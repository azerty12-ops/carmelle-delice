import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('carmel_token');
    if (token) {
      axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data);
      }).catch(() => {
        localStorage.removeItem('carmel_token');
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/login', { email, password });
    localStorage.setItem('carmel_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/register', { name, email, password, phone });
    localStorage.setItem('carmel_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const socialLogin = async (token, provider) => {
    const res = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/auth/social', { token, provider });
    localStorage.setItem('carmel_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('carmel_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('carmel_token');
    if (!token) return;
    try {
      const res = await axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  const updateUserInfo = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, socialLogin, logout, updateUserInfo, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
