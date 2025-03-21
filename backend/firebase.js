import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: "linkio-55478.firebaseapp.com",
  projectId: "linkio-55478",
  storageBucket: "linkio-55478.firebasestorage.app",
  messagingSenderId: "886719348838",
  appId: "1:886719348838:web:95962d566d0d5e54886da7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
