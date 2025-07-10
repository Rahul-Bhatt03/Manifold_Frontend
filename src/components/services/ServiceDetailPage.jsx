import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Fab,
  Tooltip,
  styled,
  useTheme,
  alpha,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  Avatar,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  BuildCircle as BuildCircleIcon,
  Schedule as ScheduleIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Build as BuildIcon,
  ExpandMore as ExpandMoreIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { 
  useGetServiceById, 
  useUpdateService, 
  useDeleteService, 
  useGetAllServices 
} from '../../hooks/useServices';

// Styled Components
const GlassCard = styled(Card)(({ theme }) => ({
  backdropFilter: 'blur(20px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: '20px',
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '70vh',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0 0 40px 40px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.8) 100%)',
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

const FloatingNavBar = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: '50px',
  padding: '12px 24px',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  minWidth: 200,
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    maxWidth: '350px',
    padding: '10px 16px',
  },
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  marginTop: '-80px',
  position: 'relative',
  zIndex: 10,
  [theme.breakpoints.down('sm')]: {
    marginTop: '-60px',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '20px',
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [userData, setUserData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    categoryId: '',
    image: null,
    descriptions: [],
    methods: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState([]);

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  // React Query hooks
  const { data: serviceResponse, isLoading, error, refetch } = useGetServiceById(id);
  const { data: allServicesResponse } = useGetAllServices();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

  // Extract service data from response
  const service = serviceResponse?.data;
  const allServices = allServicesResponse?.data || [];

  // Get unique categories from all services
useEffect(() => {
  if (allServices.length > 0) {
    const uniqueCategories = allServices.reduce((acc, service) => {
      if (service.category && !acc.find(cat => cat.id === service.category.id)) {
        acc.push(service.category);
      }
      return acc;
    }, []);
    setCategories(uniqueCategories);
  }
}, [allServices]);

  // Check user role from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Error parsing userData from localStorage:', error);
        setSnackbar({
          open: true,
          message: 'Error loading user data',
          severity: 'error'
        });
      }
    }
  }, []);

  // Set service form data
