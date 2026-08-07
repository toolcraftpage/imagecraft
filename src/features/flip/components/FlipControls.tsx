import { useState, useEffect } from 'react';
import { loadImage, flipImage, canvasToBlob, downloadFile } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import type { ImageFile } from '@/shared/types';

export default function FlipControls({ image }: { image: ImageFile }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => { loadImage(image.preview).then(setImg); }, [image]);

  const applyFlip = (direction: 'horizontal' | 'vertical') => {
    if (!img) return;
    const canvas = flipImage(img, direction);
    canvasToBlob(canvas, 'image/png').then(blob => setPreviewUrl(URL.createObjectURL(blob)));
  };

  const download = () => {
    if (previewUrl) { const a = document.createElement('a'); a.href = previewUrl; a.download = `flipped-${image.file.name}`; a.click(); }
  };

  return (
    <div className="mt-8 space-y-6 rounded-card border p-6">
      <h3 className="text-lg font-semibold">Flip Direction</h3>
      <div className="flex gap-2">
        <Button onClick={() => applyFlip('horizontal')}>Flip Horizontal</Button>
        <Button onClick={() => applyFlip('vertical')}>Flip Vertical</Button>
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