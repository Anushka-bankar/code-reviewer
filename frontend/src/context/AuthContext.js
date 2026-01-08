
// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Create context
export const AuthContext = createContext();

/**
 *  AuthProvider component
 * 
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage?.getItem('github_token') || null;
    }
    return null;
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Handle token from URL and fetch user
  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check for token in URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const urlError = urlParams.get('error');

        if (urlError) {
          console.error('❌ OAuth error:', urlError);
          alert('Authentication failed: ' + urlError);
          window.history.replaceState({}, document.title, '/');
          setLoading(false);
          return;
        }

        if (urlToken) {
          console.log('✅ Token received from GitHub OAuth');
          
          if (typeof window !== 'undefined') {
            window.localStorage?.setItem('github_token', urlToken);
          }
          
          setToken(urlToken);
          
          // Clean URL
          window.history.replaceState({}, document.title, '/');
          
          // Fetch user with new token
          await fetchUser(urlToken);
          return;
        }

        // Check if we have a stored token
        const storedToken = typeof window !== 'undefined' 
          ? window.localStorage?.getItem('github_token') 
          : null;

        if (storedToken) {
          console.log('🔄 Found stored token, fetching user...');
          await fetchUser(storedToken);
        } else {
          console.log('ℹ️ No token found, user not logged in');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setLoading(false);
      }
    };

    handleAuth();
  }, []); // Only run once on mount

  const fetchUser = async (authToken) => {
    // ✅ CRITICAL: Don't fetch if no token
    if (!authToken) {
      console.log('⚠️ No token provided to fetchUser');
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      console.log('🔄 Fetching user data...');
      
      // Decode JWT to get username
      const payload = authToken.split('.')[1];
      if (!payload) {
        throw new Error('Invalid token format');
      }

      const decoded = JSON.parse(atob(payload));
      console.log('📋 Decoded JWT:', decoded);

      // ✅ Check if token has required fields
      if (!decoded.login) {
        throw new Error('Token missing login field');
      }

      // Fetch full user data from GitHub API
      const userData = await api.getUserInfo(decoded.login);
      
      // ✅ Merge GitHub API data with JWT decoded data
      setUser({
        ...userData,
        githubId: decoded.githubId,
        login: decoded.login
      });

      console.log('✅ User loaded:', decoded.login);
    } catch (err) {
      console.error('❌ Failed to fetch user:', err);
      
      // Clear invalid token
      if (typeof window !== 'undefined') {
        window.localStorage?.removeItem('github_token');
      }
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    console.log('🔐 Redirecting to GitHub login...');
    window.location.href = `${process.env.REACT_APP_API_BASE_URL}/github/login`;
  };

  const logout = () => {
    console.log('👋 Logging out...');
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem('github_token');
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook to use auth context
export const useAuth = () => useContext(AuthContext);
