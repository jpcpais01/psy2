'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Save } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRefreshChat = () => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message || "I'm here to listen and support you."
      }]);

    } catch (error) {
      console.error('Chat submission error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties. Could you please try again?"
      }]);
    }
  };

  const handleSaveChat = () => {
    // Save chat messages to journal
    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? 'You: ' : 'AI: '}${msg.content}`
    ).join('\n\n');

    // Dispatch a custom event to save to journal
    const saveEvent = new CustomEvent('save-chat-to-journal', {
      detail: { content: chatContent }
    });
    window.dispatchEvent(saveEvent);
  };

  const handleSaveChatClick = () => {
    console.log("Save button clicked");
  };

  return (
    <div className="w-full h-full flex flex-col px-2 py-6">
      <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col">
        <div className="flex-grow relative bg-transparent rounded-2xl overflow-hidden shadow-lg">
          <div className={`absolute inset-0 ${messages.length > 0 ? 'overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-400/20 hover:scrollbar-thumb-neutral-400/30 scrollbar-track-transparent' : 'overflow-hidden'} p-3 sm:p-4 space-y-4`}>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut"
                  }
                }}
                className="text-center text-neutral-500 dark:text-neutral-400 h-full flex flex-col items-center justify-center"
              >
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: 0.2,
                      duration: 0.8,
                      ease: "easeOut"
                    }
                  }}
                  className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight"
                >
                  Welcome to Your AI Therapy Session
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: 0.4,
                      duration: 0.8,
                      ease: "easeOut"
                    }
                  }}
                  className="text-xs xs:text-sm sm:text-base lg:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto opacity-90 leading-relaxed"
                >
                  A safe space for open conversation and personal growth. Share your thoughts freely with our empathetic AI companion.
                </motion.p>
              </motion.div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-[80%] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-sm sm:text-base break-words whitespace-pre-wrap ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white'
                        : 'bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-sm'
                    }`}
                  >
                    <div className="relative z-10">{message.content}</div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 dark:from-white/5 dark:to-white/0" />
                  </div>
                </motion.div>
              ))}
              
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    key="typing-indicator"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ 
                      duration: 0.3,
                      height: { duration: 0.3, ease: 'easeInOut' }
                    }}
                    className="flex justify-start overflow-hidden"
                  >
                    <div className="relative max-w-[80%] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50 backdrop-blur-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="mt-4 w-full -mb-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center space-x-2">
              <button 
                type="button"
                onClick={handleRefreshChat}
                className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors duration-200 group relative"
                aria-label="Refresh Chat"
              >
                <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-900/50 scale-0 group-hover:scale-100 transition-transform duration-200" />
                <RefreshCw className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button 
                type="button"
                onClick={() => { handleSaveChat(); handleSaveChatClick(); }}
                className="p-2 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors duration-200 group relative"
                aria-label="Save Chat"
              >
                <div className="absolute inset-0 rounded-full bg-neutral-100/50 dark:bg-neutral-900/50 scale-0 group-hover:scale-100 transition-transform duration-200" />
                <Save className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                disabled={!input.trim()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
