import { Stop } from '@/types';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';

interface StopCardProps {
  stop: Stop;
  isLast?: boolean;
}

export const StopCard = ({ stop, isLast = false }: StopCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: stop.order * 0.1 }}
      className="flex gap-4"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full gradient-sunset flex items-center justify-center text-white font-bold text-sm shadow-soft">
          {stop.order}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/30 to-transparent my-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="glass rounded-2xl p-4 shadow-card">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-foreground">{stop.name}</h3>
            <CategoryBadge category={stop.category} />
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {stop.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{stop.duration}</span>
            </div>
            {stop.coordinates && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>View on map</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
