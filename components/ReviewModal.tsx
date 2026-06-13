'use client';

import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { X, Star, Send, CheckCircle, Smile } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  orderId: string;
  customerName: string;
  onClose: () => void;
}

const REVIEW_CATEGORIES = [
  { label: 'Delicious 😋', value: 'Delicious 😋' },
  { label: 'Fast Delivery 🚀', value: 'Fast Delivery 🚀' },
  { label: 'Friendly Service ❤️', value: 'Friendly Service ❤️' },
  { label: 'Fresh Food 🌿', value: 'Fresh Food 🌿' },
];

export default function ReviewModal({ isOpen, orderId, customerName, onClose }: ReviewModalProps) {
  const { submitReview } = useAppContext();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('Delicious 😋');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitReview({
      orderId,
      customerName,
      rating,
      comment,
      category,
      isPublic: true,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div onClick={onClose} className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-md" />

      <div className="relative w-full max-w-md bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl z-10 overflow-hidden">
        {/* Decorative gold glow top strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[#FF6F3D] via-[#DFB15B] to-[#FF6F3D]" />

        {!submitted ? (
          <>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-white">Share Your Experience 🌟</h2>
                <p className="text-[10px] text-[#DFB15B] font-semibold uppercase tracking-widest mt-0.5">
                  Your order has been paid & confirmed!
                </p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white cursor-pointer transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
              {/* Star Rating */}
              <div className="text-center space-y-3">
                <p className="text-xs uppercase tracking-wider text-white/50 font-bold">How was your meal?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#DFB15B] text-[#DFB15B]'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm font-serif font-bold text-white/80">
                  {rating === 5 ? 'Absolutely Outstanding! 🏆' :
                   rating === 4 ? 'Really Good! 😊' :
                   rating === 3 ? 'Pretty Good 👍' :
                   rating === 2 ? 'Needs Improvement 🤔' : 'Not Great 😕'}
                </p>
              </div>

              {/* Category chips */}
              <div className="space-y-2">
                <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Best describes your experience:</p>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`py-2 px-4 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                        category === cat.value
                          ? 'bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] border-transparent text-[#0B0B0C]'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Your Review</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the taste, freshness, speed of delivery and overall experience…"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all resize-none placeholder:text-white/20"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#DFB15B]/5 border border-[#DFB15B]/10 text-[10px] text-[#DFB15B]/80 font-semibold flex items-center gap-2">
                <Smile className="w-3.5 h-3.5 flex-shrink-0" />
                Positive reviews are published publicly. Constructive feedback is privately reviewed by Chef Kavata to improve our service.
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF6F3D]/10"
              >
                <Send className="w-4 h-4" /> Submit My Review
              </button>
            </form>
          </>
        ) : (
          /* ── Success Screen ── */
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center shadow-2xl shadow-[#FF6F3D]/20 animate-bounce">
              <CheckCircle className="w-10 h-10 text-[#0B0B0C]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold text-white">Asante Sana! 🙏</h3>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                Thank you {customerName.split(' ')[0]}! Your review has been submitted and helps us continue crafting premium Kenyan experiences.
              </p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#DFB15B] text-[#DFB15B]" />
              ))}
            </div>
            <button
              onClick={onClose}
              className="py-3 px-8 rounded-full bg-white/5 border border-white/10 text-white text-xs uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
