import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../apis/blogs';

// Hook to get all blogs
export const useGetAllBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getAllBlogs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get blog by ID
export const useGetBlogById = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Hook to create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: () => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error creating blog:', error);
    },
  });
};

// Hook to update blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.updateBlog,
    onSuccess: (data, variables) => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      // Update specific blog cache
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
    },
  });
};

// Hook to delete blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.deleteBlog,
    onSuccess: () => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error deleting blog:', error);
    },
  });
};

// Custom hook to get user data from localStorage
export const useUserData = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return userData;
};