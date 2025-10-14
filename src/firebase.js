import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCk6nwUGtCvoE_x0Fela02VFcnd8bzduI0",

  authDomain: "dnd-webapp-2f635.firebaseapp.com",

  projectId: "dnd-webapp-2f635",

  storageBucket: "dnd-webapp-2f635.firebasestorage.app",

  messagingSenderId: "774964002115",

  appId: "1:774964002115:web:84e94ff9eec7b5d8f083f6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
