'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/AppContext';
import { useUI } from '../lib/UIContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, MessageCircle, Menu, X, Utensils, LogOut, UserCheck } from 'lucide-react';

export default function NavBar() {
  const { cart, favorites, currentUser, logoutAccount } = useAppContext();
  const { setCartOpen, setFavOpen, setChatOpen, setAdminOpen } = useUI();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { id: 'home', name: 'Home', href: '/' },
    { id: 'menu', name: 'Our Menu', href: '/menu' },
    { id: 'story', name: 'Our Story', href: '/our-story' },
    { id: 'reviews', name: 'Connoisseur Reviews', href: '/reviews' }
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-[#0B0B0C]/80 border-b border-white/5 backdrop-blur-xl shadow-2xl shadow-black/40'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center shadow-lg shadow-[#FF6F3D]/20 group-hover:scale-105 transition-transform duration-300">
            <Utensils className="w-5 h-5 text-[#0B0B0C]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-wide text-white group-hover:text-[#DFB15B] transition-colors duration-300">
              Kavata’s <span className="text-[#FF6F3D]">Kitchen</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#DFB15B]/70 font-semibold font-sans">
              Modern African Luxury
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Link Tabs */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative py-2 text-sm uppercase tracking-widest transition-colors duration-300 font-semibold cursor-pointer ${
                  active 
                    ? 'text-[#DFB15B]' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.name}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          {/* User Account / Admin shortcut */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/account" className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-[#DFB15B]/10 border border-[#DFB15B]/20 cursor-pointer">
                <UserCheck className="w-3.5 h-3.5 text-[#DFB15B]" />
                <span className="text-[10px] font-bold text-[#DFB15B] uppercase tracking-wider">{currentUser.name.split(' ')[0]}</span>
              </Link>
              <button onClick={logoutAccount} className="p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-red-400 hover:bg-white/10 transition-all cursor-pointer" title="Sign Out">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdminOpen(true)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-[#DFB15B] hover:bg-white/10 transition-all duration-300 cursor-pointer hidden sm:flex"
              title="Chef Admin Dashboard"
            >
              <User className="w-4 h-4" />
            </button>
          )}

          {/* AI Support chatbot shortcut */}
          <button
            onClick={() => setChatOpen(true)}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-[#FF6F3D] hover:bg-white/10 transition-all duration-300 cursor-pointer hidden sm:flex relative group"
            title="AI Support Assistant"
          >
            <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF6F3D] animate-ping" />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF6F3D]" />
          </button>

          {/* Favorites List */}
          <button
            onClick={() => setFavOpen(true)}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-red-500 hover:bg-white/10 transition-all duration-300 cursor-pointer relative"
          >
            <Heart className="w-4 h-4" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-red-500/20">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Floating Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#FF6F3D]/25"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs uppercase tracking-wider">Bag</span>
            <span className="w-5 h-5 rounded-full bg-[#0B0B0C] text-[#DFB15B] text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:text-white md:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0B0B0C]/95 border-b border-white/10 backdrop-blur-2xl py-6 px-6 flex flex-col gap-4 animate-fade-in shadow-2xl md:hidden">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full py-3 text-left text-sm uppercase tracking-widest border-b border-white/5 transition-colors ${
                  active ? 'text-[#DFB15B] font-bold' : 'text-white/70'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setAdminOpen(true); }}
              className="flex-1 py-3 bg-white/5 rounded-xl border border-white/10 text-white/80 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" /> Admin
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setChatOpen(true); }}
              className="flex-1 py-3 bg-[#FF6F3D]/10 rounded-xl border border-[#FF6F3D]/20 text-[#FF6F3D] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 animate-pulse" /> AI Chat
            </button>
          </div>

          {/* User Account Portal links in mobile menu */}
          {currentUser ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#DFB15B]/10 border border-[#DFB15B]/20 text-[#DFB15B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> {currentUser.name} (Account)
              </Link>
              <button
                onClick={() => { setMobileMenuOpen(false); logoutAccount(); }}
                className="w-full py-3 bg-white/5 rounded-xl border border-white/10 text-red-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-white/5 rounded-xl border border-white/10 text-white/80 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" /> Sign In / Account
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
