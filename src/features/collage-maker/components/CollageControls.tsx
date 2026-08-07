import { useState, useEffect, useRef, useCallback } from 'react';
import { loadImage, canvasToBlob, downloadFile } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import {
  Download,
  Grid3X3,
  Grid,
  Plus,
  Minus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import type { ImageFile } from '@/shared/types';

interface LayoutPreset {
  label: string;
  rows: number;
  cols: number;
}

const PRESETS: LayoutPreset[] = [
  { label: '2×2 Grid', rows: 2, cols: 2 },
  { label: '3×3 Grid', rows: 3, cols: 3 },
  { label: '1×3 Row', rows: 1, cols: 3 },
  { label: '3×1 Column', rows: 3, cols: 1 },
  { label: '2×3 Grid', rows: 2, cols: 3 },
  { label: '3×2 Grid', rows: 3, cols: 2 },
  { label: '4×4 Grid', rows: 4, cols: 4 },
];

interface CollageControlsProps {
  images: ImageFile[];
  onClear: () => void;
}

export default function CollageControls({ images, onClear }: CollageControlsProps) {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [gap, setGap] = useState(8);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(0);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState('#cccccc');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageOrder, setImageOrder] = useState<number[]>([]); // indices to rearrange
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImgs, setLoadedImgs] = useState<HTMLImageElement[]>([]);

  // Load all images
  useEffect(() => {
    Promise.all(images.map(img => loadImage(img.preview))).then(setLoadedImgs);
  }, [images]);

  // Initialize order
  useEffect(() => {
    setImageOrder(Array.from({ length: images.length }, (_, i) => i));
  }, [images.length]);

  // Generate collage preview whenever settings change
  useEffect(() => {
    if (loadedImgs.length === 0) return;
    const canvas = document.createElement('canvas');
    const cellW = 300; // fixed cell width for preview
    const cellH = cellW; // square cells
    const totalW = cols * cellW + (cols - 1) * gap + 2 * gap;
    const totalH = rows * cellH + (rows - 1) * gap + 2 * gap;
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, borderRadius);
    ctx.fill();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx >= loadedImgs.length) continue;
        const img = loadedImgs[imageOrder[idx] ?? idx];
        if (!img) continue;
        const x = gap + c * (cellW + gap);
        const y = gap + r * (cellH + gap);

        // Draw border
        if (borderWidth > 0) {
          ctx.fillStyle = borderColor;
          ctx.beginPath();
          ctx.roundRect(x - borderWidth, y - borderWidth, cellW + 2 * borderWidth, cellH + 2 * borderWidth, borderRadius + borderWidth);
          ctx.fill();
        }

        // Draw image with rounded corners
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, borderRadius);
        ctx.clip();
        // Scale image to cover cell (cover mode)
        const scale = Math.max(cellW / img.width, cellH / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = x + (cellW - sw) / 2;
        const sy = y + (cellH - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh);
        ctx.restore();

        // Border overlay (inner)
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth;
          ctx.beginPath();
          ctx.roundRect(x, y, cellW, cellH, borderRadius);
          ctx.stroke();
        }
      }
    }

    canvasToBlob(canvas, 'image/png').then(blob => {
      setPreviewUrl(URL.createObjectURL(blob));
    });
  }, [loadedImgs, rows, cols, gap, bgColor, borderRadius, borderWidth, borderColor, imageOrder]);

  const handleDownload = (format: 'png' | 'jpeg') => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `collage.${format === 'jpeg' ? 'jpg' : 'png'}`;
    a.click();
  };

  const totalCells = rows * cols;

  // Reorder images by dragging (simple swap on click for now – can be extended)
  const swapImages = (indexA: number, indexB: number) => {
    setImageOrder(prev => {
      const newOrder = [...prev];
      [newOrder[indexA], newOrder[indexB]] = [newOrder[indexB], newOrder[indexA]];
      return newOrder;
    });
  };

  const selectedImages = images.slice(0, totalCells);
  const remaining = images.length - totalCells;

  return (
    <div className="mt-8 space-y-6">
      {/* Controls panel */}
      <div className="rounded-card border p-6 bg-surface dark:bg-surface space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Collage Settings
        </h3>

        {/* Layout presets */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Layout
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(preset => (
              <Button
                key={preset.label}
                size="sm"
                variant={rows === preset.rows && cols === preset.cols ? 'primary' : 'secondary'}
                onClick={() => { setRows(preset.rows); setCols(preset.cols); }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom rows/cols */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Rows
            </label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setRows(Math.max(1, rows - 1))}><Minus size={14}/></Button>
              <span className="w-8 text-center text-sm font-medium">{rows}</span>
              <Button size="sm" variant="secondary" onClick={() => setRows(Math.min(6, rows + 1))}><Plus size={14}/></Button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Columns
            </label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setCols(Math.max(1, cols - 1))}><Minus size={14}/></Button>
              <span className="w-8 text-center text-sm font-medium">{cols}</span>
              <Button size="sm" variant="secondary" onClick={() => setCols(Math.min(6, cols + 1))}><Plus size={14}/></Button>
            </div>
          </div>
        </div>

        {/* Gap */}
        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Spacing: {gap}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={gap}
            onChange={e => setGap(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
        </div>

        {/* Background color */}
        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Background Color
          </label>
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="h-10 w-full rounded border cursor-pointer"
          />
        </div>

        {/* Rounded corners */}
        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Corner Radius: {borderRadius}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={borderRadius}
            onChange={e => setBorderRadius(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
        </div>

        {/* Border */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Border Width: {borderWidth}px
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={borderWidth}
              onChange={e => setBorderWidth(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Border Color
            </label>
            <input
              type="color"
              value={borderColor}
              onChange={e => setBorderColor(e.target.value)}
              className="h-10 w-full rounded border cursor-pointer"
            />
          </div>
        </div>

        {/* Cell count info */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedImages.length} of {images.length} images placed ({totalCells} cells available)
          {remaining < 0 && (
            <span className="text-red-500 ml-2">
              {Math.abs(remaining)} images won't fit. Remove some or increase grid size.
            </span>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-card border overflow-hidden bg-gray-50 dark:bg-gray-800 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Preview
        </h3>
        <div ref={containerRef} className="flex justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Collage preview" className="max-w-full max-h-96 object-contain shadow-lg rounded" />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-gray-400">
              <Grid3X3 size={48} />
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="secondary" onClick={onClear} className="gap-2">
          <Trash2 size={16} /> Clear All
        </Button>
        <Button onClick={() => handleDownload('png')} className="gap-2">
          <Download size={16} /> Download PNG
        </Button>
        <Button variant="secondary" onClick={() => handleDownload('jpeg')} className="gap-2">
          <Download size={16} /> Download JPEG
        </Button>
      </div>
    </div>
  );
}