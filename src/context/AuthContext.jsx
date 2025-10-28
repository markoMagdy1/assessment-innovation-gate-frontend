import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    const userData = data.data.user;
    const userToken = data.data.token;

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);

    api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const register = async (name, email, password, password_confirmation) => {
    const { data } = await api.post('/auth/signup', {
      name,
      email,
      password,
      password_confirmation,
    });

    const userData = data.data.user;
    const userToken = data.data.token;

    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(userToken);
    setUser(userData);

    api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
