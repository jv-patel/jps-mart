import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth,
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  linkWithCredential, 
  signOut,
  PhoneAuthProvider,
  updateProfile,
  linkWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore,
  collection, 
  getDocs, 
  getDoc, 
  setDoc, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaImPLwuZnnGG3JwMCqGicJFs_gkZBYSU",
  authDomain: "jps-mart-57700.firebaseapp.com",
  projectId: "jps-mart-57700",
  storageBucket: "jps-mart-57700.firebasestorage.app",
  messagingSenderId: "260416447195",
  appId: "1:260416447195:web:9bfa1d3c6e9928226262fe",
  measurementId: "G-P17V3CZBVD"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let analytics = null;
  try {
    analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.warn("Analytics blocked or failed to load:", analyticsError);
  }

  window.firebaseApp = app;
  window.auth = auth;
  window.db = db;
  window.analytics = analytics;
  window.logEvent = logEvent || function() {};

  window.fs = {
    collection, getDocs, getDoc, setDoc, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, orderBy
  };

  window.fbAuth = {
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInAnonymously, 
    linkWithCredential, 
    signOut,
    PhoneAuthProvider,
    updateProfile,
    linkWithPopup
  };

  console.log("Firebase initialized successfully");
  // Dispatch event so deferred scripts know Firebase is ready
  window.dispatchEvent(new Event('firebaseReady'));
} catch (error) {
  console.error("Firebase failed to initialize:", error);
  window.dispatchEvent(new CustomEvent('firebaseError', { detail: error }));
}
