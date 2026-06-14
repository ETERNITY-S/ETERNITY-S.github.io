// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {

  apiKey: "PASTE_YOUR_API_KEY",

  authDomain: "PASTE_YOUR_AUTH_DOMAIN",

  projectId: "PASTE_YOUR_PROJECT_ID",

  storageBucket: "PASTE_YOUR_STORAGE_BUCKET",

  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",

  appId: "PASTE_YOUR_APP_ID"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};
