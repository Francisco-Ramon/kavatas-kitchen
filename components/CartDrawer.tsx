'use client';

import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Lightbulb } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, meals } = useAppContext();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.meal.discountPriceKES || item.meal.priceKES) * item.quantity, 0);
  const delivery = subtotal > 2000 ? 0 : 250;
  const total = subtotal + delivery;

  // Simple Smart Recommendation Engine:
  // Suggest the most popular Kenyan heritage meal or drink that is not currently in the cart
  const cartIds = cart.map((item) => item.meal.id);
  const recommendations = meals
    .filter((m) => !cartIds.includes(m.id))
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none animate-fade-in">
      {/* Background Dim Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Slide-in cart container */}
        <div className="w-screen max-w-md bg-[#0B0B0C] border-l border-white/5 shadow-2xl flex flex-col justify-between animate-slide-in">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#DFB15B]" />
              <h2 className="text-lg font-serif font-bold text-white">Your Gourmet Bag</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {cart.length === 0 ? (
              /* Empty Bag State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-5 border border-white/10">
                  <ShoppingBag className="w-7 h-7 text-white/30" />
                </div>
                <h3 className="font-serif text-white text-lg font-bold mb-2">Your Bag is Empty</h3>
                <p className="text-xs text-white/40 leading-relaxed max-w-xs mb-8">
                  Indulge in our exquisite Kenyan culinary creations. Add a handcrafted masterpiece to begin.
                </p>
                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                >
                  Explore Masterpieces
                </button>
              </div>
            ) : (
              /* Cart Item List */
              <div className="space-y-4">
                {cart.map((item) => (
                  <div 
                    key={item.meal.id}
                    className="group relative rounded-2xl bg-white/5 border border-white/5 p-4 flex gap-4 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 overflow-hidden"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-900 shadow-md flex-shrink-0">
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
            )}

            {/* Smart Concierge Suggestions Section (Dynamic AI Engine suggestion) */}
            {recommendations.length > 0 && (
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#DFB15B] font-bold">
                  <Lightbulb className="w-4 h-4 text-[#DFB15B] animate-pulse" />
                  <span>AI Chef Suggestions</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {recommendations.map((meal) => (
                    <div 
                      key={meal.id}
                      className="rounded-2xl bg-white/5 border border-white/5 p-3 flex flex-col justify-between hover:border-[#DFB15B]/30 transition-all duration-300"
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-zinc-950">
                        <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
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

          {/* Pricing totals & checkout buttons (only shown if cart has items) */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-[#18181A]/40 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Bag Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>Insulated Delivery</span>
                  <span>{delivery === 0 ? <span className="text-green-400 font-bold">FREE</span> : `KES ${delivery}`}</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-white/5">
                  <span className="text-sm font-bold text-white">Grand Total</span>
                  <span className="text-xl font-serif font-black text-[#DFB15B]">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenCheckout}
                className="w-full py-4.5 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#FF6F3D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
