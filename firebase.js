// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
// YOUR FIREBASE CONFIG
const firebaseConfig = {

 apiKey: "AIzaSyDwekdzJdBppnAnxz6PXCFYld4m-5UtWEE",
  authDomain: "eternity-s.firebaseapp.com",
  projectId: "eternity-s",
  storageBucket: "eternity-s.firebasestorage.app",
  messagingSenderId: "879216465621",
  appId: "1:879216465621:web:27be5037e42e7cf4fa345c"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
};
