
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzJrd87n3CqK72m18VPZ_KCDyZ6ESrDrA",
  authDomain: "creator-platform-461506.firebaseapp.com",
  projectId: "creator-platform-461506",
  storageBucket: "creator-platform-461506.firebasestorage.app",
  messagingSenderId: "173826602269",
  appId: "1:173826602269:web:96e4ccf34adaf656869df4",
  measurementId: "G-XZF1WGVL1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
