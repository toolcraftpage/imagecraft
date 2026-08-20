import { Helmet } from 'react-helmet-async';
import { useMemo, useRef, useState } from 'react';
import { Download, FileText, Plus, Trash2, ArrowUpDown, Check } from 'lucide-react';
import Container from '@/shared/components/ui/Container';
import Button from '@/shared/components/ui/Button';
import { jsPDF } from 'jspdf';
import type { PDFPageProxy } from 'pdfjs-dist';

interface PdfEntry {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PdfMergePage() {
  const [files, setFiles] = useState<PdfEntry[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const totalPages = useMemo(
    () => files.length,
    [files],
  );

  const handleFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;

    const nextItems: PdfEntry[] = Array.from(incoming)
      .filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
      }));

    if (nextItems.length === 0) {
      setError('Please upload valid PDF files only.');
      return;
    }

    setError(null);
    setFiles((prev) => [...prev, ...nextItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const moveItem = (from: number, to: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const mergePdfs = async () => {
    if (files.length === 0) {
      setError('Add at least one PDF file before merging.');
      return;
    }

    setIsMerging(true);
    setError(null);

    try {
      const merged = new jsPDF({ unit: 'pt', format: 'a4' });

      for (let i = 0; i < files.length; i += 1) {
        const pdfBytes = await files[i].file.arrayBuffer();
        const pdf = await (await import('pdfjs-dist')).getDocument({ data: pdfBytes }).promise;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Canvas rendering is unavailable in this browser.');
          }

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport } as Parameters<PDFPageProxy['render']>[0]).promise;

          const imageData = canvas.toDataURL('image/png');
          if (i > 0 || pageNum > 1) {
            merged.addPage();
          }

          const pageWidth = merged.internal.pageSize.getWidth();
          const pageHeight = merged.internal.pageSize.getHeight();
          merged.addImage(imageData, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        }
      }

      const output = merged.output('blob');
      const url = URL.createObjectURL(output);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'merged-document.pdf';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('Merge failed. Please ensure each file is a valid PDF and try again.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>PDF Merge – ImageCraft</title>
      </Helmet>

      <Container className="py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">PDF tools</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Merge PDFs</h1>
          </div>
          <div className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted">
            {files.length} file{files.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-muted">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Combine multiple PDFs into one</p>
                <p className="text-sm">Upload files, reorder them, and export a single merged document.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                <Plus className="mr-2 h-4 w-4" /> Add PDFs
              </Button>
              <Button onClick={mergePdfs} disabled={files.length === 0 || isMerging}>
                {isMerging ? 'Merging...' : 'Merge PDF'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              {error}
            </div>
          )}

          {files.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-10 text-center text-muted">
              Drop PDF files into the app, or use the button above to get started.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {files.map((file, index) => (
                <div key={file.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => moveItem(index, Math.max(0, index - 1))} disabled={index === 0}>
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveItem(index, Math.min(files.length - 1, index + 1))} disabled={index === files.length - 1}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeItem(file.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-dashed border-border bg-surface p-3 text-sm text-muted">
                Total pages to merge: <span className="font-semibold text-foreground">{totalPages}</span>
              </div>

              <div className="flex justify-end">
                <Button onClick={mergePdfs} disabled={files.length === 0 || isMerging}>
                  <Download className="mr-2 h-4 w-4" />
                  {isMerging ? 'Preparing file...' : 'Download merged PDF'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
