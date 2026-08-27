import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api, { clearCsrfToken, readCollection } from '../utils/api';

const missingAuthProvider = async () => {
  throw new Error('AuthProvider is required for authenticated operations');
};

const defaultAuthContext = {
  user: null,
  isLoading: false,
  login: missingAuthProvider,
  register: missingAuthProvider,
  logout: missingAuthProvider,
  logoutAll: missingAuthProvider,
  refresh: missingAuthProvider,
  getMe: missingAuthProvider,
  checkAuth: missingAuthProvider,
  getCsrf: missingAuthProvider,
  updateProfile: missingAuthProvider,
  changePassword: missingAuthProvider,
  forgotPassword: missingAuthProvider,
  resetPassword: missingAuthProvider,
  verifyEmail: missingAuthProvider,
  resendVerification: missingAuthProvider,
  getUserBookings: missingAuthProvider,
};

const AuthContext = createContext(defaultAuthContext);

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
      setUser(data);
      return data;
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
    setUser(data);
    return data;
  };

  /**
   * POST /api/auth/register
   * Body: { email, password, name, phone }
   */
  const register = async (nameOrObj, email, phone, password) => {
    let payload;
    if (typeof nameOrObj === 'object' && nameOrObj !== null) {
      payload = nameOrObj;
    } else {
      payload = {
        name: nameOrObj,
        email,
        phone,
        password,
      };
    }

    const data = await api.post('/auth/register', payload);
    // Registration does not establish an authenticated cookie session.
    return data;
  };

  /**
   * PATCH /api/auth/profile
   * Body: { name, phone, nationality, preferredCurrency, preferredLanguage }
   */
  const updateProfile = async (profileData) => {
    const payload = Object.fromEntries(
      Object.entries({
        name: profileData?.name,
        phone: profileData?.phone,
        nationality: profileData?.nationality,
        preferredCurrency: profileData?.preferredCurrency,
        preferredLanguage: profileData?.preferredLanguage,
      }).filter(([, value]) => value !== undefined),
    );
    const data = await api.patch('/auth/profile', payload);
    const updatedUser = data;
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
        newPassword: oldPasswordOrObj.newPassword,
      };
    } else {
      payload = {
        oldPassword: oldPasswordOrObj,
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
    await api.post('/auth/logout', {});
    clearCsrfToken();
    setUser(null);
  };

  /**
   * POST /api/auth/logout-all
   */
  const logoutAll = async () => {
    await api.post('/auth/logout-all', {});
    clearCsrfToken();
    setUser(null);
  };

  const getUserBookings = async () => {
    return readCollection(await api.get('/bookings/me'), 'user bookings');
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
export const useAuth = () => useContext(AuthContext) || defaultAuthContext;
