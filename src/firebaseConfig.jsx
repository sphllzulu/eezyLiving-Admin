import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBjogqSSQa1_oImLvHwcT8Mm1xuZjTb4XQ",
  authDomain: "eazyliving-fc25a.firebaseapp.com",
  projectId: "eazyliving-fc25a",
  storageBucket: "eazyliving-fc25a.appspot.com",
  messagingSenderId: "1002241710857",
  appId: "1:1002241710857:web:6a3119455401a28fcf51d8",
  measurementId: "G-YYC5844GYH"
};


export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);




export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);