import { Menu } from '@headlessui/react';
import {
  File,
  Edit,
  Image as ImageIcon,
  Download,
  Undo,
  Redo,
  Trash2,
  Copy,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize,
  Layers,
  Monitor,
  Save,
  Printer,
  X,
  FolderOpen,
  Plus,
  Clock,
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { FabricImage, ActiveSelection } from 'fabric';
import { saveProjectToFile, loadProjectFromFile } from '../utils/projectUtils';

export default function TopMenuBar() {
  const { canvas, undo, redo, pushHistory, zoom, setZoom, hasImages, setHasImages } =
    useEditorStore();
  const disabled = !canvas || !hasImages;

  // ---- File actions ----
  const openImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !canvas) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        FabricImage.fromURL(ev.target?.result as string).then((img) => {
          img.scaleToWidth(Math.min(400, canvas.width! * 0.8));
          canvas.add(img);
          canvas.centerObject(img);
          canvas.renderAll();
          pushHistory(JSON.stringify(canvas.toJSON()));
          setHasImages(true);
        });
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const addImage = openImage;

  const saveProject = () => saveProjectToFile(canvas);
  const loadProject = () => loadProjectFromFile(canvas, pushHistory);

  const exportImage = (format: string, quality = 1) => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: format as any, quality });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `image.${format === 'jpeg' ? 'jpg' : format}`;
    link.click();
  };

  const print = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({ format: 'png' });
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<img src="${dataURL}" style="max-width:100%" />`);
      win.print();
    }
  };

  const closeImage = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (active) {
      canvas.remove(active);
      pushHistory(JSON.stringify(canvas.toJSON()));
      if (canvas.getObjects().length === 0) setHasImages(false);
    }
  };

  const resetWorkspace = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.renderAll();
    setHasImages(false);
    pushHistory(JSON.stringify(canvas.toJSON()));
  };

  // ---- Edit actions ----
  const handleUndo = () => {
    const state = undo();
    if (state && canvas) canvas.loadFromJSON(JSON.parse(state), () => canvas.renderAll());
  };
  const handleRedo = () => {
    const state = redo();
    if (state && canvas) canvas.loadFromJSON(JSON.parse(state), () => canvas.renderAll());
  };
  const deleteSelected = () => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      canvas.remove(obj);
      pushHistory(JSON.stringify(canvas.toJSON()));
      if (canvas.getObjects().length === 0) setHasImages(false);
    }
  };
  const duplicateSelected = () => {
    if (!canvas) return;
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
  };
  const selectAll = () => {
    if (!canvas) return;
    const objs = canvas.getObjects();
    if (objs.length) {
      const sel = new ActiveSelection(objs, { canvas });
      canvas.setActiveObject(sel);
      canvas.renderAll();
    }
  };
  const deselectAll = () => {
    canvas?.discardActiveObject();
    canvas?.renderAll();
  };

  // ---- Image actions ----
  const flip = (dir: 'horizontal' | 'vertical') => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.set(dir === 'horizontal' ? { flipX: !obj.flipX } : { flipY: !obj.flipY });
      canvas.renderAll();
      pushHistory(JSON.stringify(canvas.toJSON()));
    }
  };
  const rotate = (deg: number) => {
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (obj) {
      obj.rotate(obj.angle! + deg);
      canvas.renderAll();
      pushHistory(JSON.stringify(canvas.toJSON()));
    }
  };
  const resizeCanvas = () => {
    if (!canvas) return;
    const w = prompt('New width (px)', canvas.width?.toString() || '800');
    const h = prompt('New height (px)', canvas.height?.toString() || '600');
    if (w && h) {
      canvas.setWidth(parseInt(w));
      canvas.setHeight(parseInt(h));
      canvas.renderAll();
      pushHistory(JSON.stringify(canvas.toJSON()));
    }
  };

  // ---- View actions ----
  const zoomIn = () => setZoom(Math.min(5, zoom + 0.1));
  const zoomOut = () => setZoom(Math.max(0.1, zoom - 0.1));
  const actualSize = () => setZoom(1);
  const fitToScreen = () => {
    if (!canvas) return;
    const container = document.querySelector('.canvas-container')?.parentElement;
    if (container) {
      const pad = 40;
      const scaleX = (container.clientWidth - pad) / canvas.width!;
      const scaleY = (container.clientHeight - pad) / canvas.height!;
      setZoom(Math.min(scaleX, scaleY, 1));
    }
  };

  // ---- Layer actions ----
  const addNewLayer = () => {
    if (!canvas) return;
    const Rect = (window as any).fabric.Rect;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      fill: '#ffffff',
      name: `Layer ${canvas.getObjects().length + 1}`,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    pushHistory(JSON.stringify(canvas.toJSON()));
  };

  const mergeDown = () => {
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    const objects = canvas.getObjects();
    const idx = objects.indexOf(active);
    if (idx <= 0) return;
    const below = objects[idx - 1];

    const tempCanvas = document.createElement('canvas');
    const group = new (window as any).fabric.Group([active, below]);
    const bounds = group.getBoundingRect();
    tempCanvas.width = bounds.width;
    tempCanvas.height = bounds.height;
    const ctx = tempCanvas.getContext('2d')!;
    group.clone((cloned: fabric.Object) => {
      cloned.setCoords();
      ctx.drawImage(
        (cloned as any).toCanvasElement(),
        -bounds.left,
        -bounds.top,
      );
    });

    const mergedImage = new (window as any).fabric.Image(tempCanvas, {
      left: bounds.left,
      top: bounds.top,
    });
    canvas.remove(active);
    canvas.remove(below);
    canvas.add(mergedImage);
    canvas.renderAll();
    pushHistory(JSON.stringify(canvas.toJSON()));
  };

  const resetLayout = () => {};

  return (
    <div className="flex items-center border-b border-gray-200 bg-surface px-2 py-1 text-sm dark:border-gray-700 dark:bg-surface z-[var(--z-toolbar)]">
      {/* File */}
      <Menu>
        <Menu.Button className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
          <File size={14} /> File
        </Menu.Button>
        <Menu.Items
          portal
          className="absolute left-0 mt-1 w-56 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 z-[var(--z-dropdown)]"
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={openImage}
                disabled={!canvas}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <FolderOpen size={14} /> Open Image
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={addImage}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Plus size={14} /> Add Image
              </button>
            )}
          </Menu.Item>
          <Menu.Item disabled>
            <button className="flex w-full items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
              <Clock size={14} /> Open Recent
            </button>
          </Menu.Item>
          <div className="border-t my-1 dark:border-gray-600" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={saveProject}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Save size={14} /> Save Project
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={loadProject}
                disabled={!canvas}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <FolderOpen size={14} /> Load Project
              </button>
            )}
          </Menu.Item>
          <div className="border-t my-1 dark:border-gray-600" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportImage('png')}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Download size={14} /> Export PNG
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportImage('jpeg', 0.9)}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Download size={14} /> Export JPEG
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportImage('webp')}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Download size={14} /> Export WebP
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={print}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Printer size={14} /> Print
              </button>
            )}
          </Menu.Item>
          <div className="border-t my-1 dark:border-gray-600" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={closeImage}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <X size={14} /> Close Image
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={resetWorkspace}
                disabled={disabled}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2 disabled:opacity-50`}
              >
                <Trash2 size={14} /> Reset Workspace
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* Edit */}
      <Menu>
        <Menu.Button
          disabled={disabled}
          className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <Edit size={14} /> Edit
        </Menu.Button>
        <Menu.Items
          portal
          className="absolute left-0 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 z-[var(--z-dropdown)]"
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleUndo}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Undo size={14} /> Undo (Ctrl+Z)
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleRedo}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Redo size={14} /> Redo (Ctrl+Shift+Z)
              </button>
            )}
          </Menu.Item>
          <div className="border-t my-1 dark:border-gray-600" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={deleteSelected}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Trash2 size={14} /> Delete
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={duplicateSelected}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Copy size={14} /> Duplicate
              </button>
            )}
          </Menu.Item>
          <div className="border-t my-1 dark:border-gray-600" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={selectAll}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                Select All (Ctrl+A)
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={deselectAll}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                Deselect (Esc)
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* Image */}
      <Menu>
        <Menu.Button
          disabled={disabled}
          className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <ImageIcon size={14} /> Image
        </Menu.Button>
        <Menu.Items
          portal
          className="absolute left-0 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 z-[var(--z-dropdown)]"
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => flip('horizontal')}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <FlipHorizontal size={14} /> Flip Horizontal
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => flip('vertical')}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <FlipVertical size={14} /> Flip Vertical
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => rotate(90)}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <RotateCw size={14} /> Rotate 90° CW
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => rotate(-90)}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <RotateCw size={14} /> Rotate 90° CCW
              </button>
            )}
          </Menu.Item>
          <div className="border-t my-1 dark:border-gray-600" />
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={resizeCanvas}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                Resize Canvas...
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* View */}
      <Menu>
        <Menu.Button
          disabled={disabled}
          className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <Eye size={14} /> View
        </Menu.Button>
        <Menu.Items
          portal
          className="absolute left-0 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 z-[var(--z-dropdown)]"
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={zoomIn}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <ZoomIn size={14} /> Zoom In
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={zoomOut}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <ZoomOut size={14} /> Zoom Out
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={actualSize}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Maximize size={14} /> Actual Size (100%)
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={fitToScreen}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Maximize size={14} /> Fit Screen
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* Layer */}
      <Menu>
        <Menu.Button
          disabled={disabled}
          className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <Layers size={14} /> Layer
        </Menu.Button>
        <Menu.Items
          portal
          className="absolute left-0 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 z-[var(--z-dropdown)]"
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={addNewLayer}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                New Layer
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={deleteSelected}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Trash2 size={14} /> Delete Layer
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={duplicateSelected}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                <Copy size={14} /> Duplicate Layer
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={mergeDown}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                Merge Down
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>

      {/* Window */}
      <Menu>
        <Menu.Button className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
          <Monitor size={14} /> Window
        </Menu.Button>
        <Menu.Items
          portal
          className="absolute left-0 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 z-[var(--z-dropdown)]"
        >
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={resetLayout}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } flex w-full items-center gap-2 px-4 py-2`}
              >
                Reset Layout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}