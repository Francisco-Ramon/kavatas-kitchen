'use client';

import React from 'react';
import { useAppContext } from '../../lib/AppContext';
import { useUI } from '../../lib/UIContext';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function BagPage() {
  const { cart, removeFromCart, updateQuantity, meals } = useAppContext();
  const { setCheckoutOpen } = useUI();

  const subtotal = cart.reduce((sum, item) => sum + (item.meal.discountPriceKES || item.meal.priceKES) * item.quantity, 0);
  const delivery = subtotal > 2000 ? 0 : 250;
  const total = subtotal + delivery;

  // Simple Smart Recommendation Engine:
  // Suggest the most popular Kenyan heritage meal or drink that is not currently in the cart
  const cartIds = cart.map((item) => item.meal.id);
  const recommendations = meals
    .filter((m) => !cartIds.includes(m.id))
    .slice(0, 3);

  return (
    <div className="bg-[#0B0B0C] text-white min-h-screen font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-4xl bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl p-6 md:p-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-6">
          <ShoppingBag className="w-6 h-6 text-[#DFB15B]" />
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white">Your Gourmet Bag</h2>
        </div>

        {cart.length === 0 ? (
          /* Empty Bag State */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
              <ShoppingBag className="w-9 h-9 text-white/20" />
            </div>
            <div>
              <h3 className="font-serif text-white text-lg font-bold">Your Bag is Empty</h3>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs mt-1">
                Indulge in our exquisite Kenyan culinary creations. Add a handcrafted masterpiece to begin.
              </p>
            </div>
            <Link
              href="/menu"
              className="py-3.5 px-8 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-[#FF6F3D]/25"
            >
              Explore Masterpieces
            </Link>
          </div>
        ) : (
          /* Spacious 2-Column Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart items & Recommendations */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.meal.id}
                    className="group relative rounded-2xl bg-white/5 border border-white/5 p-4 flex gap-4 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 overflow-hidden"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 shadow-md flex-shrink-0 border border-white/5">
                      <img src={item.meal.imageUrl} alt={item.meal.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif text-sm font-bold text-white group-hover:text-[#DFB15B] transition-colors leading-tight">
                            {item.meal.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.meal.id)}
                            className="text-white/30 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{item.meal.category}</p>
                      </div>

                      {/* Control quantity row */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.meal.id, item.quantity - 1)}
                            className="text-white/60 hover:text-[#DFB15B] p-1 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.meal.id, item.quantity + 1)}
                            className="text-white/60 hover:text-[#FF6F3D] p-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-serif font-black text-white">
                          KES {((item.meal.discountPriceKES || item.meal.priceKES) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="border-t border-white/5 pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#DFB15B] font-bold">
                    <Lightbulb className="w-4 h-4 text-[#DFB15B] animate-pulse" />
                    <span>AI Chef Suggestions</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {recommendations.map((meal) => (
                      <div 
                        key={meal.id}
                        className="rounded-2xl bg-white/5 border border-white/5 p-3 flex flex-col justify-between hover:border-[#DFB15B]/30 transition-all duration-300"
                      >
                        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-zinc-950 border border-white/5">
                          <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-serif text-xs font-bold text-white leading-tight truncate mb-1">{meal.title}</h5>
                          <p className="text-[10px] font-serif font-semibold text-white/70">
                            {meal.discountPriceKES ? (
                              <span className="flex gap-1 items-center">
                                <span className="text-[#DFB15B]">KES {meal.discountPriceKES}</span>
                                <span className="line-through text-white/30 text-[8px]">KES {meal.priceKES}</span>
                              </span>
                            ) : (
                              `KES ${meal.priceKES}`
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => updateQuantity(meal.id, 1)}
                          className="w-full mt-2.5 py-1.5 bg-white/5 hover:bg-[#DFB15B] hover:text-[#0B0B0C] border border-white/10 hover:border-transparent text-white text-[9px] uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Pricing totals & Checkout */}
            <div className="lg:col-span-4 p-6 rounded-2xl border border-white/5 bg-[#18181A]/40 space-y-6">
              <h3 className="font-serif text-base font-bold text-white border-b border-white/5 pb-3">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-white/55">
                  <span>Bag Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-white/55">
                  <span>Insulated Delivery</span>
                  <span>{delivery === 0 ? <span className="text-green-400 font-bold">FREE</span> : `KES ${delivery}`}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-white/5">
                  <span className="text-sm font-bold text-white">Grand Total</span>
                  <span className="text-xl font-serif font-black text-[#DFB15B]">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full py-4.5 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#FF6F3D]/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-white/30 text-center leading-relaxed">
                Insulated luxury shipping guaranteed. Orders are personally checked and curated before dispatch.
              </p>
            </div>

          </div>
        )}
        
      </div>
    </div>
  );
}
