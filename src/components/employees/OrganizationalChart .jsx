import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
  Backdrop,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  styled,
  GlobalStyles
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmployees, useDeleteEmployee } from '../../hooks/useEmployees';
import EmployeeForm from './EmployeeForm';
import EmployeeDetails from './EmployeeDetails';
import teamBanner from '../../assets/team.jpg';

// Add global styles for Poppins font
const globalStyles = (
  <GlobalStyles
    styles={{
      '@import': "url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap')",
      '*': {
        fontFamily: '"Poppins", sans-serif !important',
      }
    }}
  />
);

// Styled Components for Hero Section
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '70vh',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  }
}));

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
});

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: 'white',
  maxWidth: '800px',
  padding: theme.spacing(0, 3),
  fontFamily: '"Poppins", sans-serif',
}));

// Styled component for level headings
const LevelHeading = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '2px',
  }
}));

// Tree connection lines
const TreeConnections = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  zIndex: 0,
});

const OrganizationalChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  
  // React Query hooks
  const { data: employees = [], isLoading, error } = useEmployees();
  const deleteEmployeeMutation = useDeleteEmployee();

  // State
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsPanelPosition, setDetailsPanelPosition] = useState({ top: 0 });

  // Get user role from localStorage
const userData = JSON.parse(localStorage.getItem('userData') || '{}');
const isAdmin = userData?.role === "admin";

  // Memoize the employees by level calculation
  const employeesByLevel = useMemo(() => {
    const levels = {};
    employees.forEach(emp => {
      if (emp.isDeleted) return;
      const level = emp.level || 1;
      if (!levels[level]) levels[level] = [];
      levels[level].push(emp);
    });
    return levels;
  }, [employees]);

  const maxLevel = useMemo(() => {
    return Math.max(...Object.keys(employeesByLevel).map(Number), 1);
  }, [employeesByLevel]);

  // Get card dimensions based on screen size
  const getCardDimensions = () => {
    if (isMobile) return { width: 120, height: 160, avatarSize: 60 };
    if (isTablet) return { width: 150, height: 180, avatarSize: 80 };
    if (isLarge) return { width: 200, height: 220, avatarSize: 100 };
    return { width: 170, height: 200, avatarSize: 90 };
  };

  const cardDimensions = getCardDimensions();

  const handleEmployeeClick = (employee, event) => {
    setSelectedEmployee(employee);
    
    if (isMobile) {
      setShowDetails(true);
    } else {
      // Calculate the position of the clicked card
      const cardElement = event.currentTarget;
      const rect = cardElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Position the details panel at the same vertical level as the clicked card
      const topPosition = rect.top + scrollTop - 100; // Offset by 100px for better visibility
      
      setDetailsPanelPosition({ top: Math.max(topPosition, 20) }); // Minimum 20px from top
      setShowDetails(true);
      
      // Smooth scroll to the details panel position
      setTimeout(() => {
        window.scrollTo({
          top: topPosition - 50,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = (employee) => {
     if (!isAdmin) return; 
    setSelectedEmployee(employee);
    setShowEditForm(true);
  };

  const handleDeleteEmployee = async (id) => {
     if (!isAdmin) return; 
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployeeMutation.mutateAsync(id);
        if (selectedEmployee?.id === id) {
          handleCloseDetails();
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  // Get level title
  const getLevelTitle = (level) => {
    switch (level) {
      case 1: return 'Executive Leadership';
      case 2: return 'Department Heads';
      case 3: return 'Senior Engineers';
      case 4: return 'Engineers';
      case 5: return 'Junior Engineers';
      default: return `Level ${level}`;
    }
  };

  // Animation variants for hero section
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  if (isLoading && employees.length === 0) {
    return (
      <Backdrop open={true} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="white" sx={{ fontFamily: '"Poppins", sans-serif' }}>
            Loading Team Structure...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, fontFamily: '"Poppins", sans-serif' }}>
            Error Loading Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontFamily: '"Poppins", sans-serif' }}>
            {error.message}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {globalStyles}
      
      {/* Hero Banner Section */}
      <HeroSection>
        <HeroImage src={teamBanner} alt="Our Team" />
        <HeroContent>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant={isMobile ? "h3" : "h1"}
              component="h1"
              fontWeight={800}
              sx={{ 
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.1,
                textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Our Team
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h4"}
              sx={{ 
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                maxWidth: '600px',
                margin: '0 auto 2rem',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Meet the professionals building innovative solutions
            </Typography>
          </motion.div>
        </HeroContent>
      </HeroSection>

      {/* Main Content */}
      <Box sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light}10 100%)`,
        minHeight: '100vh',
        py: isMobile ? 3 : 6
      }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: isMobile ? 4 : 8 }}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight={700}
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Engineering Team
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ 
                maxWidth: '600px', 
                margin: '0 auto', 
                fontWeight: 400, 
                mb: 4,
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Discover our talented team structure and organization
            </Typography>
            
            {/* Add Employee Button - Only show for admin */}
           {isAdmin && (
  <Button
    variant="contained"
    size={isMobile ? "medium" : "large"}
    startIcon={<AddIcon />}
    onClick={() => setShowAddForm(true)}
    sx={{
      borderRadius: '16px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1rem',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
      transition: 'all 0.3s ease',
      fontFamily: '"Poppins", sans-serif',
      '&:hover': {
        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
      },
    }}
  >
    Add New Employee
  </Button>
)}
          </Box>

          {/* Main Content */}
          <Box sx={{ 
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 4
          }}>
            {/* Organization Chart */}
            <Box sx={{ 
              flex: showDetails && !isMobile ? '0 0 60%' : '1 1 100%',
              transition: 'flex 0.3s ease'
            }}>
              {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => {
                const levelEmployees = employeesByLevel[level] || [];
                if (levelEmployees.length === 0) return null;

                return (
                  <Box key={level} sx={{ position: 'relative', width: '100%', mb: 6 }}>
                    {/* Level Header - Now as proper heading */}
                    <LevelHeading>
                      <Typography 
                        variant={isMobile ? "h5" : "h4"} 
                        component="h3"
                        sx={{ 
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.1rem' },
                          letterSpacing: '0.02em',
                          fontFamily: '"Poppins", sans-serif',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {getLevelTitle(level)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mt: 1,
                          fontWeight: 400,
                          fontSize: '0.9rem',
                          fontFamily: '"Poppins", sans-serif'
                        }}
                      >
                        {levelEmployees.length} member{levelEmployees.length !== 1 ? 's' : ''}
                      </Typography>
                    </LevelHeading>

                    {/* Employee Cards with Tree Connections */}
                    <Box sx={{
                      display: 'flex',
                      gap: isMobile ? 2 : 3,
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                      mx: 'auto',
                      maxWidth: '100%',
                      position: 'relative',
                      minHeight: cardDimensions.height + 40,
                    }}>
                      {/* Tree connection lines */}
                      {level > 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -40,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '2px',
                            height: '40px',
                            background: 'linear-gradient(to bottom, #667eea, #764ba2)',
                            zIndex: 0,
                          }}
                        />
                      )}
                      
                      {levelEmployees.map((employee, index) => (
                        <motion.div
                          key={employee.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ position: 'relative', zIndex: 1 }}
                        >
                          {/* Horizontal connection lines */}
                          {level > 1 && levelEmployees.length > 1 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -40,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: index === 0 ? '50%' : index === levelEmployees.length - 1 ? '50%' : '100%',
                                height: '2px',
                                background: 'linear-gradient(to right, #667eea, #764ba2)',
                                zIndex: 0,
                                ...(index === 0 && { left: '50%' }),
                                ...(index === levelEmployees.length - 1 && { right: '50%', left: 'auto' }),
                              }}
                            />
                          )}
                          
                          <Card
                            onClick={(event) => handleEmployeeClick(employee, event)}
                            sx={{
                              width: cardDimensions.width,
                              height: cardDimensions.height,
                              cursor: 'pointer',
                              borderRadius: 3,
                              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              p: 2.5,
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                              border: '1px solid rgba(0,0,0,0.08)',
                              position: 'relative',
                              overflow: 'hidden',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              },
                              '&:hover': {
                                boxShadow: '0 16px 40px rgba(102, 126, 234, 0.25)',
                                transform: 'translateY(-4px)',
                                border: `2px solid ${theme.palette.primary.main}`,
                                '&::before': {
                                  height: '6px',
                                }
                              }
                            }}
                          >
                            <Avatar
                              src={employee.image}
                              sx={{
                                width: cardDimensions.avatarSize,
                                height: cardDimensions.avatarSize,
                                mb: 2,
                                border: `3px solid ${theme.palette.primary.main}`,
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                              }}
                            >
                              <PersonIcon sx={{ fontSize: cardDimensions.avatarSize * 0.6 }} />
                            </Avatar>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="subtitle1" sx={{ 
                                fontWeight: 600,
                                fontSize: isLarge ? '1.1rem' : isMobile ? '0.9rem' : '1rem',
                                lineHeight: 1.3,
                                mb: 0.5,
                                color: 'text.primary',
                                fontFamily: '"Poppins", sans-serif'
                              }}>
                                {employee.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                fontSize: isLarge ? '0.9rem' : isMobile ? '0.75rem' : '0.8rem',
                                lineHeight: 1.2,
                                fontWeight: 400,
                                fontFamily: '"Poppins", sans-serif'
                              }}>
                                {employee.position}
                              </Typography>
                            </Box>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                );
              })}

              {/* Empty State */}
              {employees.length === 0 && !isLoading && (
                <Paper sx={{ p: isMobile ? 4 : 8, textAlign: 'center', borderRadius: 3 }}>
                  <BusinessIcon sx={{ fontSize: isMobile ? 60 : 80, color: 'text.secondary', mb: 3 }} />
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    No team members yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    mb: 4,
                    fontFamily: '"Poppins", sans-serif'
                  }}>
                    Start building your organizational chart by adding your first employee
                  </Typography>
                 {isAdmin && (
  <Button
    variant="contained"
    size="large"
    startIcon={<AddIcon />}
    onClick={() => setShowAddForm(true)}
    sx={{ fontFamily: '"Poppins", sans-serif' }}
  >
    Add First Employee
  </Button>
)}
                </Paper>
              )}
            </Box>

            {/* Employee Details - Desktop */}
            {!isMobile && showDetails && selectedEmployee && (
              <Box sx={{ 
                flex: '0 0 40%',
                position: 'absolute',
                right: 0,
                top: detailsPanelPosition.top,
                width: '40%',
                maxHeight: 'calc(100vh - 140px)',
                overflowY: 'auto',
                p: 2,
                borderRadius: 3,
                bgcolor: 'background.paper',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                border: `2px solid ${theme.palette.primary.main}`,
                zIndex: 1000,
                transition: 'all 0.3s ease',
                // Add a close button for better UX
                '&::before': {
                  content: '"×"',
                  position: 'absolute',
                  top: '8px',
                  right: '12px',
                  fontSize: '24px',
                  color: theme.palette.text.secondary,
                  cursor: 'pointer',
                  zIndex: 1001,
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                }
              }}>
                <IconButton
                  onClick={handleCloseDetails}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1002,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <EmployeeDetails 
                  employeeId={selectedEmployee?.id}
                  onBack={handleCloseDetails}
                  onEdit={() => handleEditEmployee(selectedEmployee)}
                   onDelete={handleDeleteEmployee}
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Employee Details Modal - Mobile */}
      <Dialog
        fullScreen={isMobile}
        open={isMobile && showDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedEmployee && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'primary.main',
              color: 'white',
              fontFamily: '"Poppins", sans-serif'
            }}>
              <Typography variant="h6" sx={{ fontFamily: '"Poppins", sans-serif' }}>
                {selectedEmployee.name}
              </Typography>
              <IconButton onClick={handleCloseDetails} color="inherit">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <EmployeeDetails 
                employeeId={selectedEmployee?.id}
                onBack={handleCloseDetails}
                onEdit={() => handleEditEmployee(selectedEmployee)}
              />
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Add Employee Form */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          fontFamily: '"Poppins", sans-serif'
        }}>
          Add New Employee
        </DialogTitle>
        <DialogContent>
          <EmployeeForm
            employees={employees}
            onSave={() => {
              setShowAddForm(false);
              // You might want to add a success message or refresh the employee list here
            }}
            onCancel={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              // Optionally refresh employee data or show success message
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Employee Form */}
      <Dialog
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          fontFamily: '"Poppins", sans-serif'
        }}>
          Edit Employee
        </DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <EmployeeForm
              employee={selectedEmployee}
              employees={employees.filter(e => e.id !== selectedEmployee.id)}
              onSave={() => {
                setShowEditForm(false);
              }}
              onCancel={() => setShowEditForm(false)}
              onSuccess={() => {
                setShowEditForm(false);
                setShowDetails(false);
                setSelectedEmployee(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrganizationalChart;