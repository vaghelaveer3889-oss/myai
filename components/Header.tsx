
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Studio</h1>
      </div>
      <div className="flex gap-4">
        <span className="hidden md:inline-flex items-center text-sm font-medium text-slate-500">
          Powered by Gemini 2.5 Flash Image
        </span>
      </div>
    </header>
  );
};

export default Header;
