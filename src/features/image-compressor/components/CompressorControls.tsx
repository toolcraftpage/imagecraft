import { useState, useEffect, useCallback, useRef } from 'react';
import { loadImage, canvasToBlob } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import { Download } from 'lucide-react';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';
type SizeUnit = 'KB' | 'MB';

interface CompressorControlsProps {
  image: { file: File; preview: string };
}

export default function CompressorControls({ image }: CompressorControlsProps) {
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [originalSize] = useState(image.file.size);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  const [targetValue, setTargetValue] = useState<string>('');
  const [targetUnit, setTargetUnit] = useState<SizeUnit>('KB');
  const [targetMode, setTargetMode] = useState(false);
  const targetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searching = useRef(false);

  const compressWithQuality = useCallback(
    async (q: number, fmt: OutputFormat): Promise<{ blob: Blob; url: string }> => {
      if (!image.preview) throw new Error('No image');
      const img = await loadImage(image.preview);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, fmt, q / 100);
      const url = URL.createObjectURL(blob);
      return { blob, url };
    },
    [image],
  );

  useEffect(() => {
    if (!image.preview || targetMode) return;
    let cancelled = false;
    setProcessing(true);
    compressWithQuality(quality, format)
      .then(({ blob, url }) => {
        if (cancelled) return;
        setCompressedPreview(url);
        setCompressedSize(blob.size);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setProcessing(false);
      });
    return () => { cancelled = true; };
  }, [quality, format, image, targetMode, compressWithQuality]);

  const searchTargetSize = useCallback(
    async (targetBytes: number) => {
      if (searching.current) return;
      searching.current = true;
      setProcessing(true);
      let low = 1;
      let high = 100;
      let bestQuality = 80;
      let bestBlob: Blob | null = null;
      let bestDiff = Infinity;

      for (let i = 0; i < 8; i++) {
        const mid = Math.floor((low + high) / 2);
        try {
          const { blob } = await compressWithQuality(mid, format);
          const diff = Math.abs(blob.size - targetBytes);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestQuality = mid;
            bestBlob = blob;
          }
          if (blob.size > targetBytes) {
            high = mid - 1;
          } else {
            low = mid + 1;
          }
        } catch (err) {
          console.error(err);
          break;
        }
      }

      if (bestBlob) {
        setQuality(bestQuality);
        const url = URL.createObjectURL(bestBlob);
        setCompressedPreview(url);
        setCompressedSize(bestBlob.size);
      }
      setProcessing(false);
      searching.current = false;
    },
    [format, compressWithQuality],
  );

  const handleTargetChange = (value: string, unit: SizeUnit) => {
    setTargetValue(value);
    setTargetUnit(unit);

    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      setTargetMode(true);
      const multiplier = unit === 'MB' ? 1024 * 1024 : 1024;
      const targetBytes = num * multiplier;
      if (targetTimer.current) clearTimeout(targetTimer.current);
      targetTimer.current = setTimeout(() => {
        searchTargetSize(targetBytes);
      }, 500);
    } else {
      setTargetMode(false);
      if (targetTimer.current) clearTimeout(targetTimer.current);
    }
  };

  const download = () => {
    if (!compressedPreview) return;
    const a = document.createElement('a');
    a.href = compressedPreview;
    const ext = format.split('/')[1];
    a.download = `compressed-${image.file.name.replace(/\.[^.]+$/, '')}.${ext}`;
    a.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 rounded-card border border-gray-200 bg-surface p-6 shadow-card dark:border-gray-700 dark:bg-surface">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Compression Settings</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quality (1–100)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => {
                setTargetValue('');
                setTargetMode(false);
                setQuality(Number(e.target.value));
              }}
              className="flex-1 accent-primary-500"
            />
            <span className="w-10 text-right text-sm text-gray-600 dark:text-gray-400">
              {quality}%
            </span>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="image/jpeg">JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Or set exact file size
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0.5"
            value={targetValue}
            onChange={(e) => handleTargetChange(e.target.value, targetUnit)}
            className="flex-1 border-none bg-transparent px-3 py-2 text-sm text-gray-900 outline-none dark:text-gray-100"
          />
          <select
            value={targetUnit}
            onChange={(e) => {
              const unit = e.target.value as SizeUnit;
              setTargetUnit(unit);
              handleTargetChange(targetValue, unit);
            }}
            className="border-l border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          >
            <option value="KB">KB</option>
            <option value="MB">MB</option>
          </select>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Type a file size and we’ll find the best quality for you.
        </p>
      </div>

      {processing && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
          Compressing...
        </div>
      )}

      {compressedPreview && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Original: <strong>{formatBytes(originalSize)}</strong>
            </span>
            <span className="text-green-600 font-medium">
              Compressed: <strong>{formatBytes(compressedSize)}</strong>
            </span>
            <span className="text-gray-400">
              (-{((1 - compressedSize / originalSize) * 100).toFixed(1)}%)
            </span>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <img
              src={compressedPreview}
              alt="Compressed preview"
              className="max-h-64 w-full object-contain"
            />
          </div>

          <Button onClick={download} className="gap-2">
            <Download size={16} /> Download Compressed Image
          </Button>
        </div>
      )}
    </div>
  );
}