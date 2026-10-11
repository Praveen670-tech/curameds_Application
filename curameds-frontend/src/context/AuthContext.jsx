import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getStoredUser());
  const [token, setToken] = useState(authService.getToken());
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (authService.getToken()) {
      try {
        const data = await authService.getCurrentUser();
        setProfile(data);
      } catch (err) {
        console.warn('Failed to load user profile', err);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const stored = authService.getStoredUser();
      const currentToken = authService.getToken();
      if (stored && currentToken) {
        setUser(stored);
        setToken(currentToken);
        await fetchProfile();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const newUser = { username: data.username, role: data.role };
    setUser(newUser);
    setToken(data.token);
    await fetchProfile();
    return data;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setProfile(null);
  };

  const hasRole = (...roles) => {
    if (!user || !user.role) return false;
    const current = user.role.toUpperCase().replace('_', '');
    return roles.some(r => r.toUpperCase().replace('_', '') === current);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      profile,
      loading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      hasRole,
      refreshProfile: fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
