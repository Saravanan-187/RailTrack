import React, { createContext, useState, useEffect, useContext } from "react";
import { getToken, removeToken } from "@/utils/auth";
import { authAPI } from "@/services/api";

// Create context
const AuthContext = createContext(undefined);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = getToken();
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (token) => {
    try {
      const response = await authAPI.getCurrentUser(token);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token might be invalid, remove it
        removeToken();
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    // Store token
    localStorage.setItem("token", token);
    // Fetch user data
    fetchCurrentUser(token);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};