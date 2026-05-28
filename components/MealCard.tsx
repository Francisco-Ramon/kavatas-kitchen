'use client';

import React from 'react';
import { Meal } from '../lib/data';
import { useAppContext } from '../lib/AppContext';
import { Heart, Star, ShoppingBag, Clock } from 'lucide-react';

interface MealCardProps {
  meal: Meal;
}

export default function MealCard({ meal }: MealCardProps) {
  const { addToCart, toggleFavorite, isFavorite } = useAppContext();
  const favorite = isFavorite(meal.id);

  return (
    <div className="group relative rounded-3xl bg-[#18181A]/50 border border-white/5 p-4 flex flex-col justify-between hover:bg-[#18181A]/80 hover:border-[#DFB15B]/30 hover:shadow-2xl hover:shadow-[#DFB15B]/5 transition-all duration-500 overflow-hidden backdrop-blur-md">
      {/* Glow highlight spot on hover */}
      <span className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#DFB15B]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Meal Image Wrapper */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-zinc-900 shadow-md">
        <img
          src={meal.imageUrl}
          alt={meal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Category Overlay tag */}
        <span className="absolute top-3 left-3 bg-[#0B0B0C]/80 backdrop-blur-md text-[#DFB15B] text-[9px] uppercase tracking-widest font-bold py-1.5 px-3 rounded-full border border-white/5">
          {meal.category}
        </span>

        {/* Offer Tag */}
        {meal.offerText && (
          <span className="absolute top-3 left-3 translate-y-7 bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] text-[9px] uppercase tracking-widest font-black py-1.5 px-2.5 rounded-md shadow-lg shadow-[#FF6F3D]/25 animate-pulse">
            🔥 {meal.offerText}
          </span>
        )}

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(meal.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 border cursor-pointer ${
            favorite
              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105'
              : 'bg-[#0B0B0C]/60 border-white/5 text-white/80 hover:text-red-500 hover:bg-[#0B0B0C]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Delivery / Preparation Time Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#0B0B0C]/70 backdrop-blur-sm text-white/90 text-[10px] py-1 px-2.5 rounded-lg font-medium">
          <Clock className="w-3 h-3 text-[#DFB15B]" />
          <span>{meal.preparationTime}</span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title & Rating row */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#DFB15B] transition-colors duration-300">
              {meal.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#DFB15B] bg-[#DFB15B]/5 border border-[#DFB15B]/10 py-1 px-2 rounded-lg">
              <Star className="w-3 h-3 fill-current text-[#DFB15B]" />
              <span>{meal.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Luxury descriptive text */}
          <p className="text-xs text-white/50 leading-relaxed font-sans mb-4 group-hover:text-white/60 transition-colors duration-300 line-clamp-2">
            {meal.description}
          </p>

          {/* Ingredient preview list tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {meal.ingredients.slice(0, 3).map((ing) => (
              <span
                key={ing}
                className="text-[9px] text-white/40 bg-white/5 border border-white/5 py-0.5 px-2 rounded-md uppercase tracking-wider"
              >
                {ing}
              </span>
            ))}
            {meal.ingredients.length > 3 && (
              <span className="text-[9px] text-[#DFB15B]/50 bg-white/5 py-0.5 px-1.5 rounded-md font-semibold">
                +{meal.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Button Footer row */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-0.5">Price KES</p>
            {meal.discountPriceKES ? (
              <div className="flex items-baseline gap-1.5">
                <p className="text-lg font-serif font-black text-[#DFB15B]">
                  KES {meal.discountPriceKES.toLocaleString()}
                </p>
                <p className="text-[11px] line-through text-white/30 font-serif">
                  KES {meal.priceKES.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-lg font-serif font-black text-white">
                KES {meal.priceKES.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={() => addToCart(meal)}
            className="p-3 bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-[#FF6F3D] hover:to-[#DFB15B] text-white hover:text-[#0B0B0C] hover:border-transparent hover:scale-105 active:scale-95 transition-all duration-300 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[#FF6F3D]/20 group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:rotate-6 transition-transform" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
