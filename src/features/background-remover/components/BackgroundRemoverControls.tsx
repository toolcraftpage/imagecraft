import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Sparkles, Wand2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import Button from '@/shared/components/ui/Button';
import type { ImageFile } from '@/shared/types';

interface Props {
  image: ImageFile;
}

async function hasForeground(blob: Blob) {
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The AI result could not be decoded.'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = Math.min(image.naturalWidth, 640);
    canvas.height = Math.max(1, Math.round((image.naturalHeight / image.naturalWidth) * canvas.width));
    const context = canvas.getContext('2d');
    if (!context) return false;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let visiblePixels = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] > 16) visiblePixels += 1;
    }
    return visiblePixels / (canvas.width * canvas.height) > 0.005;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function BackgroundRemoverControls({ image }: Props) {
  const [tolerance, setTolerance] = useState(42);
  const [softness, setSoftness] = useState(2);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [segmentedBlob, setSegmentedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const outputName = useMemo(
    () => image.file.name.replace(/\.[^.]+$/, '') + '-transparent.png',
    [image.file.name],
  );

  useEffect(() => {
    setPreviewUrl(null);
    setSegmentedBlob(null);
    setProgress(0);
    setError(null);
  }, [image.preview]);

  const runRemoval = useCallback(async () => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    try {
        const runModel = async (device: 'gpu' | 'cpu', model: 'isnet' | 'isnet_fp16' | 'isnet_quint8') => {
          const blob = await removeBackground(image.preview, {
          device,
          model,
          output: { format: 'image/png' },
          progress: (_key: string, current: number, total: number) => {
            if (total > 0) setProgress(Math.round((current / total) * 100));
          },
          });
          if (!(await hasForeground(blob))) throw new Error('The AI model returned an empty foreground mask.');
          return blob;
        };

        let blob: Blob;
        try {
          blob = await runModel('cpu', 'isnet_quint8');
        } catch {
          try {
            blob = await runModel('gpu', 'isnet_fp16');
          } catch {
            blob = await runModel('cpu', 'isnet');
          }
        }

        setSegmentedBlob(blob);
        setProgress(100);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : 'Background removal failed. Please try another image.');
      } finally {
        setIsProcessing(false);
      }
  }, [image.preview]);

  useEffect(() => {
    if (!segmentedBlob) return;

    let cancelled = false;
    const sourceUrl = URL.createObjectURL(segmentedBlob);
    const refineEdges = async () => {
      const img = new Image();
      img.src = sourceUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not prepare the segmented image.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas processing is unavailable in this browser.');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const alphaThreshold = Math.round((tolerance / 120) * 48);
      const alphaLift = softness * 8;
      for (let index = 3; index < imageData.data.length; index += 4) {
        const alpha = imageData.data[index];
        imageData.data[index] = alpha <= alphaThreshold ? 0 : Math.min(255, alpha + alphaLift);
      }
      ctx.putImageData(imageData, 0, 0);

      const refinedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('PNG export failed.')), 'image/png');
      });
      const nextUrl = URL.createObjectURL(refinedBlob);
      if (cancelled) {
        URL.revokeObjectURL(nextUrl);
      } else {
        setPreviewUrl((currentUrl) => {
          if (currentUrl) URL.revokeObjectURL(currentUrl);
          return nextUrl;
        });
      }
    };

    refineEdges().catch((refinementError) => {
      if (!cancelled) setError(refinementError instanceof Error ? refinementError.message : 'Edge refinement failed.');
    });

    return () => {
      cancelled = true;
      URL.revokeObjectURL(sourceUrl);
    };
  }, [segmentedBlob, tolerance, softness]);

  const download = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = outputName;
    link.click();
  };

  return (
    <div className="mt-8 rounded-[28px] border border-indigo-200/80 bg-white/80 p-6 shadow-[0_30px_80px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" /> Professional cleanup
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Background remover</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
          <Wand2 className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Background sensitivity</label>
            <input
              type="range"
              min="10"
              max="120"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Gentle</span>
              <span>{tolerance}</span>
              <span>Strong</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Edge softness</label>
            <input
              type="range"
              min="0"
              max="5"
              value={softness}
              onChange={(e) => setSoftness(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Sharp</span>
              <span>{softness}</span>
              <span>Smooth</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 text-sm text-slate-600 dark:border-indigo-500/40 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/40 dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-white">Recommended use</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            <li>• Product photography</li>
            <li>• Portrait subject separation</li>
            <li>• Social media and ecommerce visuals</li>
            <li>• Transparent PNG export</li>
          </ul>
        </div>
      </div>

      {isProcessing && (
        <div className="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
          <div className="flex items-center justify-between gap-4">
            <span>AI is separating the subject from the background. The first run may download the model.</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={runRemoval}
          disabled={isProcessing}
          className="inline-flex gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
        >
          <Wand2 className="h-4 w-4" />
          {isProcessing ? 'Removing background…' : previewUrl ? 'Run again' : 'Remove background'}
        </Button>
        <span className="text-xs text-slate-500 dark:text-slate-400">Runs privately in your browser and creates a transparent PNG.</span>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Original image</span>
            <span className="text-xs text-slate-500">Before</span>
          </div>
          <div className="flex min-h-[280px] items-center justify-center p-4">
            <img src={image.preview} alt="Original uploaded image" className="max-h-[420px] w-full object-contain" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Background removed</span>
            <span className="text-xs text-slate-500">Transparent PNG</span>
          </div>
          <div
            className="flex min-h-[280px] items-center justify-center p-4"
            style={{ backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)', backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px', backgroundSize: '24px 24px' }}
          >
            {previewUrl ? <img src={previewUrl} alt="Background removed result" className="max-h-[420px] w-full object-contain" /> : <p className="text-center text-sm text-slate-500">Click “Remove background” to create your transparent result.</p>}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="mt-5 space-y-5">
          <div className="flex flex-wrap gap-3">
            <Button onClick={download} className="inline-flex gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500">
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
