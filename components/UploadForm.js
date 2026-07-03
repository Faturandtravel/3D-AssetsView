'use client';
import { useTransition, useRef } from 'react';
import { uploadAsset } from '@/app/actions';

export default function UploadForm() {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const finalTitle = selectedFile.name.replace(/\.[^/.]+$/, "");

    const formData = new FormData();
    formData.append('glbFile', selectedFile);
    formData.append('title', finalTitle);

    startTransition(async () => {
      const result = await uploadAsset(formData);
      if (!result.success) {
        alert(result.error);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  return (
    <div className="flex items-center justify-end w-full">
      <input
        type="file"
        accept=".glb"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isPending}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isPending}
        className={`
          flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
          border transition-all duration-200 shadow-sm select-none
          ${isPending 
            ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-not-allowed' 
            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 active:scale-[0.98]'
          }
        `}
      >
        {isPending ? (
          <>
            <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <span>Choose GLB File</span>
          </>
        )}
      </button>
    </div>
  );
}