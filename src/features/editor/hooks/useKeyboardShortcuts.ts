import { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';

export function useKeyboardShortcuts() {
  const { canvas, pushHistory, setZoom, zoom } = useEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (!canvas) return;

      // Undo / Redo
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const state = useEditorStore.getState().undo();
        if (state) canvas.loadFromJSON(JSON.parse(state), () => canvas.renderAll());
      }
      if (ctrl && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        const state = useEditorStore.getState().redo();
        if (state) canvas.loadFromJSON(JSON.parse(state), () => canvas.renderAll());
      }

      // Delete
      if (e.key === 'Delete') {
        const obj = canvas.getActiveObject();
        if (obj) {
          canvas.remove(obj);
          pushHistory(JSON.stringify(canvas.toJSON()));
        }
      }

      // Select All
      if (ctrl && e.key === 'a') {
        e.preventDefault();
        canvas.discardActiveObject();
        const objs = canvas.getObjects();
        if (objs.length > 0) {
          const sel = new (window as any).fabric.ActiveSelection(objs, { canvas });
          canvas.setActiveObject(sel);
          canvas.renderAll();
        }
      }

      // Duplicate
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        const obj = canvas.getActiveObject();
        if (obj) {
          obj.clone((cloned: fabric.Object) => {
            cloned.set({ left: obj.left! + 10, top: obj.top! + 10 });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
            pushHistory(JSON.stringify(canvas.toJSON()));
          });
        }
      }

      // Copy / Paste
      if (ctrl && e.key === 'c') {
        e.preventDefault();
        const obj = canvas.getActiveObject();
        if (obj) {
          // Store serialized object in clipboard (simplified)
          (window as any).__editorClipboard = obj.toJSON();
        }
      }
      if (ctrl && e.key === 'v') {
        e.preventDefault();
        const json = (window as any).__editorClipboard;
        if (json && canvas) {
          fabric.util.enlivenObjects([json], (objects: fabric.Object[]) => {
            objects.forEach((obj) => {
              obj.set({ left: obj.left! + 10, top: obj.top! + 10 });
              canvas.add(obj);
            });
            canvas.renderAll();
            pushHistory(JSON.stringify(canvas.toJSON()));
          });
        }
      }

      // Zoom in/out
      if (ctrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(Math.min(5, zoom + 0.1));
      }
      if (ctrl && e.key === '-') {
        e.preventDefault();
        setZoom(Math.max(0.1, zoom - 0.1));
      }

      // Escape deselect
      if (e.key === 'Escape') {
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canvas, pushHistory, setZoom, zoom]);
}