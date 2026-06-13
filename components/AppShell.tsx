'use client';

import React from 'react';
import { useUI } from '../lib/UIContext';
import { useAppContext } from '../lib/AppContext';
import NavBar from './NavBar';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import AIChatbot from './AIChatbot';
import AdminDashboard from './AdminDashboard';
import FavoritesModal from './FavoritesModal';
import OrderTracker from './OrderTracker';
import { MessageCircle, Clock, Utensils } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const {
    cartOpen, setCartOpen,
    favOpen, setFavOpen,
    chatOpen, setChatOpen,
    adminOpen, setAdminOpen,
    trackerOpen, setTrackerOpen,
    checkoutOpen, setCheckoutOpen
  } = useUI();

  const { activeOrder } = useAppContext();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white flex flex-col font-sans overflow-x-hidden selection:bg-[#DFB15B] selection:text-[#0B0B0C]">
      {/* Shared NavBar */}
      <NavBar />

      {/* Main content page area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="py-16 bg-[#09090A] border-t border-white/5 select-none font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-xs text-white/50">
          
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
        }}
      />

      {/* 4. Live Chef Administration Console */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* 5. Luxury Favorites Vault */}
      <FavoritesModal
        isOpen={favOpen}
        onClose={() => setFavOpen(false)}
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
      {activeOrder && (
        <div className="fixed bottom-6 right-6 sm:right-24 z-40 select-none">
          <button
            onClick={() => setTrackerOpen(true)}
            className="py-3 px-5 rounded-full bg-[#FF6F3D] border border-transparent text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-xl shadow-[#FF6F3D]/20 cursor-pointer flex items-center gap-1.5 animate-pulse"
          >
            <Clock className="w-4 h-4 animate-spin-slow" /> Live Tracking
          </button>
        </div>
      )}
    </div>
  );
}
