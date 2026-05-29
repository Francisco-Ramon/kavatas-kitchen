import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Meal, MEALS } from './data';
import type { Order, Review } from './AppContext';

/**
 * Subscribes to real-time updates of the meals collection in Firestore.
 * Automatically seeds the collection with initial MEALS if it is completely empty.
 */
export function subscribeToMeals(callback: (meals: Meal[]) => void): () => void {
  if (!db) return () => {};

  const mealsCol = collection(db, 'meals');
  
  const unsubscribe = onSnapshot(mealsCol, async (snapshot) => {
    if (snapshot.empty) {
      console.log('🌱 Firestore meals collection is empty. Auto-seeding 10 default gourmet meals...');
      for (const meal of MEALS) {
        try {
          await setDoc(doc(db, 'meals', meal.id), meal);
        } catch (err) {
          console.error(`Error auto-seeding meal "${meal.title}":`, err);
        }
      }
    } else {
      const fetchedMeals: Meal[] = [];
      snapshot.forEach((doc) => {
        fetchedMeals.push(doc.data() as Meal);
      });
      
      // Sort deterministically to maintain premium visual menu order (m1, m2, m3, ...)
      fetchedMeals.sort((a, b) => {
        const aNum = parseInt(a.id.replace(/\D/g, '')) || 999;
        const bNum = parseInt(b.id.replace(/\D/g, '')) || 999;
        if (aNum !== bNum) return aNum - bNum;
        return a.title.localeCompare(b.title);
      });
      
      callback(fetchedMeals);
    }
  }, (error) => {
    console.error('Error in real-time meals subscription:', error);
  });

  return unsubscribe;
}

// ── Meal CRUD Mutations ──────────────────────────────────────────────

export async function addMealDB(meal: Meal): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'meals', meal.id), meal);
}

export async function updateMealDB(meal: Meal): Promise<void> {
  if (!db) return;
  await setDoc(doc(db, 'meals', meal.id), meal);
}

export async function deleteMealDB(mealId: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'meals', mealId));
}

// ── Orders Realtime Subscriptions & Mutations ─────────────────────────

export function subscribeToOrders(callback: (orders: Order[]) => void): () => void {
  if (!db) return () => {};

  const ordersCol = collection(db, 'orders');
  
  const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
    const fetchedOrders: Order[] = [];
    snapshot.forEach((doc) => {
      fetchedOrders.push(doc.data() as Order);
    });
    
    // Sort descending by timestamp so newest order is always on top
    fetchedOrders.sort((a, b) => {
      const aTime = a.timestamp || 0;
      const bTime = b.timestamp || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.id.localeCompare(a.id);
    });
    
    callback(fetchedOrders);
  }, (error) => {
    console.error('Error in real-time orders subscription:', error);
  });

  return unsubscribe;
}

export async function addOrderDB(order: Order): Promise<void> {
  if (!db) return;
  const orderWithTimestamp = {
    ...order,
    timestamp: order.timestamp || Date.now()
  };
  await setDoc(doc(db, 'orders', order.id), orderWithTimestamp);
}

export async function updateOrderStatusDB(orderId: string, status: Order['status']): Promise<void> {
  if (!db) return;
  const orderRef = doc(db, 'orders', orderId);
  await setDoc(orderRef, { status }, { merge: true });
}

export async function markOrderAsPaidDB(orderId: string, mpesaRef: string, paidAt: string): Promise<void> {
  if (!db) return;
  const orderRef = doc(db, 'orders', orderId);
  await setDoc(orderRef, { 
    isPaid: true, 
    paidAt, 
    mpesaRef: mpesaRef || 'CASH' 
  }, { merge: true });
}

// ── Reviews Realtime Subscriptions & Mutations ────────────────────────

export function subscribeToReviews(callback: (reviews: Review[]) => void): () => void {
  if (!db) return () => {};

  const reviewsCol = collection(db, 'reviews');
  
  const unsubscribe = onSnapshot(reviewsCol, (snapshot) => {
    const fetchedReviews: Review[] = [];
    snapshot.forEach((doc) => {
      fetchedReviews.push(doc.data() as Review);
    });
    
    // Sort reviews descending by timestamp (newest reviews first)
    fetchedReviews.sort((a, b) => {
      const aTime = a.timestamp || 0;
      const bTime = b.timestamp || 0;
      if (aTime !== bTime) return bTime - aTime;
      return b.id.localeCompare(a.id);
    });
    
    callback(fetchedReviews);
  }, (error) => {
    console.error('Error in real-time reviews subscription:', error);
  });

  return unsubscribe;
}

export async function submitReviewDB(review: Review): Promise<void> {
  if (!db) return;
  const reviewWithTimestamp = {
    ...review,
    timestamp: review.timestamp || Date.now()
  };
  // 1. Save the review document
  await setDoc(doc(db, 'reviews', review.id), reviewWithTimestamp);

  // 2. Mark the corresponding order as reviewed
  const orderRef = doc(db, 'orders', review.orderId);
  await setDoc(orderRef, { hasReview: true }, { merge: true });
}
