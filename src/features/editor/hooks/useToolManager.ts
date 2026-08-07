import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Canvas, PencilBrush, Rect, Ellipse, Line, IText } from 'fabric';

export function useToolManager() {
  const { canvas, activeTool, pushHistory, setActiveTool, brushColor, brushSize, setHasImages } = useEditorStore();
  const drawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const current = useRef<fabric.Object | null>(null);
  const cropRect = useRef<Rect | null>(null);

  useEffect(() => {
    if (!canvas) return;
    canvas.off('mouse:down'); canvas.off('mouse:move'); canvas.off('mouse:up');
    canvas.isDrawingMode = false; canvas.selection = true; canvas.defaultCursor = 'default';

    if (activeTool === 'select') { canvas.selection = true; }
    else if (activeTool === 'pan') { canvas.selection = false; canvas.defaultCursor = 'move'; }
    else if (activeTool === 'brush') {
      canvas.isDrawingMode = true; canvas.selection = false;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.width = brushSize; canvas.freeDrawingBrush.color = brushColor;
      canvas.on('path:created', () => pushHistory(JSON.stringify(canvas.toJSON())));
    }
    else if (activeTool === 'eraser') {
      canvas.isDrawingMode = true; canvas.selection = false;
      canvas.freeDrawingBrush = new PencilBrush(canvas);
      canvas.freeDrawingBrush.width = brushSize * 2; canvas.freeDrawingBrush.color = '#ffffff';
      canvas.on('path:created', () => pushHistory(JSON.stringify(canvas.toJSON())));
    }
    else if (activeTool === 'rectangle' || activeTool === 'ellipse' || activeTool === 'line') {
      canvas.selection = false; canvas.defaultCursor = 'crosshair';
      const md = (opt: fabric.IEvent) => {
        const p = canvas.getPointer(opt.e); drawing.current = true; start.current = p;
        const fill = activeTool === 'line' ? 'transparent' : 'rgba(99,102,241,0.3)';
        if (activeTool === 'rectangle') current.current = new Rect({ left: p.x, top: p.y, width: 0, height: 0, fill, stroke: '#6366f1', strokeWidth: 2 });
        else if (activeTool === 'ellipse') current.current = new Ellipse({ left: p.x, top: p.y, rx: 0, ry: 0, fill, stroke: '#6366f1', strokeWidth: 2 });
        else current.current = new Line([p.x, p.y, p.x, p.y], { stroke: '#6366f1', strokeWidth: 2 });
        canvas.add(current.current!);
      };
      const mm = (opt: fabric.IEvent) => {
        if (!drawing.current || !current.current) return;
        const p = canvas.getPointer(opt.e);
        const left = Math.min(start.current.x, p.x), top = Math.min(start.current.y, p.y);
        if (activeTool === 'rectangle') { current.current.set({ left, top, width: Math.abs(p.x - start.current.x), height: Math.abs(p.y - start.current.y) }); }
        else if (activeTool === 'ellipse') { const rx = Math.abs(p.x - start.current.x)/2, ry = Math.abs(p.y - start.current.y)/2; current.current.set({ left, top, rx, ry }); }
        else { (current.current as Line).set({ x2: p.x, y2: p.y }); }
        canvas.renderAll();
      };
      const mu = () => {
        if (!drawing.current || !current.current) return; drawing.current = false;
        const obj = current.current;
        if ((obj instanceof Rect && obj.width! < 5 && obj.height! < 5) || (obj instanceof Ellipse && obj.rx!*2 < 5) || (obj instanceof Line && Math.abs((obj as Line).x2! - (obj as Line).x1!) < 5)) canvas.remove(obj);
        else pushHistory(JSON.stringify(canvas.toJSON()));
        current.current = null;
      };
      canvas.on('mouse:down', md); canvas.on('mouse:move', mm); canvas.on('mouse:up', mu);
    }
    else if (activeTool === 'text') {
      canvas.selection = false; canvas.defaultCursor = 'text';
      canvas.on('mouse:down', (opt) => {
        const p = canvas.getPointer(opt.e);
        const text = new IText('Type here', { left: p.x, top: p.y, fontSize: 24, fontFamily: 'Inter', fill: '#000' });
        canvas.add(text); canvas.setActiveObject(text); text.enterEditing();
        text.on('editing:exited', () => pushHistory(JSON.stringify(canvas.toJSON())));
      });
    }
    else if (activeTool === 'eyedropper') {
      canvas.on('mouse:down', (opt) => {
        const e = opt.e as MouseEvent;
        const ctx = canvas.getContext(); const pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data;
        const hex = `#${pixel[0].toString(16).padStart(2,'0')}${pixel[1].toString(16).padStart(2,'0')}${pixel[2].toString(16).padStart(2,'0')}`;
        useEditorStore.getState().setBrushColor(hex); setActiveTool('select');
      });
    }
    else if (activeTool === 'fill') {
      canvas.on('mouse:down', () => {
        const obj = canvas.getActiveObject();
        if (obj) { obj.set('fill', brushColor); canvas.renderAll(); pushHistory(JSON.stringify(canvas.toJSON())); }
      });
    }
    else if (activeTool === 'crop') {
      canvas.selection = false; canvas.defaultCursor = 'crosshair';
      const md = (opt: fabric.IEvent) => {
        const p = canvas.getPointer(opt.e); start.current = p;
        if (cropRect.current) canvas.remove(cropRect.current);
        cropRect.current = new Rect({ left: p.x, top: p.y, width: 0, height: 0, fill: 'rgba(0,0,0,0.3)', stroke: '#fff', strokeWidth: 2, selectable: false, evented: false });
        canvas.add(cropRect.current); canvas.renderAll();
      };
      const mm = (opt: fabric.IEvent) => {
        if (!cropRect.current) return;
        const p = canvas.getPointer(opt.e);
        const left = Math.min(start.current.x, p.x), top = Math.min(start.current.y, p.y);
        cropRect.current.set({ left, top, width: Math.abs(p.x - start.current.x), height: Math.abs(p.y - start.current.y) });
        canvas.renderAll();
      };
      const mu = () => {
        if (!cropRect.current) return;
        const cr = cropRect.current;
        if (cr.width! > 10 && cr.height! > 10) {
          const { left, top, width, height } = cr;
          canvas.remove(cr); cropRect.current = null;
          canvas.getObjects().forEach(o => o.set({ left: o.left! - left, top: o.top! - top }));
          canvas.setWidth(width); canvas.setHeight(height); canvas.renderAll();
          pushHistory(JSON.stringify(canvas.toJSON()));
          setActiveTool('select');
          if (canvas.getObjects().length === 0) setHasImages(false);
        }
      };
      canvas.on('mouse:down', md); canvas.on('mouse:move', mm); canvas.on('mouse:up', mu);
    }
  }, [activeTool, canvas, brushSize, brushColor]);
}