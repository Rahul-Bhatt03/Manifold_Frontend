// hooks/useProjects.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../apis/projects';
import { toast } from 'react-hot-toast';

// Query Keys
export const QUERY_KEYS = {
  PROJECTS: 'projects',
  PROJECT: 'project',
  PROJECTS_BY_STATUS: 'projects-by-status',
  SEARCH_PROJECTS: 'search-projects',
  PROJECTS_BY_DATE_RANGE: 'projects-by-date-range',
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

// Get projects by status
export const useGetProjectsByStatus = (status) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS_BY_STATUS, status],
    queryFn: () => projectsApi.getProjectsByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
};

// Search projects
export const useSearchProjects = (searchTerm) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_PROJECTS, searchTerm],
    queryFn: () => projectsApi.searchProjects(searchTerm),
    enabled: !!searchTerm && searchTerm.trim() !== '',
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Get projects by date range
export const useGetProjectsByDateRange = (startDate, endDate) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS_BY_DATE_RANGE, startDate, endDate],
    queryFn: () => projectsApi.getProjectsByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

// Create project mutation
// Fixed useCreateProject in hooks/useProjects.js
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectData, imageFile }) => {
      // Combine projectData with imageFile
      const combinedData = {
        ...projectData,
        image: imageFile
      };
      return projectsApi.createProject(combinedData);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_STATUS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_DATE_RANGE] });
      
      // Don't show toast here since it's handled in the component
    },
    onError: (error) => {
      console.error('Create project error:', error);
      // Don't show toast here since it's handled in the component
    },
  });
};

// Fixed useUpdateProject
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, projectData, image }) => {
      // Combine projectData with image
      const combinedData = {
        ...projectData,
        image: image
      };
      return projectsApi.updateProject({ id, projectData: combinedData });
    },
    onSuccess: (data, { id }) => {
      // Update the specific project in cache
      queryClient.setQueryData([QUERY_KEYS.PROJECT, id], data);
      
      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_STATUS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_DATE_RANGE] });
      
      // Don't show toast here since it's handled in the component
    },
    onError: (error) => {
      console.error('Update project error:', error);
      // Don't show toast here since it's handled in the component
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
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_STATUS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEARCH_PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_DATE_RANGE] });
      
      toast.success('Project deleted successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
    },
  });
};

// Bulk operations (if needed)
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      return projectsApi.updateProject({ id, projectData: { status } });
    },
    onSuccess: (data, { id }) => {
      // Update the specific project in cache
      queryClient.setQueryData([QUERY_KEYS.PROJECT, id], data);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS_BY_STATUS] });
      
      toast.success('Project status updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update project status';
      toast.error(message);
    },
  });
};