const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/tiff'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Unsupported file type: ${file.type}`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (max ${MAX_FILE_SIZE / (1024 * 1024)} MB)`;
  }
  return null;
}