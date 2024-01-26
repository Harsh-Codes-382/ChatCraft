import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: "whatsapp-ca86b",
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: "681735637780",
    appId: process.env.API_ID,
    measurementId: "G-NG95RKY5JX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)