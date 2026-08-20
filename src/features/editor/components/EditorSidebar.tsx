import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEditorStore, type SidebarTab } from '../store/editorStore';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';

export default function EditorSidebar() {
  const { sidebarTab, sidebarCollapsed, setSidebarTab, setSidebarCollapsed } = useEditorStore();

  const tabs: { id: SidebarTab; label: string }[] = [
    { id: 'properties', label: 'Properties' },
    { id: 'layers', label: 'Layers' },
  ];

  if (sidebarCollapsed) {
    return (
      <button
        onClick={() => setSidebarCollapsed(false)}
        className="w-12 bg-surface border-l border-border flex items-center justify-center text-foreground-secondary hover:text-foreground transition"
        title="Expand sidebar"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-surface border-l border-border">
      {/* Tabs */}
      <div className="flex border-b border-border bg-surface-elevated sticky top-0 z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition border-b-2
              ${
                sidebarTab === tab.id
                  ? 'text-accent border-accent'
                  : 'text-foreground-secondary hover:text-foreground border-transparent'
              }
            `}
          >
            {tab.label}
          </button>
        ))}

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(true)}
          className="px-2 text-foreground-secondary hover:text-foreground transition"
          title="Collapse sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {sidebarTab === 'properties' && <PropertiesPanel />}
        {sidebarTab === 'layers' && <LayersPanel />}
      </div>
    </aside>
  );
}
