import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api, { clearCsrfToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Global 401 listener: clear user state when unauthorized event is fired
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const data = await api.get('/auth/me');
      const userData = data?.user || data;
      setUser(userData);
      return userData;
    } catch (err) {
      setUser(null);
      throw err;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await getMe();
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [getMe]);

  /**
   * POST /api/auth/login
   * Body: { email, password }
   */
  const login = async (emailOrObj, passwordParam) => {
    const payload =
      typeof emailOrObj === 'object' && emailOrObj !== null
        ? emailOrObj
        : { email: emailOrObj, password: passwordParam };

    const data = await api.post('/auth/login', payload);
    const userData = data?.user || data;
    setUser(userData);
    return userData;
  };

  /**
   * POST /api/auth/register
   * Body: { email, password, name, phone, address, preferredLanguage }
   */
  const register = async (nameOrObj, email, phone, password, address, preferredLanguage) => {
    let payload;
    if (typeof nameOrObj === 'object' && nameOrObj !== null) {
      payload = nameOrObj;
    } else {
      payload = {
        name: nameOrObj,
        email,
        phone,
        password,
        address,
        preferredLanguage,
      };
    }

    const data = await api.post('/auth/register', payload);
    const userData = data?.user || data;
    if (userData && (userData.id || userData.email)) {
      setUser(userData);
    }
    return data;
  };

  /**
   * PATCH /api/auth/profile
   * Body: { name, phone, address, preferredLanguage }
   */
  const updateProfile = async (profileData) => {
    const data = await api.patch('/auth/profile', profileData);
    const updatedUser = data?.user || data;
    setUser((prev) => ({ ...prev, ...updatedUser }));
    return updatedUser;
  };

  /**
   * POST /api/auth/change-password
   * Body: { currentPassword, oldPassword, newPassword }
   */
  const changePassword = async (oldPasswordOrObj, newPasswordParam) => {
    let payload;
    if (typeof oldPasswordOrObj === 'object' && oldPasswordOrObj !== null) {
      payload = {
        oldPassword: oldPasswordOrObj.oldPassword || oldPasswordOrObj.currentPassword,
        currentPassword: oldPasswordOrObj.currentPassword || oldPasswordOrObj.oldPassword,
        newPassword: oldPasswordOrObj.newPassword,
      };
    } else {
      payload = {
        oldPassword: oldPasswordOrObj,
        currentPassword: oldPasswordOrObj,
        newPassword: newPasswordParam,
      };
    }

    const data = await api.post('/auth/change-password', payload);
    return data;
  };

  /**
   * POST /api/auth/forgot-password
   * Body: { email }
   */
  const forgotPassword = async (emailOrObj) => {
    const payload =
      typeof emailOrObj === 'object' && emailOrObj !== null
        ? emailOrObj
        : { email: emailOrObj };

    const data = await api.post('/auth/forgot-password', payload);
    return data;
  };

  /**
   * POST /api/auth/reset-password
   * Body: { token, newPassword }
   */
  const resetPassword = async (tokenOrObj, newPasswordParam) => {
    const payload =
      typeof tokenOrObj === 'object' && tokenOrObj !== null
        ? tokenOrObj
        : { token: tokenOrObj, newPassword: newPasswordParam };

    const data = await api.post('/auth/reset-password', payload);
    return data;
  };

  /**
   * POST /api/auth/verify-email
   * Body: { token }
   */
  const verifyEmail = async (tokenOrObj) => {
    const payload =
      typeof tokenOrObj === 'object' && tokenOrObj !== null
        ? tokenOrObj
        : { token: tokenOrObj };

    const data = await api.post('/auth/verify-email', payload);
    return data;
  };

  /**
   * POST /api/auth/resend-verification
   * Body: { email }
   */
  const resendVerification = async (emailOrObj) => {
    const payload =
      typeof emailOrObj === 'object' && emailOrObj !== null
        ? emailOrObj
        : { email: emailOrObj };

    const data = await api.post('/auth/resend-verification', payload);
    return data;
  };

  /**
   * POST /api/auth/refresh
   */
  const refresh = async () => {
    const data = await api.post('/auth/refresh', {});
    clearCsrfToken();
    return data;
  };

  /**
   * GET /api/auth/csrf
   */
  const getCsrf = async () => {
    const data = await api.get('/auth/csrf');
    return data;
  };

  /**
   * POST /api/auth/logout
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    }
    clearCsrfToken();
    setUser(null);
  };

  /**
   * POST /api/auth/logout-all
   */
  const logoutAll = async () => {
    try {
      await api.post('/auth/logout-all', {});
    } catch {
      // Ignore network errors on logout-all
    }
    clearCsrfToken();
    setUser(null);
  };

  const getUserBookings = async () => {
    try {
      const data = await api.get('/bookings/me');
      return Array.isArray(data) ? data : data?.data || [];
    } catch {
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        logoutAll,
        refresh,
        getMe,
        checkAuth: getMe,
        getCsrf,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        getUserBookings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
