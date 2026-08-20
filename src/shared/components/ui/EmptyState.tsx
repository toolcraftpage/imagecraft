import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-6 text-foreground-muted">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-foreground">{title}</h3>
      {description && <p className="mb-6 max-w-md text-foreground-secondary">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
}