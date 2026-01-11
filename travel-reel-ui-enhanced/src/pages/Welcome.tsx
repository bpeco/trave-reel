import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Map, Film } from 'lucide-react';

const features = [
  {
    icon: Film,
    title: 'Paste Any Reel',
    description: 'Instagram or TikTok travel content',
  },
  {
    icon: Sparkles,
    title: 'AI Magic',
    description: 'Instant itinerary generation',
  },
  {
    icon: Map,
    title: 'Ready to Go',
    description: 'Maps, times, all organized',
  },
];

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="relative h-[45vh] overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 gradient-sunset" />
        
        {/* Decorative elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-8 w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-32 left-12 w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-white text-center mb-3"
          >
            Turn Reels into
            <br />
            Real Adventures
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-center text-lg"
          >
            AI-powered travel planning
          </motion.p>
        </div>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 py-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 shadow-float mb-8"
        >
          <div className="space-y-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.15 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl gradient-sunset flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            variant="sunset"
            size="lg"
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            I already have an account
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
