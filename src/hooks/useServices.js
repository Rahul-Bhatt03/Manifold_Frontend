// hooks/useServices.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceAPI } from '../apis/services';

export const useGetAllServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await serviceAPI.getAllServices();
      return response.data; // Extract data from the response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get service by ID
export const useGetServiceById = (id) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await serviceAPI.getServiceById(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Hook to get services by category
export const useGetServicesByCategory = (categoryId) => {
  return useQuery({
    queryKey: ['services', 'category', categoryId],
    queryFn: async () => {
      const response = await serviceAPI.getServicesByCategory(categoryId);
      return response.data;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Hook to search services
export const useSearchServices = (query) => {
  return useQuery({
    queryKey: ['services', 'search', query],
    queryFn: async () => {
      const response = await serviceAPI.searchServices(query);
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceAPI.createService,
    onSuccess: (data) => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      // Optionally show success message
      if (data.message) {
        console.log('Success:', data.message);
      }
    },
    onError: (error) => {
      console.error('Error creating service:', error);
    },
  });
};

// Hook to update service
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceAPI.updateService,
    onSuccess: (data, variables) => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
      // Update the specific service in cache
      queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
      
      // Optionally show success message
      if (data.message) {
        console.log('Success:', data.message);
      }
    },
    onError: (error) => {
      console.error('Error updating service:', error);
    },
  });
};

// Hook to delete service
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceAPI.deleteService,
    onSuccess: (data) => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
      
      // Optionally show success message
      if (data.message) {
        console.log('Success:', data.message);
      }
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
    },
  });
};