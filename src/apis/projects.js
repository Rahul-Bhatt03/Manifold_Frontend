// apis/projects.js
import apiClient from './baseUrl';

export const projectsApi = {
  // Get all projects
  getAllProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  // Get project by ID
  getProjectById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  // Get projects by status
  getProjectsByStatus: async (status) => {
    const response = await apiClient.get(`/projects/status/${status}`);
    return response.data;
  },

  // Search projects
  searchProjects: async (searchTerm) => {
    const response = await apiClient.get(`/projects/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  // Get projects by date range
  getProjectsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(`/projects/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const formData = new FormData();
    
    // Map the project data to match the new schema
    const mappedData = {
      title: projectData.title,
      serviceTitle: projectData.serviceTitle || projectData.title, // Add serviceTitle
      description: projectData.description,
      location: projectData.location,
      projectType: projectData.projectType || 'General', // Add projectType
      status: projectData.status || 'ONGOING',
      link: projectData.link || null,
      date: projectData.date || new Date().toISOString(),
      startDate: projectData.startDate || new Date().toISOString(),
      completedDate: projectData.completedDate || null,
      image: projectData.image
    };
    
    // Append all fields to FormData
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key] !== null && mappedData[key] !== undefined) {
        formData.append(key, mappedData[key]);
      }
    });

    const response = await apiClient.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update project
  updateProject: async ({ id, projectData }) => {
    const formData = new FormData();
    
    // Map the project data to match the new schema
    const mappedData = {
      title: projectData.title,
      serviceTitle: projectData.serviceTitle,
      description: projectData.description,
      location: projectData.location,
      projectType: projectData.projectType,
      status: projectData.status,
      link: projectData.link,
      date: projectData.date,
      startDate: projectData.startDate,
      completedDate: projectData.completedDate,
      image: projectData.image
    };
    
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key] !== null && mappedData[key] !== undefined) {
        formData.append(key, mappedData[key]);
      }
    });

    const response = await apiClient.patch(`/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};