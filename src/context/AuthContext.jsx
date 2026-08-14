import { createContext, useContext, useState, useEffect } from 'react';
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);

const actionCodeSettings = {
  url: 'https://aurevia-brand.com/login',
  handleCodeInApp: true,
};

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const firebaseToken = await u.getIdToken();
        localStorage.setItem('firebaseToken', firebaseToken);

        // Sync with backend — save the custom JWT returned
        try {
          const res  = await fetch('https://aurevia-brand.com/api/v1/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firebaseIdToken: firebaseToken }),
          });
          const json = await res.json();
          // Backend returns { token: "...", data: { uid, email, name, picture } }
          if (json?.token) {
            localStorage.setItem('aurevia_token', json.token);
          }
          if (json?.data) {
            localStorage.setItem('aurevia_user', JSON.stringify(json.data));
          }
        } catch { /* silent */ }
      } else {
        localStorage.removeItem('firebaseToken');
        localStorage.removeItem('aurevia_token');
        localStorage.removeItem('aurevia_user');
      }
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  // إرسال Email Link
  const sendEmailLink = async (email) => {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    localStorage.setItem('emailForSignIn', email);
  };

  // إكمال Sign-in من Email Link
  const completeSignIn = async () => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return null;
    let email = localStorage.getItem('emailForSignIn');
    if (!email) email = window.prompt('Please confirm your email:');
    const result = await signInWithEmailLink(auth, email, window.location.href);
    const token  = await result.user.getIdToken();
    localStorage.setItem('firebaseToken', token);
    localStorage.removeItem('emailForSignIn');
    console.log('Firebase Token:', token);
    return { user: result.user, token };
  };

  // Google Sign-in — sync handled automatically in onAuthStateChanged
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result   = await signInWithPopup(auth, provider);
    return { user: result.user };
  };

  // Refresh Token
  const refreshToken = async () => {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken(true);
    localStorage.setItem('firebaseToken', token);
    return token;
  };

  // Get the backend JWT (used for cart, favorites, orders, etc.)
  const getAuthToken = () => {
    return localStorage.getItem('aurevia_token') || null;
  };

  // Sign out
  const logout = () => {
    localStorage.removeItem('firebaseToken');
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendEmailLink, completeSignIn, signInWithGoogle, refreshToken, getAuthToken, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
