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
      <HLUITab.List className={`flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700 ${className || ''}`}>
        {tabs.map((tab) => (
          <HLUITab
            key={tab.label}
            className={({ selected }) =>
              clsx(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                selected
                  ? 'bg-white text-primary-700 shadow dark:bg-gray-800 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-primary-600 dark:text-gray-400',
              )
            }
          >
            {tab.label}
          </HLUITab>
        ))}
      </HLUITab.List>
      <HLUITab.Panels className="mt-4">
        {tabs.map((tab) => (
          <HLUITab.Panel key={tab.label} className="rounded-xl bg-white p-3 dark:bg-gray-800">
            {tab.content}
          </HLUITab.Panel>
        ))}
      </HLUITab.Panels>
    </HLUITab.Group>
  );
}