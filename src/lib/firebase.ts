
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ledgerbloom",
  appId: "1:826516699519:web:123983de7b8f2d5a5c824a",
  storageBucket: "ledgerbloom.firebasestorage.app",
  apiKey: "AIzaSyDcgty6AvlLVEiWYqxg59IQ8Mv2r9sz5Ok",
  authDomain: "ledgerbloom.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "826516699519"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
