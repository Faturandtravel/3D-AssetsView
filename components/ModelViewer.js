'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage } from '@react-three/drei';
import { Suspense, useRef, useState, useCallback, useEffect } from 'react';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function RotatingGroup({ children, isDraggingRef, manualDeltaRef }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isDraggingRef.current) {
      groupRef.current.rotation.y += manualDeltaRef.current;
      manualDeltaRef.current = 0;
    } else {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function ModelViewer({ glbUrl }) {
  const [dragging, setDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const manualDeltaRef = useRef(0);
  const lastXRef = useRef(0);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    setDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      manualDeltaRef.current = dx * 0.012;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      manualDeltaRef.current = 0;
      setDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[500px] relative select-none"
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
    >
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm animate-pulse">
          Loading 3D Model...
        </div>
      }>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 0.6], fov: 25 }}
          gl={{ alpha: true }}
        >
          <ambientLight intensity={0.3} />

          <RotatingGroup isDraggingRef={isDraggingRef} manualDeltaRef={manualDeltaRef}>
            <Stage intensity={0.25} environment="city" adjustCamera={false}>
              <Model url={glbUrl} />
            </Stage>
          </RotatingGroup>
        </Canvas>
      </Suspense>
    </div>
  );
}