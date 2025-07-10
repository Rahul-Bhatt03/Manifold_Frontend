import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../apis/blogs';

// Hook to get all blogs
export const useGetAllBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogApi.getAllBlogs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // Updated from cacheTime to gcTime (React Query v5)
  });
};

// Hook to get blog by ID
export const useGetBlogById = (id) => {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, // Updated from cacheTime to gcTime
  });
};

// Hook to create blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogApi.createBlog,
    onSuccess: (data) => {
      // Invalidate and refetch blogs list
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      
      // Optionally add the new blog to the cache
      queryClient.setQueryData(['blogs'], (oldData) => {
        if (oldData?.blogs) {
          return {
            ...oldData,
            blogs: [data, ...oldData.blogs]
          };
        }
        return oldData;
      });
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
      queryClient.setQueryData(['blog', variables.id], data);
      
      // Update the blog in the blogs list cache
      queryClient.setQueryData(['blogs'], (oldData) => {
        if (oldData?.blogs) {
          return {
            ...oldData,
            blogs: oldData.blogs.map(blog => 
              blog.id === variables.id ? data : blog
            )
          };
        }
        return oldData;
      });
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
    onSuccess: (data, variables) => {
      // Remove the blog from the blogs list cache
      queryClient.setQueryData(['blogs'], (oldData) => {
        if (oldData?.blogs) {
          return {
            ...oldData,
            blogs: oldData.blogs.filter(blog => blog.id !== variables)
          };
        }
        return oldData;
      });
      
      // Remove the specific blog from cache
      queryClient.removeQueries(['blog', variables]);
      
      // Invalidate blogs list as fallback
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