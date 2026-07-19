import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClpuXXIG1nHG_2dR2mSfzidABG1p4CWU8",
  authDomain: "gen-lang-client-0255698631.firebaseapp.com",
  projectId: "gen-lang-client-0255698631",
  storageBucket: "gen-lang-client-0255698631.firebasestorage.app",
  messagingSenderId: "1074102809927",
  appId: "1:1074102809927:web:91d3f7a375d06ed05a4862"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
const dbId = "ai-studio-5ae08d7a-c87d-4f14-9e03-225903070a3f";
export const firestore = getFirestore(app, dbId);

// Initialize Auth
export const auth = getAuth(app);
