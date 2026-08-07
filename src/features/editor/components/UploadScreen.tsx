import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FabricImage } from 'fabric';
import { Upload, ImagePlus, Link, Clock } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import { useEditorStore } from '../store/editorStore';

const RECENT_KEY = 'editor_recent';

export default function UploadScreen() {
  const { canvas, setHasImages, pushHistory } = useEditorStore();
  const [drag, setDrag] = useState(false);
  const [url, setUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => { try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')); } catch {} }, []);

  const add = useCallback(async (dataUrl: string) => {
    if (!canvas) return;
    try {
      const img = await FabricImage.fromURL(dataUrl);
      img.scaleToWidth(Math.min(400, canvas.width! * 0.8));
      canvas.add(img); canvas.centerObject(img); canvas.renderAll();
      pushHistory(JSON.stringify(canvas.toJSON()));
      setHasImages(true);
      const r = [dataUrl, ...recent.filter(u => u !== dataUrl)].slice(0, 10);
      setRecent(r); localStorage.setItem(RECENT_KEY, JSON.stringify(r));
    } catch { alert('Failed to load image.'); }
  }, [canvas, setHasImages, pushHistory, recent]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => add(reader.result as string);
    reader.readAsDataURL(file);
  }, [add]);

  const drop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }, [handleFile]);
  const paste = useCallback((e: ClipboardEvent) => { const items = e.clipboardData?.items; if (items) for (const item of Array.from(items)) if (item.type.startsWith('image/')) { handleFile(item.getAsFile()!); break; } }, [handleFile]);
  useEffect(() => { document.addEventListener('paste', paste); return () => document.removeEventListener('paste', paste); }, [paste]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={drop}
        className={`mx-4 w-full max-w-2xl rounded-2xl border-2 border-dashed p-10 transition-all ${drag ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full bg-primary-100 p-5 dark:bg-primary-900"><Upload className="h-12 w-12 text-primary-500" /></div>
          <h2 className="text-2xl font-bold">Open an Image</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Drop, paste, or use the options below.</p>
          <div className="flex gap-3">
            <Button onClick={() => fileRef.current?.click()} className="gap-2"><ImagePlus size={18} /> Upload</Button>
            <Button variant="secondary" onClick={() => setShowUrl(true)} className="gap-2"><Link size={18} /> URL</Button>
          </div>
          {showUrl && (
            <div className="flex w-full max-w-sm gap-2">
              <input type="text" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && add(url)} className="flex-1 rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600" autoFocus />
              <Button onClick={() => add(url)}>Open</Button>
            </div>
          )}
          {recent.length > 0 && (
            <div className="w-full">
              <p className="mb-2 text-sm text-gray-500 flex items-center gap-2"><Clock size={14} /> Recent</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {recent.map((u, i) => <div key={i} onClick={() => add(u)} className="w-16 h-16 rounded-lg overflow-hidden border cursor-pointer hover:ring-2 ring-primary-500 flex-shrink-0"><img src={u} className="w-full h-full object-cover" /></div>)}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP, SVG, GIF, BMP, ICO • Max 50 MB</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      </div>
    </motion.div>
  );
}