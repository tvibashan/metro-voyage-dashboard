'use client'; // Add this line
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    const userId = Cookies.get('user_id');
    const email = Cookies.get('email');

    if (token && userId && email) {
      setUser({ id: userId, email });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token, userInfo) => {
    Cookies.set('access_token', token);
    Cookies.set('user_id', userInfo.id);
    Cookies.set('email', userInfo.email);
    setUser(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('user_id');
    Cookies.remove('email');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);