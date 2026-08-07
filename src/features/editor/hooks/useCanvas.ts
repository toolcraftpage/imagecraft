import { useEffect, useRef } from 'react';
import { Canvas, ActiveSelection, FabricImage, util } from 'fabric';
import { useEditorStore } from '../store/editorStore';

export function useCanvas(canvasEl: HTMLCanvasElement | null) {
  const store = useEditorStore;
  const {
    canvas, setCanvas, zoom, setZoom, pushHistory, setActiveObject,
    activeTool, hasImages,
  } = useEditorStore();
  const fabCanvas = useRef<Canvas | null>(null);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const clipboard = useRef<object | null>(null);

  useEffect(() => {
    if (!canvasEl || fabCanvas.current) return;
    const fc = new Canvas(canvasEl, {
      backgroundColor: '#ffffff',
      width: 1920,
      height: 1080,
      preserveObjectStacking: true,
      selection: true,
    });
    fabCanvas.current = fc;
    setCanvas(fc);
    pushHistory(JSON.stringify(fc.toJSON()));

    fc.on('selection:created', (e) => setActiveObject(e.selected?.[0] ?? null));
    fc.on('selection:updated', (e) => setActiveObject(e.selected?.[0] ?? null));
    fc.on('selection:cleared', () => setActiveObject(null));
    fc.on('object:modified', () => pushHistory(JSON.stringify(fc.toJSON())));

    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.min(5, Math.max(0.1, zoom + delta));
        setZoom(newZoom);
      } else {
        const vpt = fc.viewportTransform!;
        vpt[4] -= e.deltaX; vpt[5] -= e.deltaY;
        fc.requestRenderAll();
      }
    };
    canvasEl.addEventListener('wheel', wheel, { passive: false });

    const md = (opt: fabric.IEvent) => {
      const e = opt.e as MouseEvent;
      if (activeTool === 'pan' || (window as any).__spacePressed) {
        isPanning.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        fc.selection = false; fc.defaultCursor = 'move'; e.preventDefault();
      }
    };
    const mm = (opt: fabric.IEvent) => {
      if (!isPanning.current) return;
      const e = opt.e as MouseEvent;
      const vpt = fc.viewportTransform!;
      vpt[4] += e.clientX - lastPos.current.x;
      vpt[5] += e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      fc.requestRenderAll();
    };
    const mu = () => { isPanning.current = false; fc.defaultCursor = 'default'; };
    fc.on('mouse:down', md); fc.on('mouse:move', mm); fc.on('mouse:up', mu);

    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (e.key === 'Delete') {
        const obj = fc.getActiveObject(); if (obj) { fc.remove(obj); pushHistory(JSON.stringify(fc.toJSON())); }
      }
      if (ctrl && e.key === 'c') { e.preventDefault(); const obj = fc.getActiveObject(); if (obj) clipboard.current = obj.toJSON(); }
      if (ctrl && e.key === 'v') { e.preventDefault(); if (clipboard.current) { fc.discardActiveObject(); util.enlivenObjects([clipboard.current], (objs: any[]) => { objs.forEach(o => { o.set({ left: o.left + 10, top: o.top + 10 }); fc.add(o); }); fc.renderAll(); pushHistory(JSON.stringify(fc.toJSON())); }); } }
      if (ctrl && e.key === 'a') { e.preventDefault(); const objs = fc.getObjects(); if (objs.length) { fc.setActiveObject(new ActiveSelection(objs, { canvas: fc })); fc.renderAll(); } }
      if (ctrl && e.key === 'd') { e.preventDefault(); const obj = fc.getActiveObject(); if (obj) { obj.clone((cloned: any) => { cloned.set({ left: obj.left! + 10, top: obj.top! + 10 }); fc.add(cloned); fc.setActiveObject(cloned); fc.renderAll(); pushHistory(JSON.stringify(fc.toJSON())); }); } }
      if (e.key === 'Escape') { fc.discardActiveObject(); fc.renderAll(); }
    };
    window.addEventListener('keydown', key);

    return () => {
      canvasEl.removeEventListener('wheel', wheel);
      fc.off('mouse:down', md); fc.off('mouse:move', mm); fc.off('mouse:up', mu);
      window.removeEventListener('keydown', key);
      fc.dispose(); setCanvas(null); fabCanvas.current = null;
    };
  }, [canvasEl]);

  useEffect(() => { if (canvas) { canvas.setZoom(zoom); canvas.renderAll(); } }, [zoom, canvas]);
}