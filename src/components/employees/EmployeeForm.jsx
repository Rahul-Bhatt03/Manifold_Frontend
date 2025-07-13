import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  CardHeader,
  Collapse,
  CardContent,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Close,
  Add,
  Delete,
  School,
  Work,
  Code,
  Star,
  Description,
  ExpandMore,
  ExpandLess,
  Warning
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../../hooks/useEmployees';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Create custom theme with Poppins font
const customTheme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  },
});

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  department: yup.string().required('Department is required'),
  level: yup.number().required('Level is required'),
  education: yup.array().of(
    yup.object().shape({
      degree: yup.string().required('Degree is required'),
      institution: yup.string().required('Institution is required'),
      yearGraduated: yup.number().required('Year is required'),
      fieldOfStudy: yup.string().required('Field of study is required')
    })
  ),
  experience: yup.array().of(
    yup.object().shape({
      company: yup.string().required('Company is required'),
      position: yup.string().required('Position is required'),
      startDate: yup.date().required('Start date is required'),
      responsibilities: yup.array().of(yup.string().required('Responsibility is required'))
    })
  ),
  projects: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Project name is required'),
      description: yup.string().required('Description is required'),
      technologies: yup.array().of(yup.string().required('Technology is required')),
      role: yup.string().required('Role is required'),
      duration: yup.string().required('Duration is required')
    })
  )
});

const departments = ['Executive', 'Engineering', 'Operations', 'Finance', 'HR', 'Marketing'];
const levels = [
  { value: 1, label: 'CEO' },
  { value: 2, label: 'Executives' },
  { value: 3, label: 'Managers' },
  { value: 4, label: 'Staff' }
];
const positions = [
  'CEO',
  'Project Director',
  'Construction Manager',
  'Site Manager',
  'Project Manager',
  'Site Engineer',
  'Civil Engineer',
  'Structural Engineer',
  'Architect',
  'Quantity Surveyor',
  'Estimator',
  'Health & Safety Manager',
  'Foreman',
  'Site Supervisor',
  'Building Inspector',
  'Surveyor',
  'Planner/Scheduler',
  'MEP Engineer (Mechanical, Electrical, Plumbing)',
  'Quality Control Manager',
  'Contracts Manager',
  'Procurement Manager',
  'Carpenter',
  'Bricklayer',
  'Electrician',
  'Plumber',
  'Welder',
  'Plant Operator',
  'Laborer',
  'General Contractor',
  'Subcontractor'
];

