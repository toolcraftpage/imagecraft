import { useState, useCallback, useRef } from 'react';
import { validateImageFile } from '@/shared/services/fileValidation';
import type { ImageFile } from '@/shared/types';

interface UseImageUploadOptions {
  maxFiles?: number;
}

export function useImageUpload({ maxFiles = 1 }: UseImageUploadOptions = {}) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).slice(0, maxFiles);

      if (fileArray.length === 0) {
        return;
      }

      const resolvedImages = fileArray.map((file) => {
        const error = validateImageFile(file);
        if (error) {
          return Promise.resolve({ file, preview: '', dimensions: null, error } satisfies ImageFile);
        }

        return new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = typeof event.target?.result === 'string' ? event.target.result : '';
            if (!dataUrl) {
              resolve({ file, preview: '', dimensions: null, error: 'The selected file could not be opened.' });
              return;
            }

            const img = new Image();
            img.onload = () => {
              resolve({
                file,
                preview: dataUrl,
                dimensions: { width: img.naturalWidth, height: img.naturalHeight },
              });
            };
            img.onerror = () => {
              resolve({ file, preview: '', dimensions: null, error: 'The selected file could not be opened.' });
            };
            img.src = dataUrl;
          };
          reader.onerror = () => {
            resolve({ file, preview: '', dimensions: null, error: 'The selected file could not be opened.' });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(resolvedImages).then((processedImages) => {
        setImages(processedImages.slice(0, maxFiles));
      });
    },
    [maxFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = '';
      }
    },
    [processFiles],
  );

  const clearImages = useCallback(() => {
    setImages([]);
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    images,
    setImages,
    fileInputRef,
    processFiles,
    handleDrop,
    handleFileInput,
    clearImages,
    openFileDialog,
  };
}