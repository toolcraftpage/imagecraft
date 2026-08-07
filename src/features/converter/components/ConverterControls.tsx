import { useState, useEffect } from 'react';
import { loadImage, canvasToBlob } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import type { ImageFile } from '@/shared/types';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export default function ConverterControls({ image }: { image: ImageFile }) {
  const [format, setFormat] = useState<OutputFormat>('image/png');
  const [quality, setQuality] = useState(92);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const convert = async () => {
    if (!image.preview) return;
    setProcessing(true);
    try {
      const img = await loadImage(image.preview);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const blob = await canvasToBlob(canvas, format, quality / 100);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    convert();
  }, [format, quality]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `converted.${ext}`;
    a.click();
  };

  const originalFormat = image.file.type || 'unknown';

  return (
    <div className="mt-8 space-y-6 rounded-card border p-6 bg-surface dark:bg-surface">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Conversion Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Current format: <strong>{originalFormat}</strong>
          </label>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Convert to
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="w-full rounded border px-2 py-1.5 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>

      {format !== 'image/png' && (
        <div>
          <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-primary-500"
          />
        </div>
      )}

      {processing && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
          Converting...
        </div>
      )}

      {previewUrl && (
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 w-full object-contain"
            />
          </div>
          <Button onClick={handleDownload} className="gap-2">
            Download Converted Image
          </Button>
        </div>
      )}
    </div>
  );
}