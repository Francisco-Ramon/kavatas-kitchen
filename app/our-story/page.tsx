'use client';

import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, Mail, Send } from 'lucide-react';

export default function StoryPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <div className="bg-[#0B0B0C] text-white min-h-screen font-sans">
      
      {/* SECTION 2: EMOTIONAL BRAND STORYTELLING */}
      <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Brand Visuals collage */}
        <div className="lg:col-span-6 relative aspect-square max-w-md mx-auto lg:max-w-none w-full">
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-black/80">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Chef preparing Pilau"
              className="w-full h-full object-cover filter brightness-75 scale-105"
            />
          </div>
          {/* Abstract Overlay highlight spot */}
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#DFB15B]/10 rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute -top-6 -left-6 w-48 h-48 bg-[#FF6F3D]/10 rounded-full filter blur-2xl pointer-events-none" />

          {/* floating badge */}
          <div className="absolute bottom-8 left-8 p-5 bg-[#0B0B0C]/80 border border-white/10 backdrop-blur-xl rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFB15B]/20 flex items-center justify-center text-[#DFB15B]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">100% Personal</h4>
              <p className="text-[10px] text-white/50">Chef Kavata cooks & delivers</p>
            </div>
          </div>
        </div>

        {/* Story texts */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFB15B] font-bold">Prepared With Love</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Our Story: Gourmet Kenyan Craftsmanship
            </h2>
          </div>

          <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans">
            Founded on the belief that fine dining should be intimate and raw, <strong className="text-[#DFB15B]">Kavata’s Kitchen</strong> represents a return to artisanal gastronomy. We don’t operate a crowded, chaotic kitchen, nor do we partner with random delivery couriers.
          </p>

          <p className="text-xs md:text-sm text-white/60 leading-relaxed font-sans">
            Instead, Chef Kavata personally hand-selects organic inputs from local sustainable highland farms in Kenya. Every batch of Swahili Pilau is slow-simmered in hand-crushed whole cardamom and sweet cinnamon; every mbuzi is flame-chiseled on raw oak coals for hours.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-2 border-l-2 border-[#DFB15B] pl-4">
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">Fresh Local Farms</h4>
              <p className="text-[11px] text-white/40">Guaranteed non-GMO, organic inputs</p>
            </div>
            <div className="space-y-2 border-l-2 border-[#FF6F3D] pl-4">
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">Intelligent Care</h4>
              <p className="text-[11px] text-white/40">Personal thermal courier logistics</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LUXURY NEWSLETTER SIGNUP */}
      <section className="py-20 bg-gradient-to-tr from-[#18181A]/50 to-transparent border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 select-none">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFB15B] font-bold">Stay Inspired</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight">Join the Culinary Circle</h2>
            <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
              Subscribe to receive updates on Chef Kavata's weekly limited creations, seasonal ingredients, and exclusive private dining offers.
            </p>
          </div>

          {subscribed ? (
            <div className="max-w-md mx-auto py-4 px-6 rounded-2xl bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[#DFB15B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 animate-bounce">
              <ShieldCheck className="w-5 h-5" /> Welcome to the Circle!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#DFB15B] transition-all"
              />
              <button
                type="submit"
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#FF6F3D]/10"
              >
                <Mail className="w-4 h-4" /> Join
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
