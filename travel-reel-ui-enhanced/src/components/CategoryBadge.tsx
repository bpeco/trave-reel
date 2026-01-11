import { Category } from '@/types';
import { cn } from '@/lib/utils';
import { Palette, Utensils, TreePine, Star, ShoppingBag } from 'lucide-react';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryConfig: Record<Category, { label: string; icon: typeof Palette; className: string }> = {
  cultura: { label: 'Cultura', icon: Palette, className: 'badge-cultura' },
  gastronomia: { label: 'Gastronomía', icon: Utensils, className: 'badge-gastronomia' },
  naturaleza: { label: 'Naturaleza', icon: TreePine, className: 'badge-naturaleza' },
  iconico: { label: 'Icónico', icon: Star, className: 'badge-iconico' },
  compras: { label: 'Compras', icon: ShoppingBag, className: 'badge-compras' },
};

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};
