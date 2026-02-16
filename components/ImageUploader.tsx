
import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onUpload: (imageUrl: string, mimeType: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpload(reader.result as string, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-slate-50 transition-all group">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="mb-4 p-4 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="mb-2 text-lg font-semibold text-slate-700">Upload product photo</p>
          <p className="text-sm text-slate-500">PNG, JPG or WEBP (Max 10MB)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </label>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {[
          { title: "Background Removal", desc: "Just say 'remove background'" },
          { title: "Clean Up", desc: "Remove unwanted objects" },
          { title: "Filters", desc: "Apply professional lighting" }
        ].map((feat, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-indigo-600 mb-1">{feat.title}</h3>
            <p className="text-xs text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
