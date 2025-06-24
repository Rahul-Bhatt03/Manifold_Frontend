import apiClient from './baseUrl';

export const authApi = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  getCurrentUser: async () => {
     const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData?._id) {
      throw new Error("No user ID found");
    }
    const response = await apiClient.get(`/auth/user-details/${userData._id}`);
    return response.data;
  },

  updateUser:async(userId,data)=>{
    const response = await apiClient.patch(`/auth/update-user/${userId}`,data);
    return response.data;
  },

 verifyPassword: async (userId, oldPassword) => {
    const response = await apiClient.post(`/auth/verify-password/${userId}`, { 
      password: oldPassword  
    });
    return response.data;
  },


  updatePassword: async (userId, newPassword) => {
    const response = await apiClient.patch(`/auth/update-password/${userId}`, { 
      password: newPassword  
    });
    return response.data;
  }
};