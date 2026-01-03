import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// 1. Modern Worker Configuration (Optimized for Vite/Webpack in 2026)
// This uses the .mjs worker to ensure compatibility with modern bundlers.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Optional: Import CSS for standard text layer and annotation styles
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface CustomPDFViewerProps {
  presignedUrl?: string;
}

const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({ presignedUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // 2. Memoize the file object
  // Critical: Prevents the PDF from re-fetching on every component render.
  const file = useMemo(() => ({ 
    url: presignedUrl,
    // Add specific S3 headers if your backend doesn't handle them
    withCredentials: false 
  }), [presignedUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('PDF Load Error:', err);
    setError('Failed to load PDF. Please check your connection or S3 permissions.');
  };

  if (!presignedUrl) {
    return <div className="p-4 text-gray-500">No document provided.</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="shadow-xl border bg-white overflow-hidden">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<p className="p-10">Fetching document...</p>}
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            width={600} // Adjust based on your layout
          />
        </Document>
      </div>

      {numPages && (
        <div className="mt-4 flex items-center gap-4">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(prev => prev - 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          
          <p className="text-sm font-medium">
            Page {pageNumber} of {numPages}
          </p>

          <button
            disabled={pageNumber >= (numPages ?? 0)}
            onClick={() => setPageNumber(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomPDFViewer;