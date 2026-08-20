import RightSidebarAd from '@/shared/components/ads/RightSidebarAd';

interface SidebarProps {
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="hidden w-[300px] shrink-0 border-l border-border bg-surface-muted p-4 lg:block">
      <div className="sticky top-24 space-y-6">
        {children ?? <RightSidebarAd />}
      </div>
    </aside>
  );
}