import { useState, useEffect, useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import Button from '@/shared/components/ui/Button';
import Tooltip from '@/shared/components/ui/Tooltip';
import {
  Download,
  Trash2,
  FileText,
  Settings,
  Grid3X3,
  Plus,
  GripVertical,
  Eye,
  EyeOff,
  Info,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import type { ImageFile } from '@/shared/types';

type PageSize = 'A4' | 'Letter' | 'Legal' | 'Custom';
type Orientation = 'portrait' | 'landscape';
type FitMode = 'stretch' | 'contain' | 'cover';

const PAGE_SIZES: Record<PageSize, [number, number]> = {
  A4: [210, 297],
  Letter: [215.9, 279.4],
  Legal: [215.9, 355.6],
  Custom: [210, 297],
};

interface PdfControlsProps {
  images: ImageFile[];
  onClear: () => void;
}

export default function PdfControls({ images, onClear }: PdfControlsProps) {
  // ---------- Image management ----------
  const [imageOrder, setImageOrder] = useState<number[]>([]);
  const [excluded, setExcluded] = useState<Set<number>>(new Set());

  useEffect(() => {
    setImageOrder((prev) => {
      const current = Array.from({ length: images.length }, (_, i) => i);
      const existing = prev.filter((idx) => current.includes(idx));
      const newOnes = current.filter((idx) => !prev.includes(idx));
      return [...existing, ...newOnes];
    });
  }, [images.length]);

  const includedOrder = imageOrder.filter((idx) => !excluded.has(idx));

  const toggleInclude = (imgIndex: number) => {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(imgIndex)) next.delete(imgIndex);
      else next.add(imgIndex);
      return next;
    });
  };

  // ---------- Page breaks (on image indices) ----------
  const [pageBreakAfterImg, setPageBreakAfterImg] = useState<Set<number>>(new Set());

  const addPageBreak = (imgIndex: number) => setPageBreakAfterImg((prev) => new Set(prev).add(imgIndex));
  const removePageBreak = (imgIndex: number) => {
    setPageBreakAfterImg((prev) => {
      const next = new Set(prev);
      next.delete(imgIndex);
      return next;
    });
  };

  // Compute pages from includedOrder + breaks
  const pages = useCallback(() => {
    const segments: { start: number; end: number }[] = [];
    let start = 0;
    for (let i = 0; i < includedOrder.length; i++) {
      const imgIdx = includedOrder[i];
      if (pageBreakAfterImg.has(imgIdx) && i < includedOrder.length - 1) {
        segments.push({ start, end: i });
        start = i + 1;
      }
    }
    if (start < includedOrder.length) {
      segments.push({ start, end: includedOrder.length - 1 });
    }
    return segments;
  }, [includedOrder, pageBreakAfterImg]);

  const pagesList = pages();

  // ---------- Per‑page layout ----------
  // Store desired images per page (null means auto‑grid)
  const [imagesPerPage, setImagesPerPage] = useState<Record<number, number | null>>({});
  // Store manual cols/rows overrides (null means derived from imagesPerPage)
  const [manualLayout, setManualLayout] = useState<Record<number, { cols: number; rows: number } | null>>({});

  // Derive effective layout (cols/rows) for a page from its imagesPerPage value
  const getLayout = useCallback((pageIdx: number, imageCount: number) => {
    const manual = manualLayout[pageIdx];
    if (manual) return manual;

    const perPage = imagesPerPage[pageIdx] ?? null;
    if (perPage !== null && perPage > 0) {
      // Fit exactly `perPage` images on the page with a square‑ish grid
      const cols = Math.ceil(Math.sqrt(perPage));
      const rows = Math.ceil(perPage / cols);
      return { cols, rows };
    }

    // Default: auto‑grid based on actual image count
    if (imageCount <= 1) return { cols: 1, rows: 1 };
    const cols = Math.ceil(Math.sqrt(imageCount));
    const rows = Math.ceil(imageCount / cols);
    return { cols, rows };
  }, [imagesPerPage, manualLayout]);

  // Reset to auto layout (remove per‑page settings)
  const resetToAutoLayout = () => {
    setImagesPerPage({});
    setManualLayout({});
  };

  // Set every page to 1 image per page
  const setAllToOnePerPage = () => {
    const newImagesPerPage: Record<number, number> = {};
    pagesList.forEach((_, idx) => {
      newImagesPerPage[idx] = 1;
    });
    setImagesPerPage(newImagesPerPage);
    setManualLayout({});
  };

  // ---------- Enhanced Drag & Drop ----------
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropTarget(index);
    if (listRef.current) {
      const rect = listRef.current.getBoundingClientRect();
      const mouseY = e.clientY;
      const threshold = 60;
      if (mouseY - rect.top < threshold && !autoScrollRef.current) {
        autoScrollRef.current = window.setInterval(() => listRef.current?.scrollBy(0, -10), 16);
      } else if (rect.bottom - mouseY < threshold && !autoScrollRef.current) {
        autoScrollRef.current = window.setInterval(() => listRef.current?.scrollBy(0, 10), 16);
      } else if (mouseY - rect.top >= threshold && rect.bottom - mouseY >= threshold && autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    }
  };

  const handleDragLeave = () => {};

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDropTarget(null);
      return;
    }
    setImageOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDropTarget(null);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropTarget(null);
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  // ---------- Global settings ----------
  const [pageSize, setPageSize] = useState<PageSize>('A4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [customWidth, setCustomWidth] = useState(210);
  const [customHeight, setCustomHeight] = useState(297);
  const [margin, setMargin] = useState(10);
  const [fitMode, setFitMode] = useState<FitMode>('contain');
  const [gap, setGap] = useState(2);
  const [generating, setGenerating] = useState(false);

  const generatePdf = useCallback(async () => {
    if (includedOrder.length === 0) return;
    setGenerating(true);

    const [pageW, pageH] = pageSize === 'Custom' ? [customWidth, customHeight] : PAGE_SIZES[pageSize];
    const isLandscape = orientation === 'landscape';
    const finalW = isLandscape ? pageH : pageW;
    const finalH = isLandscape ? pageW : pageH;

    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [finalW, finalH],
    });

    const availableW = finalW - 2 * margin;
    const availableH = finalH - 2 * margin;
    let pageInDoc = 0;

    for (let segIdx = 0; segIdx < pagesList.length; segIdx++) {
      const seg = pagesList[segIdx];
      const segImages = includedOrder.slice(seg.start, seg.end + 1);
      const layout = getLayout(segIdx, segImages.length);
      const cols = layout.cols;
      const rows = layout.rows;
      const imagesPerPageCapacity = cols * rows;

      for (let i = 0; i < segImages.length; i += imagesPerPageCapacity) {
        if (pageInDoc > 0) doc.addPage([finalW, finalH]);
        pageInDoc++;
        const pageImages = segImages.slice(i, i + imagesPerPageCapacity);
        const totalGapW = (cols - 1) * gap;
        const totalGapH = (rows - 1) * gap;
        const cellW = (availableW - totalGapW) / cols;
        const cellH = (availableH - totalGapH) / rows;

        for (let cellIndex = 0; cellIndex < pageImages.length; cellIndex++) {
          const imgIndex = pageImages[cellIndex];
          const imgFile = images[imgIndex];
          if (!imgFile?.preview) continue;

          const row = Math.floor(cellIndex / cols);
          const col = cellIndex % cols;
          const img = await loadImageElement(imgFile.preview);
          const imgW = img.width;
          const imgH = img.height;
          const aspect = imgW / imgH;

          let drawW: number, drawH: number;
          if (fitMode === 'stretch') {
            drawW = cellW;
            drawH = cellH;
          } else if (fitMode === 'contain') {
            if (aspect > cellW / cellH) {
              drawW = cellW;
              drawH = drawW / aspect;
            } else {
              drawH = cellH;
              drawW = drawH * aspect;
            }
          } else {
            if (aspect > cellW / cellH) {
              drawH = cellH;
              drawW = drawH * aspect;
            } else {
              drawW = cellW;
              drawH = drawW / aspect;
            }
          }

          const x = margin + col * (cellW + gap) + (cellW - drawW) / 2;
          const y = margin + row * (cellH + gap) + (cellH - drawH) / 2;
          doc.addImage(imgFile.preview, 'JPEG', x, y, drawW, drawH, undefined, 'FAST');
        }
      }
    }

    doc.save('images.pdf');
    setGenerating(false);
  }, [includedOrder, pagesList, getLayout, pageSize, orientation, customWidth, customHeight, margin, fitMode, gap, images]);

  const loadImageElement = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  // Total pages count
  const totalPages = pagesList.reduce((acc, seg) => {
    const segImages = includedOrder.slice(seg.start, seg.end + 1);
    const layout = getLayout(acc, segImages.length); // careful: acc is index here, not correct
    // need to compute using segment index
    const count = seg.end - seg.start + 1;
    const layoutForSeg = getLayout(pagesList.indexOf(seg), count);
    const perPage = layoutForSeg.cols * layoutForSeg.rows;
    return acc + Math.ceil(count / perPage);
  }, 0);

  // recalculate total pages properly
  const totalPagesFixed = pagesList.reduce((acc, seg) => {
    const idx = pagesList.indexOf(seg);
    const count = seg.end - seg.start + 1;
    const layout = getLayout(idx, count);
    return acc + Math.ceil(count / (layout.cols * layout.rows));
  }, 0);

  return (
    <div className="mt-8 space-y-6">
      {/* Global settings panel */}
      <div className="rounded-card border p-6 bg-surface dark:bg-surface space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings size={18} /> PDF Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Page Size</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="w-full rounded border px-2 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Orientation</label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as Orientation)}
              className="w-full rounded border px-2 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Fit Mode</label>
            <select
              value={fitMode}
              onChange={(e) => setFitMode(e.target.value as FitMode)}
              className="w-full rounded border px-2 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="contain">Contain (no crop)</option>
              <option value="cover">Cover (fill)</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
        </div>

        {pageSize === 'Custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Width (mm)</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                min={10}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Height (mm)</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                min={10}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Margin: {margin} mm</label>
            <input
              type="range"
              min="0"
              max="50"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">Spacing: {gap} mm</label>
            <input
              type="range"
              min="0"
              max="20"
              value={gap}
              onChange={(e) => setGap(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Page layout editor */}
      <div className="rounded-card border p-6 bg-surface dark:bg-surface">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={18} /> Page Layout
          </h3>
          <div className="flex gap-2">
            <Tooltip content="Place each image on its own page">
              <Button size="sm" variant="secondary" onClick={setAllToOnePerPage} className="gap-1">
                <LayoutList size={14} /> One per page
              </Button>
            </Tooltip>
            <Tooltip content="Reset to automatic grid layout">
              <Button size="sm" variant="secondary" onClick={resetToAutoLayout} className="gap-1">
                <Grid3X3 size={14} /> Auto grid
              </Button>
            </Tooltip>
          </div>
        </div>

        {includedOrder.length === 0 ? (
          <p className="text-sm text-gray-500">No images included. Use the eye icon in the list below to include them.</p>
        ) : (
          <div className="space-y-6">
            {pagesList.map((seg, pageIdx) => {
              const segImages = includedOrder.slice(seg.start, seg.end + 1);
              const layout = getLayout(pageIdx, segImages.length);
              const capacity = layout.cols * layout.rows;
              const subPages = Math.ceil(segImages.length / capacity);
              const currentPerPage = imagesPerPage[pageIdx] ?? capacity; // fallback to auto capacity

              return (
                <div key={pageIdx} className="rounded-lg border dark:border-gray-700 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Page {pageIdx + 1} ({segImages.length} image{segImages.length !== 1 ? 's' : ''}
                      {subPages > 1 ? ` → ${subPages} PDF pages` : ''})
                    </span>
                    <div className="flex items-center gap-3">
                      {/* Images per page input */}
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-500">Images per page:</label>
                        <input
                          type="number"
                          min={1}
                          max={Math.max(1, segImages.length)}
                          value={currentPerPage}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (isNaN(val) || val < 1) return;
                            setImagesPerPage((prev) => ({ ...prev, [pageIdx]: val }));
                            setManualLayout((prev) => ({ ...prev, [pageIdx]: null })); // clear manual cols/rows
                          }}
                          className="w-16 rounded border px-1 py-0.5 text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-white text-center"
                        />
                      </div>
                      {/* Manual cols/rows override */}
                      <div className="flex items-center gap-1">
                        <label className="text-xs text-gray-500">Cols:</label>
                        <select
                          value={layout.cols}
                          onChange={(e) => {
                            const newCols = Number(e.target.value);
                            const newRows = Math.ceil(currentPerPage / newCols);
                            setManualLayout((prev) => ({ ...prev, [pageIdx]: { cols: newCols, rows: newRows } }));
                          }}
                          className="rounded border px-1 py-0.5 text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                          {[1,2,3,4,5,6].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <span className="text-gray-400">×</span>
                        <select
                          value={layout.rows}
                          onChange={(e) => {
                            const newRows = Number(e.target.value);
                            const newCols = Math.ceil(currentPerPage / newRows);
                            setManualLayout((prev) => ({ ...prev, [pageIdx]: { cols: newCols, rows: newRows } }));
                          }}
                          className="rounded border px-1 py-0.5 text-xs dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                          {[1,2,3,4,5,6].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {segImages.map((imgIndex, pos) => {
                      const img = images[imgIndex];
                      if (!img) return null;
                      return (
                        <div key={pos} className="flex flex-col items-center">
                          <img src={img.preview} alt={img.file.name} className="w-10 h-10 object-cover rounded border" />
                          <span className="text-[9px] text-gray-400">{pos + 1}</span>
                        </div>
                      );
                    })}
                  </div>

                  {seg.end < includedOrder.length - 1 && !pageBreakAfterImg.has(includedOrder[seg.end]) && (
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addPageBreak(includedOrder[seg.end])}
                        className="text-primary-500 text-xs"
                      >
                        <Plus size={12} className="mr-1" /> Insert Page Break
                      </Button>
                    </div>
                  )}
                  {pageBreakAfterImg.has(includedOrder[seg.end]) && seg.end < includedOrder.length - 1 && (
                    <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
                      <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
                      <button onClick={() => removePageBreak(includedOrder[seg.end])} className="text-red-500 hover:underline">
                        Remove break
                      </button>
                      <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-2 text-center">Total pages: {totalPagesFixed}</p>
      </div>

      {/* Drag-and-drop image list */}
      <div className="rounded-card border p-6 bg-surface dark:bg-surface">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText size={18} /> Image Order ({includedOrder.length} included)
          </h3>
          <Tooltip content="Drag images to reorder or move between pages" placement="top">
            <Info size={16} className="text-gray-400 cursor-help" />
          </Tooltip>
        </div>
        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <GripVertical size={12} /> Drag the handle to reorder. Page breaks stay with the image they follow, even after moving.
        </p>

        {imageOrder.length === 0 ? (
          <p className="text-sm text-gray-500">No images.</p>
        ) : (
          <div
            ref={listRef}
            className="space-y-1 max-h-[500px] overflow-y-auto pr-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {imageOrder.map((imgIndex, position) => {
              const img = images[imgIndex];
              if (!img) return null;
              const isExcluded = excluded.has(imgIndex);
              const showBreak = pageBreakAfterImg.has(imgIndex) && position < imageOrder.length - 1 && !isExcluded;

              return (
                <div key={`${imgIndex}`}>
                  <div
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${
                      dragIndex === position ? 'opacity-30 scale-95' :
                      isExcluded ? 'opacity-40' :
                      'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    } ${
                      dropTarget === position && dragIndex !== position ? 'border-t-2 border-primary-400' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(position)}
                    onDragOver={(e) => handleDragOver(e, position)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(position)}
                    onDragEnd={handleDragEnd}
                  >
                    <Tooltip content="Drag to reorder" placement="top">
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <GripVertical size={16} />
                      </div>
                    </Tooltip>

                    <span className="text-xs font-mono w-6 text-center text-gray-500">{position + 1}</span>
                    <img src={img.preview} alt={img.file.name} className="w-10 h-10 object-cover rounded" />
                    <span className="flex-1 text-sm truncate text-gray-700 dark:text-gray-300">{img.file.name}</span>

                    <Tooltip content={isExcluded ? 'Include in PDF' : 'Exclude from PDF'} placement="top">
                      <button
                        onClick={() => toggleInclude(imgIndex)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {isExcluded ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </Tooltip>
                  </div>

                  {showBreak && (
                    <div className="flex items-center justify-center my-1 text-xs text-gray-400">
                      <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
                      <span className="px-2">Page Break</span>
                      <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClear} className="gap-2">
          <Trash2 size={16} /> Clear All
        </Button>
        <Button onClick={generatePdf} disabled={generating || includedOrder.length === 0} className="gap-2">
          <Download size={16} /> {generating ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>
    </div>
  );
}