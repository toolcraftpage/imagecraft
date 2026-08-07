import { useState, useEffect, useMemo } from 'react';
import { loadImage, resizeImage, canvasToBlob, downloadFile } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import { Download, Image as ImageIcon, Lock, Unlock } from 'lucide-react';
import type { ImageFile } from '@/shared/types';

interface Preset {
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { label: 'YouTube Thumbnail', width: 1280, height: 720 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Instagram Story', width: 1080, height: 1920 },
  { label: 'Facebook Post', width: 1200, height: 630 },
  { label: 'Twitter Post', width: 1200, height: 675 },
  { label: 'LinkedIn Post', width: 1200, height: 627 },
  { label: 'Pinterest Pin', width: 1000, height: 1500 },
  { label: 'Twitch Banner', width: 1200, height: 480 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function formatAspectRatio(w: number, h: number): string {
  if (!w || !h) return '';
  const divisor = gcd(w, h);
  return `${w / divisor}∶${h / divisor}`;
}

export default function ResizeControls({ image }: ResizeControlsProps) {
  const [widthStr, setWidthStr] = useState('0');
  const [heightStr, setHeightStr] = useState('0');
  const [locked, setLocked] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalAspect, setOriginalAspect] = useState(1);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [allowUpscale, setAllowUpscale] = useState(false);

  // Parse current numeric values (0 if empty or invalid)
  const width = useMemo(() => {
    const n = parseInt(widthStr, 10);
    return isNaN(n) || n < 1 ? 0 : n;
  }, [widthStr]);

  const height = useMemo(() => {
    const n = parseInt(heightStr, 10);
    return isNaN(n) || n < 1 ? 0 : n;
  }, [heightStr]);

  // Initialize from image dimensions
  useEffect(() => {
    if (!image.dimensions) return;
    setWidthStr(String(image.dimensions.width));
    setHeightStr(String(image.dimensions.height));
    setOriginalAspect(image.dimensions.width / image.dimensions.height);
    loadImage(image.preview).then(setImg);
  }, [image]);

  const handleWidthChange = (value: string) => {
    // Allow empty string, digits only, no negative
    setWidthStr(value.replace(/[^0-9]/g, ''));
    setActivePreset(null);
    if (locked && value !== '') {
      const w = parseInt(value, 10);
      if (!isNaN(w) && w > 0) {
        setHeightStr(String(Math.round(w / originalAspect)));
      }
    }
  };

  const handleHeightChange = (value: string) => {
    setHeightStr(value.replace(/[^0-9]/g, ''));
    setActivePreset(null);
    if (locked && value !== '') {
      const h = parseInt(value, 10);
      if (!isNaN(h) && h > 0) {
        setWidthStr(String(Math.round(h * originalAspect)));
      }
    }
  };

  const applyPreset = (preset: Preset) => {
    setActivePreset(preset.label);
    if (locked) {
      const ratio = Math.min(
        preset.width / image.dimensions!.width,
        preset.height / image.dimensions!.height,
      );
      if (!allowUpscale && ratio > 1) {
        setWidthStr(String(image.dimensions!.width));
        setHeightStr(String(image.dimensions!.height));
      } else {
        setWidthStr(String(Math.round(image.dimensions!.width * ratio)));
        setHeightStr(String(Math.round(image.dimensions!.height * ratio)));
      }
    } else {
      setWidthStr(String(preset.width));
      setHeightStr(String(preset.height));
    }
  };

  const handleResize = async () => {
    if (!img || width === 0 || height === 0) return;
    const canvas = resizeImage(img, width, height);
    const blob = await canvasToBlob(canvas, 'image/png');
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const handleDownload = () => {
    if (previewUrl) {
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = `resized-${image.file.name}`;
      a.click();
    }
  };

  const maxW = image.dimensions?.width || 5000;
  const maxH = image.dimensions?.height || 5000;

  const currentAspectStr = useMemo(
    () => (width > 0 && height > 0 ? formatAspectRatio(width, height) : ''),
    [width, height],
  );

  return (
    <div className="space-y-6 rounded-card border border-gray-200 bg-surface p-6 shadow-card dark:border-gray-700 dark:bg-surface">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resize Image</h3>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant={activePreset === preset.label ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => applyPreset(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Width – Lock – Height */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="w-full sm:flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Width (px)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={widthStr}
            onChange={(e) => handleWidthChange(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-1">
          <div className="hidden h-px w-6 bg-gray-300 dark:bg-gray-600 sm:block" />
          <button
            onClick={() => setLocked(!locked)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            title={locked ? 'Aspect ratio locked' : 'Unlocked'}
          >
            {locked ? (
              <Lock size={18} className="text-primary-500" />
            ) : (
              <Unlock size={18} className="text-gray-400" />
            )}
          </button>
          <div className="hidden h-px w-6 bg-gray-300 dark:bg-gray-600 sm:block" />
        </div>

        <div className="w-full sm:flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Height (px)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={heightStr}
            onChange={(e) => handleHeightChange(e.target.value)}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Aspect ratio badge below inputs */}
      {locked && currentAspectStr && (
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            Aspect ratio: {currentAspectStr}
          </span>
        </div>
      )}

      {/* Additional controls */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <input
            type="checkbox"
            checked={allowUpscale}
            onChange={(e) => setAllowUpscale(e.target.checked)}
            className="accent-primary-500"
          />
          Allow upscaling
        </label>
        <span className="text-gray-500">
          Original: {image.dimensions?.width}×{image.dimensions?.height}
        </span>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleResize} className="gap-2">
          <ImageIcon size={16} /> Preview Resized
        </Button>
        {previewUrl && (
          <Button onClick={handleDownload} variant="secondary" className="gap-2">
            <Download size={16} /> Download
          </Button>
        )}
      </div>

      {previewUrl && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-900">
          <img
            src={previewUrl}
            alt="Resized preview"
            className="max-h-64 w-full object-contain"
          />
          <p className="p-3 text-sm text-gray-500 dark:text-gray-400">
            Resized image is ready for download.
          </p>
        </div>
      )}
    </div>
  );
}