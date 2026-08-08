import { useRef, useState, useEffect, useCallback } from 'react';
import { loadImage, cropImage, canvasToBlob } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import { Crop as CropIcon, Download } from 'lucide-react';
import type { ImageFile } from '@/shared/types';

interface CropCanvasProps {
  image: ImageFile;
}

type AspectRatioPreset = { label: string; value: number | null; width?: number; height?: number };

const PRESETS: AspectRatioPreset[] = [
  { label: 'Freeform', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
  { label: 'YouTube', value: 16 / 9, width: 1280, height: 720 },
  { label: 'Instagram', value: 1, width: 1080, height: 1080 },
  { label: 'Twitter Post', value: 16 / 9, width: 1200, height: 675 },
  { label: 'Facebook Cover', value: 820 / 312, width: 820, height: 312 },
];

export default function CropCanvas({ image }: CropCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [dragging, setDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'move' | 'resize' | null>(null);
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<AspectRatioPreset>(PRESETS[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropDimensions, setCropDimensions] = useState({ w: 0, h: 0 });
  const scaleRef = useRef(1);

  useEffect(() => {
    if (!image.preview) return;
    loadImage(image.preview).then((loadedImg) => {
      setImg(loadedImg);
      const w = loadedImg.width * 0.5;
      const h = loadedImg.height * 0.5;
      setCrop({
        x: (loadedImg.width - w) / 2,
        y: (loadedImg.height - h) / 2,
        width: w,
        height: h,
      });
    });
  }, [image]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const maxWidth = Math.min(700, window.innerWidth - 40);
    const scale = maxWidth / img.width;
    scaleRef.current = scale;

    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.rect(
      crop.x * scale,
      crop.y * scale,
      crop.width * scale,
      crop.height * scale,
    );
    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      crop.x * scale,
      crop.y * scale,
      crop.width * scale,
      crop.height * scale,
    );

    const handleSize = 10;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5;
    const corners = [
      [crop.x * scale, crop.y * scale],
      [(crop.x + crop.width) * scale, crop.y * scale],
      [crop.x * scale, (crop.y + crop.height) * scale],
      [(crop.x + crop.width) * scale, (crop.y + crop.height) * scale],
    ];
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    });

    setCropDimensions({ w: Math.round(crop.width), h: Math.round(crop.height) });
  }, [img, crop]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scaleRef.current,
      y: (e.clientY - rect.top) / scaleRef.current,
    };
  };

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!img) return;
    const pos = getCanvasCoords(e);
    const threshold = 10 / scaleRef.current;

    const corners = {
      tl: { x: crop.x, y: crop.y },
      tr: { x: crop.x + crop.width, y: crop.y },
      bl: { x: crop.x, y: crop.y + crop.height },
      br: { x: crop.x + crop.width, y: crop.y + crop.height },
    };

    for (const [corner, pt] of Object.entries(corners)) {
      if (Math.abs(pos.x - pt.x) < threshold && Math.abs(pos.y - pt.y) < threshold) {
        setResizeCorner(corner);
        setDragMode('resize');
        setDragging(true);
        return;
      }
    }

    if (
      pos.x > crop.x && pos.x < crop.x + crop.width &&
      pos.y > crop.y && pos.y < crop.y + crop.height
    ) {
      setDragMode('move');
      setDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !img) return;
    const pos = getCanvasCoords(e);
    const ratio = activePreset.value;

    setCrop((prev) => {
      const newCrop = { ...prev };
      const minSize = 20;

      if (dragMode === 'move') {
        newCrop.x = clamp(pos.x - prev.width / 2, 0, img.width - prev.width);
        newCrop.y = clamp(pos.y - prev.height / 2, 0, img.height - prev.height);
      } else if (dragMode === 'resize' && resizeCorner) {
        if (resizeCorner.includes('r')) {
          newCrop.width = Math.max(minSize, pos.x - prev.x);
        }
        if (resizeCorner.includes('l')) {
          const newW = prev.x + prev.width - pos.x;
          if (newW >= minSize) {
            newCrop.x = pos.x;
            newCrop.width = newW;
          }
        }
        if (resizeCorner.includes('b')) {
          newCrop.height = Math.max(minSize, pos.y - prev.y);
        }
        if (resizeCorner.includes('t')) {
          const newH = prev.y + prev.height - pos.y;
          if (newH >= minSize) {
            newCrop.y = pos.y;
            newCrop.height = newH;
          }
        }
        if (ratio) {
          if (resizeCorner === 'br' || resizeCorner === 'bl') {
            newCrop.height = newCrop.width / ratio;
          } else {
            newCrop.width = newCrop.height * ratio;
          }
        }
      }

      newCrop.x = clamp(newCrop.x, 0, img.width - newCrop.width);
      newCrop.y = clamp(newCrop.y, 0, img.height - newCrop.height);
      newCrop.width = clamp(newCrop.width, minSize, img.width - newCrop.x);
      newCrop.height = clamp(newCrop.height, minSize, img.height - newCrop.y);

      return newCrop;
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragMode(null);
    setResizeCorner(null);
  };

  const applyPreset = (preset: AspectRatioPreset) => {
    setActivePreset(preset);
    if (!img) return;
    if (preset.width && preset.height) {
      setCrop({
        x: (img.width - preset.width) / 2,
        y: (img.height - preset.height) / 2,
        width: preset.width,
        height: preset.height,
      });
    }
  };

  const handleCrop = async () => {
    if (!img) return;
    const cropped = cropImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      crop.width,
      crop.height,
    );
    const blob = await canvasToBlob(cropped, 'image/png');
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const handleDownload = () => {
    if (previewUrl) {
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = `cropped-${image.file.name}`;
      a.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant={activePreset.label === preset.label ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => applyPreset(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="overflow-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-950">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Crop: {cropDimensions.w} × {cropDimensions.h} px</span>
        <div className="flex gap-2">
          <Button onClick={handleCrop} className="gap-2">
            <CropIcon size={16} /> Preview Crop
          </Button>
          {previewUrl && (
            <Button onClick={handleDownload} variant="secondary" className="gap-2">
              <Download size={16} /> Download
            </Button>
          )}
        </div>
      </div>

      {previewUrl && (
        <div className="rounded-card border border-gray-200 bg-white p-4 dark:bg-gray-800">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Cropped preview:</p>
          <img src={previewUrl} alt="Cropped" className="max-h-64 object-contain" />
        </div>
      )}
    </div>
  );
}