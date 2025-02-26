import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      return result;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google successfully!');
      return result;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
