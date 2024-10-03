// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyChtDFPelxJCaBB1JUL0wmmiRyx0N2rIxk",
  authDomain: "taskmaster-d9861.firebaseapp.com",
  databaseURL: "https://taskmaster-d9861-default-rtdb.firebaseio.com",
  projectId: "taskmaster-d9861",
  storageBucket: "taskmaster-d9861.appspot.com",
  messagingSenderId: "85020246429",
  appId: "1:85020246429:web:e6fe19b3c08f5fffdaef74",
  measurementId: "G-0LHD3LY5J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage }; // Export auth along with db and storage
