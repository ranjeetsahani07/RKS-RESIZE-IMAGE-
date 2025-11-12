
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './icons';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  error: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File | undefined) => {
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }, [handleFile]);

  const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  }, [handleFile]);

  const borderColor = error 
    ? 'border-red-500' 
    : isDragging 
    ? 'border-sky-500' 
    : 'border-slate-700';
  
  const bgColor = isDragging ? 'bg-sky-900/20' : 'bg-slate-800/50';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label htmlFor="file-upload" className="cursor-pointer">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center w-full h-80 rounded-2xl border-4 border-dashed ${borderColor} ${bgColor} transition-all duration-300`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadCloudIcon className={`w-12 h-12 mb-4 ${isDragging ? 'text-sky-400' : 'text-slate-500'} transition-colors`} />
            <p className="mb-2 text-lg font-semibold text-slate-300">
              <span className="text-sky-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-slate-500">Image (PNG, JPG, WEBP) or PDF</p>
          </div>
        </div>
      </label>
      <input id="file-upload" type="file" className="hidden" onChange={onFileChange} accept="image/*,application/pdf" />
      {error && <p className="mt-4 text-center text-red-400">{error}</p>}
    </div>
  );
};
