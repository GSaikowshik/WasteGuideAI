// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhzdXAuhOrC4T7gyAt-rXKtJ2p4N_dGwc",
  authDomain: "wasteguideai-b9617.firebaseapp.com",
  projectId: "wasteguideai-b9617",
  storageBucket: "wasteguideai-b9617.firebasestorage.app",
  messagingSenderId: "12600767525",
  appId: "1:12600767525:web:eb0f6140657389a86fbbcc",
  measurementId: "G-QF9RD8DD87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
