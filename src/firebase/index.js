import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Votre configuration Firebase
const firebaseConfig = {
  // vos paramètres de configuration
};

// Initialiser Firebase une seule fois
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  if (!/already exists/.test(error.message)) {
    console.error('Firebase initialization error', error.stack);
  }
}

export const db = getFirestore(app);
export const auth = getAuth(app); 