export type Theme = 'light' | 'dark';

// Image dimensions (width/height in pixels)
export interface ImageDimensions {
  width: number;
  height: number;
}

// Represents a file uploaded by the user, including preview and dimensions
export interface ImageFile {
  file: File;
  preview: string;          // data‑URL for preview
  dimensions: ImageDimensions | null;
  error?: string;
}

// Options for image processing (resize, compress, format conversion)
export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;         // 0–1 for JPEG/WebP
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  preserveMetadata?: boolean;
}

// Additional types used across features
export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' | 'image/svg+xml' | 'image/bmp' | 'image/tiff';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollageLayout {
  rows: number;
  cols: number;
  gap: number;
  backgroundColor: string;
}