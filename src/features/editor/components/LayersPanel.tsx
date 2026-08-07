import { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, ArrowUp, ArrowDown, Copy } from 'lucide-react';

export default function LayersPanel() {
  const { canvas, pushHistory } = useEditorStore();
  const [objects, setObjects] = useState<fabric.Object[]>([]);
  useEffect(() => {
    if (!canvas) return;
    const update = () => setObjects([...canvas.getObjects()].reverse());
    canvas.on('object:added', update); canvas.on('object:removed', update); canvas.on('object:modified', update);
    update();
    return () => { canvas.off('object:added', update); canvas.off('object:removed', update); canvas.off('object:modified', update); };
  }, [canvas]);

  const toggleVisibility = (obj: fabric.Object) => { obj.visible = !obj.visible; canvas?.renderAll(); };
  const toggleLock = (obj: fabric.Object) => { obj.lockMovementX = !obj.lockMovementX; obj.lockMovementY = obj.lockMovementX; canvas?.renderAll(); };
  const deleteObj = (obj: fabric.Object) => { canvas?.remove(obj); pushHistory(JSON.stringify(canvas?.toJSON())); };
  const duplicateObj = (obj: fabric.Object) => { obj.clone((cloned: fabric.Object) => { cloned.set({ left: obj.left!+10, top: obj.top!+10 }); canvas?.add(cloned); pushHistory(JSON.stringify(canvas?.toJSON())); }); };
  const moveUp = (obj: fabric.Object) => { if (!canvas) return; const idx = canvas.getObjects().indexOf(obj); if (idx < canvas.getObjects().length-1) { canvas.moveTo(obj, idx+1); canvas.renderAll(); pushHistory(JSON.stringify(canvas.toJSON())); } };
  const moveDown = (obj: fabric.Object) => { if (!canvas) return; const idx = canvas.getObjects().indexOf(obj); if (idx > 0) { canvas.moveTo(obj, idx-1); canvas.renderAll(); pushHistory(JSON.stringify(canvas.toJSON())); } };
  const selectObj = (obj: fabric.Object) => { canvas?.setActiveObject(obj); canvas?.renderAll(); };

  return (
    <div className="flex flex-col gap-1 p-2">
      {objects.map((obj, i) => (
        <div key={i} onClick={() => selectObj(obj)} className={`flex cursor-pointer items-center gap-1 rounded p-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${canvas?.getActiveObject() === obj ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}>
          <span className="flex-1 truncate">{obj.type || 'object'}</span>
          <button onClick={e => { e.stopPropagation(); toggleVisibility(obj); }}>{obj.visible ? <Eye size={12}/> : <EyeOff size={12}/>}</button>
          <button onClick={e => { e.stopPropagation(); toggleLock(obj); }}>{obj.lockMovementX ? <Lock size={12}/> : <Unlock size={12}/>}</button>
          <button onClick={e => { e.stopPropagation(); duplicateObj(obj); }}><Copy size={12}/></button>
          <button onClick={e => { e.stopPropagation(); moveUp(obj); }}><ArrowUp size={12}/></button>
          <button onClick={e => { e.stopPropagation(); moveDown(obj); }}><ArrowDown size={12}/></button>
          <button onClick={e => { e.stopPropagation(); deleteObj(obj); }}><Trash2 size={12}/></button>
        </div>
      ))}
      {objects.length === 0 && <p className="p-2 text-xs text-gray-400">No layers</p>}
    </div>
  );
}