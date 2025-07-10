// hooks/useEmployee.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchEmployees,
  fetchEmployee,
  fetchOrgChart,
  fetchEmployeesByDepartment,
  fetchEmployeesByLevel,
  updateEmployee,
  deleteEmployee,
  createEmployee
} from '../apis/employeeApi';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEmployee = (id) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployee(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
        experience: data.experience ? data.experience.map(exp => ({
          ...exp,
          startDate: parseDate(exp.startDate),
          endDate: parseDate(exp.endDate),
          responsibilities: exp.responsibilities || []
        })) : [],
        projects: data.projects ? data.projects.map(proj => ({
          ...proj,
          technologies: proj.technologies || []
        })) : [],
        skills: data.skills || [],
        certifications: data.certifications || []
      };
    }
  });
};

export const useOrgChart = () => {
  return useQuery({
    queryKey: ['orgChart'],
    queryFn: fetchOrgChart,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useEmployeesByDepartment = (department) => {
  return useQuery({
    queryKey: ['employees', 'department', department],
    queryFn: () => fetchEmployeesByDepartment(department),
    enabled: !!department,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEmployeesByLevel = (level) => {
  return useQuery({
    queryKey: ['employees', 'level', level],
    queryFn: () => fetchEmployeesByLevel(level),
    enabled: !!level,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['orgChart'] });
    },
    onError: (error) => {
      console.error('Error creating employee:', error);
    }
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, employeeData }) => updateEmployee({ id, formData: employeeData }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['orgChart'] });
      queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
    },
    onError: (error) => {
      console.error('Error updating employee:', error);
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['orgChart'] });
    },
    onError: (error) => {
      console.error('Error deleting employee:', error);
    }
  });
};