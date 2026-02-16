
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Editor from './components/Editor';
import { ImageState } from './types';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    original: null,
    current: null,
    history: []
  });
  const [mimeType, setMimeType] = useState<string>('image/png');

  const handleUpload = (imageUrl: string, type: string) => {
    setImageState({
      original: imageUrl,
      current: imageUrl,
      history: []
    });
    setMimeType(type);
  };

  const handleReset = () => {
    setImageState({
      original: null,
      current: null,
      history: []
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {!imageState.original ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Professional photos, <span className="text-indigo-600">minus the studio.</span></h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Transform your raw product shots into professional marketing assets just by chatting. Remove backgrounds, clean up imperfections, and add styling in seconds.
              </p>
            </div>
            
            <ImageUploader onUpload={handleUpload} />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Upload another image
              </button>
            </div>
            
            <Editor 
              imageState={imageState} 
              setImageState={setImageState} 
              mimeType={mimeType}
            />
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>© 2024 Gemini Product Studio • Powered by Google Gemini 2.5 Flash Image</p>
      </footer>
    </div>
  );
};

export default App;
