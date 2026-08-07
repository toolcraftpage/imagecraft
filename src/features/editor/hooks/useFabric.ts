import { useEffect } from 'react';
import { Canvas } from 'fabric';
import { useEditorStore } from '../store/editorStore';

export function useFabric(canvasEl: HTMLCanvasElement | null) {
  const { setCanvas, canvas, zoom, setActiveObject, pushHistory } = useEditorStore();

  useEffect(() => {
    if (!canvasEl || canvas) return;
    const fabCanvas = new Canvas(canvasEl, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });
    setCanvas(fabCanvas);

    // Initial history
    pushHistory(JSON.stringify(fabCanvas.toJSON()));

    fabCanvas.on('selection:created', (e) => setActiveObject(e.selected?.[0] ?? null));
    fabCanvas.on('selection:updated', (e) => setActiveObject(e.selected?.[0] ?? null));
    fabCanvas.on('selection:cleared', () => setActiveObject(null));

    fabCanvas.on('object:modified', () => pushHistory(JSON.stringify(fabCanvas.toJSON())));

    // Delete key
    const deleteHandler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && fabCanvas.getActiveObject()) {
        fabCanvas.remove(fabCanvas.getActiveObject());
        pushHistory(JSON.stringify(fabCanvas.toJSON()));
      }
    };
    window.addEventListener('keydown', deleteHandler);

    return () => {
      fabCanvas.dispose();
      setCanvas(null);
      setActiveObject(null);
      window.removeEventListener('keydown', deleteHandler);
    };
  }, [canvasEl]);

  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom);
      canvas.requestRenderAll();
    }
  }, [zoom, canvas]);
}