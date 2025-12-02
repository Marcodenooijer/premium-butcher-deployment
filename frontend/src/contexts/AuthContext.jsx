// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext({});

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
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
        
        const refreshInterval = setInterval(async () => {
          try {
            const newToken = await firebaseUser.getIdToken(true);
            setIdToken(newToken);
          } catch (error) {
            console.error('Error refreshing token:', error);
          }
        }, 55 * 60 * 1000);

        setLoading(false);
        return () => clearInterval(refreshInterval);
      } else {
        setUser(null);
        setIdToken(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIdToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };


  const value = {
    logout,
    user,
    idToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

