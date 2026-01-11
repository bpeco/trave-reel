import { motion } from 'framer-motion';
import { Plane, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: typeof Plane;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Plane,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6"
      >
        <Icon className="w-10 h-10 text-muted-foreground" />
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs mb-6">{description}</p>

      {actionLabel && onAction && (
        <Button variant="sunset" onClick={onAction}>
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};
