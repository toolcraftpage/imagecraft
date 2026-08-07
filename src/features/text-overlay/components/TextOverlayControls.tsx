import { useState, useRef, useEffect } from 'react';
import { loadImage, canvasToBlob } from '@/shared/services/imageUtils';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import {
  Download,
  Plus,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Blend,
  Type,
} from 'lucide-react';
import type { ImageFile } from '@/shared/types';

interface ShadowSettings {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}

interface StrokeSettings {
  enabled: boolean;
  width: number;
  color: string;
}

interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  opacity: number;
  shadow: ShadowSettings;
  stroke: StrokeSettings;
}

let nextId = 1;

const defaultText: Omit<TextItem, 'id'> = {
  text: 'Sample Text',
  x: 50,
  y: 50,
  rotation: 0,
  fontSize: 40,
  fontFamily: 'Arial',
  color: '#ffffff',
  bold: false,
  italic: false,
  underline: false,
  textAlign: 'center',
  letterSpacing: 0,
  opacity: 1,
  shadow: {
    enabled: true,
    offsetX: 2,
    offsetY: 2,
    blur: 4,
    color: '#000000',
  },
  stroke: {
    enabled: false,
    width: 3,           // increased from 2 to 3 for visibility
    color: '#000000',
  },
};

export default function TextOverlayControls({ image }: { image: ImageFile }) {
  const [texts, setTexts] = useState<TextItem[]>([{ id: '1', ...defaultText }]);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadImage(image.preview).then(setImg);
  }, [image]);

  useEffect(() => {
    if (!img || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const aspectRatio = img.width / img.height;
    const containerHeight = containerWidth / aspectRatio;
    setContainerSize({ width: containerWidth, height: containerHeight });
  }, [img]);

  useEffect(() => {
    const handleResize = () => {
      if (img && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = img.width / img.height;
        const containerHeight = containerWidth / aspectRatio;
        setContainerSize({ width: containerWidth, height: containerHeight });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [img]);

  // Generate flat image for download – stroke drawn AFTER fill so it becomes visible
  useEffect(() => {
    if (!img || texts.length === 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);

    texts.forEach((t) => {
      const x = (t.x / 100) * img.width;
      const y = (t.y / 100) * img.height;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((t.rotation * Math.PI) / 180);
      ctx.globalAlpha = t.opacity;
      ctx.textAlign = t.textAlign;
      ctx.letterSpacing = `${t.letterSpacing}px`;
      ctx.font = `${t.italic ? 'italic ' : ''}${t.bold ? 'bold ' : ''}${t.fontSize}px ${t.fontFamily}`;

      // Shadow
      if (t.shadow.enabled) {
        ctx.shadowOffsetX = t.shadow.offsetX;
        ctx.shadowOffsetY = t.shadow.offsetY;
        ctx.shadowBlur = t.shadow.blur;
        ctx.shadowColor = t.shadow.color;
      } else {
        ctx.shadowColor = 'transparent';
      }

      // Fill text first
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, 0, 0);

      // Stroke drawn AFTER fill – this makes the outline visible on top
      if (t.stroke.enabled) {
        ctx.strokeStyle = t.stroke.color;
        ctx.lineWidth = t.stroke.width;
        ctx.strokeText(t.text, 0, 0);
      }

      // Underline
      if (t.underline) {
        const textWidth = ctx.measureText(t.text).width;
        const startX = t.textAlign === 'center' ? -textWidth / 2 : t.textAlign === 'right' ? -textWidth : 0;
        ctx.beginPath();
        ctx.strokeStyle = t.color;
        ctx.lineWidth = Math.max(1, t.fontSize / 15);
        ctx.moveTo(startX, t.fontSize * 0.15);
        ctx.lineTo(startX + textWidth, t.fontSize * 0.15);
        ctx.stroke();
      }

      ctx.restore();
    });

    canvasToBlob(canvas, 'image/png').then((blob) => {
      setPreviewUrl(URL.createObjectURL(blob));
    });
  }, [texts, img]);

  const selectedText = texts.find((t) => t.id === selectedId);

  const updateText = (id: string, changes: Partial<TextItem>) => {
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  };

  const updateShadow = (id: string, changes: Partial<ShadowSettings>) => {
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, shadow: { ...t.shadow, ...changes } } : t,
      ),
    );
  };

  const updateStroke = (id: string, changes: Partial<StrokeSettings>) => {
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, stroke: { ...t.stroke, ...changes } } : t,
      ),
    );
  };

  const addText = () => {
    const newId = String(nextId++);
    const newText: TextItem = { id: newId, ...defaultText };
    setTexts((prev) => [...prev, newText]);
    setSelectedId(newId);
    setEditingId(newId);
    setEditText(newText.text);
  };

  const deleteText = () => {
    if (!selectedId || texts.length <= 1) return;
    setTexts((prev) => prev.filter((t) => t.id !== selectedId));
    const remaining = texts.filter((t) => t.id !== selectedId);
    setSelectedId(remaining.length ? remaining[0].id : '');
    if (editingId === selectedId) {
      setEditingId(null);
      setEditText('');
    }
  };

  const download = () => {
    if (previewUrl) {
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = `text-overlay-${image.file.name}`;
      a.click();
    }
  };

  // ... (mouse interaction handlers remain identical to the previous version)

  const handleDragStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    const startX = e.clientX;
    const startY = e.clientY;
    const textItem = texts.find((t) => t.id === id);
    if (!textItem) return;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      if (!containerRef.current || containerSize.width === 0) return;
      const percentX = (deltaX / containerSize.width) * 100;
      const percentY = (deltaY / containerSize.height) * 100;
      updateText(id, {
        x: Math.max(0, Math.min(100, textItem.x + percentX)),
        y: Math.max(0, Math.min(100, textItem.y + percentY)),
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotateStart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    const textItem = texts.find((t) => t.id === id);
    if (!textItem) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const centerX = containerRect!.left + (textItem.x / 100) * containerSize.width;
    const centerY = containerRect!.top + (textItem.y / 100) * containerSize.height;
    const startAngle =
      (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentAngle =
        (Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180) /
        Math.PI;
      const deltaAngle = currentAngle - startAngle;
      updateText(id, { rotation: (textItem.rotation + deltaAngle) % 360 });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = (id: string) => {
    const textItem = texts.find((t) => t.id === id);
    if (!textItem) return;
    setEditingId(id);
    setEditText(textItem.text);
  };

  const commitEditing = () => {
    if (editingId) {
      updateText(editingId, { text: editText });
    }
    setEditingId(null);
    setEditText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEditing();
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditText('');
    }
  };

  if (!img) return null;

  return (
    <div className="mt-8 space-y-6">
      {/* Floating toolbar */}
      {selectedText && (
        <div className="rounded-card border bg-surface p-4 shadow-card dark:bg-surface dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Text Properties
          </h3>
          {/* Basic controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Text"
              value={editingId ? editText : selectedText.text}
              onChange={(e) => {
                if (editingId) setEditText(e.target.value);
                else updateText(selectedText.id, { text: e.target.value });
              }}
              onFocus={() => {
                if (!editingId) {
                  setEditingId(selectedText.id);
                  setEditText(selectedText.text);
                }
              }}
            />
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                Font Size
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={selectedText.fontSize}
                  onChange={(e) =>
                    updateText(selectedText.id, { fontSize: Number(e.target.value) })
                  }
                  className="flex-1 accent-primary-500"
                />
                <input
                  type="number"
                  value={selectedText.fontSize}
                  onChange={(e) =>
                    updateText(selectedText.id, { fontSize: Number(e.target.value) })
                  }
                  className="w-16 rounded border px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  min="10"
                  max="200"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                Font Family
              </label>
              <select
                value={selectedText.fontFamily}
                onChange={(e) =>
                  updateText(selectedText.id, { fontFamily: e.target.value })
                }
                className="w-full rounded-lg border px-2 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Impact', 'Comic Sans MS'].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                Color
              </label>
              <input
                type="color"
                value={selectedText.color}
                onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                className="h-10 w-full cursor-pointer rounded border dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          </div>
          {/* Style buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedText.bold ? 'primary' : 'secondary'}
              onClick={() => updateText(selectedText.id, { bold: !selectedText.bold })}
            >
              <Bold size={16} />
            </Button>
            <Button
              size="sm"
              variant={selectedText.italic ? 'primary' : 'secondary'}
              onClick={() => updateText(selectedText.id, { italic: !selectedText.italic })}
            >
              <Italic size={16} />
            </Button>
            <Button
              size="sm"
              variant={selectedText.underline ? 'primary' : 'secondary'}
              onClick={() => updateText(selectedText.id, { underline: !selectedText.underline })}
            >
              <Underline size={16} />
            </Button>
            <span className="mx-1 text-gray-300">|</span>
            <Button
              size="sm"
              variant={selectedText.textAlign === 'left' ? 'primary' : 'secondary'}
              onClick={() => updateText(selectedText.id, { textAlign: 'left' })}
            >
              <AlignLeft size={16} />
            </Button>
            <Button
              size="sm"
              variant={selectedText.textAlign === 'center' ? 'primary' : 'secondary'}
              onClick={() => updateText(selectedText.id, { textAlign: 'center' })}
            >
              <AlignCenter size={16} />
            </Button>
            <Button
              size="sm"
              variant={selectedText.textAlign === 'right' ? 'primary' : 'secondary'}
              onClick={() => updateText(selectedText.id, { textAlign: 'right' })}
            >
              <AlignRight size={16} />
            </Button>
          </div>
          {/* Opacity & Letter Spacing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={selectedText.opacity}
                onChange={(e) => updateText(selectedText.id, { opacity: Number(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">
                Letter Spacing
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={selectedText.letterSpacing}
                onChange={(e) => updateText(selectedText.id, { letterSpacing: Number(e.target.value) })}
                className="w-full accent-primary-500"
              />
            </div>
          </div>
          {/* Shadow settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Blend size={16} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shadow</label>
              <input
                type="checkbox"
                checked={selectedText.shadow.enabled}
                onChange={(e) => updateShadow(selectedText.id, { enabled: e.target.checked })}
                className="accent-primary-500"
              />
            </div>
            {selectedText.shadow.enabled && (
              <div className="grid grid-cols-2 gap-2 ml-8">
                <Input label="Offset X" type="number" value={selectedText.shadow.offsetX} onChange={(e) => updateShadow(selectedText.id, { offsetX: Number(e.target.value) })} />
                <Input label="Offset Y" type="number" value={selectedText.shadow.offsetY} onChange={(e) => updateShadow(selectedText.id, { offsetY: Number(e.target.value) })} />
                <Input label="Blur" type="number" value={selectedText.shadow.blur} onChange={(e) => updateShadow(selectedText.id, { blur: Number(e.target.value) })} />
                <div>
                  <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Color</label>
                  <input type="color" value={selectedText.shadow.color} onChange={(e) => updateShadow(selectedText.id, { color: e.target.value })} className="h-8 w-full cursor-pointer rounded border" />
                </div>
              </div>
            )}
          </div>
          {/* Stroke settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type size={16} className="text-gray-500" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stroke</label>
              <input
                type="checkbox"
                checked={selectedText.stroke.enabled}
                onChange={(e) => updateStroke(selectedText.id, { enabled: e.target.checked })}
                className="accent-primary-500"
              />
            </div>
            {selectedText.stroke.enabled && (
              <div className="grid grid-cols-2 gap-2 ml-8">
                <Input label="Width" type="number" value={selectedText.stroke.width} onChange={(e) => updateStroke(selectedText.id, { width: Number(e.target.value) })} />
                <div>
                  <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Color</label>
                  <input type="color" value={selectedText.stroke.color} onChange={(e) => updateStroke(selectedText.id, { color: e.target.value })} className="h-8 w-full cursor-pointer rounded border" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main interactive area */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800 mx-auto"
        style={{
          width: '100%',
          maxWidth: 800,
          aspectRatio: `${img.width} / ${img.height}`,
        }}
      >
        <img src={image.preview} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        {texts.map((text) => (
          <div
            key={text.id}
            className={`absolute cursor-move group ${selectedId === text.id ? 'ring-2 ring-primary-500' : ''}`}
            style={{
              left: `${text.x}%`,
              top: `${text.y}%`,
              transform: `translate(-50%, -50%) rotate(${text.rotation}deg)`,
              fontSize: `${text.fontSize}px`,
              fontFamily: text.fontFamily,
              color: text.color,
              fontWeight: text.bold ? 'bold' : 'normal',
              fontStyle: text.italic ? 'italic' : 'normal',
              textDecoration: text.underline ? 'underline' : 'none',
              textAlign: text.textAlign,
              letterSpacing: `${text.letterSpacing}px`,
              opacity: text.opacity,
              textShadow: text.shadow.enabled
                ? `${text.shadow.offsetX}px ${text.shadow.offsetY}px ${text.shadow.blur}px ${text.shadow.color}`
                : 'none',
              WebkitTextStroke: text.stroke.enabled
                ? `${text.stroke.width}px ${text.stroke.color}`
                : 'unset',
              whiteSpace: 'nowrap',
            }}
            onMouseDown={(e) => handleDragStart(text.id, e)}
            onDoubleClick={() => handleDoubleClick(text.id)}
          >
            {editingId === text.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitEditing}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-b border-white outline-none text-inherit"
                style={{
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  letterSpacing: 'inherit',
                  textShadow: 'inherit',
                  WebkitTextStroke: 'inherit',
                  width: 'auto',
                }}
                autoFocus
              />
            ) : (
              text.text
            )}
            {(selectedId === text.id || editingId !== text.id) && (
              <div
                className="absolute -top-6 -right-6 w-6 h-6 bg-primary-500 rounded-full cursor-pointer flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseDown={(e) => handleRotateStart(text.id, e)}
                title="Rotate"
              >
                ↻
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <Button onClick={addText} className="gap-1">
          <Plus size={16} /> Add Text
        </Button>
        <Button variant="secondary" onClick={deleteText} disabled={texts.length <= 1} className="gap-1">
          <Trash2 size={16} /> Delete
        </Button>
        <Button onClick={download} className="gap-1">
          <Download size={16} /> Download
        </Button>
      </div>
    </div>
  );
}