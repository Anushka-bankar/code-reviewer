// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage?.getItem('github_token') || null;
    }
    return null;
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlError = urlParams.get('error');

        if (urlError) {
          alert('Authentication failed: ' + urlError);
          window.history.replaceState({}, document.title, '/');
          setLoading(false);
          return;
        }

        if (urlToken) {
          window.localStorage?.setItem('github_token', urlToken);
          setToken(urlToken);
          window.history.replaceState({}, document.title, '/');
          await fetchUser(urlToken);
          return;
        }

        const storedToken = window.localStorage?.getItem('github_token');
        if (storedToken) {
          await fetchUser(storedToken);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth init error:', error);
        setLoading(false);
      }
    };

    handleAuth();
  }, []);

  const fetchUser = async (authToken) => {
    if (!authToken) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const payload = authToken.split('.')[1];
      const decoded = JSON.parse(atob(payload));

      const userData = await api.getUserInfo(decoded.login);

      setUser({
        ...userData,
        githubId: decoded.githubId,
        login: decoded.login
      });
    } catch (err) {
      window.localStorage?.removeItem('github_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  
  const login = () => {
  window.location.href =
      `${process.env.REACT_APP_API_BASE_URL}/api/github/login`;
  };



  const logout = () => {
    window.localStorage?.removeItem('github_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
