import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

// AuthProvider menyediakan state otentikasi ke seluruh aplikasi
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Sinkronisasi state dengan localStorage
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Fungsi untuk login, menyimpan token
  const login = (newToken) => {
    setToken(newToken);
  };

  // Fungsi untuk logout, menghapus token
  const logout = () => {
    setToken(null);
  };

  // Nilai yang akan disediakan oleh context
  const value = {
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook custom untuk mempermudah penggunaan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};