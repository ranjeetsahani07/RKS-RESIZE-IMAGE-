
import React from 'react';
import { FileUpIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-8 md:mb-12">
      <div className="inline-flex items-center justify-center bg-slate-800 p-3 rounded-full mb-4 border-2 border-sky-500/50">
          <FileUpIcon className="h-8 w-8 text-sky-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
        File Resizer <span className="text-sky-400">Pro</span>
      </h1>
      <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
        Quickly resize images to a target file size and optimize PDFs with ease.
      </p>
    </header>
  );
};
