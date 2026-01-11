import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { mockTrips } from '@/data/mockData';
import { ArrowLeft, Calendar, MapPin, Plus, Film, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';

const TripDetail = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0];
  const [activeTab, setActiveTab] = useState<'itineraries' | 'map'>('itineraries');

  return (
    <div className="mobile-container min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-64">
        <img
          src={trip.coverImage}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 safe-top flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full glass-dark flex items-center justify-center"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Trip info */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-extrabold text-white mb-2">{trip.name}</h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>
                {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex gap-2 p-1 bg-muted rounded-2xl">
          <button
            onClick={() => setActiveTab('itineraries')}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'itineraries'
                ? 'bg-background shadow-card text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Itineraries ({trip.itineraries.length})
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'map'
                ? 'bg-background shadow-card text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-8">
        {activeTab === 'itineraries' ? (
          trip.itineraries.length === 0 ? (
            <EmptyState
              title="No itineraries yet"
              description="Add your first itinerary from an Instagram or TikTok reel!"
              actionLabel="Add from Reel"
              onAction={() => navigate(`/trip/${tripId}/add-reel`)}
              icon={Film}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {trip.itineraries.map((itinerary, index) => (
                <motion.div
                  key={itinerary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                  className="glass rounded-2xl p-4 shadow-card cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground">{itinerary.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {itinerary.stops.length} stops
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{itinerary.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{itinerary.totalTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add more button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/trip/${tripId}/add-reel`)}
              >
                <Plus className="w-4 h-4" />
                Add from Reel
              </Button>
            </motion.div>
          )
        ) : (
          <div className="h-64 rounded-2xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Map view coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetail;
