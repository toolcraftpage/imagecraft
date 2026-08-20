import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Download,
  Eraser,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  RefreshCcw,
  RotateCcw,
  RotateCw,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Container from '@/shared/components/ui/Container';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import { useImageUpload } from '@/shared/hooks/useImageUpload';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function averageColorFromBorder(data: Uint8ClampedArray, width: number, height: number) {
  const step = Math.max(2, Math.floor(Math.min(width, height) / 16));
  const samples: number[] = [];

  for (let x = 0; x < width; x += step) {
    const top = (0 * width + x) * 4;
    const bottom = ((height - 1) * width + x) * 4;
    samples.push(data[top], data[top + 1], data[top + 2], data[bottom], data[bottom + 1], data[bottom + 2]);
  }

  for (let y = 0; y < height; y += step) {
    const left = (y * width + 0) * 4;
    const right = (y * width + (width - 1)) * 4;
    samples.push(data[left], data[left + 1], data[left + 2], data[right], data[right + 1], data[right + 2]);
  }

  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < samples.length; i += 3) {
    r += samples[i];
    g += samples[i + 1];
    b += samples[i + 2];
  }

  const total = Math.max(1, Math.floor(samples.length / 3));
  return { r: r / total, g: g / total, b: b / total };
}

function edgeStrength(data: Uint8ClampedArray, width: number, height: number, x: number, y: number) {
  const base = (y * width + x) * 4;
  const r = data[base];
  const g = data[base + 1];
  const b = data[base + 2];
  let maxDiff = 0;

  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const nx = clamp(x + dx, 0, width - 1);
    const ny = clamp(y + dy, 0, height - 1);
    const idx = (ny * width + nx) * 4;
    const diff = Math.abs(r - data[idx]) + Math.abs(g - data[idx + 1]) + Math.abs(b - data[idx + 2]);
    maxDiff = Math.max(maxDiff, diff);
  }

  return maxDiff;
}

function applyBackgroundRemoval(imageData: ImageData, tolerance: number, softness: number) {
  const { data, width, height } = imageData;
  const bg = averageColorFromBorder(data, width, height);
  const mask = new Uint8ClampedArray(width * height);
  const queue: Array<[number, number]> = [];
  const visited = new Uint8ClampedArray(width * height);

  const enqueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    queue.push([x, y]);
  };

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        const i = (y * width + x) * 4;
        const distance = Math.sqrt((data[i] - bg.r) ** 2 + (data[i + 1] - bg.g) ** 2 + (data[i + 2] - bg.b) ** 2);
        if (distance <= tolerance * 1.2) {
          enqueue(x, y);
        }
      }
    }
  }

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const idx = y * width + x;
    mask[idx] = 1;
    const pixelIndex = idx * 4;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    const distance = Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2);
    const edge = edgeStrength(data, width, height, x, y);

    if (distance > tolerance + edge * 0.08) continue;

    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  const radius = clamp(Math.round(softness), 0, 5);
  const filtered = radius > 0 ? new Uint8ClampedArray(width * height) : mask;

  if (radius > 0) {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        let count = 0;
        let total = 0;
        for (let yy = -radius; yy <= radius; yy += 1) {
          for (let xx = -radius; xx <= radius; xx += 1) {
            const nx = x + xx;
            const ny = y + yy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            total += mask[ny * width + nx];
            count += 1;
          }
        }
        filtered[y * width + x] = count && total / count > 0.52 ? 1 : 0;
      }
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    if (filtered[Math.floor(i / 4)] === 1) {
      data[i + 3] = 0;
    }
  }

  return imageData;
}

