'use client';

import React from 'react';
import { useAppContext } from '../../lib/AppContext';
import { TESTIMONIALS } from '../../lib/data';
import { Star, CheckCircle } from 'lucide-react';

export default function ReviewsPage() {
  const { publicReviews } = useAppContext();

  return (
    <div className="bg-[#0B0B0C] text-white min-h-screen font-sans">
      
      {/* SECTION 3: LIVE CUSTOMER REVIEWS */}
      <section className="py-12 max-w-7xl mx-auto px-6 space-y-12 select-none">
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
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex gap-1 text-[#DFB15B]">
                    {[...Array(item.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold py-1 px-3 bg-white/5 rounded-full border border-white/5 text-[#DFB15B]">
                      {item.category}
                    </span>
                    {isLive && (
                      <span className="text-[8px] uppercase tracking-wider font-bold py-0.5 px-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center gap-0.5 whitespace-nowrap">
                        <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
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

    </div>
  );
}
