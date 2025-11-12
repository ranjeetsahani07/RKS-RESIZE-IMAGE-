
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { PreviewCard } from './components/PreviewCard';
import { SizeSlider } from './components/SizeSlider';
import { resizeImage, optimizePdf } from './services/resizer';
import { ProcessMode } from './types';
import { DownloadIcon, LoaderIcon, RefreshCwIcon } from './components/icons';

export default function App(): React.ReactElement {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [resizedFile, setResizedFile] = useState<Blob | null>(null);
  const [targetSizeKb, setTargetSizeKb] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ProcessMode>(null);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type.startsWith('image/')) {
        setMode('image');
      } else if (file.type === 'application/pdf') {
        setMode('pdf');
      } else {
        setError('Unsupported file type. Please upload an image or PDF.');
        return;
      }
      setOriginalFile(file);
      setResizedFile(null);
      setError(null);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setResizedFile(null);
    setError(null);
    setIsProcessing(false);
    setMode(null);
    setTargetSizeKb(100);
  };

  const handleProcessFile = useCallback(async () => {
    if (!originalFile || !mode) return;

    setIsProcessing(true);
    setError(null);
    setResizedFile(null);

    try {
      let result: Blob;
      if (mode === 'image') {
        result = await resizeImage(originalFile, targetSizeKb);
      } else {
        result = await optimizePdf(originalFile);
      }
      setResizedFile(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Processing failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [originalFile, mode, targetSizeKb]);
  
  const renderContent = () => {
    if (!originalFile) {
      return <FileUploader onFileSelect={handleFileChange} error={error} />;
    }

    return (
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <PreviewCard file={originalFile} title="Original" />
          
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center items-center space-y-6">
            <h2 className="text-xl font-bold text-sky-400">{mode === 'image' ? 'Resize Options' : 'PDF Optimizer'}</h2>
            {mode === 'image' && (
              <SizeSlider
                value={targetSizeKb}
                onChange={setTargetSizeKb}
                min={5}
                max={1000}
                disabled={isProcessing}
              />
            )}
            {mode === 'pdf' && (
              <p className="text-sm text-slate-400 text-center px-4">
                This tool optimizes PDF structure and compresses images to reduce file size. The final size may vary.
              </p>
            )}

            <div className="w-full pt-4 space-y-4">
              <button
                onClick={handleProcessFile}
                disabled={isProcessing}
                className="w-full h-12 flex items-center justify-center bg-sky-500 hover:bg-sky-600 disabled:bg-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300"
              >
                {isProcessing ? (
                  <>
                    <LoaderIcon className="animate-spin mr-2" />
                    {mode === 'image' ? 'Resizing...' : 'Optimizing...'}
                  </>
                ) : (
                  mode === 'image' ? 'Resize Image' : 'Optimize PDF'
                )}
              </button>
              <button
                onClick={handleReset}
                className="w-full h-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg transition-all duration-300"
              >
                <RefreshCwIcon className="mr-2" />
                Start Over
              </button>
            </div>
          </div>
          
          <PreviewCard file={resizedFile} title="Result" isLoading={isProcessing}>
            {resizedFile && (
              <a
                href={URL.createObjectURL(resizedFile)}
                download={originalFile.name.replace(/(\.[\w\d_-]+)$/i, `_resized$1`)}
                className="mt-4 w-full h-12 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all duration-300"
              >
                <DownloadIcon className="mr-2" />
                Download
              </a>
            )}
          </PreviewCard>
        </div>
        {error && (
            <div className="w-full text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                {error}
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col p-4 md:p-8">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
}
