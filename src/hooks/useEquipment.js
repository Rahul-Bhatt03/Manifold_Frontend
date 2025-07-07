// hooks/useEquipment.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import equipmentApi from '../apis/equipmentApi';

// Query keys for cache management
const EQUIPMENT_KEYS = {
  all: ['equipment'],
  lists: () => [...EQUIPMENT_KEYS.all, 'list'],
  list: (params) => [...EQUIPMENT_KEYS.lists(), params],
  details: () => [...EQUIPMENT_KEYS.all, 'detail'],
  detail: (id) => [...EQUIPMENT_KEYS.details(), id],
  categories: () => [...EQUIPMENT_KEYS.all, 'categories'],
  byCategory: (category) => [...EQUIPMENT_KEYS.all, 'category', category]
};

// Get all equipment with pagination and filtering
export const useEquipment = (params = {}) => {
  return useQuery({
    queryKey: EQUIPMENT_KEYS.list(params),
    queryFn: () => equipmentApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    select: (data) => ({
      equipment: data.data,
      pagination: data.pagination,
      success: data.success,
      message: data.message
    })
  });
};

// Get equipment by ID
export const useEquipmentById = (id) => {
  return useQuery({
    queryKey: EQUIPMENT_KEYS.detail(id),
    queryFn: () => equipmentApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    select: (data) => data.data
  });
};

// Get equipment by category
export const useEquipmentByCategory = (category) => {
  return useQuery({
    queryKey: EQUIPMENT_KEYS.byCategory(category),
    queryFn: () => equipmentApi.getByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    select: (data) => data.data
  });
};

// Get all equipment categories
export const useEquipmentCategories = () => {
  return useQuery({
    queryKey: EQUIPMENT_KEYS.categories(),
    queryFn: equipmentApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => data.data
  });
};

// Create equipment mutation
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: equipmentApi.create,
    onSuccess: (data) => {
      // Invalidate and refetch equipment lists
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.categories() });
      
      // Add the new equipment to the cache
      queryClient.setQueryData(
        EQUIPMENT_KEYS.detail(data.data.id),
        { data: data.data }
      );
    },
    onError: (error) => {
      console.error('Create equipment error:', error);
    }
  });
};

// Update equipment mutation
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...equipmentData }) => equipmentApi.update(id, equipmentData),
    onSuccess: (data, variables) => {
      // Update the specific equipment in cache
      queryClient.setQueryData(
        EQUIPMENT_KEYS.detail(variables.id),
        { data: data.data }
      );
      
      // Invalidate lists to refresh them
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.categories() });
    },
    onError: (error) => {
      console.error('Update equipment error:', error);
    }
  });
};

// Delete equipment mutation
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: equipmentApi.delete,
    onSuccess: (data, deletedId) => {
      // Remove the equipment from cache
      queryClient.removeQueries({ queryKey: EQUIPMENT_KEYS.detail(deletedId) });
      
      // Invalidate lists to refresh them
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_KEYS.categories() });
    },
    onError: (error) => {
      console.error('Delete equipment error:', error);
    }
  });
};

// Utility hook for equipment management with loading states
export const useEquipmentActions = () => {
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();
  const deleteMutation = useDeleteEquipment();

  return {
    // Actions
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    
    // Loading states
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    
    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    
    // Success states
    createSuccess: createMutation.isSuccess,
    updateSuccess: updateMutation.isSuccess,
    deleteSuccess: deleteMutation.isSuccess,
    
    // Reset functions
    resetCreate: createMutation.reset,
    resetUpdate: updateMutation.reset,
    resetDelete: deleteMutation.reset,
  };
};

// Export query keys for external use
export { EQUIPMENT_KEYS };