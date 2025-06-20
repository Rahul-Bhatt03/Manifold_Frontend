// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../apis/authApi';
import { useNavigate } from 'react-router-dom';

// First define useCurrentUser as a standalone hook
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    enabled: !!localStorage.getItem('authToken'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    }
  });
};

// Then define useRegister
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      // Store both token and user data with role
      const token = data.token || data.accessToken;
      const userData = data.user || data;
      
      localStorage.setItem('authToken', token);
      
      // Make sure to save the user data with role
      const userDataWithRole = {
        ...userData,
        role: userData.role || 'user' // Default to 'user' if no role is specified
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userDataWithRole));
      
      // Update React Query cache
      queryClient.setQueryData(['currentUser'], userDataWithRole);
      
      navigate('/');
    },
    onError: (error) => {
      console.error('Registration error:', error);
      // Don't navigate or show success - let the component handle the error
      throw error; // Re-throw to let the component catch it
    }
  });
};

// Then define useLogin
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store both token and user data with role
      const token = data.token || data.accessToken;
      const userData = data.user || data;
      
      localStorage.setItem('authToken', token);
      
      // Make sure to preserve the user's actual role from database
      const userDataWithRole = {
        ...userData,
        role: userData.role // Keep the role as returned from the database
      };
      
      // Store user data in localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userDataWithRole));
      
      // Update React Query cache
      queryClient.setQueryData(['currentUser'], userDataWithRole);
      
      navigate('/');
    },
    onError: (error) => {
      console.error('Login error:', error);
      // Don't navigate or show success - let the component handle the error
      throw error; // Re-throw to let the component catch it
    }
  });
};

// Then define useLogout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData'); // Also remove user data
    queryClient.removeQueries(['currentUser']);
    queryClient.resetQueries();
    navigate('/login');
  };
};

// Helper function to get user data from localStorage
export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

// Finally, create the main useAuth hook that combines them all
export const useAuth = () => {
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const currentUserQuery = useCurrentUser();
  
  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    currentUser: currentUserQuery.data || getUserFromStorage(), // Fallback to localStorage
    logout: useLogout(),
    // Additional utilities
    isAuthenticated: !!(currentUserQuery.data || getUserFromStorage()),
    userRole: (currentUserQuery.data || getUserFromStorage())?.role,
  };
};