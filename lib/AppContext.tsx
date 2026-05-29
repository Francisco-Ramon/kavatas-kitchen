'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meal, MEALS } from './data';
import { db } from './firebase';
import {
  subscribeToMeals,
  addMealDB,
  updateMealDB,
  deleteMealDB,
  subscribeToOrders,
  addOrderDB,
  updateOrderStatusDB,
  markOrderAsPaidDB,
  subscribeToReviews,
  submitReviewDB,
} from './firestoreService';

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Review {
  id: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  category: string;
  createdAt: string;
  isPublic: boolean;
  timestamp?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    gps: string;
    notes: string;
    isGuest: boolean;
    userId?: string;
  };
  meals: CartItem[];
  total: number;
  status: 'Received' | 'Preparing' | 'On the Way' | 'Delivered';
  isPaid: boolean;
  paidAt?: string;
  mpesaRef?: string;
  hasReview: boolean;
  createdAt: string;
  timestamp?: number;
}

interface AppContextType {
  meals: Meal[];
  mealsLoading: boolean;
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  reviews: Review[];
  activeOrder: Order | null;
  currentUser: UserAccount | null;
  // Cart
  addToCart: (meal: Meal) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, qty: number) => void;
  clearCart: () => void;
  // Favorites
  toggleFavorite: (mealId: string) => void;
  isFavorite: (mealId: string) => boolean;
  // Orders
  placeOrder: (customer: Order['customer']) => { order: Order; whatsappUrl: string };
  // Admin
  addMeal: (meal: Meal) => void;
  updateMeal: (meal: Meal) => void;
  deleteMeal: (mealId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  markOrderAsPaid: (orderId: string, mpesaRef?: string) => void;
  setActiveOrder: (order: Order | null) => void;
  // Reviews
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  publicReviews: Review[];
  // Auth
  createAccount: (name: string, email: string, phone: string, password: string) => boolean;
  loginAccount: (email: string, password: string) => boolean;
  logoutAccount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(MEALS);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeOrder, setActiveOrderState] = useState<Order | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // ── Load state from localStorage on startup + subscribe to real-time updates
  useEffect(() => {
    // 1. Core user/session states
    const storedCart = localStorage.getItem('kavatas_cart');
    const storedFavs = localStorage.getItem('kavatas_favorites');
    const storedUser = localStorage.getItem('kavatas_user');

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    // 2. Realtime Subscriptions (or Local fallback)
    if (db) {
      console.log('⚡ Kavata\'s Kitchen: Realtime Firestore Sync Enabled!');

      // Meals Subscription
      const unsubMeals = subscribeToMeals((fetchedMeals) => {
        setMeals(fetchedMeals);
        setMealsLoading(false);
      });

      // Orders Subscription
      const unsubOrders = subscribeToOrders((fetchedOrders) => {
        setOrders(fetchedOrders);
        
        // Find if this specific device/session has an active (undelivered) order
        const storedLocalOrderIds = JSON.parse(localStorage.getItem('kavatas_orders_ids') || '[]');
        const active = fetchedOrders.find(
          (o: Order) => 
            o.status !== 'Delivered' && 
            (o.customer.userId === currentUser?.id || storedLocalOrderIds.includes(o.id))
        );
        
        if (active) {
          setActiveOrderState(active);
        } else {
          setActiveOrderState(null);
        }
      });

      // Reviews Subscription
      const unsubReviews = subscribeToReviews((fetchedReviews) => {
        setReviews(fetchedReviews);
      });

      return () => {
        unsubMeals();
        unsubOrders();
        unsubReviews();
      };
    } else {
      console.log('🔌 Kavata\'s Kitchen: Running in local fallback state (localStorage only).');
      
      const storedMeals = localStorage.getItem('kavatas_meals');
      const storedOrders = localStorage.getItem('kavatas_orders');
      const storedReviews = localStorage.getItem('kavatas_reviews');

      if (storedMeals) setMeals(JSON.parse(storedMeals));
      if (storedReviews) setReviews(JSON.parse(storedReviews));
      setMealsLoading(false);

      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
        const active = parsedOrders.find((o: Order) => o.status !== 'Delivered');
        if (active) setActiveOrderState(active);
      }
    }
  }, [currentUser?.id]);

  // ── Persist helpers ───────────────────────────────────────────────
  const saveCart = (v: CartItem[]) => { setCart(v); localStorage.setItem('kavatas_cart', JSON.stringify(v)); };
  const saveFavorites = (v: string[]) => { setFavorites(v); localStorage.setItem('kavatas_favorites', JSON.stringify(v)); };
  const saveOrders = (v: Order[]) => { setOrders(v); localStorage.setItem('kavatas_orders', JSON.stringify(v)); };
  const saveReviews = (v: Review[]) => { setReviews(v); localStorage.setItem('kavatas_reviews', JSON.stringify(v)); };
  const saveMeals = (v: Meal[]) => { setMeals(v); localStorage.setItem('kavatas_meals', JSON.stringify(v)); };

  // ─── Cart ──────────────────────────────────────────────────────────
  const addToCart = (meal: Meal) => {
    const idx = cart.findIndex(i => i.meal.id === meal.id);
    if (idx > -1) {
      const nc = [...cart]; nc[idx].quantity += 1; saveCart(nc);
    } else {
      saveCart([...cart, { meal, quantity: 1 }]);
    }
  };
  const removeFromCart = (mealId: string) => saveCart(cart.filter(i => i.meal.id !== mealId));
  const updateQuantity = (mealId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(mealId); return; }
    saveCart(cart.map(i => i.meal.id === mealId ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => saveCart([]);

  // ─── Favorites ─────────────────────────────────────────────────────
  const toggleFavorite = (mealId: string) =>
    saveFavorites(favorites.includes(mealId) ? favorites.filter(id => id !== mealId) : [...favorites, mealId]);
  const isFavorite = (mealId: string) => favorites.includes(mealId);

  // ─── Place Order ───────────────────────────────────────────────────
  const placeOrder = (customer: Order['customer']) => {
    const orderId = 'KK-' + Math.floor(1000 + Math.random() * 9000);
    const total = cart.reduce((s, i) => s + (i.meal.discountPriceKES || i.meal.priceKES) * i.quantity, 0);
    const newOrder: Order = {
      id: orderId,
      customer: {
        ...customer,
        userId: currentUser?.id || undefined
      },
      meals: [...cart],
      total,
      status: 'Received',
      isPaid: false,
      hasReview: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    if (db) {
      // 1. Save order to Firestore
      addOrderDB(newOrder).catch((err) => console.error('Error placing order to Firestore:', err));

      // 2. Store placed order ID in localStorage to track it even if guest logs out
      const storedLocalOrderIds = JSON.parse(localStorage.getItem('kavatas_orders_ids') || '[]');
      localStorage.setItem('kavatas_orders_ids', JSON.stringify([...storedLocalOrderIds, orderId]));
    } else {
      // Local fallback
      const newOrders = [newOrder, ...orders];
      saveOrders(newOrders);
    }
    
    // Also save in localStorage as a backup
    const localBackupOrders = JSON.parse(localStorage.getItem('kavatas_orders') || '[]');
    localStorage.setItem('kavatas_orders', JSON.stringify([newOrder, ...localBackupOrders]));

    setActiveOrderState(newOrder);
    clearCart();

    const businessPhone = '254114590693';
    let message = `*🌟 NEW ORDER – KAVATA'S KITCHEN 🌟*\n\n`;
    message += `*Order ID:* #${orderId}\n`;
    message += `*Customer:* ${customer.name}\n`;
    message += `*Phone:* ${customer.phone}\n`;
    message += `*Delivery To:* ${customer.address}\n`;
    if (customer.gps) message += `*📍 GPS:* ${customer.gps}\n`;
    if (customer.notes) message += `*Notes:* _${customer.notes}_\n`;
    message += `\n*🍽️ ITEMS:*\n`;
    newOrder.meals.forEach(i => { message += `- ${i.quantity}x ${i.meal.title} — KES ${(i.meal.discountPriceKES || i.meal.priceKES).toLocaleString()}\n`; });
    message += `\n*💰 TOTAL:* KES ${total.toLocaleString()}\n`;
    message += `\nPlease confirm & prepare — handcrafted with love! 🙏`;
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;
    return { order: newOrder, whatsappUrl };
  };

  // ─── Admin: Mark as Paid ───────────────────────────────────────────
  const markOrderAsPaid = (orderId: string, mpesaRef?: string) => {
    const paidAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const ref = mpesaRef || 'CASH';

    if (db) {
      markOrderAsPaidDB(orderId, ref, paidAt).catch(err => console.error('Error marking order paid in Firestore:', err));
    } else {
      const updated = orders.map(o =>
        o.id === orderId
          ? { ...o, isPaid: true, paidAt, mpesaRef: ref }
          : o
      );
      saveOrders(updated);
      if (activeOrder && activeOrder.id === orderId) {
        const match = updated.find(o => o.id === orderId);
        if (match) setActiveOrderState(match);
      }
    }
  };

  // ─── Admin: Meals CRUD ─────────────────────────────────────────────
  const addMeal = (meal: Meal) => {
    if (db) {
      addMealDB(meal).catch(err => console.error('Error adding meal to Firestore:', err));
    } else {
      const updatedMeals = [meal, ...meals];
      saveMeals(updatedMeals);
    }
  };

  const updateMeal = (meal: Meal) => {
    if (db) {
      updateMealDB(meal).catch(err => console.error('Error updating meal in Firestore:', err));
    } else {
      const updatedMeals = meals.map(m => m.id === meal.id ? meal : m);
      saveMeals(updatedMeals);
    }
  };

  const deleteMeal = (mealId: string) => {
    if (db) {
      deleteMealDB(mealId).catch(err => console.error('Error deleting meal from Firestore:', err));
    } else {
      const updatedMeals = meals.filter(m => m.id !== mealId);
      saveMeals(updatedMeals);
    }
  };

  // ─── Admin: Order Status ───────────────────────────────────────────
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (db) {
      updateOrderStatusDB(orderId, status).catch(err => console.error('Error updating order status in Firestore:', err));
    } else {
      const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
      saveOrders(updated);
      if (activeOrder && activeOrder.id === orderId) {
        const match = updated.find(o => o.id === orderId);
        if (match) setActiveOrderState(match);
      }
    }
  };

  const setActiveOrder = (order: Order | null) => setActiveOrderState(order);

  // ─── Reviews ───────────────────────────────────────────────────────
  const submitReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      createdAt: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: Date.now()
    };

    if (db) {
      // Atomic review + order reviewed status update
      submitReviewDB(newReview).catch(err => console.error('Error submitting review to Firestore:', err));
    } else {
      const updatedReviews = [newReview, ...reviews];
      saveReviews(updatedReviews);

      // Mark order as reviewed locally
      const updatedOrders = orders.map(o => o.id === review.orderId ? { ...o, hasReview: true } : o);
      saveOrders(updatedOrders);
      if (activeOrder && activeOrder.id === review.orderId) {
        setActiveOrderState({ ...activeOrder, hasReview: true });
      }
    }
  };

  const publicReviews = reviews.filter(r => r.isPublic);

  // ─── Auth ──────────────────────────────────────────────────────────
  const createAccount = (name: string, email: string, phone: string, password: string): boolean => {
    const existing = JSON.parse(localStorage.getItem('kavatas_accounts') || '[]');
    if (existing.find((a: any) => a.email === email)) return false; // already exists

    const user: UserAccount = { id: 'u-' + Date.now(), name, email, phone, createdAt: new Date().toISOString() };
    const accounts = [...existing, { ...user, password }];
    localStorage.setItem('kavatas_accounts', JSON.stringify(accounts));
    setCurrentUser(user);
    localStorage.setItem('kavatas_user', JSON.stringify(user));
    return true;
  };

  const loginAccount = (email: string, password: string): boolean => {
    const existing = JSON.parse(localStorage.getItem('kavatas_accounts') || '[]');
    const match = existing.find((a: any) => a.email === email && a.password === password);
    if (!match) return false;
    const { password: _, ...user } = match;
    setCurrentUser(user);
    localStorage.setItem('kavatas_user', JSON.stringify(user));
    return true;
  };

  const logoutAccount = () => {
    setCurrentUser(null);
    localStorage.removeItem('kavatas_user');
  };

  return (
    <AppContext.Provider value={{
      meals, mealsLoading, cart, favorites, orders, reviews, activeOrder, currentUser,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleFavorite, isFavorite,
      placeOrder,
      addMeal, updateMeal, deleteMeal, updateOrderStatus, markOrderAsPaid, setActiveOrder,
      submitReview, publicReviews,
      createAccount, loginAccount, logoutAccount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
