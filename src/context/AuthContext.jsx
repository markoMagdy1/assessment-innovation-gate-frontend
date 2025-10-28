import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    // const userData = await api.get('/me');
    setUser(userData.data);
  };

  const register = async (name, email, password, password_confirmation) => {
    const { data } = await api.post('/auth/signup', {
      name,
      email,
      password,
      password_confirmation,
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    setUser(null);
  };

  // useEffect(() => {
  //   const checkUser = async () => {
  //     try {
  //       const { data } = await api.get('/me');
  //       setUser(data);
  //     } catch {
  //       setUser(null);
  //     }
  //   };
  //   checkUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
