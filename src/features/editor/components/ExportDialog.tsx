import { useMemo, useState } from 'react';
import { Download, ImageIcon } from 'lucide-react';
import Modal from '@/shared/components/ui/Modal';
import Button from '@/shared/components/ui/Button';

export type ExportFormat = 'image/png' | 'image/jpeg' | 'image/webp';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  filename: string;
  width: number;
  height: number;
  previewUrl?: string | null;
  onExport: (format: ExportFormat, quality: number, filename: string) => void | Promise<void>;
}

const formatLabels: Record<ExportFormat, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/webp': 'WEBP',
};

export default function ExportDialog({
  open,
  onClose,
  filename,
  width,
  height,
  previewUrl,
  onExport,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('image/png');
  const [quality, setQuality] = useState(0.92);
  const [exportName, setExportName] = useState(filename);

  const formattedName = useMemo(() => {
    const base = exportName.trim() || 'imagecraft-export';
    const clean = base.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]+/g, '').trim() || 'imagecraft-export';
    return clean;
  }, [exportName]);

  const handleExport = async () => {
    await onExport(selectedFormat, quality, `${formattedName}${selectedFormat === 'image/png' ? '.png' : selectedFormat === 'image/jpeg' ? '.jpg' : '.webp'}`);
  };

  return (
    <Modal open={open} onClose={onClose} title="Export Image" size="lg">
      <div className="space-y-5">
        <div className="flex gap-4 rounded-2xl border border-border bg-surface-muted p-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-foreground-muted" />
            )}
          </div>
          <div className="flex-1 space-y-2 text-sm text-foreground-secondary">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] text-foreground-muted">File</span>
              <p className="mt-1 font-medium text-foreground">{formattedName || 'imagecraft-export'}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Format</span>
                <p className="mt-1 text-foreground">{formatLabels[selectedFormat]}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.18em] text-foreground-muted">Dimensions</span>
                <p className="mt-1 text-foreground">{width} × {height}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Filename
            <input
              value={exportName}
              onChange={(event) => setExportName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-input-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-input-placeholder focus:border-accent focus:outline-none"
              placeholder="imagecraft-export"
            />
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(formatLabels) as ExportFormat[]).map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setSelectedFormat(format)}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${selectedFormat === format ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface text-foreground-secondary hover:bg-surface-elevated'}`}
                >
                  {formatLabels[format]}
                </button>
              ))}
            </div>
          </div>

          {selectedFormat !== 'image/png' && (
            <label className="block text-sm font-medium text-foreground">
              Quality
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="w-full accent-accent"
                />
                <span className="min-w-[3rem] text-right text-sm text-foreground-secondary">{quality.toFixed(2)}</span>
              </div>
            </label>
          )}

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm text-foreground-secondary">
            <span>Maintain aspect ratio</span>
            <span className="font-medium text-foreground">On</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </Modal>
  );
}
