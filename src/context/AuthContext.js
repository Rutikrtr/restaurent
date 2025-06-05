import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define user interface
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        try {
          // Optional: Verify token validity with your backend
          // const response = await axios.get('http://localhost:8000/api/v1/user/verify-token', {
          //   headers: { Authorization: `Bearer ${token}` }
          // });
          
          // For now, just check if user data exists in localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          // Clear invalid tokens
          logout();
        }
      }
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:8000/api/v1/user/login/customer`,
        { email, password }
      );

      if (response.data.success) {
        // Store tokens in cookies
        Cookies.set('accessToken', response.data.data.accessToken, {
          expires: 7, // 7 days expiration
          secure: true,
          sameSite: 'strict',
          path: '/'
        });

        Cookies.set('refreshToken', response.data.data.refreshToken, {
          expires: 30, // 30 days expiration
          secure: true,
          sameSite: 'strict',
          path: '/'
        });

        // Store user in state
        const userData = response.data.data.user;
        setUser({
          id: userData._id,
          name: userData.fullname || userData.name,
          email: userData.email,
          role: userData.accountType || userData.role
        });
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  const logout = () => {
    // Clear cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    
    // Clear user state
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      logout, 
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};