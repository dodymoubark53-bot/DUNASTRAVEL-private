import { createContext, useState, useContext, useEffect } from 'react';
import api, { clearCsrfToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // api.get automatically unwraps the response envelope
        const data = await api.get('/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    // api.post fetches CSRF token automatically before sending
    const data = await api.post('/auth/login', { email, password });
    // Backend returns user object inside data
    const userData = data?.user || data;
    setUser(userData);
    return userData;
  };

  const register = async (name, email, phone, password) => {
    const data = await api.post('/auth/register', { name, email, phone, password });
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    }
    clearCsrfToken();
    setUser(null);
    window.location.href = '/';
  };

  if (isLoading) {
    return null; // Or a loader component
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
