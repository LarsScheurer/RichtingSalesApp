// In frontend/src/firebase/config.ts

import { initializeApp, getApps } from "firebase/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZh5R0sSQ-T3mnk9XS8WA0GV0t_xjD0pY",
  authDomain: "richting-sales-d764a.firebaseapp.com",
  projectId: "richting-sales-d764a",
  storageBucket: "richting-sales-d764a.firebasestorage.app",
  messagingSenderId: "228500270341",
  appId: "1:228500270341:web:1e2bbafbc609136a581b6c",
  measurementId: "G-6833KTWQ8K"
};
// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };
