import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOeOXyE5Gy9W6smn7GZY96ReJ2INLyb0M",
  authDomain: "quran-revision-app.firebaseapp.com",
  projectId: "quran-revision-app",
  storageBucket: "quran-revision-app.firebasestorage.app",
  messagingSenderId: "624873978871",
  appId: "1:624873978871:web:0b855d5976e71aca17ccf2",
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();