import { useState, useEffect, useRef } from 'react';
import { loadImage, canvasToBlob } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import {
  Download,
  Trash2,
  Plus,
  Minus,
  Grid3X3,
} from 'lucide-react';
import type { ImageFile } from '@/shared/types';

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
  const [imageOrder, setImageOrder] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedImgs, setLoadedImgs] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    Promise.all(images.map(img => loadImage(img.preview))).then(setLoadedImgs);
  }, [images]);

  useEffect(() => {
    setImageOrder(Array.from({ length: images.length }, (_, i) => i));
  }, [images.length]);

  useEffect(() => {
    if (loadedImgs.length === 0) return;
    const canvas = document.createElement('canvas');
    const cellW = 300;
    const cellH = cellW;
    const totalW = cols * cellW + (cols - 1) * gap + 2 * gap;
    const totalH = rows * cellH + (rows - 1) * gap + 2 * gap;
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    (ctx as any).roundRect(0, 0, canvas.width, canvas.height, borderRadius);
    ctx.fill();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx >= loadedImgs.length) continue;
        const img = loadedImgs[imageOrder[idx] ?? idx];
        if (!img) continue;
        const x = gap + c * (cellW + gap);
        const y = gap + r * (cellH + gap);

        if (borderWidth > 0) {
          ctx.fillStyle = borderColor;
          ctx.beginPath();
          (ctx as any).roundRect(x - borderWidth, y - borderWidth, cellW + 2 * borderWidth, cellH + 2 * borderWidth, borderRadius + borderWidth);
          ctx.fill();
        }

        ctx.save();
        ctx.beginPath();
        (ctx as any).roundRect(x, y, cellW, cellH, borderRadius);
        ctx.clip();
        const scale = Math.max(cellW / img.width, cellH / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = x + (cellW - sw) / 2;
        const sy = y + (cellH - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh);
        ctx.restore();

        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth;
          ctx.beginPath();
          (ctx as any).roundRect(x, y, cellW, cellH, borderRadius);
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
  const selectedImages = images.slice(0, totalCells);
  const remaining = images.length - totalCells;

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-card border p-6 bg-surface dark:bg-surface space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Collage Settings
        </h3>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Layout</label>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => { setRows(2); setCols(2); }}>2×2 Grid</Button>
            <Button size="sm" variant="secondary" onClick={() => { setRows(3); setCols(3); }}>3×3 Grid</Button>
            <Button size="sm" variant="secondary" onClick={() => { setRows(1); setCols(3); }}>1×3 Row</Button>
            <Button size="sm" variant="secondary" onClick={() => { setRows(3); setCols(1); }}>3×1 Column</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Rows</label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setRows(Math.max(1, rows - 1))}><Minus size={14}/></Button>
              <span className="w-8 text-center text-sm font-medium">{rows}</span>
              <Button size="sm" variant="secondary" onClick={() => setRows(Math.min(6, rows + 1))}><Plus size={14}/></Button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Columns</label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setCols(Math.max(1, cols - 1))}><Minus size={14}/></Button>
              <span className="w-8 text-center text-sm font-medium">{cols}</span>
              <Button size="sm" variant="secondary" onClick={() => setCols(Math.min(6, cols + 1))}><Plus size={14}/></Button>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Spacing: {gap}px</label>
          <input type="range" min="0" max="50" value={gap} onChange={e => setGap(Number(e.target.value))} className="w-full accent-primary-500" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Background Color</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-10 w-full rounded border cursor-pointer" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Corner Radius: {borderRadius}px</label>
          <input type="range" min="0" max="50" value={borderRadius} onChange={e => setBorderRadius(Number(e.target.value))} className="w-full accent-primary-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Border Width: {borderWidth}px</label>
            <input type="range" min="0" max="10" value={borderWidth} onChange={e => setBorderWidth(Number(e.target.value))} className="w-full accent-primary-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Border Color</label>
            <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="h-10 w-full rounded border cursor-pointer" />
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedImages.length} of {images.length} images placed ({totalCells} cells available)
          {remaining < 0 && <span className="text-red-500 ml-2">{Math.abs(remaining)} images won't fit.</span>}
        </div>
      </div>

      <div className="rounded-card border overflow-hidden bg-gray-50 dark:bg-gray-800 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
        <div ref={containerRef} className="flex justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Collage preview" className="max-w-full max-h-96 object-contain shadow-lg rounded" />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-gray-400"><Grid3X3 size={48} /></div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="secondary" onClick={onClear} className="gap-2"><Trash2 size={16} /> Clear All</Button>
        <Button onClick={() => handleDownload('png')} className="gap-2"><Download size={16} /> Download PNG</Button>
        <Button variant="secondary" onClick={() => handleDownload('jpeg')} className="gap-2"><Download size={16} /> Download JPEG</Button>
      </div>
    </div>
  );
}