"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  User, 
  AuthProvider as FirebaseAuthProvider 
} from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../config/firebaseConfig";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, additionalInfo?: { firstName: string; lastName: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("Logged-in user:", firebaseUser); // Logs the user to the console
    });
    return () => unsubscribe();
  }, []);

  // Email login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Email signup
  const signUpWithEmail = async (email: string, password: string, additionalInfo?: { firstName: string; lastName: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (additionalInfo) {
      // Store additional user data if needed, e.g., in Firestore
      const { firstName, lastName } = additionalInfo;
      console.log("Additional info:", firstName, lastName);
    }
    setUser(userCredential.user);
  };

  // Google login
  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  // Facebook login
  const loginWithFacebook = async () => {
    await signInWithPopup(auth, facebookProvider);
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, signUpWithEmail, loginWithGoogle, loginWithFacebook, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
