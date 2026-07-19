/**
 * firebase.ts
 *
 * Initialises the Firebase client SDK (app, auth, firestore).
 * Uses getApps() guard so the SDK is never initialised twice
 * (important in Next.js where modules can be evaluated multiple times
 * across server and client contexts).
 *
 * All NEXT_PUBLIC_ values come from .env.local — see .env.local.example.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialise once; reuse the existing app on subsequent module evaluations.
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Firebase Authentication instance
const auth: Auth = getAuth(app);

// Cloud Firestore instance
const db: Firestore = getFirestore(app);

export { app, auth, db };
