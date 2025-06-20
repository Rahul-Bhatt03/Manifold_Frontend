import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceAPI } from '../apis/services';
// import { toast } from 'react-hot-toast';

export const useGetAllServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: serviceAPI.getAllServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get service by ID
export const useGetServiceById = (id) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceAPI.getServiceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Hook to create service
export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceAPI.createService,
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
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
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error) => {
      console.error('Error deleting service:', error);
    },
  });
};