'use client';

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('@/components/ModelViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 text-sm border border-slate-700">
      Initializing 3D Canvas...
    </div>
  )
});

export default function SafeModelViewer({ glbUrl }) {
  return <ModelViewer glbUrl={glbUrl} />;
}