"use client";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../config/firebaseConfig";

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    console.log("Logged in with Google");
  } catch (error) {
    console.error("Google login error:", error);
  }
};

export const signInWithFacebook = async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
    console.log("Logged in with Facebook");
  } catch (error) {
    console.error("Facebook login error:", error);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
