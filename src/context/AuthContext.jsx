import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getUserData, logOut } from '../services/auth';

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
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
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

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const { error: logoutError } = await logOut();
    if (logoutError) {
      setError(logoutError);
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
