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
      const newImages: ImageFile[] = [];

      fileArray.forEach((file) => {
        const error = validateImageFile(file);
        if (error) {
          newImages.push({ file, preview: '', dimensions: null, error });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            setImages((prev) =>
              prev.map((imgFile) =>
                imgFile.file === file
                  ? {
                      ...imgFile,
                      preview: dataUrl,
                      dimensions: { width: img.naturalWidth, height: img.naturalHeight },
                      error: undefined,
                    }
                  : imgFile,
              ),
            );
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);

        newImages.push({
          file,
          preview: '',
          dimensions: null,
        });
      });

      setImages((prev) => [...prev, ...newImages]);
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
    handleDrop,
    handleFileInput,
    clearImages,
    openFileDialog,
  };
}