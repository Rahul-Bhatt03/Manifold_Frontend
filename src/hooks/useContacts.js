// hooks/useContacts.js

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../apis/contactApi.js';

export const CONTACT_KEYS = {
  all: ['contacts'],
  lists: () => [...CONTACT_KEYS.all, 'list'],
  list: (filters) => [...CONTACT_KEYS.lists(), { filters }],
  details: () => [...CONTACT_KEYS.all, 'detail'],
  detail: (id) => [...CONTACT_KEYS.details(), id],
};

// Create contact
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.createContact(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CONTACT_KEYS.lists() });
      toast.success(data.message || 'Contact created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create contact');
    },
  });
};

// Get all contacts
export const useContacts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: CONTACT_KEYS.list({ page, limit }),
    queryFn: () => api.getContacts(page, limit),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};

// Get contact by ID
export const useContact = (id) => {
  return useQuery({
    queryKey: CONTACT_KEYS.detail(id),
    queryFn: () => api.getContactById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Delete contact
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.deleteContact(id),
    onSuccess: (data, id) => {
      queryClient.removeQueries({ queryKey: CONTACT_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CONTACT_KEYS.lists() });
      toast.success(data.message || 'Contact deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete contact');
    },
  });
};

// Health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.healthCheck(),
    refetchInterval: 30000,
    retry: 3,
  });
};
