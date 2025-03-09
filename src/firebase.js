// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCuUfWqGzhuN4yHyk9nBZsuKWUvOIQ3uwc",
  authDomain: "blog-bf80c.firebaseapp.com",
  projectId: "blog-bf80c",
  storageBucket: "blog-bf80c.firebasestorage.app",
  messagingSenderId: "672087051784",
  appId: "1:672087051784:web:569392f19b99add06f8bbd",
  measurementId: "G-BVWVM62ZL2"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, firestore, auth, analytics };
