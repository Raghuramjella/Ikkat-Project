import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const getToken = () => localStorage.getItem('token');
  const getRole = () => localStorage.getItem('role');

  const value = {
    login,
    logout,
    getToken,
    getRole,
    isAuthenticated: !!getToken(),
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}