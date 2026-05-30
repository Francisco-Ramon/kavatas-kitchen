'use client';

import React, { useState } from 'react';
import { useAppContext } from '../../lib/AppContext';
import { Heart, ShoppingBag, Trash2, LogIn, UserPlus, Eye, EyeOff, CheckCircle, ShieldAlert, LogOut, UserCheck } from 'lucide-react';

type AuthMode = 'login' | 'register';

export default function AccountPage() {
  const {
    currentUser,
    favorites,
    meals,
    toggleFavorite,
    addToCart,
    createAccount,
    loginAccount,
    logoutAccount
  } = useAppContext();

  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(''); setAuthSuccess('');
    if (authMode === 'register') {
      const ok = createAccount(authName, authEmail, authPhone, authPassword);
      if (!ok) { setAuthError('An account with this email already exists.'); return; }
      setAuthSuccess('Account created successfully! Welcome to Kavata\'s Kitchen.');
    } else {
      const ok = loginAccount(authEmail, authPassword);
      if (!ok) { setAuthError('Invalid email or password. Please try again.'); return; }
      setAuthSuccess('Welcome back! Logged in successfully.');
    }
  };

  const favoriteMeals = meals.filter((meal) => favorites.includes(meal.id));

  return (
    <div className="bg-[#0B0B0C] text-white min-h-screen font-sans flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-2xl bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 space-y-6">
        
        {currentUser ? (
          /* Profile and Favorites Dashboard */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/5 pb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C] font-serif font-black text-3xl shadow-xl shadow-[#FF6F3D]/10">
                {currentUser.name[0]}
              </div>
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                  {currentUser.name}
                  <span className="text-[8px] bg-[#DFB15B]/20 text-[#DFB15B] py-0.5 px-2 rounded-full font-sans uppercase font-bold tracking-widest">Premium Member</span>
                </h2>
                <p className="text-xs text-white/50">{currentUser.email} · {currentUser.phone}</p>
                <p className="text-[10px] text-white/30">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={logoutAccount} 
                className="py-3 px-6 bg-white/5 border border-white/10 text-white/60 hover:text-red-400 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            {/* Saved favorites section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <h3 className="font-serif text-lg font-bold text-white">Your Saved Masterpieces</h3>
              </div>

              {favoriteMeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-white/5 rounded-2xl">
                  <Heart className="w-10 h-10 text-white/15 mb-3" />
                  <p className="text-xs text-white/40 leading-relaxed max-w-xs text-center">
                    Your luxury favorites vault is currently empty. Toggle the heart button on meals to save them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteMeals.map((meal) => (
                    <div 
                      key={meal.id}
                      className="rounded-2xl bg-white/5 border border-white/5 p-4 flex gap-4 items-center justify-between hover:bg-white/[0.08] transition-all"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/5">
                          <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-serif text-xs font-bold text-white leading-tight truncate">{meal.title}</h4>
                          <p className="text-[8px] text-[#DFB15B] uppercase tracking-wider font-semibold mt-0.5">{meal.category}</p>
                          <p className="text-xs font-serif font-black text-white/80 mt-1">KES {meal.priceKES.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => addToCart(meal)}
                          className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] hover:opacity-90 transition-all cursor-pointer"
                          title="Add to Bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(meal.id)}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-red-500 hover:bg-white/10 transition-all cursor-pointer"
                          title="Remove Favorite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Authentication Screen */
          <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C] mx-auto shadow-lg shadow-[#FF6F3D]/25">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">Culinary Circle</h2>
              <p className="text-xs text-white/40">Log in or create an account to access your premium vault & track gourmet orders.</p>
            </div>

            {/* Toggle tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
              {(['login', 'register'] as AuthMode[]).map((m) => (
                <button 
                  key={m} 
                  onClick={() => { setAuthMode(m); setAuthError(''); setAuthSuccess(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${
                    authMode === m ? 'bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C]' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {m === 'login' ? '🔑 Log In' : '✨ Register'}
                </button>
              ))}
            </div>

            {/* Forms */}
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={authName} 
                      onChange={e => setAuthName(e.target.value)} 
                      placeholder="e.g. Wanjiku Kamau"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3.5 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={authPhone} 
                      onChange={e => setAuthPhone(e.target.value)} 
                      placeholder="0712 345 678"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-3.5 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" 
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={authEmail} 
                  onChange={e => setAuthEmail(e.target.value)} 
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={authPassword} 
                    onChange={e => setAuthPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 pr-12 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-semibold flex items-center gap-1.5 pl-1">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> {authError}
                </p>
              )}
              {authSuccess && (
                <p className="text-xs text-green-400 font-semibold flex items-center gap-1.5 pl-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {authSuccess}
                </p>
              )}

              <button 
                type="submit" 
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FF6F3D]/25"
              >
                {authMode === 'login' ? (
                  <><LogIn className="w-4 h-4" /> Sign In</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> Create Account</>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