useEffect(() => {
  if (service) {
    // Transform descriptions data to match expected format
    const transformedDescriptions = service.descriptions?.map(desc => ({
      mainTitle: desc.mainTitle || '',
      summary: desc.summary || '',
      points: desc.points?.map(point => point.content || point) || []
    })) || [];

    // Transform methods data to match expected format
    const transformedMethods = service.methods?.map(method => 
      typeof method === 'string' ? method : method.name || ''
    ) || [];

    setServiceForm({
      title: service.title || '',
      categoryId: service.categoryId || '',
      image: null,
      descriptions: transformedDescriptions,
      methods: transformedMethods
    });
    
    // Set image preview from service images
    if (service.images && service.images.length > 0) {
      setImagePreview(service.images[0].url);
    }
  }
}, [service]);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdmin = userData?.role === 'ADMIN' || userData?.role === 'admin';

  const handleBackClick = () => {
    navigate('/services');
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
  setOpenEditDialog(false);
  if (service) {
    const transformedDescriptions = service.descriptions?.map(desc => ({
      mainTitle: desc.mainTitle || '',
      summary: desc.summary || '',
      points: desc.points?.map(point => point.content || point) || []
    })) || [];

    const transformedMethods = service.methods?.map(method => 
      typeof method === 'string' ? method : method.name || ''
    ) || [];

    setServiceForm({
      title: service.title || '',
      categoryId: service.categoryId || '',
      image: null,
      descriptions: transformedDescriptions,
      methods: transformedMethods
    });
    
    if (service.images && service.images.length > 0) {
      setImagePreview(service.images[0].url);
    }
  }
};

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Please select a valid image file',
          severity: 'error'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size should be less than 5MB',
          severity: 'error'
        });
        return;
      }

      setServiceForm(prev => ({
        ...prev,
        image: file,
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle description changes
  const handleDescriptionChange = (index, field, value) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === index ? { ...desc, [field]: value } : desc
      )
    }));
  };

  const handlePointChange = (descIndex, pointIndex, value) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === descIndex ? {
          ...desc,
          points: desc.points.map((point, j) => 
            j === pointIndex ? value : point
          )
        } : desc
      )
    }));
  };

  const addDescription = () => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, { mainTitle: '', summary: '', points: [''] }]
    }));
  };

  const removeDescription = (index) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index)
    }));
  };

  const addPoint = (descIndex) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === descIndex ? {
          ...desc,
          points: [...desc.points, '']
        } : desc
      )
    }));
  };

  const removePoint = (descIndex, pointIndex) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === descIndex ? {
          ...desc,
          points: desc.points.filter((_, j) => j !== pointIndex)
        } : desc
      )
    }));
  };

  // Handle method changes
  const handleMethodChange = (index, value) => {
    setServiceForm(prev => ({
      ...prev,
      methods: prev.methods.map((method, i) => 
        i === index ? value : method
      )
    }));
  };

  const addMethod = () => {
    setServiceForm(prev => ({
      ...prev,
      methods: [...prev.methods, '']
    }));
  };

  const removeMethod = (index) => {
    setServiceForm(prev => ({
      ...prev,
      methods: prev.methods.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  if (!serviceForm.title.trim() || !serviceForm.categoryId) {
    setSnackbar({
      open: true,
      message: 'Please fill in all required fields',
      severity: 'error'
    });
    return;
  }

  try {
    // Transform descriptions back to API format
    const transformedDescriptions = serviceForm.descriptions.map(desc => ({
      mainTitle: desc.mainTitle,
      summary: desc.summary,
      points: desc.points.map(point => ({ content: point }))
    }));

    // Transform methods back to API format
    const transformedMethods = serviceForm.methods.map(method => ({ name: method }));

    const updateData = {
      id: service.id,
      title: serviceForm.title,
      categoryId: serviceForm.categoryId,
      descriptions: transformedDescriptions,
      methods: transformedMethods
    };

    if (serviceForm.image) {
      updateData.image = serviceForm.image;
    }

    await updateServiceMutation.mutateAsync(updateData);
    setSnackbar({
      open: true,
      message: 'Service updated successfully!',
      severity: 'success'
    });
    handleCloseEditDialog();
    refetch();
  } catch (error) {
    setSnackbar({
      open: true,
      message: error.message || 'Error updating service',
      severity: 'error'
    });
  }
};

  const handleDelete = async () => {
    try {
      await deleteServiceMutation.mutateAsync(service.id);
      setSnackbar({
        open: true,
        message: 'Service deleted successfully!',
        severity: 'success'
      });
      handleCloseDeleteDialog();
      setTimeout(() => {
        navigate('/services');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Error deleting service',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <GlassCard sx={{ p: 4 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
              Loading service details...
            </Typography>
          </GlassCard>
        </motion.div>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 2
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <WarningIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
            </motion.div>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Error Loading Service
            </Typography>
            <Typography color="textSecondary" paragraph>
              {error.message || 'Failed to load service details'}
            </Typography>
            <ActionButton
              variant="contained"
              onClick={() => refetch()}
              startIcon={<ArrowBackIcon />}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Retry
            </ActionButton>
          </GlassCard>
        </motion.div>
      </Box>
    );
  }

  // Service not found
  if (!service) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 2
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <WarningIcon sx={{ fontSize: 64, color: 'warning.main', mb: 3 }} />
            </motion.div>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Service Not Found
            </Typography>
            <Typography color="textSecondary" paragraph>
              The service you're looking for doesn't exist or has been removed.
            </Typography>
            <ActionButton
              variant="contained"
              onClick={handleBackClick}
              startIcon={<ArrowBackIcon />}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              Back to Services
            </ActionButton>
          </GlassCard>
        </motion.div>
      </Box>
    );
  }

  // Get main service image
  const mainImage = service.images && service.images.length > 0 
    ? service.images[0].url 
    : '/api/placeholder/1200/800';

  return (
    <Box sx={{ 
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      pb: 4
    }}>
      {/* Floating Navigation */}
      <FloatingNavBar
        style={{ opacity: headerOpacity }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <IconButton 
          onClick={handleBackClick}
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            width: 40,
            height: 40,
            '&:hover': {
              transform: 'scale(1.1)',
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b4d91 100%)',
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          noWrap 
          sx={{ 
            maxWidth: isMobile ? 200 : 300,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {service.title}
        </Typography>
      </FloatingNavBar>

      {/* Hero Section */}
      <HeroSection>
        <motion.div style={{ scale: heroScale }}>
          <HeroImage 
            src={mainImage} 
            alt={service.title} 
          />
        </motion.div>
        
        {/* Hero Content */}
        <Box sx={{ 
          position: 'relative', 
          zIndex: 2,
          textAlign: 'center',
          px: 2,
          color: 'white'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.1
              }}
            >
              {service.title}
            </Typography>
            
            {service.category && (
              <Chip
                icon={<CategoryIcon />}
                label={service.category.name}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mb: 3,
                  fontSize: '1.1rem',
                  height: 44,
                  borderRadius: '22px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              />
            )}
          </motion.div>
        </Box>
      </HeroSection>

      {/* Content Section */}
      <ContentContainer maxWidth="lg">
        <GlassCard>
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Header with Admin Actions */}
              <motion.div variants={contentVariants}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  mb: 4,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}>
                  <Box>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Active Service"
                      color="success"
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        height: 36
                      }}
                    />
                    {service.createdAt && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          fontWeight: 500
                        }}
                      >
                        <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                        Added on {new Date(service.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Admin Actions */}
                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Service">
                        <IconButton
                          onClick={handleOpenEditDialog}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            width: 44,
                            height: 44,
                            '&:hover': {
                              transform: 'scale(1.1)',
                              background: 'linear-gradient(135deg, #5a67d8 0%, #6b4d91 100%)',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Service">
                        <IconButton
                          onClick={handleOpenDeleteDialog}
                          sx={{
                            background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                            color: 'white',
                            width: 44,
                            height: 44,
                            '&:hover': {
                              transform: 'scale(1.1)',
                              background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </motion.div>

              <Divider sx={{ mb: 4 }} />

              {/* Service Images */}
              {service.images && service.images.length > 0 && (
                <motion.div variants={contentVariants}>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                        mb: 3,
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}
                    >
                      <ImageIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                      Service Gallery
                    </Typography>
                    <Grid container spacing={3}>
                      {service.images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Card sx={{ 
                              borderRadius: 4, 
                              overflow: 'hidden',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                              '&:hover': {
                                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                              }
                            }}>
                              <CardMedia
                                component="img"
                                height="200"
                                image={image.url}
                                alt={`${service.title} image ${index + 1}`}
                                sx={{ objectFit: 'cover' }}
                              />
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </motion.div>
              )}

              {/* Service Descriptions */}
            {service.descriptions && service.descriptions.length > 0 && (
  <motion.div variants={contentVariants}>
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
          mb: 3,
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2rem' }
        }}
      >
        <DescriptionIcon sx={{ mr: 1.5, color: 'primary.main' }} />
        Service Details
      </Typography>
      
      {service.descriptions.map((description, index) => (
        <Accordion 
          key={index} 
          defaultExpanded={index === 0}
          sx={{ 
            mb: 2, 
            borderRadius: '16px !important',
            '&:before': { display: 'none' },
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
            }
          }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '& .MuiAccordionSummary-content': {
                alignItems: 'center'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mr: 2 }}>
                {description.mainTitle}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              {description.summary}
            </Typography>
            
            {description.points && description.points.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <List disablePadding>
                  {description.points.map((point, pointIndex) => (
                    <ListItem key={pointIndex} sx={{ px: 0 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        width: '100%'
                      }}>
                        <Box sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          mt: 0.5,
                          flexShrink: 0
                        }}>
                          {pointIndex + 1}
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                          {typeof point === 'string' ? point : point.content}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  </motion.div>
)}

                {/* Service Methods */}
               {service.methods && service.methods.length > 0 && (
  <motion.div variants={contentVariants}>
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
          mb: 3,
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2rem' }
        }}
      >
        <BuildIcon sx={{ mr: 1.5, color: 'primary.main' }} />
        Our Approach
      </Typography>
      
      <Grid container spacing={3}>
        {service.methods.map((method, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GlassCard sx={{ 
                p: 3, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <BuildCircleIcon sx={{ 
                    fontSize: 40, 
                    color: 'primary.main' 
                  }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {typeof method === 'string' ? method : method.name}
                </Typography>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  </motion.div>
)}
              </motion.div>
            </Box>
          </GlassCard>
        </ContentContainer>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1000
              }}
            >
              <Tooltip title="Scroll to top">
                <Fab
                  onClick={scrollToTop}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b4d91 100%)',
                    }
                  }}
                >
                  <ArrowUpIcon />
                </Fab>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Service Dialog */}
        <StyledDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            pb: 1,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
              Edit Service
            </Typography>
            <IconButton 
              onClick={handleCloseEditDialog} 
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleUpdateSubmit}>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="Service Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={serviceForm.title}
                    onChange={handleInputChange}
                    required
                    sx={{ mb: 2 }}
                    InputProps={{
                      sx: { 
                        borderRadius: '12px',
                        background: alpha(theme.palette.background.default, 0.5)
                      }
                    }}
                  />

                  <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="categoryId"
                      value={serviceForm.categoryId}
                      onChange={handleInputChange}
                      label="Category"
                      required
                      sx={{
                        borderRadius: '12px',
                        background: alpha(theme.palette.background.default, 0.5)
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Image Upload */}
                  <Box sx={{ mb: 2 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="edit-service-image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="edit-service-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        fullWidth
                        sx={{ 
                          mb: 2, 
                          borderRadius: '12px',
                          py: 1.5,
                          borderStyle: 'dashed',
                          background: alpha(theme.palette.background.default, 0.5)
                        }}
                      >
                        {serviceForm.image ? 'Change Image' : 'Update Image'}
                      </Button>
                    </label>
                    {imagePreview && (
                      <Box sx={{ 
                        textAlign: 'center',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
                      }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  {/* Methods Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600
                    }}>
                      <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Service Methods
                    </Typography>
                    
                    <List dense>
                      {serviceForm.methods.map((method, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={method}
                            onChange={(e) => handleMethodChange(index, e.target.value)}
                            placeholder="Method name"
                            sx={{ mr: 1 }}
                            InputProps={{
                              sx: { 
                                borderRadius: '8px',
                                background: alpha(theme.palette.background.default, 0.5)
                              }
                            }}
                          />
                          <IconButton
                            onClick={() => removeMethod(index)}
                            color="error"
                            size="small"
                            sx={{
                              background: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                background: alpha(theme.palette.error.main, 0.2),
                              }
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      onClick={addMethod}
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{ 
                        mt: 1,
                        borderRadius: '20px',
                        background: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': {
                          background: alpha(theme.palette.primary.main, 0.2),
                        }
                      }}
                    >
                      Add Method
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Descriptions Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600
                }}>
                  <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Service Descriptions
                </Typography>
                
                {serviceForm.descriptions.map((description, descIndex) => (
                  <Accordion 
                    key={descIndex} 
                    defaultExpanded={descIndex === 0}
                    sx={{ 
                      mb: 2, 
                      borderRadius: '16px !important',
                      background: alpha(theme.palette.background.default, 0.5),
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <TextField
                          fullWidth
                          variant="standard"
                          value={description.mainTitle}
                          onChange={(e) => handleDescriptionChange(descIndex, 'mainTitle', e.target.value)}
                          placeholder="Section Title"
                          sx={{ mr: 2 }}
                          InputProps={{ 
                            disableUnderline: true,
                            sx: {
                              fontSize: '1.1rem',
                              fontWeight: 600
                            }
                          }}
                        />
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDescription(descIndex);
                          }}
                          color="error"
                          size="small"
                          sx={{
                            background: alpha(theme.palette.error.main, 0.1),
                            '&:hover': {
                              background: alpha(theme.palette.error.main, 0.2),
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={description.summary}
                        onChange={(e) => handleDescriptionChange(descIndex, 'summary', e.target.value)}
                        placeholder="Summary description"
                        sx={{ mb: 2 }}
                        InputProps={{
                          sx: { 
                            borderRadius: '12px',
                            background: alpha(theme.palette.background.default, 0.5)
                          }
                        }}
                      />
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Key Points:
                      </Typography>
                      
                      <List dense>
                        {description.points.map((point, pointIndex) => (
                          <ListItem key={pointIndex} sx={{ pl: 0 }}>
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              value={point}
                              onChange={(e) => handlePointChange(descIndex, pointIndex, e.target.value)}
                              placeholder="Point content"
                              sx={{ mr: 1 }}
                              InputProps={{
                                sx: { 
                                  borderRadius: '8px',
                                  background: alpha(theme.palette.background.default, 0.5)
                                }
                              }}
                            />
                            <IconButton
                              onClick={() => removePoint(descIndex, pointIndex)}
                              color="error"
                              size="small"
                              sx={{
                                background: alpha(theme.palette.error.main, 0.1),
                                '&:hover': {
                                  background: alpha(theme.palette.error.main, 0.2),
                                }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                      
                      <Button
                        onClick={() => addPoint(descIndex)}
                        startIcon={<AddIcon />}
                        size="small"
                        sx={{ 
                          mt: 1,
                          borderRadius: '20px',
                          background: alpha(theme.palette.primary.main, 0.1),
                          '&:hover': {
                            background: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      >
                        Add Point
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                ))}
                
                <Button
                  onClick={addDescription}
                  startIcon={<AddIcon />}
                  sx={{ 
                    mt: 2,
                    borderRadius: '20px',
                    background: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.2),
                    }
                  }}
                >
                  Add Description Section
                </Button>
              </Box>

              {updateServiceMutation.error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: '12px',
                    background: alpha(theme.palette.error.main, 0.1)
                  }}
                >
                  {updateServiceMutation.error.message}
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button 
                onClick={handleCloseEditDialog} 
                disabled={updateServiceMutation.isPending}
                sx={{ 
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  fontWeight: 600
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updateServiceMutation.isPending || !serviceForm.title.trim() || !serviceForm.categoryId}
                startIcon={updateServiceMutation.isPending ? <CircularProgress size={20} /> : null}
                sx={{ 
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b4d91 100%)',
                  },
                }}
              >
                {updateServiceMutation.isPending ? 'Updating...' : 'Update Service'}
              </Button>
            </DialogActions>
          </form>
        </StyledDialog>

        {/* Delete Confirmation Dialog */}
        <StyledDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'error.main',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <WarningIcon sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Confirm Delete
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Are you sure you want to delete the service "<strong>{service?.title}</strong>"? 
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDeleteDialog}
              disabled={deleteServiceMutation.isPending}
              sx={{ 
                borderRadius: '20px',
                px: 3,
                py: 1,
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteServiceMutation.isPending}
              startIcon={deleteServiceMutation.isPending ? <CircularProgress size={20} /> : null}
              sx={{ 
                borderRadius: '20px',
                px: 3,
                py: 1,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                },
              }}
            >
              {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete Service'}
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%', 
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              background: alpha(theme.palette.background.paper, 0.9),
              boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };
  
  export default ServiceDetailPage;