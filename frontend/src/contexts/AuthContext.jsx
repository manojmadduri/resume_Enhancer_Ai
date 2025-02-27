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
  sendEmailVerification,
} from 'firebase/auth';
import { toast } from 'react-toastify';

// Firebase configuration
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

  // Sign up with email and password
  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      toast.success('Account created! Please check your email for verification.');
      await signOut(auth); // Sign out immediately after registration
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      let message = 'Failed to create account.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      toast.error(message);
      throw error;
    }
  }

  // Sign in with email and password
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        toast.error('Please verify your email before logging in. Check your inbox for the verification link.');
        throw new Error('Email not verified');
      }
      
      toast.success('Logged in successfully!');
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Failed to log in.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.message === 'Email not verified') {
        message = 'Please verify your email before logging in. Check your inbox for the verification link.';
      }
      toast.error(message);
      throw error;
    }
  }

  // Sign in with Google
  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google successfully!');
      return result;
    } catch (error) {
      console.error('Google login error:', error);
      let message = 'Failed to log in with Google.';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Login popup was closed.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Login popup was blocked. Please allow popups for this site.';
      }
      toast.error(message);
      throw error;
    }
  }

  // Sign out
  async function logout() {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
      throw error;
    }
  }

  // Reset password
  async function resetPassword(email) {
    if (!email) {
      throw new Error('Email is required');
    }

    try {
      console.log('Attempting to send password reset email to:', email);
      const auth = getAuth();
      
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log('Password reset email sent successfully');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  }

  // Listen to auth state changes
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

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}
