// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBVvXnqKbvuSndqZYEH50LgNTMzz-1MdAE",
  authDomain: "ing-news.firebaseapp.com",
  projectId: "ing-news",
  storageBucket: "ing-news.appspot.com", // ✅ corrected `.firebasestorage.app` → `.appspot.com`
  messagingSenderId: "621430319046",
  appId: "1:621430319046:web:c79fa00b077c867557b4c7",
  measurementId: "G-DQE6NTDXY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore
export const db = getFirestore(app);