// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ4lsW9BpwhKO2cZg4kNEQNDqv5126NmU",
  authDomain: "rdvp3-2a363.firebaseapp.com",
  projectId: "rdvp3-2a363",
  storageBucket: "rdvp3-2a363.appspot.com",
  messagingSenderId: "681298416276",
  appId: "1:681298416276:web:47df035976886e228c1a81",
  measurementId: "G-4EQSTLHXC2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();
export { app, analytics, auth, db, functions, googleProvider };
