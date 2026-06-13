'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../lib/AppContext';
import { MessageCircle, X, Send, Bot, Clock, HelpCircle, Utensils, Compass } from 'lucide-react';

interface Message {
  sender: 'user' | 'concierge';
  text: string;
  time: string;
}

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreMenu: () => void;
}

export default function AIChatbot({ isOpen, onClose, onExploreMenu }: AIChatbotProps) {
  const { meals } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'concierge',
      text: "Greetings, culinary connoisseur. I am your personal Kavata's Kitchen AI Concierge. May I assist you in discovering our handcrafted masterpieces or coordinate your gourmet delivery details today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI Concierge response
    setTimeout(() => {
      let replyText = '';
      const query = textToSend.toLowerCase();

      if (query.includes('special') || query.includes('signature') || query.includes('chef')) {
        const signature = meals.find((m) => m.category === 'Chef') || meals[0];
        replyText = `Our Chef's supreme signature is the **${signature.title}**. ${signature.description} Priced at KES ${signature.priceKES.toLocaleString()}, it is handcrafted personally by Chef Kavata with exceptional care. Would you like me to guide you to our Menu to add this masterpiece?`;
      } else if (query.includes('delivery') || query.includes('time') || query.includes('speed') || query.includes('how')) {
        replyText = `We are proud to offer **Tesla‑class personal delivery**. Chef Kavata personally prepares, coordinates, and delivers your food in customized gold‑trimmed, highly‑insulated thermal containers to ensure it arrives straight‑from‑the‑oak‑coals hot. Delivery is free for orders over KES 2,000, else it's a flat rate of KES 250 anywhere in Nairobi.`;
      } else if (query.includes('kenyan') || query.includes('heritage') || query.includes('pilau') || query.includes('choma')) {
        replyText = `For a true taste of Kenyan culinary luxury, I highly recommend our **Swahili Pilau Luxe** (KES 950) or our **Flame-Grilled Nyama Choma** (KES 1,200), seasoned with organic sea salt and grilled over oak embers. They represent the pinnacle of our local heritage.`;
      } else if (query.includes('spicy') || query.includes('chili') || query.includes('wings')) {
        replyText = `For a beautiful, warm kick, our **Spiced Piri Piri Wings** (KES 900) glazed in secret homegrown habanero and lemon are outstanding! Pair them with our chilled **Hibiscus Gold Infusion** containing a real 24k gold leaf to perfectly balance the heat.`;
      } else if (query.includes('menu') || query.includes('eat') || query.includes('food') || query.includes('buy')) {
        replyText = `I would be delighted to guide you. We offer multiple luxury categories: **Kenyan Heritage**, **Gourmet Fast Food**, **Elixirs & Chai**, and premium **Chef Signatures**. You can browse them dynamically, and when you find a match, just click "Add to Bag".`;
      } else {
        replyText = `It is a privilege to serve you at Kavata's Kitchen. We focus on handcrafted excellence, sourcing only organic farm‑fresh local ingredients, and delivering personally. May I suggest you explore our **Swahili Pilau Luxe** or let me know if you have specific dietary preferences?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'concierge',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  const quickChips = [
    "Chef's Special Signatures",
    "How does luxury delivery work?",
    "Suggest a spicy heritage meal",
    "Tell me about Pilau Luxe"
  ];

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-96 h-full sm:h-[550px] bg-[#0C0C0E] border-0 sm:border border-white/5 shadow-2xl rounded-none sm:rounded-3xl z-50 flex flex-col justify-between overflow-hidden animate-fade-in font-sans">
      
      {/* Concierge Header */}
      <div className="p-5 bg-gradient-to-r from-[#FF6F3D]/20 to-[#DFB15B]/20 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C] shadow-lg shadow-[#FF6F3D]/10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-white">AI Concierge Assistant</h3>
            <p className="text-[9px] uppercase tracking-widest text-[#DFB15B] font-bold">Kavata's Kitchen Advisor</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Feed Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold rounded-tr-none shadow-md shadow-[#FF6F3D]/10'
                  : 'bg-white/5 border border-white/5 text-white/80 rounded-tl-none'
              }`}
            >
              {/* Parse bold texts dynamically */}
              <p className="whitespace-pre-line">
                {msg.text.split('**').map((chunk, index) => 
                  index % 2 === 1 ? <strong key={index} className="font-extrabold text-[#DFB15B] dark:text-[#DFB15B]">{chunk}</strong> : chunk
                )}
              </p>
              <span className={`text-[8px] mt-2 block text-right ${msg.sender === 'user' ? 'text-[#0B0B0C]/60' : 'text-white/30'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {/* Typing Dots Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#DFB15B] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-[#DFB15B] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-1.5 bg-[#DFB15B] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick replies scroll row */}
      {messages.length === 1 && (
        <div className="px-5 py-2 overflow-x-auto flex gap-2 scrollbar-none select-none">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="py-1.5 px-3 rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-[#DFB15B] hover:border-[#DFB15B]/30 hover:bg-white/10 text-[9px] font-bold transition-all whitespace-nowrap cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-4 pb-6 sm:pb-4 border-t border-white/5 bg-[#0B0B0C] flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
          placeholder="Ask about menu, delivery details, etc..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white text-xs focus:outline-none focus:border-[#DFB15B] focus:ring-1 focus:ring-[#DFB15B] transition-all"
        />
        <button
          onClick={() => handleSend(inputText)}
          className="p-3 rounded-2xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#FF6F3D]/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
