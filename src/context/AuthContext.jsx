import { createContext, useContext, useState, useEffect } from 'react';
import { isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Firebase is not configured, skip auth setup and go to demo mode
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Dynamically import auth services only when Firebase is configured
    let unsubscribe = () => {};

    const setupAuth = async () => {
      try {
        const { onAuthStateChange, getUserData } = await import('../services/auth');

        unsubscribe = onAuthStateChange(async (firebaseUser) => {
          setLoading(true);
          setError(null);

          if (firebaseUser) {
            setUser(firebaseUser);

            // Fetch additional user data from Firestore
            const { data, error: fetchError } = await getUserData(firebaseUser.uid);
            if (data) {
              setUserData(data);
            } else if (fetchError) {
              setError(fetchError);
            }
          } else {
            setUser(null);
            setUserData(null);
          }

          setLoading(false);
        });
      } catch {
        // Auth setup failed, continue without auth
        setLoading(false);
      }
    };

    setupAuth();

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setUserData(null);
      return;
    }

    try {
      const { logOut } = await import('../services/auth');
      const { error: logoutError } = await logOut();
      if (logoutError) {
        setError(logoutError);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    userData,
    loading,
    error,
    logout,
    clearError,
    isAuthenticated: !!user,
    isAthlete: userData?.role === 'athlete',
    isCoach: userData?.role === 'coach',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
