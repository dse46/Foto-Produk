import React from 'react';
import { DownloadIcon, ImageIcon } from './Icons';

interface ResultDisplayProps {
  generatedImage: string | null;
  isGenerating: boolean;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isGenerating, error }) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `pro-product-edit-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return (
      <div className="w-full h-64 md:h-full min-h-[320px] rounded-2xl border border-red-200 bg-red-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 font-bold text-xl">!</div>
        <h3 className="text-red-800 font-semibold mb-2">Generation Failed</h3>
        <p className="text-red-600 text-sm max-w-xs">{error}</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="w-full h-64 md:h-full min-h-[320px] rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50 to-transparent animate-pulse opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <h3 className="text-slate-700 font-medium animate-pulse">Creating Magic...</h3>
          <p className="text-slate-400 text-xs mt-2">Powered by Gemini 2.5</p>
        </div>
      </div>
    );
  }

  if (!generatedImage) {
    return (
      <div className="w-full h-64 md:h-full min-h-[320px] rounded-2xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
         <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <ImageIcon className="w-8 h-8 text-slate-300" />
         </div>
         <p className="text-slate-400 font-medium">Your result will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg group bg-slate-900 flex items-center justify-center min-h-[320px]">
        <img 
          src={generatedImage} 
          alt="Generated Result" 
          className="w-full h-full object-contain max-h-[600px]"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
        >
          <DownloadIcon className="w-4 h-4" />
          Download Result
        </button>
      </div>
    </div>
  );
};