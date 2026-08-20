import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import { Download, ImagePlus, Type, Droplets } from 'lucide-react';
import Container from '@/shared/components/ui/Container';
import Button from '@/shared/components/ui/Button';
import ImageDropZone from '@/shared/components/ui/ImageDropZone';
import { useImageUpload } from '@/shared/hooks/useImageUpload';
import { loadImage, canvasToBlob } from '@/shared/services/imageUtils';

export default function WatermarkPage() {
  const { images, fileInputRef, handleDrop, handleFileInput, clearImages } = useImageUpload({ maxFiles: 1 });
  const [text, setText] = useState('ImageCraft');
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(40);
  const [fontSize, setFontSize] = useState(56);
  const [rotation, setRotation] = useState(-25);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const image = images[0];

  useEffect(() => {
    if (!image?.preview) {
      setImg(null);
      return;
    }

    loadImage(image.preview)
      .then(setImg)
      .catch(() => setImg(null));
  }, [image?.preview]);

  useEffect(() => {
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    ctx.save();
    ctx.translate((position.x / 100) * img.width, (position.y / 100) * img.height);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.font = `700 ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.fillText(text || 'ImageCraft', 0, 0);
    ctx.restore();

    canvasToBlob(canvas, 'image/png').then((blob) => {
      setPreviewUrl(URL.createObjectURL(blob));
    });
  }, [img, text, color, opacity, fontSize, rotation, position]);

  const downloadWatermarked = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `${image?.file.name?.replace(/\.[^/.]+$/, '') || 'watermarked-image'}-watermarked.png`;
    link.click();
  };

  const presets = useMemo(
    () => [
      { label: 'Center', x: 50, y: 50 },
      { label: 'Top-left', x: 20, y: 20 },
      { label: 'Bottom-right', x: 80, y: 80 },
    ],
    [],
  );

  return (
    <>
      <Helmet>
        <title>Watermark – ImageCraft</title>
      </Helmet>

      <Container className="py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Advanced tools</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Image Watermark</h1>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <ImageDropZone
              images={images}
              onDrop={handleDrop}
              onFileInput={handleFileInput}
              fileInputRef={fileInputRef}
              onClear={clearImages}
              maxFiles={1}
            />

            {img && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background p-4">
                <img src={previewUrl || image.preview} alt="Watermarked preview" className="max-h-[520px] w-full rounded-xl object-contain" />
              </div>
            )}
          </div>

          <div className="space-y-5 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Watermark text</label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                <Type className="h-4 w-4 text-muted" />
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  className="w-full bg-transparent text-sm text-foreground outline-none"
                  placeholder="ImageCraft"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Text color</label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2">
                <Droplets className="h-4 w-4 text-muted" />
                <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="h-10 w-16 border-0 bg-transparent p-0" />
                <span className="text-sm text-muted">{color}</span>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-foreground">
                <span>Opacity</span>
                <span>{opacity}%</span>
              </div>
              <input type="range" min="5" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-accent" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-foreground">
                <span>Size</span>
                <span>{fontSize}px</span>
              </div>
              <input type="range" min="20" max="180" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-accent" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-foreground">
                <span>Rotation</span>
                <span>{rotation}°</span>
              </div>
              <input type="range" min="-90" max="90" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-accent" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Preset position</label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPosition({ x: preset.x, y: preset.y })}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:border-accent/40 hover:text-accent"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Custom position</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background px-3 py-2">
                  <p className="mb-1 text-xs uppercase tracking-[0.16em] text-muted">X</p>
                  <input type="range" min="0" max="100" value={position.x} onChange={(e) => setPosition((prev) => ({ ...prev, x: Number(e.target.value) }))} className="w-full accent-accent" />
                </div>
                <div className="rounded-xl border border-border bg-background px-3 py-2">
                  <p className="mb-1 text-xs uppercase tracking-[0.16em] text-muted">Y</p>
                  <input type="range" min="0" max="100" value={position.y} onChange={(e) => setPosition((prev) => ({ ...prev, y: Number(e.target.value) }))} className="w-full accent-accent" />
                </div>
              </div>
            </div>

            <Button onClick={downloadWatermarked} disabled={!previewUrl} className="w-full gap-2">
              <Download className="h-4 w-4" /> Download image
            </Button>

            {!image && (
              <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  Upload an image to begin.
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
