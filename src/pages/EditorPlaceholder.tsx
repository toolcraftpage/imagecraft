import EmptyState from '@/shared/components/ui/EmptyState';
import { Image } from 'lucide-react';

export default function EditorPlaceholder() {
  return (
    <EmptyState
      icon={<Image size={48} />}
      title="Professional Editor"
      description="The full image editor will be available here. Stay tuned."
    />
  );
}