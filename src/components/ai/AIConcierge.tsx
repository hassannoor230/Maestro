import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Sparkles, Clock, MapPin, Phone, Utensils, Calendar } from 'lucide-react';
import API from '../../lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  action: string;
}

const quickActions: QuickAction[] = [
  { icon: <Utensils size={16} />, label: 'Explore Menu', action: 'Show me the menu' },
  { icon: <Calendar size={16} />, label: 'Reserve Table', action: 'I want to book a table' },
  { icon: <Clock size={16} />, label: 'Opening Hours', action: 'What are your opening hours?' },
  { icon: <Sparkles size={16} />, label: 'Signature Dishes', action: 'What are your signature dishes?' },
  { icon: <MapPin size={16} />, label: 'Location', action: 'Where are you located?' },
  { icon: <Phone size={16} />, label: 'Contact Us', action: 'What is your phone number?' },
];

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showActions, setShowActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const welcomeMessage: Message = {
    id: 'welcome',
    role: 'assistant',
    content: `Welcome to Maestro Cafe.

I'm your personal digital concierge, here to assist you with reservations, menu inquiries, and any questions about your dining experience.

How may I make your visit exceptional today?`,
    timestamp: new Date(),
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([welcomeMessage]);
    }
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setShowActions(false);
    setIsTyping(true);
    
    setTimeout(() => {
      handleAIResponse(action);
    }, 1500);
  };

  const handleAIResponse = async (userMessage: string) => {
    try {
      const response = await API.post('/ai/chat', {
        message: userMessage,
        sessionId: localStorage.getItem('ai_session_id') || Date.now().toString()
      });
      
      const data = response.data;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm here to help. Is there anything else I can assist you with?",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, I'm having trouble connecting to our concierge service. Please try again or call us at +92 55 3821477.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowActions(false);
    setIsTyping(true);

    handleAIResponse(input.trim());
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* 3D Floating Orb Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 group cursor-pointer hidden lg:block"
            style={{ width: 64, height: 64 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/40 via-amber-500/30 to-yellow-600/20 blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
            
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-gold/50 animate-spin-slow" 
              style={{ animationDuration: '8s', background: 'conic-gradient(from 0deg, transparent, #D4AF37, transparent)' }}
            />
            
            {/* Main Orb */}
            <motion.div
              className="absolute inset-1 rounded-full overflow-hidden"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Glass Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a]" />
              
              {/* Inner Gold Core */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold/60 via-amber-500/40 to-yellow-600/30" />
              
              {/* Shine */}
              <div className="absolute top-1 left-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
              
              {/* Bot Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Bot className="text-champagne" size={24} strokeWidth={1.5} />
              </div>
            </motion.div>

            {/* Floating Particles */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gold animate-float opacity-60" style={{ animationDelay: '0s' }} />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-champagne animate-float opacity-40" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -right-2 w-1 h-1 rounded-full bg-amber-400 animate-float opacity-50" style={{ animationDelay: '2s' }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] hidden lg:block"
          >
            {/* Outer Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-gold/20 via-amber-500/10 to-yellow-600/20 blur-xl" />
            
            {/* Main Container */}
            <div className="relative h-full w-full rounded-3xl overflow-hidden glass-strong border border-gold/20 flex flex-col">
              {/* Header */}
              <div className="relative px-6 py-4 bg-gradient-to-r from-[#1a1a1a] via-[#111111] to-[#1a1a1a] border-b border-gold/20">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Mini Orb */}
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/30 to-amber-600/20 blur-sm" />
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center border border-gold/30">
                        <Bot className="text-gold" size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-champagne">MAESTRO AI CONCIERGE</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-muted">ONLINE • AT YOUR SERVICE</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-champagne transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-gold/20 to-amber-500/10 border border-gold/30 text-champagne'
                          : 'bg-white/5 border border-white/10 text-[#F5F3ED]'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                      <p className="text-xs text-muted/50 mt-1 text-right">{formatTime(msg.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Actions */}
                {showActions && messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <p className="text-xs text-muted/60 text-center">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, i) => (
                        <motion.button
                          key={action.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          onClick={() => handleQuickAction(action.action)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 text-sm text-champagne transition-all hover:scale-[1.02]"
                        >
                          <span className="text-gold">{action.icon}</span>
                          <span className="text-xs">{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 text-champagne placeholder:text-muted/50 focus:border-gold/50 focus:outline-none transition-colors"
                  />
                   <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-gold to-amber-600 text-black disabled:opacity-40 hover:scale-105 transition-transform disabled:hover:scale-100"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-muted/40 text-center mt-2">
                  Maestro AI Concierge • Powered by OpenAI
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile AI Concierge - Bottom Right */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            className="fixed bottom-20 right-6 z-50 group cursor-pointer lg:hidden"
            style={{ width: 56, height: 56 }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/40 via-amber-500/30 to-yellow-600/20 blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-gold/50 animate-spin-slow" 
              style={{ animationDuration: '8s', background: 'conic-gradient(from 0deg, transparent, #D4AF37, transparent)' }}
            />
            <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]" />
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gold/60 via-amber-500/40 to-yellow-600/30" />
              <Bot className="text-champagne relative z-10" size={22} strokeWidth={1.5} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Chat Window - Bottom Right, Full Width */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 bottom-4 z-50 h-[70vh] lg:hidden"
          >
            <div className="relative h-full w-full rounded-3xl overflow-hidden glass-strong border border-gold/20 flex flex-col">
              <div className="relative px-4 py-3 bg-gradient-to-r from-[#1a1a1a] via-[#111111] to-[#1a1a1a] border-b border-gold/20">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center border border-gold/30">
                      <Bot className="text-gold" size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-champagne">MAESTRO AI CONCIERGE</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[10px] text-muted">ONLINE</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-champagne transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-gold/20 to-amber-500/10 border border-gold/30 text-champagne'
                        : 'bg-white/5 border border-white/10 text-[#F5F3ED]'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                      <p className="text-[10px] text-muted/50 mt-1 text-right">{formatTime(msg.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                {showActions && messages.length === 1 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted/60 text-center">Quick Actions</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {quickActions.map((action, i) => (
                        <motion.button
                          key={action.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          onClick={() => handleQuickAction(action.action)}
                          className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/5 hover:bg-gold/10 border border-white/10 hover:border-gold/30 text-[10px] text-champagne transition-all"
                        >
                          <span className="text-gold">{action.icon}</span>
                          <span>{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 pr-10 text-sm text-champagne placeholder:text-muted/50 focus:border-gold/50 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gradient-to-br from-gold to-amber-600 text-black disabled:opacity-40"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
