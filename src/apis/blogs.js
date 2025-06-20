import apiClient from "./baseUrl";

export const blogApi = {
  // Get all blogs
  getAllBlogs: async () => {
    const response = await apiClient.get('/blogs');
    return response.data;
  },

  // Get blog by ID
  getBlogById: async (id) => {
    const response = await apiClient.get(`/blogs/${id}`);
    return response.data;
  },

  // Create new blog
  createBlog: async (blogData) => {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('author', blogData.author);
    if (blogData.image) {
      formData.append('image', blogData.image);
    }

    const response = await apiClient.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update blog
  updateBlog: async ({ id, blogData }) => {
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('author', blogData.author);
    if (blogData.image) {
      formData.append('image', blogData.image);
    }

    const response = await apiClient.patch(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },
};

