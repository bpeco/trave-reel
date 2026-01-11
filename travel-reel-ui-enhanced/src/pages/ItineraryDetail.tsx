import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StopCard } from '@/components/StopCard';
import { Button } from '@/components/ui/button';
import { mockItinerary } from '@/data/mockData';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Share2,
  Edit3,
  Navigation,
  Map,
  List,
  MessageCircle,
} from 'lucide-react';

const ItineraryDetail = () => {
  const navigate = useNavigate();
  const itinerary = mockItinerary;
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  return (
    <div className="mobile-container min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-50 glass safe-top">
        <div className="flex items-center justify-between p-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Edit3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            {itinerary.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{itinerary.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{itinerary.totalTime}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 glass rounded-2xl p-3 text-center shadow-soft">
              <p className="text-xl font-bold text-foreground">{itinerary.stops.length}</p>
              <p className="text-xs text-muted-foreground">Stops</p>
            </div>
            <div className="flex-1 glass rounded-2xl p-3 text-center shadow-soft">
              <p className="text-xl font-bold text-foreground">
                {itinerary.stops.filter((s) => s.category === 'gastronomia').length}
              </p>
              <p className="text-xs text-muted-foreground">Food spots</p>
            </div>
            <div className="flex-1 glass rounded-2xl p-3 text-center shadow-soft">
              <p className="text-xl font-bold text-foreground">{itinerary.totalTime}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl mb-6">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                viewMode === 'list'
                  ? 'bg-background shadow-card text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <List className="w-4 h-4" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                viewMode === 'map'
                  ? 'bg-background shadow-card text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
          </div>
        </motion.div>

        {/* Content */}
        {viewMode === 'list' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-0"
          >
            {itinerary.stops.map((stop, index) => (
              <StopCard
                key={stop.id}
                stop={stop}
                isLast={index === itinerary.stops.length - 1}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-80 rounded-3xl bg-muted overflow-hidden relative"
          >
            {/* Placeholder map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map view</p>
              </div>
            </div>

            {/* Route dots */}
            <div className="absolute inset-4 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 200 150">
                <path
                  d="M 30 120 Q 60 60 100 80 T 170 40"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                {[
                  { cx: 30, cy: 120 },
                  { cx: 70, cy: 70 },
                  { cx: 100, cy: 80 },
                  { cx: 140, cy: 55 },
                  { cx: 170, cy: 40 },
                ].map((point, i) => (
                  <circle
                    key={i}
                    cx={point.cx}
                    cy={point.cy}
                    r="8"
                    fill="hsl(var(--primary))"
                  />
                ))}
              </svg>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <Button variant="sunset" size="lg" className="w-full">
            <Navigation className="w-4 h-4" />
            Open in Google Maps
          </Button>
          <Button
            variant="glass"
            size="lg"
            className="w-full"
            onClick={() => navigate('/chat')}
          >
            <MessageCircle className="w-4 h-4" />
            Modify with AI
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ItineraryDetail;
