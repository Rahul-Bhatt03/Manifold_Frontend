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

  // Get services by category
  getServicesByCategory: async (categoryId) => {
    const response = await apiClient.get(`/services/category/${categoryId}`);
    return response.data;
  },

  // Search services
  searchServices: async (query) => {
    const response = await apiClient.get(`/services/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Create new service
  createService: async (serviceData) => {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('title', serviceData.title);
    formData.append('categoryId', serviceData.categoryId);
    
    // Add image if provided
    if (serviceData.image) {
      formData.append('image', serviceData.image);
    }
    
    // Add descriptions as JSON string
    if (serviceData.descriptions) {
      formData.append('descriptions', JSON.stringify(serviceData.descriptions));
    }
    
    // Add methods as JSON string
    if (serviceData.methods) {
      formData.append('methods', JSON.stringify(serviceData.methods));
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
    const { id, title, categoryId, image, descriptions, methods } = updateData;
    const formData = new FormData();
    
    // Add basic fields if provided
    if (title) formData.append('title', title);
    if (categoryId) formData.append('categoryId', categoryId);
    
    // Add image if provided
    if (image) {
      formData.append('image', image);
    }
    
    // Add descriptions as JSON string if provided
    if (descriptions) {
      formData.append('descriptions', JSON.stringify(descriptions));
    }
    
    // Add methods as JSON string if provided
    if (methods) {
      formData.append('methods', JSON.stringify(methods));
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