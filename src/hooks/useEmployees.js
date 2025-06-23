// hooks/useEmployee.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEmployees,
  fetchEmployee,
  updateEmployee,
  deleteEmployee,
  createEmployee
} from '../apis/employeeApi';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });
};

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
    enabled: !!id,
    select: (data) => {
      if (!data) return null;

      const parseDate = (dateStr) => {
        try {
          return dateStr ? new Date(dateStr) : null;
        } catch {
          return null;
        }
      };

      return {
        ...data,
        createdAt: parseDate(data.createdAt),
        updatedAt: parseDate(data.updatedAt),
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || [],
        certifications: data.certifications || []
      };
    }
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgChart'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, employeeData }) => updateEmployee({ id, formData: employeeData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgChart'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee'] });
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgChart'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
};