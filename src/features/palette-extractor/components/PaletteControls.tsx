import { useState, useEffect } from 'react';
import { loadImage } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import { RefreshCw, Download } from 'lucide-react';
import type { ImageFile } from '@/shared/types';

// ---------- Color extraction logic ----------
function extractColors(
  img: HTMLImageElement,
  colorCount: number,
  ignoreBackground: boolean
): string[] {
  const canvas = document.createElement('canvas');
  const sampleSize = Math.min(img.width, img.height, 200);
  const ratio = sampleSize / Math.max(img.width, img.height);
  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const pixels: [number, number, number][] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    if (ignoreBackground) {
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;
    }

    pixels.push([r, g, b]);
  }

  if (pixels.length === 0) return [];

  const centroids = kMeans(pixels, colorCount, 10);
  centroids.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));

  return centroids.map(
    (c) =>
      `#${c[0].toString(16).padStart(2, '0')}${c[1].toString(16).padStart(2, '0')}${c[2].toString(16).padStart(2, '0')}`
  );
}

function kMeans(
  pixels: [number, number, number][],
  k: number,
  maxIter: number = 10
): [number, number, number][] {
  let centroids: [number, number, number][] = [pixels[Math.floor(Math.random() * pixels.length)]];
  for (let i = 1; i < k; i++) {
    const distances = pixels.map((p) => {
      const dMin = centroids.reduce((min, c) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        return Math.min(min, d);
      }, Infinity);
      return dMin;
    });
    const sum = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let j = 0; j < pixels.length; j++) {
      r -= distances[j];
      if (r <= 0) {
        centroids.push(pixels[j]);
        break;
      }
    }
  }

  for (let iter = 0; iter < maxIter; iter++) {
    const clusters: [number, number, number][][] = Array.from({ length: k }, () => []);
    pixels.forEach((p) => {
      let minDist = Infinity;
      let idx = 0;
      centroids.forEach((c, i) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < minDist) {
          minDist = d;
          idx = i;
        }
      });
      clusters[idx].push(p);
    });

    centroids = clusters.map((cluster) => {
      if (cluster.length === 0) return [0, 0, 0] as [number, number, number];
      return [
        Math.round(cluster.reduce((s, p) => s + p[0], 0) / cluster.length),
        Math.round(cluster.reduce((s, p) => s + p[1], 0) / cluster.length),
        Math.round(cluster.reduce((s, p) => s + p[2], 0) / cluster.length),
      ];
    });
  }

  return centroids;
}

// ---------- Component ----------
export default function PaletteControls({ image }: { image: ImageFile }) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [colorCount, setColorCount] = useState(8);
  const [ignoreBg, setIgnoreBg] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadImage(image.preview).then(setImg);
  }, [image]);

  useEffect(() => {
    if (!img) return;
    const palette = extractColors(img, colorCount, ignoreBg);
    setColors(palette);
  }, [img, colorCount, ignoreBg]);

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  const downloadPaletteImage = () => {
    if (colors.length === 0) return;
    const swatchHeight = 60;
    const swatchWidth = 100;
    const canvas = document.createElement('canvas');
    canvas.width = colors.length * swatchWidth;
    canvas.height = swatchHeight + 30;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    colors.forEach((color, i) => {
      const x = i * swatchWidth;
      ctx.fillStyle = color;
      ctx.fillRect(x, 0, swatchWidth, swatchHeight);
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(color, x + swatchWidth / 2, swatchHeight + 20);
    });

    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'palette.png';
    a.click();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-card border p-6 bg-surface dark:bg-surface space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Palette Settings
        </h3>

        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Number of Colors: {colorCount}
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={colorCount}
            onChange={(e) => setColorCount(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={ignoreBg}
            onChange={(e) => setIgnoreBg(e.target.checked)}
            id="ignore-bg"
            className="accent-primary-500"
          />
          <label htmlFor="ignore-bg" className="text-sm text-gray-700 dark:text-gray-300">
            Ignore background colors (more vibrant)
          </label>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setColors(extractColors(img!, colorCount, ignoreBg))} className="gap-2">
            <RefreshCw size={16} /> Re‑extract
          </Button>
          <Button variant="secondary" onClick={downloadPaletteImage} className="gap-2">
            <Download size={16} /> Download Palette
          </Button>
        </div>
      </div>

      {img && (
        <div className="rounded-card border overflow-hidden bg-gray-50 dark:bg-gray-800 p-2">
          <img
            src={image.preview}
            alt="Uploaded"
            className="max-h-64 w-full object-contain rounded"
          />
        </div>
      )}

      <div className="rounded-card border p-6 bg-surface dark:bg-surface">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Extracted Palette
        </h3>
        {colors.length === 0 ? (
          <p className="text-sm text-gray-500">No colors extracted. Adjust settings and try again.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => copyToClipboard(color, idx)}
              >
                <div
                  className="w-full aspect-square rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-transform hover:scale-105 relative"
                  style={{ backgroundColor: color }}
                />
                <span className="mt-2 text-xs font-mono text-gray-700 dark:text-gray-300">
                  {color.toUpperCase()}
                </span>
                {copiedIndex === idx && (
                  <span className="text-xs text-green-500 animate-pulse">Copied!</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}