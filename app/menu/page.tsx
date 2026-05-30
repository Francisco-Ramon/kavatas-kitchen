'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../lib/AppContext';
import { CATEGORIES } from '../../lib/data';
import MealCard from '../../components/MealCard';
import { Utensils } from 'lucide-react';

export default function MenuPage() {
  const { meals, mealsLoading } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter meals based on selected category tab
  const filteredMeals = selectedCategory === 'all'
    ? meals
    : meals.filter((meal) => meal.category === selectedCategory);

  return (
    <div className="bg-[#0B0B0C] text-white min-h-screen font-sans">
      <section className="py-12 max-w-7xl mx-auto px-6 space-y-12 select-none">
        
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
    </div>
  );
}
