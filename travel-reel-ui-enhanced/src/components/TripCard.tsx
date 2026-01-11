import { Trip } from '@/types';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export const TripCard = ({ trip, onClick }: TripCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-3xl cursor-pointer shadow-card group"
    >
      {/* Background Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-bold text-white mb-2">{trip.name}</h3>
        
        <div className="flex items-center gap-4 text-white/80 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{trip.destination}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(trip.startDate), 'MMM d')}</span>
          </div>
        </div>

        {/* Itinerary count badge */}
        <div className="absolute bottom-5 right-5 flex items-center gap-2">
          <span className="glass-dark rounded-full px-3 py-1.5 text-xs text-white font-medium">
            {trip.itineraries.length} {trip.itineraries.length === 1 ? 'itinerary' : 'itineraries'}
          </span>
          <div className="w-8 h-8 rounded-full glass-dark flex items-center justify-center">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
