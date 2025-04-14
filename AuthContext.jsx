import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const VITE_API_URL = import.meta.env.VITE_API_URL


export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setRole(parsedUser.role);
          setIsAuthenticated(true);
  
          // Verify user with the backend
          const fetchedUser = await fetchUser(parsedUser);
          if (fetchedUser) {
            setUser(fetchedUser);
            setRole(fetchedUser.role);
          } else {
            console.warn("User verification failed, but keeping local state.");
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    initializeAuth();
  }, []);

  const signIn = async (userInfo) => {
    try {
      setUser(userInfo);
      setRole(userInfo.role);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user'); // Remove the user info from localStorage
      localStorage.removeItem("activeLink");
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const fetchUser = async (user) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_FETCH_USER}`, {
        id: user.id,
        email: user.email,
      });

      return response.data; // Axios auto-parses JSON response
    } catch (error) {
      console.error('Error fetching user:', error);
      signOut();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        role,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
