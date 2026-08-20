import { Tab as HLUITab } from '@headlessui/react';
import { clsx } from 'clsx';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export default function Tabs({ tabs, className }: TabsProps) {
  return (
    <HLUITab.Group>
      <HLUITab.List className={`flex space-x-1 rounded-xl bg-surface-muted p-1 ${className || ''}`}>
        {tabs.map((tab) => (
          <HLUITab
            key={tab.label}
            className={({ selected }) =>
              clsx(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-focus-ring',
                selected
                  ? 'bg-surface text-accent shadow-sm'
                  : 'text-foreground-secondary hover:bg-surface-elevated hover:text-accent',
              )
            }
          >
            {tab.label}
          </HLUITab>
        ))}
      </HLUITab.List>
      <HLUITab.Panels className="mt-4">
        {tabs.map((tab) => (
          <HLUITab.Panel key={tab.label} className="rounded-xl border border-border bg-surface p-3">
            {tab.content}
          </HLUITab.Panel>
        ))}
      </HLUITab.Panels>
    </HLUITab.Group>
  );
}