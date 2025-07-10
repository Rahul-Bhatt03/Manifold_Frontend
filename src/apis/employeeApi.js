// apis/employeeApi.js
import apiClient from "./baseUrl";

export const fetchEmployees = async () => {
  const { data } = await apiClient.get('/employees');
  return data.data; // Extract the data array from the response
};

export const fetchEmployee = async (id) => {
  const { data } = await apiClient.get(`/employees/${id}`);
  return data.data; // Extract the data object from the response
};

export const fetchOrgChart = async () => {
  const { data } = await apiClient.get('/employees/org-chart');
  return data.data; // Extract the data array from the response
};

export const fetchEmployeesByDepartment = async (department) => {
  const { data } = await apiClient.get(`/employees/department/${department}`);
  return data.data; // Extract the data array from the response
};

export const fetchEmployeesByLevel = async (level) => {
  const { data } = await apiClient.get(`/employees/level/${level}`);
  return data.data; // Extract the data array from the response
};

export const createEmployee = async (formData) => {
  const { data } = await apiClient.post('/employees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data.data; // Extract the data object from the response
};

export const updateEmployee = async ({ id, formData }) => {
  const { data } = await apiClient.put(`/employees/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data.data; // Extract the data object from the response
};

export const deleteEmployee = async (id) => {
  const { data } = await apiClient.delete(`/employees/${id}`);
  return data; // Return the success response
};