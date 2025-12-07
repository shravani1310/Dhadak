import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState(localStorage.getItem('adminEmail'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    if (email) {
      localStorage.setItem('adminEmail', email);
    } else {
      localStorage.removeItem('adminEmail');
    }
  }, [email]);

  const login = (newToken, newEmail) => {
    setToken(newToken);
    setEmail(newEmail);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
