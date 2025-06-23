// apis/employeeApi.js
import apiClient from "./baseUrl";

export const fetchEmployees = async () => {
  const { data } = await apiClient.get('/employees');
  return data;
};

export const fetchEmployee = async (id) => {
  const { data } = await apiClient.get(`/employees/${id}`);
  return data;
};

export const createEmployee = async (formData) => {
  const { data } = await apiClient.post('/employees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const updateEmployee = async ({ id, formData }) => {
  const { data } = await apiClient.put(`/employees/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteEmployee = async (id) => {
  await apiClient.delete(`/employees/${id}`);
};