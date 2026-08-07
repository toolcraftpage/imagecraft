import AdSlot from '@/shared/components/ads/AdSlot';

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-l border-gray-200 bg-surface p-4 lg:block dark:border-gray-700 dark:bg-surface">
      <div className="sticky top-20 space-y-6">
        <AdSlot size="sidebar" />
        <AdSlot size="sidebar" />
      </div>
    </aside>
  );
}