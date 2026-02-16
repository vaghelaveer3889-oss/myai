
import React, { useState, useRef, useEffect } from 'react';
import { ImageState } from '../types';
import { editImageWithGemini } from '../services/geminiService';

interface EditorProps {
  imageState: ImageState;
  setImageState: React.Dispatch<React.SetStateAction<ImageState>>;
  mimeType: string;
}

const Editor: React.FC<EditorProps> = ({ imageState, setImageState, mimeType }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'original'>('current');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleEdit = async () => {
    if (!prompt.trim() || !imageState.current) return;

    setIsProcessing(true);
    setError(null);

    const result = await editImageWithGemini({
      image: imageState.current,
      prompt: prompt,
      mimeType: mimeType
    });

    if (result.error) {
      setError(result.error);
    } else if (result.imageUrl) {
      setImageState(prev => ({
        ...prev,
        current: result.imageUrl,
        history: [...prev.history, prev.current!]
      }));
      setPrompt('');
      setActiveTab('current');
    }
    setIsProcessing(false);
  };

  const handleReset = () => {
    if (confirm('Revert all changes and start over?')) {
      setImageState(prev => ({
        ...prev,
        current: prev.original,
        history: []
      }));
      setError(null);
    }
  };

  const handleUndo = () => {
    if (imageState.history.length === 0) return;
    const newHistory = [...imageState.history];
    const previousImage = newHistory.pop();
    setImageState(prev => ({
      ...prev,
      current: previousImage || prev.original,
      history: newHistory
    }));
  };

  const suggestedPrompts = [
    "Remove the background",
    "Add a soft shadow",
    "Make the lighting warmer",
    "Clean up the surface",
    "Put it on a white marble table",
    "Give it a retro film look",
    "Increase contrast and sharpness"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
      {/* Sidebar Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Edit Instructions</h2>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell Gemini what to do..."
              className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-slate-700"
              disabled={isProcessing}
            />
          </div>
          
          <button
            onClick={handleEdit}
            disabled={isProcessing || !prompt.trim()}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
              isProcessing || !prompt.trim() 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Run Instruction
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={imageState.history.length === 0 || isProcessing}
              className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Undo
            </button>
            <button
              onClick={handleReset}
              disabled={isProcessing}
              className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Revert All
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setPrompt(p)}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-100 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'current' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Result
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'original' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Original
            </button>
          </div>
          
          {imageState.current && (
            <a 
              href={imageState.current} 
              download="edited-product.png"
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          )}
        </div>

        <div className="relative flex-1 bg-slate-200 rounded-3xl overflow-hidden border-4 border-white shadow-xl min-h-[500px] flex items-center justify-center group">
          {/* Grid background for transparency check */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ 
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          
          <img
            src={activeTab === 'current' ? imageState.current! : imageState.original!}
            alt="Product"
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isProcessing ? 'opacity-50 grayscale' : 'opacity-100'}`}
          />
          
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900/10 backdrop-blur-[2px]">
              <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
                <div className="relative">
                   <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                   </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">Gemini is thinking...</p>
                  <p className="text-xs text-slate-500">Applying your instructions</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mini History Strip */}
        {imageState.history.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Revision History</h4>
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" ref={scrollRef}>
                <div 
                  className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-slate-100 cursor-pointer overflow-hidden hover:border-indigo-400 transition-colors"
                  onClick={() => setImageState(prev => ({...prev, current: prev.original}))}
                >
                  <img src={imageState.original!} className="w-full h-full object-cover" alt="History 0" />
                </div>
                {imageState.history.map((img, i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-slate-100 cursor-pointer overflow-hidden hover:border-indigo-400 transition-colors"
                    onClick={() => setImageState(prev => ({...prev, current: img}))}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`History ${i + 1}`} />
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
