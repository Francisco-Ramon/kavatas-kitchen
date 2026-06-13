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
    <div className="group relative rounded-2xl sm:rounded-3xl bg-[#18181A]/50 border border-white/5 p-3 sm:p-4 flex flex-col justify-between hover:bg-[#18181A]/80 hover:border-[#DFB15B]/30 hover:shadow-2xl hover:shadow-[#DFB15B]/5 transition-all duration-500 overflow-hidden backdrop-blur-md">
      {/* Glow highlight spot on hover */}
      <span className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#DFB15B]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Meal Image Wrapper */}
      <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5 bg-zinc-900 shadow-md">
        <img
          src={meal.imageUrl}
          alt={meal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Category Overlay tag */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#0B0B0C]/80 backdrop-blur-md text-[#DFB15B] text-[8px] sm:text-[9px] uppercase tracking-widest font-bold py-1 px-2 sm:py-1.5 sm:px-3 rounded-full border border-white/5">
          {meal.category}
        </span>

        {/* Offer Tag */}
        {meal.offerText && (
          <span className="absolute top-2 left-2 translate-y-6 sm:top-3 sm:left-3 sm:translate-y-7 bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] text-[8px] sm:text-[9px] uppercase tracking-widest font-black py-1 px-1.5 sm:py-1.5 sm:px-2.5 rounded-md shadow-lg shadow-[#FF6F3D]/25 animate-pulse">
            🔥 {meal.offerText}
          </span>
        )}

        {/* Favorite Heart Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(meal.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full backdrop-blur-md transition-all duration-300 border cursor-pointer ${
            favorite
              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105'
              : 'bg-[#0B0B0C]/60 border-white/5 text-white/80 hover:text-red-500 hover:bg-[#0B0B0C]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Delivery / Preparation Time Tag */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 bg-[#0B0B0C]/70 backdrop-blur-sm text-white/90 text-[8px] sm:text-[10px] py-0.5 px-1.5 sm:py-1 sm:px-2.5 rounded-lg font-medium">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DFB15B]" />
          <span>{meal.preparationTime}</span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title & Rating row */}
          <div className="flex justify-between items-start gap-1 sm:gap-2 mb-1 sm:mb-2">
            <h3 className="font-serif text-xs sm:text-base md:text-lg font-bold text-white group-hover:text-[#DFB15B] transition-colors duration-300 line-clamp-1 sm:line-clamp-2">
              {meal.title}
            </h3>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] font-bold text-[#DFB15B] bg-[#DFB15B]/5 border border-[#DFB15B]/10 py-0.5 px-1 sm:py-1 sm:px-2 rounded-md sm:rounded-lg flex-shrink-0">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-[#DFB15B]" />
              <span>{meal.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Luxury descriptive text (hidden on mobile to make cards smaller) */}
          <p className="hidden md:line-clamp-2 text-xs text-white/50 leading-relaxed font-sans mb-4 group-hover:text-white/60 transition-colors duration-300">
            {meal.description}
          </p>

          {/* Ingredient preview list tags (hidden on mobile to make cards smaller) */}
          <div className="hidden md:flex flex-wrap gap-1.5 mb-5">
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
        <div className="flex items-center justify-between border-t border-white/5 pt-2.5 sm:pt-4">
          <div>
            <p className="text-[8px] sm:text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-0.5">Price KES</p>
            {meal.discountPriceKES ? (
              <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                <p className="text-xs sm:text-base md:text-lg font-serif font-black text-[#DFB15B]">
                  KES {meal.discountPriceKES.toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[11px] line-through text-white/30 font-serif">
                  KES {meal.priceKES.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-xs sm:text-base md:text-lg font-serif font-black text-white">
                KES {meal.priceKES.toLocaleString()}
              </p>
            )}
          </div>

          <button
            onClick={() => addToCart(meal)}
            className="p-1.5 sm:p-3 bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-[#FF6F3D] hover:to-[#DFB15B] text-white hover:text-[#0B0B0C] hover:border-transparent hover:scale-105 active:scale-95 transition-all duration-300 rounded-xl sm:rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-[#FF6F3D]/20 group/btn"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-6 transition-transform" />
            <span className="hidden sm:inline text-[9px] sm:text-[10px] uppercase tracking-wider font-bold">Add to Bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
