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
  Avatar
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
  Info as InfoIcon
} from '@mui/icons-material';
import { 
  useGetServiceById, 
  useUpdateService, 
  useDeleteService, 
  useGetAllServices 
} from '../../hooks/useServices';

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '60vh',
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
    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(33, 203, 243, 0.6) 100%)',
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
  padding: '8px 24px',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '24px',
  overflow: 'hidden',
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
  marginTop: '-80px',
  position: 'relative',
  zIndex: 10,
}));

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const theme = useTheme();
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

  // Populate form when service data is loaded
  useEffect(() => {
    if (service) {
      setServiceForm({
        title: service.title || '',
        categoryId: service.categoryId || '',
        image: null,
        descriptions: service.descriptions || [],
        methods: service.methods || []
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
      setServiceForm({
        title: service.title || '',
        categoryId: service.categoryId || '',
        image: null,
        descriptions: service.descriptions || [],
        methods: service.methods || []
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

  const handleDescriptionPointChange = (descIndex, pointIndex, value) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === descIndex ? {
          ...desc,
          points: desc.points.map((point, j) => 
            j === pointIndex ? { ...point, content: value } : point
          )
        } : desc
      )
    }));
  };

  const addDescription = () => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, { mainTitle: '', summary: '', points: [] }]
    }));
  };

  const removeDescription = (index) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index)
    }));
  };

  const addDescriptionPoint = (descIndex) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === descIndex ? {
          ...desc,
          points: [...desc.points, { content: '' }]
        } : desc
      )
    }));
  };

  const removeDescriptionPoint = (descIndex, pointIndex) => {
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
        i === index ? { ...method, name: value } : method
      )
    }));
  };

  const addMethod = () => {
    setServiceForm(prev => ({
      ...prev,
      methods: [...prev.methods, { name: '' }]
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
      const updateData = {
        id: service.id,
        title: serviceForm.title,
        categoryId: serviceForm.categoryId,
        descriptions: serviceForm.descriptions,
        methods: serviceForm.methods
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
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '50%',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress size={48} thickness={4} sx={{ color: 'white' }} />
          </Box>
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
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ContentPaper sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
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
            <Button
              variant="contained"
              onClick={() => refetch()}
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </ContentPaper>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ContentPaper sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
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
            <Button
              variant="contained"
              onClick={handleBackClick}
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2 }}
            >
              Back to Services
            </Button>
          </ContentPaper>
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
      pb: 8
    }}>
      {/* Floating Navigation */}
      <FloatingNavBar
        style={{ opacity: headerOpacity }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={handleBackClick}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ maxWidth: 300 }}>
            {service.title}
          </Typography>
        </Box>
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ 
              position: 'absolute', 
              bottom: 40, 
              left: 0, 
              right: 0,
              color: 'white',
              textAlign: 'center'
            }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  lineHeight: 1.2
                }}
              >
                {service.title}
              </Typography>
              
              {service.category && (
                <Chip
                  icon={<CategoryIcon />}
                  label={service.category.title}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    mb: 3,
                    fontSize: '1rem',
                    height: 40
                  }}
                />
              )}
              
              <Button
                variant="outlined"
                onClick={handleBackClick}
                startIcon={<ArrowBackIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Back to Services
              </Button>
            </Box>
          </motion.div>
        </Container>
      </HeroSection>

      {/* Content Section */}
      <Container maxWidth="lg">
        <ContentPaper>
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
                  mb: 4 
                }}>
                  <Box>
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Active Service"
                      color="success"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    {service.createdAt && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                        Service added on {new Date(service.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Admin Actions */}
                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Service">
                        <IconButton
                          onClick={handleOpenEditDialog}
                          color="primary"
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Service">
                        <IconButton
                          onClick={handleOpenDeleteDialog}
                          color="error"
                          sx={{
                            backgroundColor: 'error.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'error.dark',
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
                      }}
                    >
                      <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Service Images
                    </Typography>
                    <Grid container spacing={2}>
                      {service.images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={image.url}
                              alt={`${service.title} image ${index + 1}`}
                              sx={{ objectFit: 'cover' }}
                            />
                          </Card>
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
                      }}
                    >
                      <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Service Descriptions
                    </Typography>
                    
                    {service.descriptions.map((description, index) => (
                      <Accordion key={index} sx={{ mb: 2, borderRadius: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="h6" fontWeight="bold">
                            {description.mainTitle}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body1" color="text.secondary" paragraph>
                            {description.summary}
                          </Typography>
                          
                          {description.points && description.points.length > 0 && (
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Key Points:
                              </Typography>
                              <List>
                                {description.points.map((point, pointIndex) => (
                                  <ListItem key={pointIndex} sx={{ pl: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                      <Avatar
                                        sx={{
                                          width: 24,
                                          height: 24,
                                          bgcolor: 'primary.main',
                                          fontSize: '0.8rem',
                                          mr: 2,
                                          mt: 0.5
                                        }}
                                      >
                                        {pointIndex + 1}
                                      </Avatar>
                                      <Typography variant="body2" color="text.secondary">
                                        {point.content}
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
                      }}
                    >
                      <BuildIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Service Methods
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {service.methods.map((method, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            textAlign: 'center'
                          }}>
                            <BuildCircleIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" fontWeight="bold">
                              {method.name}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </motion.div>
              )}
            </motion.div>
          </Box>
        </ContentPaper>
      </Container>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000
            }}
          >
            <Fab 
              color="primary" 
              onClick={scrollToTop}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
            // Scroll to Top FAB (continued from where it was cut off)
<ArrowUpIcon />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Service Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.8, y: 50 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.8, y: 50 },
          transition: { duration: 0.3 },
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1,
        }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Edit Service
          </Typography>
          <IconButton 
            onClick={handleCloseEditDialog} 
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleUpdateSubmit}>
          <DialogContent sx={{ pt: 2 }}>
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
                    sx: { borderRadius: 2 }
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
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.title}
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
                      startIcon={<ImageIcon />}
                      fullWidth
                      sx={{ 
                        mb: 2, 
                        borderRadius: 2,
                        py: 1.5,
                        borderStyle: 'dashed',
                      }}
                    >
                      {serviceForm.image ? 'Change Image' : 'Update Image'}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: 200,
                          objectFit: 'cover',
                          borderRadius: 12,
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                {/* Methods Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
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
                          value={method.name}
                          onChange={(e) => handleMethodChange(index, e.target.value)}
                          placeholder="Method name"
                          sx={{ mr: 1 }}
                        />
                        <IconButton
                          onClick={() => removeMethod(index)}
                          color="error"
                          size="small"
                        >
                          <RemoveIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    onClick={addMethod}
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Add Method
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Descriptions Section */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                Service Descriptions
              </Typography>
              
              {serviceForm.descriptions.map((description, descIndex) => (
                <Accordion key={descIndex} defaultExpanded sx={{ mb: 2, borderRadius: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <TextField
                        fullWidth
                        variant="standard"
                        value={description.mainTitle}
                        onChange={(e) => handleDescriptionChange(descIndex, 'mainTitle', e.target.value)}
                        placeholder="Section Title"
                        sx={{ mr: 2 }}
                        InputProps={{ disableUnderline: true }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDescription(descIndex);
                        }}
                        color="error"
                        size="small"
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
                            value={point.content}
                            onChange={(e) => handleDescriptionPointChange(descIndex, pointIndex, e.target.value)}
                            placeholder="Point content"
                            sx={{ mr: 1 }}
                          />
                          <IconButton
                            onClick={() => removeDescriptionPoint(descIndex, pointIndex)}
                            color="error"
                            size="small"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      onClick={() => addDescriptionPoint(descIndex)}
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Add Point
                    </Button>
                  </AccordionDetails>
                </Accordion>
              ))}
              
              <Button
                onClick={addDescription}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
              >
                Add Description Section
              </Button>
            </Box>

            {updateServiceMutation.error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {updateServiceMutation.error.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={handleCloseEditDialog} 
              disabled={updateServiceMutation.isPending}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateServiceMutation.isPending || !serviceForm.title.trim() || !serviceForm.categoryId}
              startIcon={updateServiceMutation.isPending ? <CircularProgress size={20} /> : null}
              sx={{ 
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)',
                },
              }}
            >
              {updateServiceMutation.isPending ? 'Updating...' : 'Update Service'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: { duration: 0.3 },
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: 'error.main',
        }}>
          <WarningIcon sx={{ mr: 1 }} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the service "<strong>{service?.title}</strong>"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            disabled={deleteServiceMutation.isPending}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteServiceMutation.isPending}
            startIcon={deleteServiceMutation.isPending ? <CircularProgress size={20} /> : null}
            sx={{ borderRadius: 2 }}
          >
            {deleteServiceMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceDetailPage;