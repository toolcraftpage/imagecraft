import { useState, useEffect } from 'react';
import { loadImage, canvasToBlob } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import type { ImageFile } from '@/shared/types';

export default function SaturationControls({ image }: { image: ImageFile }) {
  const [saturation, setSaturation] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => { loadImage(image.preview).then(setImg); }, [image]);

  const apply = () => {
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = `saturate(${100 + saturation}%)`;
    ctx.drawImage(img, 0, 0);
    canvasToBlob(canvas, 'image/jpeg', 0.92).then(blob => setPreviewUrl(URL.createObjectURL(blob)));
  };

  useEffect(() => { apply(); }, [saturation, img]);

  const download = () => {
    if (previewUrl) { const a = document.createElement('a'); a.href = previewUrl; a.download = `saturation-${image.file.name}`; a.click(); }
  };

  return (
    <div className="mt-8 space-y-6 rounded-card border p-6">
      <h3 className="text-lg font-semibold">Saturation</h3>
      <div>
        <label className="mb-2 block text-sm">Saturation ({saturation})</label>
        <input type="range" min="-100" max="100" value={saturation} onChange={e => setSaturation(Number(e.target.value))} className="w-full accent-primary-500" />
      </div>
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="Preview" className="max-h-64 object-contain mb-4" />
          <Button onClick={download}>Download</Button>
        </div>
      )}
    </div>
  );
}