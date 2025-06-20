// apis/services.js
import apiClient from "./baseUrl";

export const serviceAPI = {
  // Get all services
  getAllServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData) => {
    const formData = new FormData();
    formData.append('name', serviceData.name);
    formData.append('description', serviceData.description);
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }
    
    const response = await apiClient.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update service
  updateService: async (updateData) => {
    const { id, name, description, image } = updateData;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    
    const response = await apiClient.patch(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};