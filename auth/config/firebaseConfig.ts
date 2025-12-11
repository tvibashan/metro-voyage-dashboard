"use client";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCkOMwyW3R0dYhaCtt21MsweMIu0Cf64kY",
  authDomain: "tourgeeky-89b38.firebaseapp.com",
  projectId: "tourgeeky-89b38",
  storageBucket: "tourgeeky-89b38.appspot.com",
  messagingSenderId: "358072780710",
  appId: "1:358072780710:web:b550dc7ab7a9f9bd687167"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
