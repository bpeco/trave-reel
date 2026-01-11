import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TripCard } from '@/components/TripCard';
import { EmptyState } from '@/components/EmptyState';
import { BottomNav, FloatingAddButton } from '@/components/BottomNav';
import { mockTrips, mockUser } from '@/data/mockData';
import { Trip } from '@/types';
import { Bell, Search, Plane } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [trips] = useState<Trip[]>(mockTrips);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter((trip) =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mobile-container min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="p-6 safe-top">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-bold text-foreground">{mockUser.name.split(' ')[0]} 👋</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center relative"
          >
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-background" />
          </motion.button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-foreground">{trips.length}</p>
              <p className="text-xs text-muted-foreground">Trips</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-foreground">
                {trips.reduce((acc, t) => acc + t.itineraries.length, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Itineraries</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center flex-1">
              <p className="text-2xl font-bold text-gradient-sunset">12</p>
              <p className="text-xs text-muted-foreground">Days planned</p>
            </div>
          </div>
        </motion.div>

        {/* Trips Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Your Trips</h2>
          <button className="text-sm text-primary font-medium">See all</button>
        </div>

        {filteredTrips.length === 0 && searchQuery === '' ? (
          <EmptyState
            title="No trips yet"
            description="Start by creating a new trip and add your first reel-based itinerary!"
            actionLabel="Create Trip"
            onAction={() => navigate('/create-trip')}
            icon={Plane}
          />
        ) : filteredTrips.length === 0 ? (
          <EmptyState
            title="No results"
            description="Try searching for something else"
            icon={Search}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <TripCard
                  trip={trip}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <FloatingAddButton onClick={() => navigate('/create-trip')} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Home;
