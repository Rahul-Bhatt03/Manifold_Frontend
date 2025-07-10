import apiClient from './baseUrl.js';

const equipmentApi = {
  // Get all equipment with optional query parameters
  getAll: async (params = {}) => {
    const { data } = await apiClient.get('/equipment', { params });
    return data;
  },

  // Get equipment by ID
  getById: async (id) => {
    const { data } = await apiClient.get(`/equipment/${id}`);
    return data;
  },


// Create new equipment
create: async (equipmentData) => {
  console.log('API - Creating equipment with data:', equipmentData);
  
  const formData = new FormData();
  
  // Add basic fields - ensure they're not undefined
  formData.append('name', equipmentData.name || '');
  formData.append('category', equipmentData.category || '');
  formData.append('description', equipmentData.description || '');
  formData.append('application', equipmentData.application || '');
  
  // Add image if provided
  if (equipmentData.image) {
    formData.append('image', equipmentData.image);
  }
  
  // Debug log
  console.log('API - FormData contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  
  const { data } = await apiClient.post('/equipment', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
},

  // Update existing equipment
update: async (id, equipmentData) => {
  const formData = new FormData();
  
  // Add basic fields - check for undefined/null, not falsy values
  if (equipmentData.name !== undefined) formData.append('name', equipmentData.name);
  if (equipmentData.category !== undefined) formData.append('category', equipmentData.category);
  if (equipmentData.description !== undefined) formData.append('description', equipmentData.description);
  if (equipmentData.application !== undefined) formData.append('application', equipmentData.application);
  
  // Add image if provided
  if (equipmentData.image) {
    formData.append('image', equipmentData.image);
  }
  
  const { data } = await apiClient.put(`/equipment/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
},
  // Delete equipment
  delete: async (id) => {
    const { data } = await apiClient.delete(`/equipment/${id}`);
    return data;
  },

  // Get equipment by category
  getByCategory: async (category) => {
    const { data } = await apiClient.get(`/equipment/category/${encodeURIComponent(category)}`);
    return data;
  },

  // Get all equipment categories
  getCategories: async () => {
    const { data } = await apiClient.get('/equipment/categories');
    return data;
  }
};

export default equipmentApi;