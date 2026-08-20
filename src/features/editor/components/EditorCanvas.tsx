import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';

interface EditorCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  dragOver?: boolean;
  cropSelection?: { x: number; y: number; width: number; height: number } | null;
  activeTool?: string;
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
  onCropPointerDown?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onCropPointerMove?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onCropPointerUp?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerDown?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLCanvasElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export default function EditorCanvas({
  canvasRef,
  dragOver = false,
  cropSelection = null,
  activeTool = 'select',
  onDrop,
  onDragOver,
  onDragLeave,
  onCropPointerDown,
  onCropPointerMove,
  onCropPointerUp,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDoubleClick,
}: EditorCanvasProps) {
  const {
    zoom,
    canvasWidth,
    canvasHeight,
    setCanvasDimensions,
    textObjects,
    editingTextId,
    updateTextObject,
    setEditingTextId,
  } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const editingObject = textObjects.find((text) => text.id === editingTextId) ?? null;

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasDimensions(canvasRef.current.width, canvasRef.current.height);
    }
  }, [canvasRef, setCanvasDimensions]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-background"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)`,
      }}
    >
      <div className="flex h-full items-center justify-center px-4 py-6">
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-md)]"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center',
          }}
        >
          <canvas
            ref={canvasRef}
            className="block h-full w-full bg-white"
            style={{ cursor: activeTool === 'crop' ? 'crosshair' : activeTool === 'text' ? 'text' : 'default' }}
            onPointerDown={onPointerDown ?? onCropPointerDown}
            onPointerMove={onPointerMove ?? onCropPointerMove}
            onPointerUp={onPointerUp ?? onCropPointerUp}
            onPointerLeave={onPointerUp ?? onCropPointerUp}
            onDoubleClick={onDoubleClick}
          />

          {editingObject && (
            <textarea
              aria-label="Edit text"
              value={editingObject.text}
              onChange={(event) => {
                if (!editingTextId) return;
                updateTextObject(editingTextId, { text: event.target.value });
              }}
              onBlur={() => setEditingTextId(null)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault();
                  setEditingTextId(null);
                }
              }}
              autoFocus
              className="pointer-events-auto absolute rounded border border-accent bg-surface/90 px-2 py-1 text-sm text-foreground shadow-lg outline-none ring-2 ring-accent/40"
              style={{
                left: `${(editingObject.x / canvasWidth) * 100}%`,
                top: `${(editingObject.y / canvasHeight) * 100}%`,
                width: `${Math.max(160, editingObject.width)}px`,
                height: `${Math.max(52, editingObject.height)}px`,
                transform: `translate(-50%, -50%) rotate(${editingObject.rotation}deg)`,
                resize: 'none',
                whiteSpace: 'pre-wrap',
                fontFamily: editingObject.fontFamily,
                fontSize: `${editingObject.fontSize}px`,
                fontWeight: String(editingObject.fontWeight),
                color: editingObject.color,
                fontStyle: editingObject.italic ? 'italic' : 'normal',
                textDecoration: editingObject.underline ? 'underline' : 'none',
                letterSpacing: `${editingObject.letterSpacing}px`,
                lineHeight: String(editingObject.lineHeight),
                textAlign: editingObject.textAlign,
              }}
            />
          )}

          {cropSelection && activeTool === 'crop' && (
            <div
              className="pointer-events-none absolute border-2 border-accent bg-accent/10"
              style={{
                left: `${(cropSelection.x / canvasWidth) * 100}%`,
                top: `${(cropSelection.y / canvasHeight) * 100}%`,
                width: `${(cropSelection.width / canvasWidth) * 100}%`,
                height: `${(cropSelection.height / canvasHeight) * 100}%`,
                boxShadow: 'inset 0 0 0 9999px rgba(15, 23, 42, 0.28)',
              }}
            >
              <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-accent" />
            </div>
          )}
        </div>
      </div>

      {dragOver && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-accent-soft/80 backdrop-blur-[2px]">
          <div className="rounded-2xl border border-accent/50 bg-surface-elevated px-6 py-4 text-center shadow-lg">
            <p className="text-lg font-semibold text-foreground">Drop image to open</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 rounded-lg border border-border bg-surface-elevated px-3 py-2 shadow-lg">
        <p className="text-xs text-foreground-secondary">{canvasWidth} × {canvasHeight}</p>
      </div>
    </div>
  );
}
