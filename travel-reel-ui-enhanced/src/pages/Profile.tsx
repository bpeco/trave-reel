import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { mockUser } from '@/data/mockData';
import {
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  Bell,
  Shield,
  Sparkles,
} from 'lucide-react';

const menuItems = [
  { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
  { icon: CreditCard, label: 'Subscription', path: '/subscription' },
  { icon: Shield, label: 'Privacy & Security', path: '/settings/privacy' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-container min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="relative pt-safe-top">
        {/* Gradient background */}
        <div className="absolute inset-x-0 top-0 h-48 gradient-sunset" />

        {/* Profile card */}
        <div className="relative px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 shadow-float"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full gradient-ocean flex items-center justify-center text-white text-2xl font-bold">
                {mockUser.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{mockUser.name}</h1>
                <p className="text-sm text-muted-foreground">{mockUser.email}</p>
              </div>
            </div>

            {/* Premium badge or upgrade CTA */}
            {mockUser.isPremium ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground w-fit">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-medium">Premium Member</span>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/subscription')}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-sunset flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Upgrade to Premium</p>
                    <p className="text-xs text-muted-foreground">Unlimited reels & more</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl overflow-hidden shadow-card"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => navigate('/welcome')}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </motion.div>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Travel-Reel v1.0.0
        </p>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
