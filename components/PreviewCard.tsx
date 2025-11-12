
import React from 'react';
import { formatFileSize } from '../utils';
import { FileImageIcon, FileTextIcon, LoaderIcon } from './icons';

interface PreviewCardProps {
  file: File | Blob | null;
  title: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({ file, title, isLoading = false, children }) => {
  const renderPreview = () => {
    if (!file) {
      if (isLoading) {
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <LoaderIcon className="w-12 h-12 text-sky-500 animate-spin" />
            <p className="mt-4 text-slate-400">Processing...</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-600">
          <div className="w-24 h-24 border-4 border-dashed border-slate-700 rounded-lg"></div>
          <p className="mt-4 text-sm">Waiting for result</p>
        </div>
      );
    }

    if (file.type.startsWith('image/')) {
      return <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-contain" />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-700/50 p-4">
        {file.type === 'application/pdf' ? 
            <FileTextIcon className="w-16 h-16 text-slate-400" /> :
            <FileImageIcon className="w-16 h-16 text-slate-400" />
        }
        <p className="mt-4 text-sm text-slate-300 text-center break-all">
          {'name' in file ? file.name : 'result'}
        </p>
      </div>
    );
  };
  
  const originalSize = file?.size ?? 0;

  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-bold text-lg text-slate-300">{title}</h3>
        {file && (
          <p className="text-sm text-sky-400 font-mono bg-slate-900/50 px-2 py-1 rounded inline-block mt-1">
            {formatFileSize(originalSize)}
          </p>
        )}
      </div>
      <div className="flex-grow min-h-[200px] p-2">{renderPreview()}</div>
      {children && <div className="p-4 border-t border-slate-700">{children}</div>}
    </div>
  );
};
