import React, { useState, useRef } from 'react';
import { UploadIcon, ImageIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, previewUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center w-full h-64 md:h-80 lg:h-96
          border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
          ${previewUrl ? 'bg-slate-900 border-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-md" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <UploadIcon className="w-5 h-5" />
                <span>Change Image</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center p-6">
            <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              {isDragging ? 'Drop to upload' : 'Upload Product Photo'}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs">
              Drag and drop your image here, or click to browse.
              <br/>
              <span className="text-xs opacity-70">Supports JPEG, PNG</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};