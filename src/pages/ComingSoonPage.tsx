import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import EmptyState from '@/shared/components/ui/EmptyState';
import { TOOLS } from '@/shared/constants/routes';
import { Construction } from 'lucide-react';

export default function ComingSoonPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOLS.find((t) => t.id === toolId);
  const name = tool?.name || 'Tool';

  return (
    <>
      <Helmet>
        <title>{name} – ImageCraft</title>
      </Helmet>
      <EmptyState
        icon={<Construction size={48} />}
        title={name}
        description={`The ${name} tool is under construction. Check back soon!`}
      />
    </>
  );
}