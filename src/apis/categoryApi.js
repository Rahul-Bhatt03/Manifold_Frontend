import apiClient from './baseUrl';

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get('/categories');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Get category by ID
export const getCategoryById = async (id) => {
  try {
    if (!id) throw new Error('Category ID is required');
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const validation = validateCategoryData(categoryData);
    if (!validation.isValid) throw new Error(validation.message);

    const formData = new FormData();
   formData.append('name', categoryData.name?.trim?.() || '');
formData.append('description', categoryData.description?.trim?.() || '');
    if (categoryData.image) formData.append('image', categoryData.image);

    const response = await apiClient.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Update category
export const updateCategory = async (id, categoryData) => {
  try {
    if (!id) throw new Error('Category ID is required');

    const hasName = categoryData.name && categoryData.name.trim();
    const hasDescription = categoryData.description && categoryData.description.trim();
    const hasImage = categoryData.image;

    if (!hasName && !hasDescription && !hasImage)
      throw new Error('At least one field (name, description, or image) must be provided for update');

    const formData = new FormData();
    if (hasName) formData.append('name', categoryData.name.trim());
    if (hasDescription) formData.append('description', categoryData.description.trim());
    if (hasImage) formData.append('image', categoryData.image);

    const response = await apiClient.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Delete category
export const deleteCategory = async (id) => {
  try {
    if (!id) throw new Error('Category ID is required');
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Validation helper
export const validateCategoryData = (categoryData, isUpdate = false) => {
  const errors = [];

  if (!isUpdate) {
    if (!categoryData.name || !categoryData.name.trim()) errors.push('Category name is required');
    if (!categoryData.description || !categoryData.description.trim()) errors.push('Category description is required');
    if (!categoryData.image) errors.push('Category image is required');
  }

  if (categoryData.name && categoryData.name.trim().length > 100) errors.push('Category name must be less than 100 characters');
  if (categoryData.description && categoryData.description.trim().length > 500) errors.push('Category description must be less than 500 characters');

  if (categoryData.image) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(categoryData.image.type)) errors.push('Image must be a JPEG, JPG, or PNG file');

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (categoryData.image.size > maxSize) errors.push('Image size must be less than 5MB');
  }

  return {
    isValid: errors.length === 0,
    message: errors.join(', '),
    errors,
  };
};

// Error handler
export const handleError = (error) => {
  if (error.response) {
    const { data, status } = error.response;
    return {
      message: data?.message || 'An error occurred',
      status,
      success: false,
      errors: data?.errors || [],
    };
  } else if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      success: false,
      errors: [],
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      success: false,
      errors: [],
    };
  }
};
