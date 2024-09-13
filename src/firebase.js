// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Debug: Log all environment variables
console.log("All environment variables:", process.env);

// Debug: Log specific Firebase config variables
console.log("FIREBASE_API_KEY:", process.env.REACT_APP_FIREBASE_API_KEY);
console.log("FIREBASE_PROJECT_ID:", process.env.REACT_APP_FIREBASE_PROJECT_ID);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "const mySecret = process.env['REACT_APP_FIREBASE_API_KEY']",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "rdvp3-2a363.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "rdvp3-2a363",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "rdvp3-2a363.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "681298416276",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:681298416276:web:47df035976886e228c1a81",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-4EQSTLHXC2"
};

// Debug: Log the final firebaseConfig
console.log("Final Firebase Config:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase services
export { app, analytics, auth, db, functions, googleProvider, storage };