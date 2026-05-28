'use client';

import React, { useState } from 'react';
import { useAppContext } from '../lib/AppContext';
import { X, Send, MapPin, Loader2, Navigation, CheckCircle, User, UserPlus, UserCheck, Eye, EyeOff, LogIn } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: () => void;
}

type AuthMode = 'guest' | 'login' | 'register';

export default function CheckoutModal({ isOpen, onClose, onOrderCompleted }: CheckoutModalProps) {
  const { cart, placeOrder, currentUser, createAccount, loginAccount } = useAppContext();

  // ── Auth flow
  const [authMode, setAuthMode] = useState<AuthMode>(currentUser ? 'guest' : 'guest');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // ── Delivery form
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [gps, setGps] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Steps: 1=auth, 2=delivery
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.meal.discountPriceKES || item.meal.priceKES) * item.quantity, 0);
  const delivery = total > 2000 ? 0 : 250;
  const grandTotal = total + delivery;

  // ── Auth actions
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(''); setAuthSuccess('');
    if (authMode === 'register') {
      const ok = createAccount(authName, authEmail, authPhone, authPassword);
      if (!ok) { setAuthError('An account with this email already exists.'); return; }
      setAuthSuccess('Account created! Proceeding to delivery details…');
      setName(authName); setPhone(authPhone);
      setTimeout(() => setStep(2), 1200);
    } else if (authMode === 'login') {
      const ok = loginAccount(authEmail, authPassword);
      if (!ok) { setAuthError('Invalid email or password. Please try again.'); return; }
      setAuthSuccess('Welcome back! Proceeding to delivery details…');
      setTimeout(() => setStep(2), 1200);
    }
  };

  const handleContinueAsGuest = () => setStep(2);

  // ── GPS
  const handleDetectGPS = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          setGps(link); setDetectingGps(false); setGpsSuccess(true);
        },
        () => {
          const link = `https://www.google.com/maps?q=-1.2921,36.8219`;
          setGps(link); setDetectingGps(false); setGpsSuccess(true);
        },
        { timeout: 8000 }
      );
    } else {
      setTimeout(() => {
        setGps('https://www.google.com/maps?q=-1.2921,36.8219');
        setDetectingGps(false); setGpsSuccess(true);
      }, 1000);
    }
  };

  // ── Submit order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) return;
    setSubmitting(true);
    setTimeout(() => {
      const { whatsappUrl } = placeOrder({
        name, phone, address, gps, notes,
        isGuest: !currentUser,
        userId: currentUser?.id,
      });
      setSubmitting(false);
      onClose(); onOrderCompleted();
      window.open(whatsappUrl, '_blank');
    }, 1800);
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div onClick={onClose} className="absolute inset-0 bg-[#0B0B0C]/90 backdrop-blur-md" />

      <div className="relative w-full max-w-lg bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl z-10 overflow-y-auto max-h-[92vh] scrollbar-none">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-white">Exclusive Checkout</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-bold uppercase tracking-widest py-0.5 px-2 rounded-full ${step === 1 ? 'bg-[#FF6F3D] text-[#0B0B0C]' : 'bg-white/10 text-white/40'}`}>1 Account</span>
              <span className="text-white/20 text-xs">→</span>
              <span className={`text-[9px] font-bold uppercase tracking-widest py-0.5 px-2 rounded-full ${step === 2 ? 'bg-[#FF6F3D] text-[#0B0B0C]' : 'bg-white/10 text-white/40'}`}>2 Delivery</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ──── STEP 1: AUTH ──── */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            {currentUser ? (
              /* Already logged in */
              <div className="p-5 rounded-2xl bg-[#DFB15B]/5 border border-[#DFB15B]/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C] font-serif font-black text-lg">
                  {currentUser.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Welcome back, {currentUser.name}!</p>
                  <p className="text-[10px] text-white/50">{currentUser.email}</p>
                </div>
                <UserCheck className="w-5 h-5 text-[#DFB15B] ml-auto" />
              </div>
            ) : (
              /* Auth toggle tabs */
              <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
                {(['guest', 'login', 'register'] as AuthMode[]).map((m) => (
                  <button key={m} onClick={() => { setAuthMode(m); setAuthError(''); setAuthSuccess(''); }}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${authMode === m ? 'bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C]' : 'text-white/50 hover:text-white'}`}>
                    {m === 'guest' ? '🏃 Guest' : m === 'login' ? '🔑 Login' : '✨ Register'}
                  </button>
                ))}
              </div>
            )}

            {/* Guest mode — just continue */}
            {!currentUser && authMode === 'guest' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-2">
                  <User className="w-8 h-8 text-white/30 mx-auto" />
                  <p className="text-sm font-serif font-bold text-white">Order Without an Account</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    No sign-up required. Fill in your delivery details on the next step and your order goes straight to Chef Kavata. Quick and easy!
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#DFB15B]/5 border border-[#DFB15B]/10 text-[10px] text-[#DFB15B] font-semibold flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5" />
                  Create an account to track orders & earn loyalty rewards in the future!
                </div>
                <button onClick={handleContinueAsGuest}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF6F3D]/10">
                  Continue as Guest →
                </button>
              </div>
            )}

            {/* Login form */}
            {!currentUser && authMode === 'login' && (
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Email Address</label>
                  <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 pr-12 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {authError && <p className="text-xs text-red-400 font-semibold">{authError}</p>}
                {authSuccess && <p className="text-xs text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{authSuccess}</p>}
                <button type="submit" className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" /> Sign In & Continue
                </button>
              </form>
            )}

            {/* Register form */}
            {!currentUser && authMode === 'register' && (
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Full Name</label>
                    <input type="text" required value={authName} onChange={e => setAuthName(e.target.value)} placeholder="e.g. Wanjiku Kamau"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Phone</label>
                    <input type="tel" required value={authPhone} onChange={e => setAuthPhone(e.target.value)} placeholder="0712 345 678"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Email Address</label>
                  <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Create a password"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 pr-12 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {authError && <p className="text-xs text-red-400 font-semibold">{authError}</p>}
                {authSuccess && <p className="text-xs text-green-400 font-semibold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{authSuccess}</p>}
                <button type="submit" className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /> Create Account & Continue
                </button>
              </form>
            )}

            {/* If already logged in, go to step 2 */}
            {currentUser && (
              <button onClick={() => setStep(2)}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2">
                Continue to Delivery →
              </button>
            )}
          </div>
        )}

        {/* ──── STEP 2: DELIVERY ──── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <p className="text-[10px] text-white/40 leading-relaxed">
              Fill your delivery details below. Chef Kavata personally prepares and delivers your order.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Full Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Phone (M-Pesa)</label>
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712 345 678"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Delivery Address</label>
              <input type="text" required value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. Westlands, Apt 4B, Nairobi"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" />
            </div>

            {/* GPS Widget */}
            <div className="bg-[#18181A]/60 border border-white/5 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#DFB15B]" /> Precise GPS Pin</h4>
                  <p className="text-[9px] text-white/30">Allows Chef Kavata to navigate directly to your door</p>
                </div>
                <button type="button" onClick={handleDetectGPS} disabled={detectingGps}
                  className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#DFB15B] hover:text-[#DFB15B] text-[10px] uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                  {detectingGps ? <><Loader2 className="w-3 h-3 animate-spin" /> Detecting…</> : gpsSuccess ? <><CheckCircle className="w-3 h-3 text-green-400" /> Pinned!</> : <><Navigation className="w-3 h-3" /> Pin GPS</>}
                </button>
              </div>
              {gps && <p className="text-[10px] text-white/40 truncate bg-black/40 py-1.5 px-3 rounded-lg border border-white/5">{gps}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Delivery Notes</label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Call on arrival, mild spice please…"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all resize-none" />
            </div>

            {/* Pricing Summary */}
            <div className="rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>Subtotal</span><span>KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="text-green-400 font-bold">FREE</span> : `KES ${delivery}`}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5">
                <span className="font-bold text-white text-sm">Total</span>
                <span className="font-serif font-black text-[#DFB15B] text-xl">KES {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="py-4 px-5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs uppercase tracking-wider font-bold hover:bg-white/10 transition-all cursor-pointer">
                ← Back
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#FF6F3D]/10 disabled:opacity-50">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting…</> : <><Send className="w-4 h-4" /> Confirm & WhatsApp Chef</>}
              </button>
            </div>
            <p className="text-[9px] text-center text-white/25 leading-relaxed">Your order opens a prefilled WhatsApp message to Chef Kavata at +254 114 590 693 for personal delivery coordination.</p>
          </form>
        )}
      </div>
    </div>
  );
}
