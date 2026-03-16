import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCHdunDtuuqvvk3_v5Qhz2lU-p4Ngtiw9U",
  authDomain: "tba-nps.firebaseapp.com",
  projectId: "tba-nps",
  storageBucket: "tba-nps.firebasestorage.app",
  messagingSenderId: "2569608214",
  appId: "1:2569608214:web:1dca258d7af7133f33a937",
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
