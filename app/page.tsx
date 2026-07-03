import { prisma } from '@/lib/db';
import UploadForm from '@/components/UploadForm';
import SafeModelViewer from '@/components/SafeModelViewer'; 
import MotionCard from '@/components/MotionCard';
import { deleteAsset } from './actions';

export default async function Home() {
  const assets = await prisma.asset3D.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const latestAsset = assets[0];

  return (
    <main className="h-screen w-screen bg-black text-slate-100 overflow-hidden relative">
      
      {latestAsset ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <SafeModelViewer glbUrl={latestAsset.fileUrl} />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <p className="text-slate-400 font-medium text-lg drop-shadow-md">Upload 3D Model to Start</p>
        </div>
      )}

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
         <h1 className="text-2xl font-bold text-white/90 drop-shadow-lg">
           {latestAsset ? latestAsset.title : "3D CRUD"}
         </h1>
      </div>

      {latestAsset && (
        <div className="absolute top-6 right-6 z-10">
          <form action={async () => {
            'use server';
            await deleteAsset(latestAsset.id);
          }}>
            <button type="submit" className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg backdrop-blur-sm transition-all border border-red-500/30">
              Delete Current Asset
            </button>
          </form>
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-10 w-[350px] shadow-2xl rounded-xl overflow-hidden">
        <UploadForm />
      </div>

    </main>
  );
}