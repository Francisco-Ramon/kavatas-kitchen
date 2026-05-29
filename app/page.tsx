'use client';

import React, { useState } from 'react';
import { AppProvider, useAppContext } from '../lib/AppContext';
import { CATEGORIES, MEALS, TESTIMONIALS } from '../lib/data';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import MealCard from '../components/MealCard';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import AIChatbot from '../components/AIChatbot';
import AdminDashboard from '../components/AdminDashboard';
import FavoritesModal from '../components/FavoritesModal';
import OrderTracker from '../components/OrderTracker';
import ReviewModal from '../components/ReviewModal';
import { Star, Clock, Utensils, Heart, ShoppingBag, MessageCircle, User, Award, Compass, HeartHandshake, ShieldCheck, Mail, Send, CheckCircle } from 'lucide-react';

function LandingPageContent() {
  const { meals, mealsLoading, publicReviews, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Overlay Open States
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState('');
  const [completedOrderName, setCompletedOrderName] = useState('');

  // Newsletter Email State
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Filter meals based on selected category tab
  const filteredMeals = selectedCategory === 'all'
    ? meals
    : meals.filter((meal) => meal.category === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#0B0B0C] text-white min-h-screen selection:bg-[#DFB15B] selection:text-[#0B0B0C] font-sans overflow-x-hidden">
      
      {/* Premium Floating Header NavBar */}
      <NavBar
        onOpenCart={() => setCartOpen(true)}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenChat={() => setChatOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Cinematic Interactive Hero Section */}
      <Hero
        onOrderNowClick={() => scrollToSection('menu')}
        onExploreMenuClick={() => scrollToSection('menu')}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* SECTION 1: INTERACTIVE PREMIUM MENU */}
      <section id="menu" className="py-24 max-w-7xl mx-auto px-6 space-y-12 scroll-mt-24 select-none">
        
        {/* Slogan details header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFB15B] font-bold">Curated Masterpieces</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Discover Our Gourmet Menu
          </h2>
          <p className="max-w-2xl mx-auto text-xs md:text-sm text-white/50 leading-relaxed font-sans">
            Every dish is custom prepared by Chef Kavata using premium organic inputs, cooked slowly to lock in rich authentic aromas, and delivered sizzling hot.
          </p>
        </div>

        {/* Dynamic Category Filtering Tabs */}
        <div className="flex overflow-x-auto justify-start md:justify-center gap-3 py-3 scrollbar-none border-b border-white/5 pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-3 px-6 rounded-full text-xs uppercase tracking-widest font-bold whitespace-nowrap border transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] border-transparent text-[#0B0B0C] shadow-lg shadow-[#FF6F3D]/10'
                  : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:border-white/10 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealsLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="group relative rounded-3xl bg-[#18181A]/40 border border-white/5 p-4 flex flex-col justify-between h-[450px] animate-pulse overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#DFB15B]/5 to-transparent rounded-full opacity-0 pointer-events-none" />
                <div className="relative aspect-[4/3] rounded-2xl bg-white/5 mb-5 w-full overflow-hidden" />
                <div className="flex-1 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="h-6 bg-white/10 rounded-lg w-2/3" />
                      <div className="h-5 bg-[#DFB15B]/5 border border-[#DFB15B]/10 rounded-lg w-12" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-white/5 rounded-md w-full" />
                      <div className="h-3 bg-white/5 rounded-md w-4/5" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <div className="h-4 bg-white/5 border border-white/5 rounded-md w-14" />
                      <div className="h-4 bg-white/5 border border-white/5 rounded-md w-14" />
                      <div className="h-4 bg-white/5 border border-white/5 rounded-md w-14" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="space-y-1">
                      <div className="h-2.5 bg-white/5 rounded w-10" />
                      <div className="h-5 bg-white/10 rounded w-20" />
                    </div>
                    <div className="h-10 bg-white/10 rounded-2xl w-28" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredMeals.length === 0 ? (
            <div className="col-span-full text-center py-20 border border-dashed border-white/5 rounded-3xl backdrop-blur-md">
              <Utensils className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm font-sans">No gourmet creations found in this category.</p>
            </div>
          ) : (
            filteredMeals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))
          )}
        </div>
      </section>

      {/* SECTION 2: EMOTIONAL BRAND STORYTELLING */}
      <section id="story" className="py-24 bg-[#18181A]/40 border-t border-b border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
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
              Founded on the belief that fine dining should be intimate and raw, **Kavata’s Kitchen** represents a return to artisanal gastronomy. We don’t operate a crowded, chaotic kitchen, nor do we partner with random delivery couriers.
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
        </div>
      </section>

      {/* SECTION 3: LIVE CUSTOMER REVIEWS */}
      <section id="reviews" className="py-24 max-w-7xl mx-auto px-6 space-y-12 scroll-mt-24 select-none">
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#DFB15B] font-bold">Verified Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">Connoisseur Reviews</h2>
          <p className="max-w-2xl mx-auto text-xs md:text-sm text-white/50 leading-relaxed">
            Authentic experiences from our beloved culinary guests — unfiltered and real.
          </p>
        </div>

        {/* Merge static + live reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...publicReviews, ...TESTIMONIALS].slice(0, 8).map((item, idx) => {
            const isLive = 'orderId' in item;
            return (
              <div key={isLive ? item.id : (item as any).id + idx}
                className="rounded-3xl bg-[#18181A]/50 border border-white/5 p-6 flex flex-col justify-between hover:bg-[#18181A]/70 hover:border-white/10 transition-all duration-300 relative backdrop-blur-md overflow-hidden">
                <span className="absolute top-6 right-6 text-[10px] uppercase tracking-wider font-bold py-1 px-3 bg-white/5 rounded-full border border-white/5 text-[#DFB15B]">
                  {item.category}
                </span>
                {isLive && (
                  <span className="absolute top-14 right-6 text-[8px] uppercase tracking-wider font-bold py-0.5 px-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                  </span>
                )}
                <div className="space-y-4">
                  <div className="flex gap-1 text-[#DFB15B]">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-serif italic">
                    "{isLive ? item.comment : (item as any).content}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-6">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C] font-serif font-bold text-xs uppercase shadow-md">
                    {(isLive ? item.customerName : (item as any).name)[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{isLive ? item.customerName : (item as any).name}</h4>
                    <p className="text-[9px] uppercase tracking-wider text-white/30 font-semibold">
                      {isLive ? (item as any).createdAt : (item as any).role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* FOOTER */}
      <footer className="py-16 bg-[#09090A] border-t border-white/5 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-xs text-white/50 font-sans">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C]">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-serif font-bold text-white tracking-wider">Kavata’s Kitchen</h3>
            </div>
            <p className="leading-relaxed">
              Handcrafting luxury Swahili‑heritage and gourmet food delivered fresh personally inside Nairobi. Experiential, clean, and beautiful dining.
            </p>
            <p className="text-[10px] text-white/30">© 2026 Kavata’s Kitchen. Built in luxury style.</p>
          </div>

          {/* Delivery zones */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Premium Zones</h4>
            <ul className="space-y-2 leading-relaxed">
              <li>• Westlands</li>
              <li>• Lavington & Kilimani</li>
              <li>• Gigiri & Runda</li>
              <li>• Karen Estate</li>
              <li>• Nairobi Central</li>
            </ul>
          </div>

          {/* Working hours */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Active Curation</h4>
            <ul className="space-y-2 leading-relaxed">
              <li>Tuesday – Sunday</li>
              <li className="font-semibold text-white">11:00 AM – 10:00 PM</li>
              <li className="text-[10px] text-[#DFB15B] font-bold">Pre-orders coordinates welcomed</li>
            </ul>
          </div>

          {/* Support Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-white font-bold">Concierge Contacts</h4>
            <ul className="space-y-2 leading-relaxed">
              <li>WhatsApp Direct Chat:</li>
              <li className="font-semibold text-white font-mono">+254 114 590 693</li>
              <li>General Inquiries:</li>
              <li className="font-semibold text-white truncate">concierge@kavatas-kitchen.com</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* OVERLAY DRAWERS & MODALS WIDGETS */}
      
      {/* 1. Global Shopping Bag Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* 2. Sleek Geolocation Checkout */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderCompleted={() => {
          setCheckoutOpen(false);
          setTrackerOpen(true);
        }}
      />

      {/* 3. AI Concierge Advisor Chat widget */}
      <AIChatbot
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onExploreMenu={() => {
          setChatOpen(false);
          scrollToSection('menu');
        }}
      />

      {/* 4. Live Chef Administration Console */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* 5. Luxury Favorites Vault */}
      <FavoritesModal
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
      />

      {/* 6. Gourmet Progress Tracker */}
      <OrderTracker
        isOpen={trackerOpen}
        onClose={() => setTrackerOpen(false)}
      />

      {/* WhatsApp Fixed Concierge shortcut button */}
      <div className="fixed bottom-6 left-6 z-40 select-none">
        <a
          href="https://wa.me/254114590693?text=Hello%20Chef%20Kavata%2C%20I'm%20visiting%20your%20Kitchen%20gourmet%20platform!"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl shadow-[#25D366]/20 hover:scale-105 hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 relative group cursor-pointer"
          title="Instant WhatsApp Consultation"
        >
          <MessageCircle className="w-6 h-6 fill-current text-white" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white" />
        </a>
      </div>

      {/* Floating Order tracking widget shortcut if activeOrder exists */}
      <div className="fixed bottom-6 right-24 z-40 select-none hidden sm:block">
        <button
          onClick={() => setTrackerOpen(true)}
          className="py-3 px-5 rounded-full bg-[#FF6F3D] border border-transparent text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-xl shadow-[#FF6F3D]/20 cursor-pointer flex items-center gap-1.5 animate-pulse"
        >
          <Clock className="w-4 h-4 animate-spin-slow" /> Live Tracking
        </button>
      </div>

    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <LandingPageContent />
    </AppProvider>
  );
}
