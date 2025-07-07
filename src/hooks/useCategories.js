// hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceAPI } from '../apis/services';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await serviceAPI.getAllCategories();
      // Handle both direct data and nested response structure
      return response.data || response;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      // Ensure data is an array before sorting
      if (Array.isArray(data)) {
        return data.sort((a, b) => a.name.localeCompare(b.name));
      }
      return [];
    },
    onError: (error) => {
      console.error('Error fetching categories:', error);
    }
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await serviceAPI.getCategoryById(id);
      return response.data || response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      console.error('Error fetching category:', error);
    }
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData) => {
      const response = await serviceAPI.createCategory(categoryData);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      throw error;
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...categoryData }) => {
      const response = await serviceAPI.updateCategory(id, categoryData);
      return response.data || response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['categories']);
      queryClient.setQueryData(['category', variables.id], data);
    },
    onError: (error) => {
      console.error('Error updating category:', error);
      throw error;
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await serviceAPI.deleteCategory(id);
      return response.data || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      throw error;
    }
  });
};

// Additional hook for dropdown/select usage
export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ['categoryOptions'],
    queryFn: async () => {
      const response = await serviceAPI.getAllCategories();
      const categories = response.data || response;
      
      if (Array.isArray(categories)) {
        return categories.map(category => ({
          value: category.id,
          label: category.name,
          ...category
        }));
      }
      return [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    onError: (error) => {
      console.error('Error fetching category options:', error);
    }
  });
};