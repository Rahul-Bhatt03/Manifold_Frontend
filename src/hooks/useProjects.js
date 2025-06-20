import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../apis/projects';
import { toast } from 'react-hot-toast';

// Query Keys
export const QUERY_KEYS = {
  PROJECTS: 'projects',
  PROJECT: 'project',
};

// Get all projects
export const useGetAllProjects = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: projectsApi.getAllProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get project by ID
export const useGetProjectById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECT, id],
    queryFn: () => projectsApi.getProjectById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Create project mutation
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: (data) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      toast.success('Project created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    },
  });
};

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: (data, { id }) => {
      // Update the specific project in cache
      queryClient.setQueryData([QUERY_KEYS.PROJECT, id], data);
      // Invalidate projects list to ensure consistency
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      toast.success('Project updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update project';
      toast.error(message);
    },
  });
};

// Delete project mutation
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: (_, deletedId) => {
      // Remove project from cache
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.PROJECT, deletedId] });
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      toast.success('Project deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
    },
  });
};