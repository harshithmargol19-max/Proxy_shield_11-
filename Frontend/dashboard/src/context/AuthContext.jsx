import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Send user UID to backend for registration/sync
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return null;

    try {
      const idToken = await firebaseUser.getIdToken();
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      
      const response = await axios.post(
        `${API_BASE}/users/firebase-sync`,
        {
          firebase_uid: firebaseUser.uid,
          real_email: firebaseUser.email || null,
          display_name: firebaseUser.displayName || null,
          photo_url: firebaseUser.photoURL || null,
          is_anonymous: firebaseUser.isAnonymous,
        },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (err) {
      console.error('[Auth] Backend sync failed:', err.message);
      // Don't fail auth if backend sync fails
      return null;
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
          emailVerified: firebaseUser.emailVerified,
        };
        setUser(userData);
        
        // Sync with backend
        await syncUserWithBackend(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      setError(err.message);
      console.error('[Auth] Google sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in anonymously
  const signInAnonymousUser = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (err) {
      setError(err.message);
      console.error('[Auth] Anonymous sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      console.error('[Auth] Sign-out error:', err);
      throw err;
    }
  };

  // Get current user's ID token (for API calls)
  const getIdToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInAnonymousUser,
    signOut,
    getIdToken,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
