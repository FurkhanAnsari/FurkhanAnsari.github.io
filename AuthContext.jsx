import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData, profile: profileData } = response.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    setProfile(profileData);
    
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updatePassword = async (currentPassword, newPassword) => {
    await api.put('/auth/update-password', { currentPassword, newPassword });
  };

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    updatePassword,
    refreshUser: fetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

