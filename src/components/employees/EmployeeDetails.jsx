import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Divider,
  Chip,
  Button,
  useTheme,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  School,
  Work,
  Code,
  Star,
  Description,
  ArrowBack,
  Edit,
  Delete,
  Warning,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Business,
  TrendingUp,
  EmojiEvents,
  Download
} from '@mui/icons-material';
import { useDeleteEmployee, useEmployee } from '../../hooks/useEmployees';
import { jsPDF } from 'jspdf';

const EmployeeDetails = ({ employeeId, onBack, onEdit }) => {
  const theme = useTheme();
  const deleteMutation = useDeleteEmployee();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  
  // Fetch employee data using the hook
  const { data: employee, isLoading, isError, error } = useEmployee(employeeId);

  const isAdmin=JSON.parse(localStorage.getItem('userData')).role === 'admin';

  const generatePDF = async () => {
    if (!employee) return;
    
    setPdfGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 20;
      const lineHeight = 7;
      
      // Helper function to add text with word wrapping
      const addText = (text, x, y, maxWidth, fontSize = 10, style = 'normal') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', style);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * (fontSize * 0.35));
      };

      // Header
      pdf.setFillColor(theme.palette.primary.main.slice(1)); // Remove # from hex
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      yPosition = addText(
        `${safeGet(employee, 'name')} - Employee Profile`,
        margin,
        15,
        pageWidth - 2 * margin,
        16,
        'bold'
      );

      yPosition += 10;

      // Basic Information Section
      yPosition = addText('BASIC INFORMATION', margin, yPosition, pageWidth - 2 * margin, 12, 'bold');
      yPosition += 5;
      
      const basicInfo = [
        `Name: ${safeGet(employee, 'name')}`,
        `Position: ${safeGet(employee, 'position')}`,
        `Department: ${safeGet(employee, 'department')}`,
        `Level: ${
          safeGet(employee, 'level') === 1 ? 'CEO' : 
          safeGet(employee, 'level') === 2 ? 'Executive' : 
          safeGet(employee, 'level') === 3 ? 'Manager' : 'Staff'
        }`,
        `Employee ID: ${safeGet(employee, 'id')}`
      ];

      basicInfo.forEach(info => {
        yPosition = addText(info, margin, yPosition, pageWidth - 2 * margin);
        yPosition += 2;
      });

      yPosition += 10;

      // Skills Section
      if (safeGet(employee, 'skills', []).length > 0) {
        yPosition = addText('SKILLS', margin, yPosition, pageWidth - 2 * margin, 12, 'bold');
        yPosition += 5;
        const skillsText = safeGet(employee, 'skills', []).join(', ');
        yPosition = addText(skillsText, margin, yPosition, pageWidth - 2 * margin);
        yPosition += 10;
      }

      // Education Section
      if (safeGet(employee, 'education', []).length > 0) {
        yPosition = addText('EDUCATION', margin, yPosition, pageWidth - 2 * margin, 12, 'bold');
        yPosition += 5;
        
        safeGet(employee, 'education', []).forEach((edu, index) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }
          
          yPosition = addText(
            `${safeGet(edu, 'degree')} - ${safeGet(edu, 'institution')}`,
            margin,
            yPosition,
            pageWidth - 2 * margin,
            10,
            'bold'
          );
          yPosition = addText(
            `Field: ${safeGet(edu, 'fieldOfStudy')}, Graduated: ${safeGet(edu, 'yearGraduated')}`,
            margin,
            yPosition,
            pageWidth - 2 * margin
          );
          yPosition += 5;
        });
        yPosition += 5;
      }

      // Experience Section
      if (safeGet(employee, 'experience', []).length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }
        
        yPosition = addText('WORK EXPERIENCE', margin, yPosition, pageWidth - 2 * margin, 12, 'bold');
        yPosition += 5;
        
        safeGet(employee, 'experience', []).forEach((exp, index) => {
          if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = 20;
          }
          
          yPosition = addText(
            `${safeGet(exp, 'position')} at ${safeGet(exp, 'company')}`,
            margin,
            yPosition,
            pageWidth - 2 * margin,
            10,
            'bold'
          );
          
          const startDate = safeGet(exp, 'startDate') ? new Date(safeGet(exp, 'startDate')).toLocaleDateString() : 'N/A';
          const endDate = safeGet(exp, 'endDate') ? new Date(safeGet(exp, 'endDate')).toLocaleDateString() : 'Present';
          
          yPosition = addText(
            `Duration: ${startDate} - ${endDate}`,
            margin,
            yPosition,
            pageWidth - 2 * margin
          );
          
          if (safeGet(exp, 'responsibilities', []).length > 0) {
            yPosition = addText('Responsibilities:', margin, yPosition, pageWidth - 2 * margin, 9, 'bold');
            safeGet(exp, 'responsibilities', []).forEach(resp => {
              yPosition = addText(`• ${resp}`, margin + 5, yPosition, pageWidth - 2 * margin - 5, 9);
            });
          }
          yPosition += 5;
        });
      }

      // Projects Section
      if (safeGet(employee, 'projects', []).length > 0) {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = 20;
        }
        
        yPosition = addText('PROJECTS', margin, yPosition, pageWidth - 2 * margin, 12, 'bold');
        yPosition += 5;
        
        safeGet(employee, 'projects', []).forEach((proj, index) => {
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }
          
          yPosition = addText(
            safeGet(proj, 'name'),
            margin,
            yPosition,
            pageWidth - 2 * margin,
            10,
            'bold'
          );
          yPosition = addText(
            safeGet(proj, 'description'),
            margin,
            yPosition,
            pageWidth - 2 * margin
          );
          yPosition = addText(
            `Role: ${safeGet(proj, 'role')}, Duration: ${safeGet(proj, 'duration')}`,
            margin,
            yPosition,
            pageWidth - 2 * margin
          );
          
          if (safeGet(proj, 'technologies', []).length > 0) {
            yPosition = addText(
              `Technologies: ${safeGet(proj, 'technologies', []).join(', ')}`,
              margin,
              yPosition,
              pageWidth - 2 * margin
            );
          }
          yPosition += 5;
        });
      }

      // Certifications Section
      if (safeGet(employee, 'certifications', []).length > 0) {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        yPosition = addText('CERTIFICATIONS', margin, yPosition, pageWidth - 2 * margin, 12, 'bold');
        yPosition += 5;
        
        safeGet(employee, 'certifications', []).forEach(cert => {
          yPosition = addText(`• ${cert}`, margin, yPosition, pageWidth - 2 * margin);
        });
      }

      pdf.save(`${employee.name || 'employee'}-profile.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(employee?._id);
      onBack();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        p: 4,
        fontFamily: '"Poppins", sans-serif'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ 
          mt: 2, 
          color: 'text.secondary',
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 500
        }}>
          Loading employee details...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', fontFamily: '"Poppins", sans-serif' }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3, 
          bgcolor: 'error.light', 
          color: 'error.contrastText',
          fontFamily: '"Poppins", sans-serif'
        }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            fontFamily: '"Poppins", sans-serif', 
            fontWeight: 600 
          }}>
            Error loading employee details
          </Typography>
          <Typography sx={{ 
            mb: 2, 
            fontFamily: '"Poppins", sans-serif' 
          }}>
            {error.message}
          </Typography>
          <Button 
            onClick={onBack} 
            variant="contained" 
            color="error" 
            sx={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Back to Team
          </Button>
        </Paper>
      </Box>
    );
  }

  // No employee data state
  if (!employee) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center', 
        fontFamily: '"Poppins", sans-serif' 
      }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          fontFamily: '"Poppins", sans-serif'
        }}>
          <Typography variant="h6" sx={{ 
            mb: 2, 
            fontFamily: '"Poppins", sans-serif', 
            fontWeight: 600 
          }}>
            No employee data found
          </Typography>
          <Button 
            onClick={onBack} 
            variant="outlined" 
            sx={{ fontFamily: '"Poppins", sans-serif' }}
          >
            Back to Team
          </Button>
        </Paper>
      </Box>
    );
  }

  // Safely access nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
  };

  const getHierarchyLevel = (level) => {
    switch(level) {
      case 1: return { text: 'CEO', color: 'error' };
      case 2: return { text: 'Executive', color: 'warning' };
      case 3: return { text: 'Manager', color: 'info' };
      default: return { text: 'Staff', color: 'success' };
    }
  };

  const hierarchyInfo = getHierarchyLevel(safeGet(employee, 'level'));

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        p: { xs: 2, md: 3 }, 
        minHeight: '100vh', 
        bgcolor: 'grey.50',
        fontFamily: '"Poppins", sans-serif',
         maxWidth: '100vw', // Ensure full width
        overflowX: 'hidden' // Prevent horizontal scroll
      }}>
        {/* Header Actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          width: '100%',
          gap: 2
        }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={onBack} 
            variant="outlined"
            size="large"
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            Back to Team
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Edit employee profile">
             {isAdmin && (<Button
                variant="contained"
                onClick={() => onEdit(employee)}
                disabled={deleteMutation.isLoading}
                startIcon={<Edit />}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 120,
                  fontFamily: '"Poppins", sans-serif'
                }}
              >
                Edit Profile
              </Button>
             )}
            </Tooltip>
            
            <Tooltip title="Delete employee">
             {isAdmin &&(
               <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={deleteMutation.isLoading}
                startIcon={<Delete />}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif'
                }}
              >
                Delete
              </Button>
             )}
            </Tooltip>
            
            <Tooltip title="Download PDF profile">
              <Button
                variant="contained"
                color="secondary"
                startIcon={pdfGenerating ? <CircularProgress size={20} color="inherit" /> : <Download />}
                onClick={generatePDF}
                disabled={pdfGenerating || !employee}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 140,
                  fontFamily: '"Poppins", sans-serif'
                }}
              >
                {pdfGenerating ? 'Generating...' : 'Download PDF'}
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {pdfGenerating && (
          <Box sx={{ mb: 2, width: '100%' }}>
            <LinearProgress />
            <Typography variant="body2" sx={{ 
              mt: 1, 
              textAlign: 'center', 
              color: 'text.secondary',
              fontFamily: '"Poppins", sans-serif'
            }}>
              Generating PDF, please wait...
            </Typography>
          </Box>
        )}

   
        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - Profile Summary */}
          <Grid item xs={12} lg={4}>
            <Card elevation={6} sx={{ 
              borderRadius: 4, 
              overflow: 'visible', 
              position: 'relative',
              height: 'fit-content',
              fontFamily: '"Poppins", sans-serif',
                width: '100%'
            }}>
              <Box sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                height: 120,
                borderRadius: '16px 16px 0 0'
              }} />
              
              <CardContent sx={{ pt: 0, pb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -6 }}>
                  <Avatar
                    src={safeGet(employee, 'image')}
                    sx={{
                      width: 120,
                      height: 120,
                      border: `6px solid white`,
                      boxShadow: theme.shadows[8],
                      mb: 2
                    }}
                  />
                  
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    textAlign: 'center',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    {safeGet(employee, 'name')}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ 
                    color: 'text.secondary', 
                    mb: 2,
                    textAlign: 'center',
                    fontWeight: 500,
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    {safeGet(employee, 'position')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip
                      label={safeGet(employee, 'department')}
                      color="primary"
                      variant="filled"
                      sx={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600,
                        borderRadius: 3,
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    />
                    <Chip
                      label={hierarchyInfo.text}
                      color={hierarchyInfo.color}
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 600,
                        borderRadius: 3,
                        fontFamily: '"Poppins", sans-serif'
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Employee ID Section - Updated to match education box style */}
                <Box sx={{ mb: 3 }}>
                  <Paper 
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      borderLeft: `4px solid ${theme.palette.info.main}`,
                      transition: 'all 0.3s ease',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      width: '100%',
                      fontFamily: '"Poppins", sans-serif',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 700, 
                      color: 'primary.main',
                      fontFamily: '"Poppins", sans-serif'
                    }}>
                      Employee Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          fontFamily: '"Poppins", sans-serif'
                        }}>
                          Employee ID
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ 
                          fontFamily: '"Poppins", sans-serif'
                        }}>
                          {safeGet(employee, '_id', 'N/A')}
                        </Typography>
                      </Grid>
                      {safeGet(employee, 'parentId') && (
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            Reports To
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ 
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(employee, 'parentId.name', 'N/A')}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Box>

                {/* Skills */}
                {safeGet(employee, 'skills', []).length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 700, 
                      color: 'primary.main',
                      fontFamily: '"Poppins", sans-serif'
                    }}>
                      Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {safeGet(employee, 'skills', []).map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          size="small"
                          sx={{ 
                            borderRadius: 2,
                            fontWeight: 500,
                            fontFamily: '"Poppins", sans-serif',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white'
                            }
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Certifications */}
                {safeGet(employee, 'certifications', []).length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 700, 
                      color: 'primary.main',
                      fontFamily: '"Poppins", sans-serif'
                    }}>
                      Certifications
                    </Typography>
                    <List dense>
                      {safeGet(employee, 'certifications', []).map((cert, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <EmojiEvents color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={cert}
                            primaryTypographyProps={{ 
                              fontSize: '0.9rem',
                              fontFamily: '"Poppins", sans-serif'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Detailed Information */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 ,  width: '100%'}}>
              
              {/* Education Section */}
              {safeGet(employee, 'education', []).length > 0 && (
                <Card elevation={4} sx={{ borderRadius: 4, fontFamily: '"Poppins", sans-serif',  width: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ 
                      mb: 3, 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'primary.main',
                      fontFamily: '"Poppins", sans-serif'
                    }}>
                      <School sx={{ mr: 2, fontSize: 32 }} />
                      Education
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {safeGet(employee, 'education', []).map((edu, index) => (
                        <Paper 
                          key={index} 
                          elevation={2}
                          sx={{ 
                            p: 4, 
                            borderRadius: 3,
                            borderLeft: `4px solid ${theme.palette.primary.main}`,
                            transition: 'all 0.3s ease',
                            minHeight: '140px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            width: '100%',
                            fontFamily: '"Poppins", sans-serif',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: theme.shadows[8]
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="h5" sx={{ 
                              fontWeight: 700, 
                              mb: 1,
                              fontFamily: '"Poppins", sans-serif'
                            }}>
                              {safeGet(edu, 'degree')}
                            </Typography>
                            <Typography variant="subtitle1" color="primary" sx={{ 
                              mb: 2, 
                              fontWeight: 600,
                              fontFamily: '"Poppins", sans-serif'
                            }}>
                              {safeGet(edu, 'institution')}
                            </Typography>
                          </Box>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600,
                                fontFamily: '"Poppins", sans-serif'
                              }}>
                                Field of Study
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ 
                                 fontSize: '1.1rem',
                                fontFamily: '"Poppins", sans-serif'
                              }}>
                                {safeGet(edu, 'fieldOfStudy')}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600,
                                fontFamily: '"Poppins", sans-serif'
                              }}>
                                Year Graduated
                              </Typography>
                              <Typography variant="body1" color="text.secondary" sx={{ 
                                 fontSize: '1.1rem',
                                fontFamily: '"Poppins", sans-serif'
                              }}>
                                {safeGet(edu, 'yearGraduated')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

           {/* Experience Section - Full Width */}
          {safeGet(employee, 'experience', []).length > 0 && (
            <Card elevation={4} sx={{ 
              borderRadius: 4, 
              fontFamily: '"Poppins", sans-serif',
              width: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{  // Increased size
                  mb: 3, 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  fontFamily: '"Poppins", sans-serif'
                }}>
                  <Work sx={{ mr: 2, fontSize: 32 }} /> {/* Increased icon size */}
                  Work Experience
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}> {/* Increased gap */}
                  {safeGet(employee, 'experience', []).map((exp, index) => (
                    <Paper 
                      key={index} 
                      elevation={3}  // Slightly higher elevation
                      sx={{ 
                        p: 4,  // Increased padding
                        borderRadius: 3,
                        borderLeft: `6px solid ${theme.palette.secondary.main}`, // Thicker border
                        transition: 'all 0.3s ease',
                        fontFamily: '"Poppins", sans-serif',
                        width: '100%',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: theme.shadows[10]
                        }
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="h5" sx={{  // Increased size
                            fontWeight: 700, 
                            mb: 1,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(exp, 'position')}
                          </Typography>
                          <Typography variant="h6" color="secondary" sx={{  // Increased size
                            mb: 3,  // Increased margin
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(exp, 'company')}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{  // Increased size
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            Start Date
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ 
                            fontSize: '1.1rem',  // Slightly larger
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(exp, 'startDate') ? new Date(safeGet(exp, 'startDate')).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{  // Increased size
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            End Date
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ 
                            fontSize: '1.1rem',  // Slightly larger
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(exp, 'endDate') ? new Date(safeGet(exp, 'endDate')).toLocaleDateString() : 'Present'}
                          </Typography>
                        </Grid>
                        
                        {safeGet(exp, 'responsibilities', []).length > 0 && (
                          <Grid item xs={12}>
                            <Typography variant="h6" sx={{  // Increased size
                              mb: 2, 
                              fontWeight: 700,
                              fontFamily: '"Poppins", sans-serif'
                            }}>
                              Key Responsibilities:
                            </Typography>
                            <List dense>
                              {safeGet(exp, 'responsibilities', []).map((resp, respIndex) => (
                                <ListItem key={respIndex} sx={{ py: 1 }}> {/* Increased padding */}
                                  <ListItemText 
                                    primary={`• ${resp}`}
                                    primaryTypographyProps={{ 
                                      variant: 'body1',  // Larger text
                                      color: 'text.secondary',
                                      fontFamily: '"Poppins", sans-serif'
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Projects Section - Full Width */}
          {safeGet(employee, 'projects', []).length > 0 && (
            <Card elevation={4} sx={{ 
              borderRadius: 4, 
              fontFamily: '"Poppins", sans-serif',
              width: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{  // Increased size
                  mb: 3, 
                  fontWeight: 700, 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'primary.main',
                  fontFamily: '"Poppins", sans-serif'
                }}>
                  <Code sx={{ mr: 2, fontSize: 32 }} /> {/* Increased icon size */}
                  Projects
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}> {/* Increased gap */}
                  {safeGet(employee, 'projects', []).map((proj, index) => (
                    <Paper 
                      key={index} 
                      elevation={3}  // Slightly higher elevation
                      sx={{ 
                        p: 4,  // Increased padding
                        borderRadius: 3,
                        borderLeft: `6px solid ${theme.palette.success.main}`, // Thicker border
                        transition: 'all 0.3s ease',
                        fontFamily: '"Poppins", sans-serif',
                        width: '100%',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: theme.shadows[10]
                        }
                      }}
                    >
                      <Typography variant="h5" sx={{  // Increased size
                        fontWeight: 700, 
                        mb: 3,  // Increased margin
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        {safeGet(proj, 'name')}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        mb: 4,  // Increased margin
                        lineHeight: 1.8,  // Better readability
                        fontSize: '1.1rem',  // Slightly larger
                        fontFamily: '"Poppins", sans-serif'
                      }}>
                        {safeGet(proj, 'description')}
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{  // Increased size
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            Role
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ 
                            fontSize: '1.1rem',  // Slightly larger
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(proj, 'role')}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" sx={{  // Increased size
                            fontWeight: 600,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            Duration
                          </Typography>
                          <Typography variant="body1" color="text.secondary" sx={{ 
                            fontSize: '1.1rem',  // Slightly larger
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            {safeGet(proj, 'duration')}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      {safeGet(proj, 'technologies', []).length > 0 && (
                        <Box sx={{ mt: 4 }}>  {/* Increased margin */}
                          <Typography variant="h6" sx={{  // Increased size
                            mb: 3,  // Increased margin
                            fontWeight: 700,
                            fontFamily: '"Poppins", sans-serif'
                          }}>
                            Technologies Used:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}> {/* Increased gap */}
                            {safeGet(proj, 'technologies', []).map((tech, techIndex) => (
                              <Chip 
                                key={techIndex} 
                                label={tech} 
                                variant="outlined" 
                                size="medium"  // Slightly larger
                                color="success"
                                sx={{ 
                                  borderRadius: 3,  // More rounded
                                  fontSize: '0.95rem',  // Slightly larger
                                  fontFamily: '"Poppins", sans-serif',
                                  px: 1.5  // More horizontal padding
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog 
          open={deleteConfirmOpen} 
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              fontFamily: '"Poppins", sans-serif'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center',
            pb: 1,
            fontFamily: '"Poppins", sans-serif'
          }}>
            <Warning color="error" sx={{ mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
                Confirm Deletion
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Poppins", sans-serif' }}>
                This action cannot be undone
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ fontFamily: '"Poppins", sans-serif' }}>
              Are you sure you want to delete <strong>{safeGet(employee, 'name', 'this employee')}</strong>? 
              All associated data will be permanently removed from the system.
            </Typography>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setDeleteConfirmOpen(false)} 
              disabled={deleteMutation.isLoading}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteMutation.isLoading}
              startIcon={deleteMutation.isLoading ? <CircularProgress size={20} /> : <Delete />}
              sx={{ 
                borderRadius: 2, 
                ml: 1,
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Delete Employee'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default EmployeeDetails;