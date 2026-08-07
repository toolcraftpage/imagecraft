import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ImageIcon } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import type { ImageFile } from '@/shared/types';

interface ImageDropZoneProps {
  images: ImageFile[];
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onClear?: () => void;
  maxFiles?: number;
  multiple?: boolean;
}

export default function ImageDropZone({
  images,
  onDrop,
  onFileInput,
  fileInputRef,
  onClear,
  maxFiles = 1,
  multiple = false,
}: ImageDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const showDropZone = images.length < maxFiles;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      onDrop(e);
    },
    [onDrop],
  );

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={`${img.file.name}-${idx}`}
              className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              {img.error ? (
                <div className="flex h-32 items-center justify-center text-red-500 text-sm">
                  {img.error}
                </div>
              ) : img.preview ? (
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="h-32 w-full object-contain"
                />
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-400">
                  <ImageIcon size={24} />
                </div>
              )}
              <div className="p-2 text-xs text-gray-600 dark:text-gray-400 truncate">
                {img.file.name}
                {img.dimensions && (
                  <span className="ml-1 text-gray-400">
                    ({img.dimensions.width}×{img.dimensions.height})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropZone && (
        <motion.div
          whileTap={{ scale: 0.98 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors ${
            isDragOver
              ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30'
              : 'border-gray-300 bg-white hover:border-primary-300 dark:border-gray-600 dark:bg-gray-800'
          }`}
        >
          <Upload className="mb-4 h-10 w-10 text-gray-400 dark:text-gray-500" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drag & drop {multiple ? 'images' : 'an image'} here
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            or
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={onFileInput}
          />
        </motion.div>
      )}

      {images.length > 0 && onClear && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1 text-gray-500">
            <X size={16} /> Clear all
          </Button>
        </div>
      )}
    </div>
  );
}