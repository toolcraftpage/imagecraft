import { useState, useEffect, useCallback } from 'react';
import { loadImage } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import { Download } from 'lucide-react';
import type { ImageFile } from '@/shared/types';

const SIZES = [16, 32, 48, 64, 128, 256];

export default function FaviconControls({ image }: { image: ImageFile }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [useBg, setUseBg] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);

  // Load the source image
  useEffect(() => {
    loadImage(image.preview).then(setImg);
  }, [image]);

  // Generate a favicon data URL for a given size
  const generateFavicon = useCallback(
    (size: number): string => {
      if (!img) return '';
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Clear with background if enabled
      if (useBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      // Apply rounded corners via clipping path
      ctx.save();
      const radius = (borderRadius / 100) * (size / 2);
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      // Draw image scaled to fit
      ctx.drawImage(img, 0, 0, size, size);
      ctx.restore();

      return canvas.toDataURL('image/png');
    },
    [img, useBg, bgColor, borderRadius],
  );

  const downloadSingle = (size: number) => {
    const dataURL = generateFavicon(size);
    if (!dataURL) return;
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  };

  const downloadAll = () => {
    SIZES.forEach((size, index) => {
      setTimeout(() => {
        downloadSingle(size);
      }, index * 200); // sequential downloads
    });
  };

  if (!img) return null;

  return (
    <div className="mt-8 space-y-6">
      {/* Settings panel */}
      <div className="rounded-card border p-6 bg-surface dark:bg-surface space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Favicon Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Background toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="use-bg"
              checked={useBg}
              onChange={(e) => setUseBg(e.target.checked)}
              className="accent-primary-500"
            />
            <label htmlFor="use-bg" className="text-sm text-gray-700 dark:text-gray-300">
              Background
            </label>
            {useBg && (
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 rounded border cursor-pointer"
              />
            )}
          </div>

          {/* Rounded corners slider */}
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
              Roundness: {borderRadius}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-end gap-2 justify-end">
            <Button onClick={downloadAll} className="gap-2">
              <Download size={16} /> Download All
            </Button>
          </div>
        </div>
      </div>

      {/* Browser tab preview */}
      <div className="rounded-card border p-4 bg-surface dark:bg-surface">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Browser Preview
        </p>
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 rounded-t-lg p-2 max-w-md">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-800 rounded px-3 py-1 text-xs text-gray-500">
            <img
              src={generateFavicon(16)}
              alt="Favicon"
              className="w-4 h-4"
              style={{ borderRadius: `${borderRadius}%` }}
            />
            <span>ImageCraft – Favicon Generator</span>
          </div>
        </div>
      </div>

      {/* Size previews grid */}
      <div className="rounded-card border p-6 bg-surface dark:bg-surface">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generated Sizes
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {SIZES.map((size) => {
            const dataURL = generateFavicon(size);
            return (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 shadow-sm"
                  style={{ width: 80, height: 80 }}
                >
                  <img
                    src={dataURL}
                    alt={`${size}x${size}`}
                    className="w-full h-full object-contain"
                    style={{ imageRendering: size < 32 ? 'pixelated' : 'auto' }}
                  />
                </div>
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{size}×{size}</span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => downloadSingle(size)}
                  className="text-xs w-full"
                >
                  <Download size={12} className="mr-1" /> PNG
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}