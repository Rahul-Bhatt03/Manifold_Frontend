// src/hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../apis/authApi';
import { useNavigate } from 'react-router-dom';

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

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Current user query hook
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await authApi.getCurrentUser();
      } catch (error) {
        // If API fails, fallback to localStorage
        const localUser = getUserFromStorage();
        if (localUser) return localUser;
        throw error;
      }
    },
    enabled: !!getAuthToken(), // Only run query if token exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    }
  });
};

// Update user mutation hook
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, updateData }) => {
      if (!userId) throw new Error("User ID is required");
      return authApi.updateUser(userId, updateData);
    },
    onSuccess: (updatedUser) => {
      // Update the query cache
      queryClient.setQueryData(['currentUser'], updatedUser);
      
      // Also update localStorage to keep in sync
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    },
    onError: (error) => {
      console.error("Update user failed:", error);
    }
  });
};

// Verify password mutation hook
export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: ({ userId, oldPassword }) => {
      if (!userId) throw new Error("User ID is required");
      if (!oldPassword) throw new Error("Password is required");
      return authApi.verifyPassword(userId, oldPassword);
    },
    onError: (error) => {
      console.error("Password verification failed:", error);
    }
  });
};

// Update password mutation hook
export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, newPassword }) => {
      if (!userId) throw new Error("User ID is required");
      if (!newPassword) throw new Error("New password is required");
      return authApi.updatePassword(userId, newPassword);
    },
    onSuccess: (updatedUser) => {
      // Update the query cache
      queryClient.setQueryData(['currentUser'], updatedUser);
      
      // Also update localStorage to keep in sync
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    },
    onError: (error) => {
      console.error("Password update failed:", error);
    }
  });
};

// Register mutation hook
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      try {
        // Extract token and user data
        const token = data.token || data.accessToken;
        const userData = data.user || data;
        
        if (!token) {
          throw new Error("No authentication token received");
        }

        // Store token
        localStorage.setItem('authToken', token);
        
        // Ensure user data has all required fields
        const userDataWithDefaults = {
          ...userData,
          role: userData.role || 'user'
        };
        
        // Store user data
        localStorage.setItem('userData', JSON.stringify(userDataWithDefaults));
        
        // Update React Query cache
        queryClient.setQueryData(['currentUser'], userDataWithDefaults);
        
        // Navigate to home
        navigate('/');
      } catch (error) {
        console.error('Error processing registration success:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });
};

// Login mutation hook
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      try {
        // Extract token and user data
        const token = data.token || data.accessToken;
        const userData = data.user || data;
        
        if (!token) {
          throw new Error("No authentication token received");
        }

        // Store token
        localStorage.setItem('authToken', token);
        
        // Store user data (preserve original role from database)
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update React Query cache
        queryClient.setQueryData(['currentUser'], userData);
        
        // Navigate to home
        navigate('/');
      } catch (error) {
        console.error('Error processing login success:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    try {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Clear React Query cache
      queryClient.removeQueries(['currentUser']);
      queryClient.clear(); // Clear all queries
      
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate even if there's an error
      navigate('/login');
    }
  };
};

// Main useAuth hook that combines everything
export const useAuth = () => {
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const currentUserQuery = useCurrentUser();
  const logout = useLogout();
  
  // Get current user data (with fallback to localStorage)
  const currentUser = currentUserQuery.data || getUserFromStorage();
  
  return {
    // Authentication methods
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    
    logout,
    
    // User data
    currentUser,
    isLoadingUser: currentUserQuery.isLoading,
    userError: currentUserQuery.error,
    
    // Computed properties
    isAuthenticated: !!(currentUser && getAuthToken()),
    userRole: currentUser?.role,
    userId: currentUser?._id,
    
    // Utility methods
    refetchUser: currentUserQuery.refetch,
  };
};