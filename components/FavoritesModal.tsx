'use client';

import React from 'react';
import { useAppContext } from '../lib/AppContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const { favorites, meals, toggleFavorite, addToCart } = useAppContext();

  if (!isOpen) return null;

  const favoriteMeals = meals.filter((meal) => favorites.includes(meal.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans flex items-center justify-center p-4 animate-fade-in">
      {/* Background Dim Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-md"
      />

      {/* Favorites panel */}
      <div className="relative w-full max-w-md bg-[#0C0C0E]/95 border border-white/5 rounded-3xl p-4 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <h3 className="font-serif text-lg font-bold text-white">Your Saved Masterpieces</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content feed */}
        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin">
          {favoriteMeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Heart className="w-10 h-10 text-white/15 mb-3" />
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Your luxury favorites vault is currently empty. Toggle the heart button on meals to save them.
              </p>
            </div>
          ) : (
            favoriteMeals.map((meal) => (
              <div 
                key={meal.id}
                className="rounded-2xl bg-white/5 border border-white/5 p-3.5 flex gap-3.5 items-center justify-between hover:bg-white/[0.08] transition-all"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                    <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xs font-bold text-white leading-tight truncate max-w-[150px]">{meal.title}</h4>
                    <p className="text-[9px] text-[#DFB15B] uppercase tracking-wider font-semibold mt-0.5">{meal.category}</p>
                    <p className="text-xs font-serif font-black text-white/80 mt-1">KES {meal.priceKES.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Quick Add */}
                  <button
                    onClick={() => {
                      addToCart(meal);
                    }}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] hover:opacity-90 transition-all cursor-pointer"
                    title="Add to Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                  {/* Delete from favorites */}
                  <button
                    onClick={() => {
                      toggleFavorite(meal.id);
                    }}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-500 hover:bg-white/10 transition-all cursor-pointer"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
