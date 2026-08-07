/**
 * Load an image from a File or URL, returning an HTMLImageElement.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Convert a canvas to a Blob of the given format and quality.
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      },
      type || 'image/png',
      quality,
    );
  });
}

/**
 * Trigger a file download in the browser.
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Resize an image (maintaining aspect ratio) using a canvas.
 * Returns a new canvas with the resized image.
 */
export function resizeImage(
  source: HTMLImageElement | HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number,
): HTMLCanvasElement {
  let { width, height } = source instanceof HTMLImageElement ? source : { width: source.width, height: source.height };

  if (width <= maxWidth && height <= maxHeight) {
    // No resize needed; just draw original
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(source, 0, 0);
    return canvas;
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

/**
 * Crop an image to a specific rectangle.
 */
export function cropImage(
  source: HTMLImageElement | HTMLCanvasElement,
  sx: number, sy: number, sw: number, sh: number,
  dw: number, dh: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source as CanvasImageSource, sx, sy, sw, sh, 0, 0, dw, dh);
  return canvas;
}

/**
 * Rotate an image by a multiple of 90 degrees.
 * `angle`: 0, 90, 180, 270.
 */
export function rotateImage(
  source: HTMLImageElement | HTMLCanvasElement,
  angle: number,
): HTMLCanvasElement {
  const { width, height } = source instanceof HTMLImageElement ? source : source;
  const rad = (angle * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newWidth = Math.round(width * cos + height * sin);
  const newHeight = Math.round(width * sin + height * cos);

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rad);
  ctx.drawImage(source as CanvasImageSource, -width / 2, -height / 2);
  return canvas;
}

/**
 * Flip an image horizontally or vertically.
 */
export function flipImage(
  source: HTMLImageElement | HTMLCanvasElement,
  direction: 'horizontal' | 'vertical',
): HTMLCanvasElement {
  const { width, height } = source instanceof HTMLImageElement ? source : source;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  if (direction === 'horizontal') {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, height);
    ctx.scale(1, -1);
  }
  ctx.drawImage(source as CanvasImageSource, 0, 0);
  return canvas;
}

/**
 * Convert an image to a different format and return a Blob.
 */
export async function convertFormat(
  source: HTMLImageElement | HTMLCanvasElement,
  format: 'image/jpeg' | 'image/png' | 'image/webp',
  quality = 0.92,
): Promise<Blob> {
  const { width, height } = source instanceof HTMLImageElement ? source : source;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source as CanvasImageSource, 0, 0);
  return canvasToBlob(canvas, format, quality);
}

/**
 * Remove EXIF metadata by redrawing the image onto a new canvas.
 */
export function stripMetadata(
  source: HTMLImageElement | HTMLCanvasElement,
): HTMLCanvasElement {
  const { width, height } = source instanceof HTMLImageElement ? source : source;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source as CanvasImageSource, 0, 0);
  return canvas;
}