import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import {
  ArrowLeft,
  Send,
  Sparkles,
  MapPin,
  Clock,
  Utensils,
  Route,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const quickPrompts = [
  { icon: MapPin, label: 'Add a museum' },
  { icon: Utensils, label: 'Find lunch spots' },
  { icon: Clock, label: 'I have 2 extra hours' },
  { icon: Route, label: 'Optimize my route' },
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your travel assistant 🌍 I can help you modify your \"Perfect Day in Rome\" itinerary. What would you like to change?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (message?: string) => {
    const content = message || input;
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'Add a museum': "Great idea! I found the Borghese Gallery nearby. It has an amazing Bernini collection. Would you like me to add it after lunch? It would fit perfectly at 2:30 PM for about 2 hours. ✨",
        'Find lunch spots': "Based on your route, here are 3 great lunch options near the Vatican: \n\n1. **Pizzarium** - Famous for their pizza al taglio\n2. **Osteria dell'Angelo** - Traditional Roman cuisine\n3. **Dal Toscano** - Great pasta dishes\n\nWhich one interests you?",
        'I have 2 extra hours': "Perfect! With 2 extra hours, I suggest adding:\n\n• **Trastevere neighborhood** - Charming streets & local vibes\n• **Piazza Navona** - Beautiful baroque architecture\n\nBoth are on your route! Should I add them?",
        'Optimize my route': "I've analyzed your stops and found a better order that saves 45 minutes of walking! 🚶‍♂️\n\nNew order:\n1. Colosseum → 2. Vatican → 3. Trattoria → 4. Gardens → 5. Shopping\n\nWant me to apply this change?",
      };

      const response = responses[content] || "I understand! Let me help you with that. Could you provide a bit more detail about what you'd like to change in your itinerary?";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="mobile-container min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass safe-top">
        <div className="flex items-center gap-4 p-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex-1">
            <h1 className="font-bold text-foreground">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Editing: Perfect Day in Rome
            </p>
          </div>
          <div className="w-10 h-10 rounded-full gradient-sunset flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-48">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex mb-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'gradient-sunset text-white rounded-br-sm'
                    : 'glass shadow-soft rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 shadow-soft">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="fixed bottom-48 left-0 right-0 px-4">
          <div className="max-w-md mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <motion.button
                  key={prompt.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(prompt.label)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full glass shadow-soft text-sm"
                >
                  <prompt.icon className="w-4 h-4 text-primary" />
                  <span>{prompt.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-20 left-0 right-0 px-4 py-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 h-12 px-4 rounded-2xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button
              variant="sunset"
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="h-12 w-12 rounded-2xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Chat;
