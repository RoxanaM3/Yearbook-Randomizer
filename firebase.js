// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAouO2XczT3EKqebZyTwqj7yFfPeS46csg",
  authDomain: "yearbook-randomizer.firebaseapp.com",
  projectId: "yearbook-randomizer",
  storageBucket: "yearbook-randomizer.firebasestorage.app",
  messagingSenderId: "127922673093",
  appId: "1:127922673093:web:67c4286b84a062f35827ac"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, getDoc, setDoc, onSnapshot };
