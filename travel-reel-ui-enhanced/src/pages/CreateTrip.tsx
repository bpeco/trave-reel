import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Calendar, Camera } from 'lucide-react';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="mobile-container min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 safe-top flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <h1 className="text-xl font-bold text-foreground">New Trip</h1>
      </div>

      <div className="flex-1 px-6 py-4">
        {/* Cover Image Picker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-48 rounded-3xl bg-muted mb-6 overflow-hidden"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center mb-2">
              <Camera className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Add cover photo</p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleCreate}
          className="space-y-5"
        >
          {/* Trip Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Trip Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Italian Adventure"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Destination */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Destination
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="e.g., Rome, Italy"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button variant="sunset" size="lg" className="w-full mt-8" type="submit">
            Create Trip
          </Button>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateTrip;
