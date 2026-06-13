'use client';

import React, { useState } from 'react';
import { useAppContext, Order } from '../lib/AppContext';
import { Meal } from '../lib/data';
import {
  X, LayoutDashboard, Plus, Trash2, Edit2, ShieldAlert,
  CheckCircle, Navigation, ExternalLink, Settings,
  CreditCard, Banknote, DollarSign, BadgeCheck, Upload,
  Lock, Eye, EyeOff, LogOut, ChefHat, ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ADMIN_PASSWORD = 'Kavata@2026';

export default function AdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { meals, orders, addMeal, updateMeal, deleteMeal, updateOrderStatus, markOrderAsPaid } = useAppContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'meals' | 'settings'>('orders');

  // ── Admin Auth Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Meal CRUD
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceKES, setPriceKES] = useState(1000);
  const [discountPriceKES, setDiscountPriceKES] = useState<number | ''>('');
  const [offerText, setOfferText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState<Meal['category']>('Kenyan');
  const [ingredients, setIngredients] = useState('');
  const [prepTime, setPrepTime] = useState('20 mins');

  // M-Pesa ref input per order
  const [mpesaRefs, setMpesaRefs] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // ── Admin Login Handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    setTimeout(() => {
      if (passwordInput === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        setActiveTab('orders');
      } else {
        setAuthError('Incorrect password. Access denied.');
      }
      setAuthLoading(false);
    }, 900);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
    setActiveTab('orders');
  };

  // ── Image File Compression & Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImageUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // ── Meal form submit
  const handleSubmitMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) return;
    const ingArray = ingredients.split(',').map(i => i.trim()).filter(Boolean);
    const mealPayload: Meal = {
      id: editingMeal ? editingMeal.id : 'm-' + Date.now(),
      title,
      description,
      priceKES,
      imageUrl,
      category,
      ingredients: ingArray,
      rating: editingMeal ? editingMeal.rating : 4.9,
      reviewsCount: editingMeal ? editingMeal.reviewsCount : 0,
      preparationTime: prepTime
    };

    if (discountPriceKES !== '') {
      mealPayload.discountPriceKES = Number(discountPriceKES);
    }
    if (offerText) {
      mealPayload.offerText = offerText;
    }


    if (editingMeal) {
      updateMeal(mealPayload);
      setEditingMeal(null);
    } else {
      addMeal(mealPayload);
    }
    setTitle(''); setDescription(''); setPriceKES(1000); setImageUrl('');
    setDiscountPriceKES(''); setOfferText('');
    setIngredients(''); setPrepTime('20 mins'); setShowAddForm(false);
  };

  const handleEditClick = (meal: Meal) => {
    setEditingMeal(meal);
    setTitle(meal.title); setDescription(meal.description); setPriceKES(meal.priceKES);
    setDiscountPriceKES(meal.discountPriceKES !== undefined ? meal.discountPriceKES : '');
    setOfferText(meal.offerText || '');
    setImageUrl(meal.imageUrl); setCategory(meal.category);
    setIngredients(meal.ingredients.join(', ')); setPrepTime(meal.preparationTime);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setShowAddForm(false); setEditingMeal(null);
    setTitle(''); setDescription(''); setPriceKES(1000);
    setDiscountPriceKES(''); setOfferText('');
    setImageUrl(''); setIngredients(''); setPrepTime('20 mins');
  };

  // Revenue stats
  const totalRevenue = orders.filter(o => o.isPaid).reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter(o => !o.isPaid).length;

  // ── ADMIN LOGIN GATE ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
        <div onClick={onClose} className="absolute inset-0 bg-[#0B0B0C]/95 backdrop-blur-md" />

        <div className="relative w-full max-w-sm bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl z-10 overflow-hidden">
          {/* Gold glow accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#DFB15B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/40 hover:text-white cursor-pointer transition-colors z-10">
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 space-y-6">
            {/* Logo / Icon */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center shadow-xl shadow-[#FF6F3D]/20">
                <ChefHat className="w-8 h-8 text-[#0B0B0C]" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-white">Chef Admin Console</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">Kavata's Kitchen · Secure Access</p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-wider text-white/40 font-bold block">Admin Password</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={e => { setPasswordInput(e.target.value); setAuthError(''); }}
                    placeholder="Enter admin password"
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-12 text-white text-sm focus:outline-none focus:border-[#DFB15B] transition-all placeholder-white/20"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white cursor-pointer transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1.5 pl-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-[#FF6F3D]/20 disabled:opacity-60"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0B0B0C]/40 border-t-[#0B0B0C] rounded-full animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Enter Dashboard</>
                )}
              </button>
            </form>

            <p className="text-center text-[9px] text-white/20 leading-relaxed">
              This console is restricted to Kavata's Kitchen staff only.<br />Unauthorised access is prohibited.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED DASHBOARD ───────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in font-sans">
      <div onClick={onClose} className="absolute inset-0 bg-[#0B0B0C]/95 backdrop-blur-md" />

      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0C0C0E] border border-white/5 rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden">

        {/* Top Header */}
        <div className="p-5 bg-[#18181A]/80 border-b border-white/5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6F3D] to-[#DFB15B] flex items-center justify-center text-[#0B0B0C]">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                Chef Admin Console
                <span className="text-[8px] bg-[#DFB15B]/20 text-[#DFB15B] py-0.5 px-2 rounded-full font-sans uppercase font-bold tracking-widest">Master Dashboard</span>
              </h2>
              <p className="text-[9px] text-white/30 uppercase tracking-widest font-semibold">Kavata's Kitchen Control Centre</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3 md:gap-4 mr-2 md:mr-6 text-right">
            <div className="text-right">
              <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30">Revenue (Paid)</p>
              <p className="font-serif font-black text-[#DFB15B] text-xs md:text-sm">KES {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] md:text-[9px] uppercase tracking-wider text-white/30">Pending</p>
              <p className="font-serif font-black text-[#FF6F3D] text-xs md:text-sm">{pendingCount} ord</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-white/5 bg-[#0C0C0E]/50 p-3 md:p-4 flex flex-row md:flex-col gap-2 flex-shrink-0 overflow-x-auto scrollbar-none">
            {(['orders', 'meals', 'settings'] as const).map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); resetForm(); }}
                className={`py-2 px-3 md:py-3 md:px-4 rounded-xl text-center md:text-left text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap flex-1 md:flex-none ${
                  activeTab === tab ? 'bg-[#FF6F3D] text-[#0B0B0C]' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                {tab === 'orders' ? `📦 Orders (${orders.length})` : tab === 'meals' ? `🍽️ Meals (${meals.length})` : '⚙️ Settings'}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto scrollbar-thin bg-black/20">

            {/* ── ORDERS TAB ── */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-white">Live Customer Orders</h3>
                  <span className="text-[9px] text-green-400 font-bold animate-pulse">● Listening for new orders</span>
                </div>

                {orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl">
                    <ShieldAlert className="w-10 h-10 text-white/20 mb-3" />
                    <p className="text-sm text-white/30">No orders received yet. Keep cooking!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="rounded-2xl bg-white/5 border border-white/5 p-5 space-y-4 hover:border-white/10 transition-all">

                        {/* Order header row */}
                        <div className="flex justify-between items-start flex-wrap gap-3 border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-serif font-black text-white text-sm">Order #{order.id}</span>
                            {/* Delivery status badge */}
                            <span className={`text-[8px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-full border ${
                              order.status === 'Delivered' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-[#FF6F3D]/20 text-[#FF6F3D] border-[#FF6F3D]/30 animate-pulse'
                            }`}>{order.status}</span>
                            {/* Payment badge */}
                            {order.isPaid ? (
                              <span className="text-[8px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] border border-[#DFB15B]/30 flex items-center gap-1">
                                <BadgeCheck className="w-3 h-3" /> Paid {order.mpesaRef ? `· ${order.mpesaRef}` : ''}
                              </span>
                            ) : (
                              <span className="text-[8px] uppercase tracking-widest font-bold py-1 px-2.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                                <CreditCard className="w-3 h-3" /> Awaiting Payment
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-white/30">Placed: {order.createdAt}</span>
                        </div>

                        {/* Customer info + GPS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1 text-white/60">
                            <p><span className="font-bold text-white">Name:</span> {order.customer.name}</p>
                            <p><span className="font-bold text-white">Phone:</span> {order.customer.phone}</p>
                            <p><span className="font-bold text-white">Address:</span> {order.customer.address}</p>
                            {order.customer.notes && <p className="italic text-white/30">"{order.customer.notes}"</p>}
                            {order.customer.isGuest && (
                              <span className="inline-block text-[9px] bg-white/5 border border-white/10 text-white/40 py-0.5 px-2 rounded-full">Guest Order</span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {order.customer.gps ? (
                              <a href={order.customer.gps} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#DFB15B]/10 hover:bg-[#DFB15B]/20 text-[#DFB15B] font-bold text-[10px] uppercase tracking-wider border border-[#DFB15B]/20 transition-all">
                                <Navigation className="w-3.5 h-3.5" /> View Route on Google Maps <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <p className="text-[10px] text-white/25 italic">No GPS pin captured</p>
                            )}
                            {order.hasReview && (
                              <span className="inline-flex items-center gap-1 text-[9px] text-green-400 border border-green-500/20 bg-green-500/10 py-1 px-2.5 rounded-full font-bold">
                                <CheckCircle className="w-3 h-3" /> Customer Reviewed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Meal list */}
                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 text-xs space-y-1.5">
                          {order.meals.map(item => (
                            <div key={item.meal.id} className="flex justify-between text-white/70">
                              <span>{item.quantity}x {item.meal.title}</span>
                              <span className="font-serif font-bold text-[#DFB15B]">KES {item.meal.priceKES.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-bold border-t border-white/5 pt-2 mt-1 text-[#DFB15B]">
                            <span>Total</span><span>KES {order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* ── Action Controls ── */}
                        <div className="flex flex-wrap gap-3 pt-1">
                          {/* Delivery status buttons */}
                          <div className="flex gap-1.5 flex-wrap">
                            {(['Received', 'Preparing', 'On the Way', 'Delivered'] as Order['status'][]).map(status => (
                              <button key={status} onClick={() => updateOrderStatus(order.id, status)}
                                className={`text-[9px] uppercase tracking-wider font-bold py-1.5 px-3 rounded-lg border cursor-pointer transition-all ${
                                  order.status === status ? 'bg-[#DFB15B] border-[#DFB15B] text-[#0B0B0C]' : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:border-white/15'
                                }`}>{status}</button>
                            ))}
                          </div>

                          {/* ── MARK AS PAID (key feature) ── */}
                          {!order.isPaid && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:ml-auto">
                              <input
                                type="text"
                                value={mpesaRefs[order.id] || ''}
                                onChange={e => setMpesaRefs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                placeholder="M-Pesa Ref (optional)"
                                className="bg-white/5 border border-white/10 rounded-xl py-1.5 px-3 text-white text-[10px] focus:outline-none focus:border-[#DFB15B] w-full sm:w-36 transition-all"
                              />
                              <button
                                onClick={() => markOrderAsPaid(order.id, mpesaRefs[order.id])}
                                className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1db954] text-white font-bold text-[10px] uppercase tracking-wider hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/10 w-full sm:w-auto"
                              >
                                <Banknote className="w-3.5 h-3.5" /> Mark as Paid ✓
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── MEALS TAB ── */}
            {activeTab === 'meals' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-white">
                    {showAddForm ? (editingMeal ? 'Edit Masterpiece' : 'New Masterpiece') : 'Gourmet Masterpieces'}
                  </h3>
                  <button onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer">
                    {showAddForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Add Meal</>}
                  </button>
                </div>

                {showAddForm ? (
                  <form onSubmit={handleSubmitMeal} className="space-y-4 bg-white/5 border border-white/5 p-6 rounded-2xl max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Meal Name *</label>
                        <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Coconut Fish Curry"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Price (KES) *</label>
                        <input type="number" required value={priceKES} onChange={e => setPriceKES(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Category *</label>
                        <select value={category} onChange={e => setCategory(e.target.value as Meal['category'])}
                          className="w-full bg-[#0C0C0E] border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all cursor-pointer">
                          <option value="Kenyan">Kenyan Heritage</option>
                          <option value="Fast Food">Gourmet Fast Food</option>
                          <option value="Drinks">Elixirs & Chai (Drinks)</option>
                          <option value="Specials">Daily Specials</option>
                          <option value="Chef">Chef's Signatures</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Prep Time *</label>
                        <input type="text" required value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="e.g. 25 mins"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                      </div>
                    </div>

                    {/* Offers & Discount Prices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Offer Title/Tag (Optional)</label>
                        <input type="text" value={offerText} onChange={e => setOfferText(e.target.value)} placeholder="e.g. 15% OFF, Buy 1 Get 1"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Offer Price (KES) (Optional)</label>
                        <input type="number" value={discountPriceKES} onChange={e => setDiscountPriceKES(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 800"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                      </div>
                    </div>

                    {/* Image Selector / Drag-n-Drop File Uploader */}
                    <div className="space-y-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <label className="text-[9px] uppercase tracking-wider text-[#DFB15B] font-bold block">Gourmet Image Setup *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="space-y-1.5">
                          <label className="text-[8px] uppercase tracking-wider text-white/40 block">Option A: Image Web URL</label>
                          <input type="url" value={imageUrl.startsWith('data:') ? '' : imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/…"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[8px] uppercase tracking-wider text-white/40 block">Option B: Upload File (Faster)</label>
                          <div className="relative group border border-dashed border-white/15 rounded-xl p-3 flex flex-col items-center justify-center hover:border-[#DFB15B]/30 hover:bg-white/[0.02] transition-all cursor-pointer">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <Upload className="w-5 h-5 text-white/40 group-hover:text-[#DFB15B] mb-1 transition-all" />
                            <p className="text-[9px] text-white/40 group-hover:text-white/60 font-semibold transition-all">Click or drag image file here</p>
                          </div>
                        </div>

                      </div>

                      {imageUrl && (
                        <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
                          <div className="h-16 w-16 rounded-lg overflow-hidden border border-[#DFB15B]/20 flex-shrink-0">
                            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.src = '')} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] uppercase tracking-wider text-white/40">Active Image Source</p>
                            <p className="text-[10px] text-[#DFB15B] font-mono truncate">{imageUrl.startsWith('data:') ? 'Base64 Uploaded File (Auto-Compressed)' : imageUrl}</p>
                          </div>
                          <button type="button" onClick={() => setImageUrl('')} className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-red-400 hover:bg-white/10 text-[9px] uppercase font-bold tracking-wider transition-all">
                            Clear
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Ingredients (comma-separated)</label>
                      <input type="text" value={ingredients} onChange={e => setIngredients(e.target.value)} placeholder="Fresh Fish, Coconut Milk, Coriander"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">Description *</label>
                      <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)}
                        placeholder="Rich, slow-simmered in coastal coconut cream and fresh Kenyan spices…"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white text-xs focus:outline-none focus:border-[#DFB15B] transition-all resize-none" />
                    </div>
                    <button type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-[#FF6F3D] to-[#DFB15B] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 cursor-pointer flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> {editingMeal ? 'Update Masterpiece' : 'Publish Masterpiece'}
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {meals.map(meal => {
                      const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
                        'Kenyan':    { label: 'Kenyan Heritage',       color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
                        'Fast Food': { label: 'Gourmet Fast Food',     color: 'bg-[#FF6F3D]/15 text-[#FF6F3D] border-[#FF6F3D]/25' },
                        'Drinks':    { label: 'Elixirs & Chai',        color: 'bg-sky-500/15 text-sky-400 border-sky-500/25' },
                        'Specials':  { label: 'Daily Specials',        color: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
                        'Chef':      { label: "Chef's Signatures",     color: 'bg-[#DFB15B]/15 text-[#DFB15B] border-[#DFB15B]/25' },
                      };
                      const cat = CATEGORY_LABELS[meal.category] || { label: meal.category, color: 'bg-white/10 text-white/50 border-white/10' };
                      return (
                        <div key={meal.id} className="rounded-2xl bg-white/5 border border-white/5 p-4 flex gap-3 items-center justify-between hover:border-white/10 transition-all">
                          <div className="flex gap-3 items-center min-w-0">
                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/5">
                              <img src={meal.imageUrl} alt={meal.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <h4 className="font-serif text-sm font-bold text-white truncate">{meal.title}</h4>
                              <span className={`inline-block text-[8px] uppercase tracking-widest font-bold py-0.5 px-2 rounded-full border ${cat.color}`}>{cat.label}</span>
                              <div className="flex items-baseline gap-1.5">
                                <p className="text-xs font-serif font-black text-white/70">
                                  KES {(meal.discountPriceKES || meal.priceKES).toLocaleString()}
                                </p>
                                {meal.discountPriceKES && (
                                  <p className="text-[9px] line-through text-white/30">KES {meal.priceKES.toLocaleString()}</p>
                                )}
                              </div>
                              {meal.offerText && (
                                <p className="text-[8px] text-[#FF6F3D] font-bold uppercase tracking-wide">🔥 {meal.offerText}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleEditClick(meal)} className="p-2 rounded-lg bg-white/5 hover:bg-[#DFB15B]/20 text-white/70 hover:text-[#DFB15B] transition-all border border-white/5 cursor-pointer" title="Edit">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteMeal(meal.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all border border-white/5 cursor-pointer" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === 'settings' && (
              <div className="space-y-5 max-w-lg">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#DFB15B]" /> Kitchen Configuration
                </h3>
                <div className="space-y-4">
                  <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-white">WhatsApp Business Number</p>
                    <p className="text-base font-mono text-[#DFB15B] font-black">+254 114 590 693</p>
                    <p className="text-[10px] text-white/30">All order payloads automatically open a click-to-chat WhatsApp draft to this number.</p>
                  </div>
                  <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-[#DFB15B]" /> Delivery Pricing</p>
                    <div className="grid grid-cols-2 gap-4 text-xs text-white/60">
                      <div><span className="block text-white/40 text-[9px] uppercase tracking-wider mb-1">Base Delivery</span><span className="font-bold text-white text-sm">KES 250</span></div>
                      <div><span className="block text-white/40 text-[9px] uppercase tracking-wider mb-1">Free Delivery Over</span><span className="font-bold text-white text-sm">KES 2,000</span></div>
                    </div>
                  </div>
                  <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-[#DFB15B]" /> M-Pesa Payment Flow</p>
                    <p className="text-[10px] text-white/40 leading-relaxed">When a customer pays via M-Pesa, enter the M-Pesa reference number (e.g. QJK2XAP9T) in the order card and click <strong className="text-white">Mark as Paid ✓</strong>. The customer's Order Tracker automatically syncs to paid status, unlocking the Review prompt on their screen.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
