'use client';

import React, { useState, useEffect } from 'react';
import { Play, Utensils, MessageCircle, ChevronDown, Award, Compass, Zap } from 'lucide-react';

interface HeroProps {
  onOrderNowClick: () => void;
  onExploreMenuClick: () => void;
  onOpenChat: () => void;
}

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1920&q=80'
];

export default function Hero({ onOrderNowClick, onExploreMenuClick, onOpenChat }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Rotate background slideshow every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Simple mouse move parallax handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 40;
    const y = (clientY - window.innerHeight / 2) / 40;
    setMousePosition({ x, y });
  };

  return (
    <header
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black py-20"
    >
      {/* Background Image Slideshow with smooth crossfade */}
      {BACKGROUND_IMAGES.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105 ${
            index === currentSlide ? 'opacity-40 translate-x-0 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Luxury Radial/Gradient dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/70 to-[#0B0B0C]/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(11,11,12,0.9)_80%)]" />

      {/* Floating Glowing Particle simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-35">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#DFB15B] rounded-full blur-[2px] animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#FF6F3D] rounded-full blur-[3px] animate-ping" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-[#DFB15B] rounded-full blur-[1px] animate-bounce" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#DFB15B] rounded-full blur-[2px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-2.5 h-2.5 bg-[#FF6F3D] rounded-full blur-[3px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Cinematic Steam Effect (adds premium feeling of freshness) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 pointer-events-none opacity-20 filter blur-xl mix-blend-screen animate-pulse bg-gradient-to-t from-white/10 to-transparent" />

      {/* Interactive Floating Luxury Badges */}
      <div
        className="hidden lg:flex absolute right-16 top-1/3 flex-col gap-6"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl hover:bg-white/10 hover:border-[#DFB15B]/50 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#DFB15B]/10 flex items-center justify-center text-[#DFB15B]">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">100% Handcrafted</h4>
            <p className="text-[10px] text-white/50">Made personally with love</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl hover:bg-white/10 hover:border-[#FF6F3D]/50 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#FF6F3D]/10 flex items-center justify-center text-[#FF6F3D]">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Chef Prepared</h4>
            <p className="text-[10px] text-white/50">Premium quality curation</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl hover:bg-white/10 hover:border-[#DFB15B]/50 transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#DFB15B]/10 flex items-center justify-center text-[#DFB15B]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Delivered Fresh</h4>
            <p className="text-[10px] text-white/50">Thermal insulated luxury</p>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div 
        className="max-w-4xl mx-auto px-6 text-center z-10 flex flex-col items-center select-none"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        {/* Modern African Tagline badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#FF6F3D] animate-ping" />
          <p className="text-xs uppercase tracking-[0.25em] text-[#DFB15B] font-bold">
            Best Meals in Kenya Delivered Fresh
          </p>
        </div>

        {/* Cinematic Main Header Title */}
        <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">Handcrafted</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF6F3D] via-[#DFB15B] to-[#FF6F3D] bg-size-200 animate-gradient-flow">
            African Luxury
          </span>
        </h1>

        {/* Awwwards level description */}
        <p className="max-w-2xl text-base md:text-lg text-white/60 leading-relaxed font-sans mb-12 drop-shadow-lg">
          Experience gourmet food made with fresh local Kenyan ingredients, custom‑spiced for your palate, handcrafted by Chef Kavata, and delivered directly to your doorstep.
        </p>

        {/* Premium CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-md">
          {/* Order now trigger */}
          <button
            onClick={onOrderNowClick}
            className="flex-1 py-4.5 px-8 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold uppercase tracking-wider text-xs shadow-xl shadow-[#FF6F3D]/25 hover:shadow-[#FF6F3D]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" /> Order Now
          </button>

          {/* Explore menu scroll */}
          <button
            onClick={onExploreMenuClick}
            className="flex-1 py-4.5 px-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold uppercase tracking-wider text-xs backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#DFB15B]" /> Explore Menu
          </button>

          {/* Concierge whatsapp/chat shortcut */}
          <button
            onClick={onOpenChat}
            className="sm:hidden py-4.5 px-8 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] font-bold uppercase tracking-wider text-xs backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" /> AI Concierge
          </button>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div 
        onClick={onExploreMenuClick}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 cursor-pointer animate-bounce"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Scroll to Discover</span>
        <ChevronDown className="w-4 h-4" />
      </div>
    </header>
  );
}
