const RECENT_IMAGES_KEY = 'editor_recent_images';
const MAX_RECENT = 10;

export function loadImageFromFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function getRecentImages(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_IMAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentImage(dataUrl: string) {
  const recent = getRecentImages().filter((url) => url !== dataUrl);
  recent.unshift(dataUrl);
  if (recent.length > MAX_RECENT) recent.pop();
  localStorage.setItem(RECENT_IMAGES_KEY, JSON.stringify(recent));
}