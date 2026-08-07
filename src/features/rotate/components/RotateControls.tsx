import { useState, useEffect } from 'react';
import { loadImage, rotateImage, canvasToBlob, downloadFile } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import type { ImageFile } from '@/shared/types';

export default function RotateControls({ image }: { image: ImageFile }) {
  const [angle, setAngle] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => { loadImage(image.preview).then(setImg); }, [image]);

  const applyRotation = (deg?: number) => {
    if (!img) return;
    const rotationAngle = deg !== undefined ? deg : angle;
    const canvas = rotateImage(img, rotationAngle);
    canvasToBlob(canvas, 'image/png').then(blob => setPreviewUrl(URL.createObjectURL(blob)));
  };

  const download = () => {
    if (previewUrl) { const a = document.createElement('a'); a.href = previewUrl; a.download = `rotated-${image.file.name}`; a.click(); }
  };

  return (
    <div className="mt-8 space-y-6 rounded-card border p-6">
      <h3 className="text-lg font-semibold">Rotation</h3>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => applyRotation(90)}>Rotate 90°</Button>
        <Button onClick={() => applyRotation(180)}>Rotate 180°</Button>
        <Button onClick={() => applyRotation(270)}>Rotate 270°</Button>
      </div>
      <div className="flex items-center gap-4">
        <Input label="Custom Angle (°)" type="number" value={angle} onChange={e => setAngle(Number(e.target.value))} min={0} max={360} className="w-32" />
        <Button onClick={() => applyRotation()}>Rotate</Button>
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