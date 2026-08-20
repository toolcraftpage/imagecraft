export const TOOLS = [
  { id: 'image-compressor', name: 'Compressor', description: 'Reduce file size without quality loss.', live: true, category: 'basic' },
  { id: 'crop', name: 'Crop', description: 'Trim and frame your images perfectly.', live: true, category: 'basic' },
  { id: 'image-resizer', name: 'Resize', description: 'Scale images to exact dimensions.', live: true, category: 'basic' },
  { id: 'converter', name: 'Converter Image', description: 'Convert images between JPG, PNG, and WebP.', live: true, category: 'basic' },
  { id: 'flip', name: 'Flip', description: 'Flip images horizontally or vertically.', live: true, category: 'basic' },
  { id: 'rotate', name: 'Rotate', description: 'Rotate images by any angle.', live: true, category: 'basic' },

  { id: 'brightness', name: 'Brightness', description: 'Adjust image brightness.', live: true, category: 'adjust' },
  { id: 'contrast', name: 'Contrast', description: 'Adjust image contrast.', live: true, category: 'adjust' },
  { id: 'saturation', name: 'Saturation', description: 'Adjust image saturation.', live: true, category: 'adjust' },
  { id: 'hue', name: 'Hue', description: 'Rotate the hue of an image.', live: true, category: 'adjust' },

  { id: 'text-overlay', name: 'Add Text', description: 'Overlay custom text on images.', live: true, category: 'create' },
  { id: 'collage-maker', name: 'Collage Maker', description: 'Combine multiple images into a collage.', live: true, category: 'create' },

  { id: 'pdf-to-image', name: 'PDF to Image', description: 'Convert PDF pages to images.', live: true, category: 'convert' },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert multiple images into a single PDF.', live: true, category: 'convert' },
  { id: 'pdf-merge', name: 'PDF Merge', description: 'Combine multiple PDF files into one clean document.', live: true, category: 'convert' },
  { id: 'watermark', name: 'Watermark', description: 'Add branded text or logo overlays to images.', live: true, category: 'create' },
  { id: 'favicon-generator', name: 'Favicon Generator', description: 'Create favicons for your site.', live: true, category: 'convert' },
  { id: 'metadata-viewer', name: 'Metadata Viewer', description: 'View image EXIF metadata.', live: true, category: 'convert' },
  { id: 'palette-extractor', name: 'Color Palette', description: 'Extract dominant colors.', live: true, category: 'convert' },

  { id: 'background-remover', name: 'Background Remover', description: 'AI-style background removal for clean transparent PNGs.', live: true, category: 'other' },
] as const;

export const TOOL_CATEGORIES = [
  { key: 'basic', label: 'Basic Editing' },
  { key: 'adjust', label: 'Adjust Colors' },
  { key: 'create', label: 'Create & Design' },
  { key: 'convert', label: 'Convert & Export' },
  { key: 'other', label: 'Advanced Tools' },
] as const;

export const TOOL_PATH = (id: string) => `/tools/${id}`;

export const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/editor': 'Editor',
  '/tools': 'Tools',
  ...Object.fromEntries(TOOLS.map((t) => [TOOL_PATH(t.id), t.name])),
};