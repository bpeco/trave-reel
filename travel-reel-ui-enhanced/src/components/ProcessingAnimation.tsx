import { motion, AnimatePresence } from 'framer-motion';
import { ProcessingState } from '@/types';
import { Download, FileAudio, Sparkles, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface ProcessingAnimationProps {
  state: ProcessingState;
  onComplete?: () => void;
}

const stateConfig: Record<ProcessingState, { icon: typeof Download; label: string; description: string }> = {
  idle: { icon: Download, label: '', description: '' },
  downloading: { 
    icon: Download, 
    label: 'Downloading Reel', 
    description: 'Fetching your travel content...' 
  },
  transcribing: { 
    icon: FileAudio, 
    label: 'Transcribing', 
    description: 'Understanding the creator\'s tips...' 
  },
  generating: { 
    icon: Sparkles, 
    label: 'Generating Itinerary', 
    description: 'AI is crafting your perfect day...' 
  },
  geocoding: { 
    icon: MapPin, 
    label: 'Finding Locations', 
    description: 'Mapping all the spots...' 
  },
  success: { 
    icon: CheckCircle, 
    label: 'Ready!', 
    description: 'Your itinerary is ready to explore' 
  },
  error: { 
    icon: XCircle, 
    label: 'Oops!', 
    description: 'Something went wrong. Try again?' 
  },
};

export const ProcessingAnimation = ({ state }: ProcessingAnimationProps) => {
  const config = stateConfig[state];
  const Icon = config.icon;
  const isSuccess = state === 'success';
  const isError = state === 'error';
  const isProcessing = !isSuccess && !isError && state !== 'idle';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          {/* Animated Icon Container */}
          <div className="relative mb-6">
            {/* Outer glow ring */}
            {isProcessing && (
              <motion.div
                className="absolute inset-0 rounded-full gradient-sunset opacity-20"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ margin: '-20px' }}
              />
            )}
            
            {/* Icon background */}
            <motion.div
              className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isSuccess ? 'bg-emerald-500' : isError ? 'bg-destructive' : 'gradient-sunset'
              } shadow-float`}
              animate={isProcessing ? { rotate: 360 } : {}}
              transition={isProcessing ? { duration: 8, repeat: Infinity, ease: 'linear' } : {}}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>
          </div>

          {/* Progress dots */}
          {isProcessing && (
            <div className="flex gap-2 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          )}

          {/* Labels */}
          <h3 className="text-xl font-bold text-foreground mb-2">{config.label}</h3>
          <p className="text-muted-foreground text-center max-w-xs">{config.description}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
