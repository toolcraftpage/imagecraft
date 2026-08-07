import EmptyState from '@/shared/components/ui/EmptyState';
import { Wrench } from 'lucide-react';

export default function ToolsPlaceholder() {
  return (
    <EmptyState
      icon={<Wrench size={48} />}
      title="Explore Tools"
      description="Individual image tools are coming soon."
    />
  );
}