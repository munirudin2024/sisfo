// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMln3tQo1eLNZpXJI_P_P8v91Iing7wt4",
  authDomain: "sisfo-bc3d6.firebaseapp.com",
  projectId: "sisfo-bc3d6",
  storageBucket: "sisfo-bc3d6.firebasestorage.app",
  messagingSenderId: "934576182862",
  appId: "1:934576182862:web:aaa4acba2f763bd9aad51f",
  measurementId: "G-KDPHXD5FLF",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
