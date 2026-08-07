import { useState, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import Button from '@/shared/components/ui/Button';
import {
  Upload,
  Download,
  CheckSquare,
  Square,
  File,
  X,
} from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageInfo {
  index: number;
  thumbnail: string;
}

export default function PdfControls() {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState(92);
  const [scale, setScale] = useState(2);
  const [previewPage, setPreviewPage] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPdf = useCallback(async (file: File) => {
    setError(null);
    setLoading(true);
    setFileName(file.name);
    setSelectedPages(new Set());
    setPreviewPage(null);
    setPreviewUrl(null);
    setPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      pdfDocRef.current = pdf;
      const pageInfos: PageInfo[] = [];
      const thumbnailScale = 0.5;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: thumbnailScale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport } as any).promise;
        pageInfos.push({ index: i, thumbnail: canvas.toDataURL('image/png') });
      }
      setPages(pageInfos);
      setSelectedPages(new Set(pageInfos.map((p) => p.index)));
    } catch (err: any) {
      console.error('PDF load error:', err);
      setError(`Failed to load PDF. ${err.message || 'The file may be corrupted or password-protected.'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadPdf(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadPdf(file);
  };

  const togglePage = (index: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const selectAll = () => setSelectedPages(new Set(pages.map((p) => p.index)));
  const deselectAll = () => setSelectedPages(new Set());

  const renderPage = async (pageIndex: number, scale: number, format: string, quality: number): Promise<string> => {
    const pdf = pdfDocRef.current;
    if (!pdf) throw new Error('No PDF loaded');
    const page = await pdf.getPage(pageIndex);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport } as any).promise;
    const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    return canvas.toDataURL(mimeType, quality / 100);
  };

  const downloadPage = async (pageIndex: number) => {
    try {
      const dataUrl = await renderPage(pageIndex, scale, outputFormat, quality);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `page-${pageIndex}.${outputFormat === 'jpeg' ? 'jpg' : outputFormat}`;
      a.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to render page.');
    }
  };

  const downloadSelected = async () => {
    for (const index of selectedPages) {
      await downloadPage(index);
      await new Promise((r) => setTimeout(r, 300));
    }
  };

  const previewHighRes = async (pageIndex: number) => {
    setPreviewPage(pageIndex);
    try {
      const dataUrl = await renderPage(pageIndex, 1.5, 'png', 100);
      setPreviewUrl(dataUrl);
    } catch {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      {pages.length === 0 && !loading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-colors ${
            dragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Upload PDF</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Drag & drop a PDF file here, or click to browse</p>
          <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
            <File size={16} /> Choose PDF
          </Button>
          {error && (
            <p className="mt-4 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded">
              {error}
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Loading PDF... Please wait</span>
        </div>
      )}

      {pages.length > 0 && (
        <>
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border p-4 bg-surface dark:bg-surface">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={selectAll}>
                <CheckSquare size={14} className="mr-1" /> Select All
              </Button>
              <Button size="sm" variant="secondary" onClick={deselectAll}>
                <Square size={14} className="mr-1" /> Deselect
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedPages.size} of {pages.length} pages
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as any)}
                className="rounded border px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
              {outputFormat !== 'png' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Quality:</label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-20 accent-primary-500"
                  />
                  <span className="text-xs text-gray-500">{quality}%</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Scale:</label>
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="rounded border px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                </select>
              </div>
              <Button onClick={downloadSelected} disabled={selectedPages.size === 0} className="gap-2">
                <Download size={16} /> Download {selectedPages.size} page(s)
              </Button>
            </div>
          </div>

          {/* Page thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((page) => (
              <div
                key={page.index}
                className={`relative rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPages.has(page.index)
                    ? 'border-primary-500 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                }`}
                onClick={() => togglePage(page.index)}
              >
                <img
                  src={page.thumbnail}
                  alt={`Page ${page.index}`}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onDoubleClick={(e) => { e.stopPropagation(); previewHighRes(page.index); }}
                />
                <div className="p-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Page {page.index}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadPage(page.index); }}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    <Download size={14} />
                  </button>
                </div>
                {selectedPages.has(page.index) && (
                  <div className="absolute top-2 left-2 bg-primary-500 rounded-full p-0.5 text-white">
                    <CheckSquare size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPages([]);
                setFileName('');
                pdfDocRef.current = null;
                setError(null);
              }}
            >
              <X size={14} className="mr-1" /> Reset
            </Button>
            {fileName && <span className="text-sm text-gray-500 truncate max-w-xs">{fileName}</span>}
          </div>

          {previewPage && previewUrl && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setPreviewPage(null)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Page {previewPage}</h4>
                  <button onClick={() => setPreviewPage(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={20} />
                  </button>
                </div>
                <img src={previewUrl} alt="Preview" className="max-w-full" />
              </div>
            </div>
          )}
        </>
      )}

      <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
    </div>
  );
}