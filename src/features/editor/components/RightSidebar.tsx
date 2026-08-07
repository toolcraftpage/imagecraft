import { useEditorStore } from '../store/editorStore';
import { Layers, Sliders, Droplets } from 'lucide-react';
import LayersPanel from './LayersPanel';
import AdjustmentsPanel from './AdjustmentsPanel';
import FiltersPanel from './FiltersPanel';

export default function RightSidebar() {
  const { rightPanelTab, setRightPanelTab, hasImages } = useEditorStore();
  return (
    <div className="flex w-64 flex-col border-l border-gray-200 bg-surface dark:border-gray-700">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {(['layers','adjustments','filters'] as const).map(tab => (
          <button key={tab} onClick={() => setRightPanelTab(tab)} disabled={!hasImages}
            className={`flex-1 py-2 text-xs font-medium capitalize disabled:opacity-50 ${rightPanelTab===tab ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>
            {tab === 'layers' && <Layers size={14} className="inline mr-1"/>}
            {tab === 'adjustments' && <Sliders size={14} className="inline mr-1"/>}
            {tab === 'filters' && <Droplets size={14} className="inline mr-1"/>}
            {tab}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {rightPanelTab === 'layers' && <LayersPanel />}
        {rightPanelTab === 'adjustments' && <AdjustmentsPanel />}
        {rightPanelTab === 'filters' && <FiltersPanel />}
      </div>
    </div>
  );
}