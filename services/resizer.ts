
// These are loaded from CDN in index.html
declare const imageCompression: any;
declare const PDFLib: any;

/**
 * Resizes an image to a target file size.
 * @param file The original image file.
 * @param targetSizeKb The target size in kilobytes.
 * @returns A promise that resolves with the resized image as a Blob.
 */
export async function resizeImage(file: File, targetSizeKb: number): Promise<Blob> {
  if (!imageCompression) {
    throw new Error('Image compression library not loaded.');
  }

  const options = {
    maxSizeMB: targetSizeKb / 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('Image resizing error:', error);
    throw new Error('Could not resize the image. It might be too small or in an unsupported format.');
  }
}

/**
 * Optimizes a PDF file to reduce its size.
 * @param file The original PDF file.
 * @returns A promise that resolves with the optimized PDF as a Blob.
 */
export async function optimizePdf(file: File): Promise<Blob> {
  if (!PDFLib) {
    throw new Error('PDF library not loaded.');
  }

  try {
    const { PDFDocument } = PDFLib;
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
        // This option can sometimes help with corrupted PDFs
        ignoreEncryption: true 
    });
    
    // Simply saving the document with pdf-lib can optimize its structure and reduce size.
    const pdfBytes = await pdfDoc.save();
    
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('PDF optimization error:', error);
    throw new Error('Could not process the PDF. The file might be corrupted or password-protected.');
  }
}
