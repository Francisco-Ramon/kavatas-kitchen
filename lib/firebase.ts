import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all configuration keys are present and populated
const isConfigComplete = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let db: any = null;

if (isConfigComplete) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      '⚠️ KAVATA\'S KITCHEN: Firebase configuration is missing or incomplete.\n' +
      'The application is running in standard fallback mode (localStorage state persistence).\n' +
      'To enable instant, global real-time synchronization for meals, orders, and reviews across all sessions, ' +
      'create a Firebase project, configure a Firestore database, and paste the keys in a .env.local file.\n' +
      'Refer to the env.template file in the project root for guidance.'
    );
  }
}

export { db };