export default function EditorPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 1 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hue, setHue] = useState(0);
  const [blur, setBlur] = useState(0);
  const [vignette, setVignette] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [preset, setPreset] = useState('None');
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [backgroundTolerance, setBackgroundTolerance] = useState(42);
  const [backgroundSoftness, setBackgroundSoftness] = useState(2);
  const [imageError, setImageError] = useState<string | null>(null);

  const currentImage = images[0];

  useEffect(() => {
    if (!currentImage?.preview) {
      imageRef.current = null;
      setImageError(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageError(null);
    };
    img.onerror = () => setImageError('The selected file could not be opened.');
    img.src = currentImage.preview;
  }, [currentImage?.preview]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const radians = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const width = Math.round(img.width * cos + img.height * sin);
    const height = Math.round(img.width * sin + img.height * cos);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radians);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

    if (removeBackground) {
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = img.width;
      tmpCanvas.height = img.height;
      const tmpCtx = tmpCanvas.getContext('2d');
      if (!tmpCtx) return;
      tmpCtx.drawImage(img, 0, 0);
      const imageData = tmpCtx.getImageData(0, 0, img.width, img.height);
      applyBackgroundRemoval(imageData, backgroundTolerance, backgroundSoftness);
      tmpCtx.putImageData(imageData, 0, 0);
      ctx.filter = `${preset === 'B&W' ? 'grayscale(1)' : ''}${preset === 'Sepia' ? 'sepia(0.8)' : ''} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px)`;
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(tmpCanvas, -img.width / 2, -img.height / 2, img.width, img.height);
    } else {
      ctx.filter = `${preset === 'B&W' ? 'grayscale(1)' : ''}${preset === 'Sepia' ? 'sepia(0.8)' : ''} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px)`;
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;

    if (vignette > 0) {
      const gradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.18, width / 2, height / 2, Math.max(width, height) * 0.7);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, `rgba(0, 0, 0, ${vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [brightness, contrast, saturation, hue, blur, vignette, opacity, preset, rotation, flipX, flipY, removeBackground, backgroundTolerance, backgroundSoftness, currentImage?.preview]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = currentImage?.file.name ? `${currentImage.file.name.replace(/\.[^.]+$/, '')}-edited.png` : 'edited-image.png';
    link.click();
  };

  const resetAdjustments = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setHue(0);
    setBlur(0);
    setVignette(0);
    setOpacity(100);
    setPreset('None');
    setRotation(0);
    setFlipX(false);
    setFlipY(false);
    setRemoveBackground(false);
    setBackgroundTolerance(42);
    setBackgroundSoftness(2);
  };

  const autoEnhance = () => {
    setBrightness(110);
    setContrast(115);
    setSaturation(120);
  };

  const applyPreset = (nextPreset: string) => {
    setPreset(nextPreset);
    if (nextPreset === 'None') {
      setBrightness(100); setContrast(100); setSaturation(100); setHue(0); setBlur(0); setVignette(0);
    } else if (nextPreset === 'B&W') {
      setBrightness(105); setContrast(112); setSaturation(0); setHue(0);
    } else if (nextPreset === 'Cool') {
      setBrightness(102); setContrast(105); setSaturation(108); setHue(-14);
    } else if (nextPreset === 'Warm') {
      setBrightness(105); setContrast(104); setSaturation(112); setHue(12);
    } else if (nextPreset === 'Sepia') {
      setBrightness(104); setContrast(108); setSaturation(82); setHue(0);
    } else if (nextPreset === 'Dramatic') {
      setBrightness(98); setContrast(135); setSaturation(112); setVignette(28);
    } else if (nextPreset === 'Soft') {
      setBrightness(106); setContrast(92); setSaturation(94); setBlur(0.4);
    }
  };

  const stats = useMemo(
    () => [{ label: 'Brightness', value: brightness }, { label: 'Contrast', value: contrast }, { label: 'Saturation', value: saturation }],
    [brightness, contrast, saturation],
  );

  return (
    <>
      <Helmet>
        <title>Advanced Editor – ImageCraft</title>
        <meta name="description" content="Professional browser-based editing studio with adjustments, transforms, and background removal tools." />
      </Helmet>

      <Container className="py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">
              Advanced studio
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Image Editor</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={autoEnhance} variant="secondary" className="gap-2">
              <Sparkles className="h-4 w-4" /> Auto Enhance
            </Button>
            <Button onClick={resetAdjustments} variant="secondary" className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Reset
            </Button>
            <Button onClick={exportImage} className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500">
              <Download className="h-4 w-4" /> Export PNG
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 md:p-6">
          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-300">
                <SlidersHorizontal className="h-4 w-4 text-indigo-500" /> Adjustments
              </div>

              <div className="space-y-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </span>
                  <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full accent-indigo-600" />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </span>
                  <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full accent-indigo-600" />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    <span>Saturation</span>
                    <span>{saturation}%</span>
                  </span>
                  <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-indigo-600" />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    <span>Hue</span>
                    <span>{hue}°</span>
                  </span>
                  <input type="range" min="-180" max="180" value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-full accent-indigo-600" />
                </label>

                {[
                  ['Blur', blur, setBlur, 0, 12, 'px'],
                  ['Vignette', vignette, setVignette, 0, 100, '%'],
                  ['Opacity', opacity, setOpacity, 0, 100, '%'],
                ].map(([label, value, setter, min, max, unit]) => (
                  <label key={label as string} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    <span className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      <span>{label as string}</span>
                      <span>{value as number}{unit as string}</span>
                    </span>
                    <input type="range" min={min as number} max={max as number} step={label === 'Blur' ? 0.1 : 1} value={value as number} onChange={(e) => (setter as (value: number) => void)(Number(e.target.value))} className="w-full accent-indigo-600" />
                  </label>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <span>Presets</span>
                  <span>{preset}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['None', 'B&W', 'Cool', 'Warm', 'Sepia', 'Dramatic', 'Soft'].map((item) => (
                    <button key={item} type="button" onClick={() => applyPreset(item)} className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${preset === item ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-indigo-50'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <span>Transform</span>
                  <span>{clamp(Math.round(rotation), -180, 180)}°</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" onClick={() => setRotation((v) => v - 90)} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Left
                  </Button>
                  <Button variant="secondary" onClick={() => setRotation((v) => v + 90)} className="gap-2">
                    <RotateCw className="h-4 w-4" /> Right
                  </Button>
                  <Button variant="secondary" onClick={() => setFlipX((v) => !v)} className="gap-2">
                    <FlipHorizontal className="h-4 w-4" /> Flip X
                  </Button>
                  <Button variant="secondary" onClick={() => setFlipY((v) => !v)} className="gap-2">
                    <FlipVertical className="h-4 w-4" /> Flip Y
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  <span>Remove BG</span>
                  <span>{backgroundTolerance}</span>
                </div>
                <Button
                  variant={removeBackground ? 'primary' : 'secondary'}
                  onClick={() => setRemoveBackground((v) => !v)}
                  className="w-full gap-2"
                >
                  <Eraser className="h-4 w-4" /> {removeBackground ? 'BG Active' : 'Apply BG Remover'}
                </Button>
                <div className="mt-3 space-y-3">
                  <label className="block text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Sensitivity
                    <input type="range" min="15" max="120" value={backgroundTolerance} onChange={(e) => setBackgroundTolerance(Number(e.target.value))} className="mt-2 w-full accent-indigo-600" />
                  </label>
                  <label className="block text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Softness
                    <input type="range" min="0" max="5" value={backgroundSoftness} onChange={(e) => setBackgroundSoftness(Number(e.target.value))} className="mt-2 w-full accent-indigo-600" />
                  </label>
                </div>
              </div>
            </aside>

            <div className="space-y-4">
              <ImageDropZone
                images={images}
                onDrop={handleDrop}
                onFileInput={handleFileInput}
                fileInputRef={fileInputRef}
                onClear={clearImages}
              />

              {imageError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
                  {imageError}
                </div>
              )}

              {currentImage && !currentImage.error && (
                <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                      <ImageIcon className="h-4 w-4 text-indigo-500" />
                      {currentImage.file.name}
                    </div>
                    {currentImage.dimensions && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {currentImage.dimensions.width} × {currentImage.dimensions.height}
                      </span>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                    <canvas ref={canvasRef} className="mx-auto max-h-[70vh] w-full object-contain rounded-xl bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.08),_transparent_55%)]" />
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-slate-700 dark:bg-slate-800/80">
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{item.label}</div>
                    <div className="mt-2 text-xl font-bold text-slate-800 dark:text-white">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
