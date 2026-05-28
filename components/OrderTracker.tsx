'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../lib/AppContext';
import { X, Check, Clock, ShieldCheck, MapPin, Truck, BadgeCheck, Star } from 'lucide-react';
import ReviewModal from './ReviewModal';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATUSES = [
  { name: 'Received', desc: 'Order transmitted to Chef Kavata', icon: Clock },
  { name: 'Preparing', desc: 'Cooking with fresh, organic Kenyan ingredients', icon: ShieldCheck },
  { name: 'On the Way', desc: 'Personal thermal delivery in transit', icon: Truck },
  { name: 'Delivered', desc: 'Your luxury feast has arrived!', icon: MapPin },
];

export default function OrderTracker({ isOpen, onClose }: OrderTrackerProps) {
  const { activeOrder } = useAppContext();
  const [reviewOpen, setReviewOpen] = useState(false);

  // Auto-open review prompt when order becomes paid & not yet reviewed
  useEffect(() => {
    if (activeOrder?.isPaid && !activeOrder?.hasReview && isOpen) {
      const timer = setTimeout(() => setReviewOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [activeOrder?.isPaid, activeOrder?.hasReview, isOpen]);

  if (!isOpen) return null;

  const getActiveIndex = () => {
    if (!activeOrder) return 0;
    const map: Record<string, number> = { Received: 0, Preparing: 1, 'On the Way': 2, Delivered: 3 };
    return map[activeOrder.status] ?? 0;
  };
  const activeIndex = getActiveIndex();

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
        <div onClick={onClose} className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-md" />

        <div className="relative w-full max-w-md bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden">

          {/* Gold accent strip */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FF6F3D] via-[#DFB15B] to-[#FF6F3D]" />

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-white">Gourmet Order Tracker</h3>
              {activeOrder && (
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[9px] text-[#DFB15B] font-bold uppercase tracking-wider">Order #{activeOrder.id}</p>
                  {/* Payment status inline badge */}
                  {activeOrder.isPaid ? (
                    <span className="text-[8px] font-bold uppercase tracking-widest py-0.5 px-2 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/30 flex items-center gap-0.5">
                      <BadgeCheck className="w-2.5 h-2.5" /> Paid via M-Pesa
                    </span>
                  ) : (
                    <span className="text-[8px] font-bold uppercase tracking-widest py-0.5 px-2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Payment Pending
                    </span>
                  )}
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/5 text-white/50 hover:text-white cursor-pointer transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {!activeOrder ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Truck className="w-10 h-10 text-white/15 mb-3" />
                <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                  No active orders yet. Place a premium gourmet order to begin real-time tracking!
                </p>
              </div>
            ) : (
              <div className="space-y-6">

                {/* Timeline */}
                <div className="relative pl-9 space-y-8 py-2">
                  {/* Background connector line */}
                  <span className="absolute top-3 left-3 bottom-3 w-[2px] bg-white/5" />
                  {/* Filled progress line */}
                  <span
                    className="absolute top-3 left-3 w-[2px] bg-gradient-to-b from-[#FF6F3D] to-[#DFB15B] transition-all duration-700"
                    style={{ height: `${Math.min((activeIndex / 3) * 100, 100)}%` }}
                  />

                  {STATUSES.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    return (
                      <div key={step.name} className="relative flex gap-4 items-start">
                        <div className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
                          isCompleted ? 'bg-gradient-to-br from-[#FF6F3D] to-[#DFB15B] border-transparent text-[#0B0B0C]'
                          : isActive ? 'bg-[#0B0B0C] border-[#DFB15B] text-[#DFB15B] shadow-lg shadow-[#DFB15B]/20 scale-110'
                          : 'bg-[#0C0C0E] border-white/10 text-white/20'
                        }`}>
                          {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3 h-3" />}
                        </div>
                        <div>
                          <h4 className={`text-sm font-serif font-bold ${isActive ? 'text-[#DFB15B]' : isCompleted ? 'text-white' : 'text-white/30'}`}>{step.name}</h4>
                          <p className={`text-xs mt-0.5 leading-relaxed ${isActive ? 'text-white/70' : isCompleted ? 'text-white/40' : 'text-white/15'}`}>{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paid status card */}
                {activeOrder.isPaid ? (
                  <div className="rounded-2xl bg-[#DFB15B]/5 border border-[#DFB15B]/20 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-5 h-5 text-[#DFB15B]" />
                      <p className="text-sm font-bold text-white">Payment Confirmed ✓</p>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Amount Paid</span>
                      <span className="font-serif font-bold text-[#DFB15B]">KES {activeOrder.total.toLocaleString()}</span>
                    </div>
                    {activeOrder.mpesaRef && (
                      <div className="flex justify-between text-xs text-white/60">
                        <span>M-Pesa Reference</span>
                        <span className="font-mono font-bold text-white">{activeOrder.mpesaRef}</span>
                      </div>
                    )}
                    {activeOrder.paidAt && (
                      <div className="flex justify-between text-xs text-white/60">
                        <span>Paid At</span>
                        <span className="text-white">{activeOrder.paidAt}</span>
                      </div>
                    )}
                    {/* Prompt to review if not yet done */}
                    {!activeOrder.hasReview && (
                      <button
                        onClick={() => setReviewOpen(true)}
                        className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF6F3D]/10"
                      >
                        <Star className="w-4 h-4 fill-current" /> Leave a Review
                      </button>
                    )}
                    {activeOrder.hasReview && (
                      <p className="text-center text-[10px] text-green-400 font-bold flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" /> Review submitted — Asante Sana! 🙏
                      </p>
                    )}
                  </div>
                ) : (
                  /* Pending payment card */
                  <div className="rounded-2xl bg-orange-500/5 border border-orange-500/20 p-4 space-y-2">
                    <p className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 animate-pulse" /> Awaiting Payment Confirmation
                    </p>
                    <p className="text-[10px] text-white/40 leading-relaxed">
                      Send your M-Pesa payment to Chef Kavata's number. Once confirmed, this tracker will update to <span className="text-[#DFB15B] font-bold">Paid</span> automatically.
                    </p>
                    <a
                      href={`https://wa.me/254114590693?text=Hello%20Kavata's%20Kitchen%2C%20I've%20sent%20M-Pesa%20for%20Order%20%23${activeOrder.id}%20(KES%20${activeOrder.total.toLocaleString()})`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] text-[#25D366] font-bold uppercase tracking-wider border border-[#25D366]/20 bg-[#25D366]/10 py-2 px-4 rounded-xl transition-all hover:bg-[#25D366]/20 cursor-pointer"
                    >
                      Confirm via WhatsApp →
                    </a>
                  </div>
                )}

                {/* WhatsApp contact */}
                <a
                  href={`https://wa.me/254114590693?text=Hello%2C%20tracking%20Order%20%23${activeOrder.id}`}
                  target="_blank" rel="noreferrer"
                  className="w-full py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-bold text-[10px] uppercase tracking-wider border border-[#25D366]/20 transition-all rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Chat with Chef Kavata on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review modal — triggered when paid */}
      {activeOrder && (
        <ReviewModal
          isOpen={reviewOpen}
          orderId={activeOrder.id}
          customerName={activeOrder.customer.name}
          onClose={() => setReviewOpen(false)}
        />
      )}
    </>
  );
}