const EmployeeForm = ({ 
  employee = null, 
  onCancel, 
  employees = [], 
  onSuccess 
}) => {
  const theme = useTheme();
  const [imagePreview, setImagePreview] = useState(employee?.image || null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    education: true,
    experience: true,
    projects: true,
    skills: true
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const formik = useFormik({
    initialValues: {
      name: employee?.name || '',
      position: employee?.position || '',
      image: employee?.image || '',
      level: employee?.level || 3,
      parentId: employee?.parentId || null,
      department: employee?.department || 'Engineering',
       education: employee?.education?.map(edu => ({
      id: edu.id, // Preserve existing ID if editing
      degree: edu.degree || '',
      institution: edu.institution || '',
      yearGraduated: edu.year || edu.yearGraduated || new Date().getFullYear(), // Handle both fields
      fieldOfStudy: edu.fieldOfStudy || ''
    })) || [],
    experience: employee?.experience?.map(exp => ({
      id: exp.id, // Preserve existing ID if editing
      company: exp.company || '',
      position: exp.position || '',
      startDate: exp.startDate ? exp.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
      endDate: exp.endDate ? exp.endDate.split('T')[0] : null,
      responsibilities: exp.responsibilities?.length > 0 
        ? [...exp.responsibilities] 
        : ['']
    })) || [],
    projects: employee?.projects || [],
    skills: employee?.skills || [],
    certifications: employee?.certifications || []
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        
        // Append all non-image fields
        formData.append('name', values.name);
        formData.append('position', values.position);
        formData.append('level', values.level);
        formData.append('department', values.department);
        if (values.parentId) formData.append('parentId', values.parentId);
        
        // Stringify arrays
        formData.append('education', JSON.stringify(values.education));
        formData.append('experience', JSON.stringify(values.experience));
        formData.append('projects', JSON.stringify(values.projects));
        formData.append('skills', JSON.stringify(values.skills));
        formData.append('certifications', JSON.stringify(values.certifications));

        // Append image file if it's a new file (not a URL)
        if (selectedImage && typeof selectedImage !== 'string') {
          formData.append('image', selectedImage);
        }

        if (employee) {
          // Update existing employee
          await updateMutation.mutateAsync({
            id: employee.id,
            employeeData: formData
          });
        } else {
          // Create new employee
          await createMutation.mutateAsync(formData);
        }
        
        // Reset the form after successful save
        resetForm();
        setImagePreview(null);
        setSelectedImage(null);
        
        // Call onSuccess if it exists
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
      } catch (error) {
        console.error('Error saving employee:', error);
      }
    }
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await deleteMutation.mutateAsync(employee.id);
      onSuccess();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('employee-form');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formik.values.name}-profile.pdf`);
    });
  };

  const handleAddItem = (field) => {
    const newItem = field === 'education' ? {
      degree: '',
      institution: '',
      yearGraduated: new Date().getFullYear(),
      fieldOfStudy: ''
    } : field === 'experience' ? {
      company: '',
      position: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      responsibilities: ['']
    } : {
      name: '',
      description: '',
      technologies: [''],
      role: '',
      duration: ''
    };
    
    formik.setFieldValue(field, [...formik.values[field], newItem]);
  };

  const handleRemoveItem = (field, index) => {
    const newItems = [...formik.values[field]];
    newItems.splice(index, 1);
    formik.setFieldValue(field, newItems);
  };

  const handleAddSubItem = (field, index, subField) => {
    const newItems = [...formik.values[field]];
    newItems[index][subField].push('');
    formik.setFieldValue(field, newItems);
  };

  const handleRemoveSubItem = (field, index, subField, subIndex) => {
    const newItems = [...formik.values[field]];
    newItems[index][subField].splice(subIndex, 1);
    formik.setFieldValue(field, newItems);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if mutations are loading
  const isMutationLoading = createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading;

  return (
    <ThemeProvider theme={customTheme}>
      <Box 
        component="form" 
        onSubmit={formik.handleSubmit} 
        sx={{ 
          p: 3,
          fontFamily: 'Poppins, sans-serif',
          // Add Google Fonts import
          '@import': 'url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)'
        }}
      >
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          `}
        </style>
        
        <Grid container spacing={4}>
          {/* Left Column - Profile Info */}
          <Grid item xs={12} lg={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                height: 'fit-content',
                position: 'sticky',
                top: 20
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar
                  src={imagePreview}
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 3,
                    border: `3px solid ${theme.palette.primary.main}`,
                    boxShadow: theme.shadows[4]
                  }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="employee-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="employee-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ 
                      mb: 2,
                      minHeight: 42,
                      px: 3
                    }}
                    disabled={isMutationLoading}
                  >
                    Change Photo
                  </Button>
                </label>
                {!imagePreview && (
                  <Typography color="error" variant="caption">
                    Employee image is required
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ 
                    '& .MuiInputBase-root': { 
                      minHeight: 56,
                      fontFamily: 'Poppins, sans-serif'
                    } 
                  }}
                />

                <FormControl fullWidth disabled={isMutationLoading}>
                  <InputLabel sx={{ fontFamily: 'Poppins, sans-serif' }}>Position</InputLabel>
                  <Select
                    name="position"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    error={formik.touched.position && Boolean(formik.errors.position)}
                    label="Position"
                    sx={{ 
                      minHeight: 56,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {positions.map((position) => (
                      <MenuItem key={position} value={position} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        {position}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.position && formik.errors.position && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1.5 }}>
                      {formik.errors.position}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Poppins, sans-serif' }}>Department</InputLabel>
                  <Select
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    label="Department"
                    sx={{ 
                      minHeight: 56,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Poppins, sans-serif' }}>Hierarchy Level</InputLabel>
                  <Select
                    name="level"
                    value={formik.values.level}
                    onChange={formik.handleChange}
                    error={formik.touched.level && Boolean(formik.errors.level)}
                    label="Hierarchy Level"
                    sx={{ 
                      minHeight: 56,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    {levels.map((level) => (
                      <MenuItem key={level.value} value={level.value} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: 'Poppins, sans-serif' }}>Reports To</InputLabel>
                  <Select
                    name="parentId"
                    value={formik.values.parentId || ''}
                    onChange={formik.handleChange}
                    label="Reports To"
                    sx={{ 
                      minHeight: 56,
                      fontFamily: 'Poppins, sans-serif'
                    }}
                  >
                    <MenuItem value="" sx={{ fontFamily: 'Poppins, sans-serif' }}>None (Top Level)</MenuItem>
                    {employees
                      .filter(e => e.id !== employee?.id)
                      .map((emp) => (
                        <MenuItem key={emp.id} value={emp.id} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                          {emp.name} - {emp.position}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Detailed Info */}
          <Grid item xs={12} lg={8}>
            {/* Education Section */}
            <Paper elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Education</Typography>
                  </Box>
                }
                action={
                  <IconButton onClick={() => toggleSection('education')}>
                    {expandedSections.education ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Collapse in={expandedSections.education}>
                <CardContent sx={{ pt: 0 }}>
                  {formik.values.education.map((edu, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 4, 
                        p: 3, 
                        border: `1px solid ${theme.palette.divider}`, 
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[50]
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Degree"
                            name={`education[${index}].degree`}
                            value={edu.degree}
                            onChange={formik.handleChange}
                            error={formik.touched.education?.[index]?.degree && Boolean(formik.errors.education?.[index]?.degree)}
                            helperText={formik.touched.education?.[index]?.degree && formik.errors.education?.[index]?.degree}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Institution"
                            name={`education[${index}].institution`}
                            value={edu.institution}
                            onChange={formik.handleChange}
                            error={formik.touched.education?.[index]?.institution && Boolean(formik.errors.education?.[index]?.institution)}
                            helperText={formik.touched.education?.[index]?.institution && formik.errors.education?.[index]?.institution}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Field of Study"
                            name={`education[${index}].fieldOfStudy`}
                            value={edu.fieldOfStudy}
                            onChange={formik.handleChange}
                            error={formik.touched.education?.[index]?.fieldOfStudy && Boolean(formik.errors.education?.[index]?.fieldOfStudy)}
                            helperText={formik.touched.education?.[index]?.fieldOfStudy && formik.errors.education?.[index]?.fieldOfStudy}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Year Graduated"
                            name={`education[${index}].yearGraduated`}
                            type="number"
                            value={edu.yearGraduated}
                            onChange={formik.handleChange}
                            InputProps={{
                              inputProps: { 
                                min: 1900, 
                                max: new Date().getFullYear() 
                              }
                            }}
                            error={formik.touched.education?.[index]?.yearGraduated && Boolean(formik.errors.education?.[index]?.yearGraduated)}
                            helperText={formik.touched.education?.[index]?.yearGraduated && formik.errors.education?.[index]?.yearGraduated}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleRemoveItem('education', index)}
                          sx={{ minHeight: 40 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('education')}
                    fullWidth
                    sx={{ 
                      minHeight: 50,
                      borderStyle: 'dashed',
                      borderWidth: 2
                    }}
                  >
                    Add Education
                  </Button>
                </CardContent>
              </Collapse>
            </Paper>

            {/* Experience Section */}
            <Paper elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Work sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Work Experience</Typography>
                  </Box>
                }
                action={
                  <IconButton onClick={() => toggleSection('experience')}>
                    {expandedSections.experience ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Collapse in={expandedSections.experience}>
                <CardContent sx={{ pt: 0 }}>
                  {formik.values.experience.map((exp, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 4, 
                        p: 3, 
                        border: `1px solid ${theme.palette.divider}`, 
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[50]
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Company"
                            name={`experience[${index}].company`}
                            value={exp.company}
                            onChange={formik.handleChange}
                            error={formik.touched.experience?.[index]?.company && Boolean(formik.errors.experience?.[index]?.company)}
                            helperText={formik.touched.experience?.[index]?.company && formik.errors.experience?.[index]?.company}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Position"
                            name={`experience[${index}].position`}
                            value={exp.position}
                            onChange={formik.handleChange}
                            error={formik.touched.experience?.[index]?.position && Boolean(formik.errors.experience?.[index]?.position)}
                            helperText={formik.touched.experience?.[index]?.position && formik.errors.experience?.[index]?.position}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Start Date"
                            name={`experience[${index}].startDate`}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={exp.startDate}
                            onChange={formik.handleChange}
                            error={formik.touched.experience?.[index]?.startDate && Boolean(formik.errors.experience?.[index]?.startDate)}
                            helperText={formik.touched.experience?.[index]?.startDate && formik.errors.experience?.[index]?.startDate}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="End Date"
                            name={`experience[${index}].endDate`}
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={exp.endDate || ''}
                            onChange={formik.handleChange}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Responsibilities
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {exp.responsibilities.map((resp, respIndex) => (
                              <Box key={respIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  minRows={1}
                                  maxRows={3}
                                  placeholder={`Responsibility ${respIndex + 1}`}
                                  value={resp}
                                  onChange={(e) => {
                                    const newExp = [...formik.values.experience];
                                    newExp[index].responsibilities[respIndex] = e.target.value;
                                    formik.setFieldValue('experience', newExp);
                                  }}
                                  error={formik.touched.experience?.[index]?.responsibilities?.[respIndex] && 
                                    Boolean(formik.errors.experience?.[index]?.responsibilities?.[respIndex])}
                                  helperText={formik.touched.experience?.[index]?.responsibilities?.[respIndex] && 
                                    formik.errors.experience?.[index]?.responsibilities?.[respIndex]}
                                  sx={{ 
                                    '& .MuiInputBase-root': { 
                                      backgroundColor: 'white'
                                    } 
                                  }}
                                />
                                <IconButton
                                  onClick={() => handleRemoveSubItem('experience', index, 'responsibilities', respIndex)}
                                  sx={{ mt: 0.5 }}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            ))}
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => handleAddSubItem('experience', index, 'responsibilities')}
                              sx={{ 
                                alignSelf: 'flex-start',
                                minHeight: 36
                              }}
                            >
                              Add Responsibility
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleRemoveItem('experience', index)}
                          sx={{ minHeight: 40 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('experience')}
                    fullWidth
                    sx={{ 
                      minHeight: 50,
                      borderStyle: 'dashed',
                      borderWidth: 2
                    }}
                  >
                    Add Experience
                  </Button>
                </CardContent>
              </Collapse>
            </Paper>

                      {/* Projects Section */}
            <Paper elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Code sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Projects</Typography>
                  </Box>
                }
                action={
                  <IconButton onClick={() => toggleSection('projects')}>
                    {expandedSections.projects ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Collapse in={expandedSections.projects}>
                <CardContent sx={{ pt: 0 }}>
                  {formik.values.projects.map((proj, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 4, 
                        p: 3, 
                        border: `1px solid ${theme.palette.divider}`, 
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[50]
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Project Name"
                            name={`projects[${index}].name`}
                            value={proj.name}
                            onChange={formik.handleChange}
                            error={formik.touched.projects?.[index]?.name && Boolean(formik.errors.projects?.[index]?.name)}
                            helperText={formik.touched.projects?.[index]?.name && formik.errors.projects?.[index]?.name}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            name={`projects[${index}].description`}
                            value={proj.description}
                            onChange={formik.handleChange}
                            multiline
                            minRows={3}
                            maxRows={5}
                            error={formik.touched.projects?.[index]?.description && Boolean(formik.errors.projects?.[index]?.description)}
                            helperText={formik.touched.projects?.[index]?.description && formik.errors.projects?.[index]?.description}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Role"
                            name={`projects[${index}].role`}
                            value={proj.role}
                            onChange={formik.handleChange}
                            error={formik.touched.projects?.[index]?.role && Boolean(formik.errors.projects?.[index]?.role)}
                            helperText={formik.touched.projects?.[index]?.role && formik.errors.projects?.[index]?.role}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Duration"
                            name={`projects[${index}].duration`}
                            value={proj.duration}
                            onChange={formik.handleChange}
                            error={formik.touched.projects?.[index]?.duration && Boolean(formik.errors.projects?.[index]?.duration)}
                            helperText={formik.touched.projects?.[index]?.duration && formik.errors.projects?.[index]?.duration}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                minHeight: 56,
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                            Technologies
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {proj.technologies.map((tech, techIndex) => (
                              <Box key={techIndex} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  placeholder={`Technology ${techIndex + 1}`}
                                  value={tech}
                                  onChange={(e) => {
                                    const newProjects = [...formik.values.projects];
                                    newProjects[index].technologies[techIndex] = e.target.value;
                                    formik.setFieldValue('projects', newProjects);
                                  }}
                                  error={formik.touched.projects?.[index]?.technologies?.[techIndex] && 
                                    Boolean(formik.errors.projects?.[index]?.technologies?.[techIndex])}
                                  helperText={formik.touched.projects?.[index]?.technologies?.[techIndex] && 
                                    formik.errors.projects?.[index]?.technologies?.[techIndex]}
                                  sx={{ 
                                    '& .MuiInputBase-root': { 
                                      backgroundColor: 'white'
                                    } 
                                  }}
                                />
                                <IconButton
                                  onClick={() => handleRemoveSubItem('projects', index, 'technologies', techIndex)}
                                  sx={{ mt: 0.5 }}
                                  color="error"
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            ))}
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<Add />}
                              onClick={() => handleAddSubItem('projects', index, 'technologies')}
                              sx={{ 
                                alignSelf: 'flex-start',
                                minHeight: 36
                              }}
                            >
                              Add Technology
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleRemoveItem('projects', index)}
                          sx={{ minHeight: 40 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={() => handleAddItem('projects')}
                    fullWidth
                    sx={{ 
                      minHeight: 50,
                      borderStyle: 'dashed',
                      borderWidth: 2
                    }}
                  >
                    Add Project
                  </Button>
                </CardContent>
              </Collapse>
            </Paper>

            {/* Skills & Certifications Section */}
            <Paper elevation={3} sx={{ mb: 4, borderRadius: 3 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Skills & Certifications</Typography>
                  </Box>
                }
                action={
                  <IconButton onClick={() => toggleSection('skills')}>
                    {expandedSections.skills ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Collapse in={expandedSections.skills}>
                <CardContent sx={{ pt: 0 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Skills</Typography>
                      {formik.values.skills.map((skill, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <TextField
                            fullWidth
                            placeholder={`Skill ${index + 1}`}
                            value={skill}
                            onChange={(e) => {
                              const newSkills = [...formik.values.skills];
                              newSkills[index] = e.target.value;
                              formik.setFieldValue('skills', newSkills);
                            }}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              const newSkills = [...formik.values.skills];
                              newSkills.splice(index, 1);
                              formik.setFieldValue('skills', newSkills);
                            }}
                            sx={{ mt: 0.5 }}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => {
                          formik.setFieldValue('skills', [...formik.values.skills, '']);
                        }}
                        sx={{ 
                          alignSelf: 'flex-start',
                          minHeight: 36
                        }}
                      >
                        Add Skill
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Certifications</Typography>
                      {formik.values.certifications.map((cert, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                          <TextField
                            fullWidth
                            placeholder={`Certification ${index + 1}`}
                            value={cert}
                            onChange={(e) => {
                              const newCerts = [...formik.values.certifications];
                              newCerts[index] = e.target.value;
                              formik.setFieldValue('certifications', newCerts);
                            }}
                            sx={{ 
                              '& .MuiInputBase-root': { 
                                backgroundColor: 'white'
                              } 
                            }}
                          />
                          <IconButton
                            onClick={() => {
                              const newCerts = [...formik.values.certifications];
                              newCerts.splice(index, 1);
                              formik.setFieldValue('certifications', newCerts);
                            }}
                            sx={{ mt: 0.5 }}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Add />}
                        onClick={() => {
                          formik.setFieldValue('certifications', [...formik.values.certifications, '']);
                        }}
                        sx={{ 
                          alignSelf: 'flex-start',
                          minHeight: 36
                        }}
                      >
                        Add Certification
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Collapse>
            </Paper>
          </Grid>
        </Grid>

        {/* Form Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          {employee && (
            <>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isMutationLoading}
                sx={{ minHeight: 42, px: 3 }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={generatePDF}
                startIcon={<Description />}
                disabled={isMutationLoading}
                sx={{ minHeight: 42, px: 3 }}
              >
                Download PDF
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            startIcon={<Close />}
            disabled={isMutationLoading}
            sx={{ minHeight: 42, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={isMutationLoading}
            startIcon={isMutationLoading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{ minHeight: 42, px: 4 }}
          >
            {isMutationLoading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif' }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontFamily: 'Poppins, sans-serif' }}>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
               disabled={isMutationLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteEmployee} 
              color="error"
              sx={{ fontFamily: 'Poppins, sans-serif' }}
               disabled={isMutationLoading}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EmployeeForm;