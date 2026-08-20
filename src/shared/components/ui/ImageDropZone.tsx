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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        style={{ display: 'none' }}
        onChange={onFileInput}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={`${img.file.name}-${idx}`}
              className="relative overflow-hidden rounded-lg border border-border bg-surface-muted"
            >
              {img.error ? (
                <div className="flex h-32 items-center justify-center text-error text-sm">
                  {img.error}
                </div>
              ) : img.preview ? (
                <img
                  src={img.preview}
                  alt={img.file.name}
                  className="h-32 w-full object-contain"
                />
              ) : (
                <div className="flex h-32 items-center justify-center text-foreground-muted">
                  <ImageIcon size={24} />
                </div>
              )}
              <div className="truncate p-2 text-xs text-foreground-secondary">
                {img.file.name}
                {img.dimensions && (
                  <span className="ml-1 text-foreground-muted">
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
          role="button"
          tabIndex={0}
          aria-label={`Choose ${multiple ? 'images' : 'an image'} to upload`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-colors ${
            isDragOver
              ? 'border-accent bg-accent-soft'
              : 'border-input-border bg-input-background hover:border-accent/60'
          }`}
        >
          <Upload className="mb-4 h-10 w-10 text-foreground-muted" />
          <p className="text-sm font-medium text-foreground">
            Drag & drop {multiple ? 'images' : 'an image'} here
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            or
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 pointer-events-none"
          >
            Browse files
          </Button>
        </motion.div>
      )}

      {images.length > 0 && onClear && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1 text-foreground-muted hover:text-foreground">
            <X size={16} /> Clear all
          </Button>
        </div>
      )}
    </div>
  );
}