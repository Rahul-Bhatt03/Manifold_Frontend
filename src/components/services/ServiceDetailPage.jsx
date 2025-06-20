// pages/ServiceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Skeleton,
  Backdrop,
  Snackbar,
  Chip,
  Card,
  CardMedia,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  BuildCircle as BuildCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useGetServiceById, useUpdateService, useDeleteService } from '../../hooks/useServices';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // React Query hooks
  const { data: service, isLoading, error, refetch } = useGetServiceById(id);
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();

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
        name: service.name || '',
        description: service.description || '',
        image: null,
      });
    }
  }, [service]);

  const isAdmin = userData?.role === 'admin';

  const handleBackClick = () => {
    navigate('/services');
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
    setImagePreview(service.image);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setServiceForm({
      name: service?.name || '',
      description: service?.description || '',
      image: null,
    });
    setImagePreview(service?.image || null);
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Please select a valid image file',
          severity: 'error'
        });
        return;
      }

      // Validate file size (5MB limit)
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
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim() || !serviceForm.description.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      const updateData = {
        id: service._id,
        name: serviceForm.name,
        description: serviceForm.description,
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
      await deleteServiceMutation.mutateAsync(service._id);
      setSnackbar({
        open: true,
        message: 'Service deleted successfully!',
        severity: 'success'
      });
      handleCloseDeleteDialog();
      // Navigate back to services page after successful deletion
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, sm: 10 } }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" height={50} />
              <Skeleton variant="text" height={30} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Box sx={{ mt: 3 }}>
                <Skeleton variant="rectangular" width={100} height={40} />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, sm: 10 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Back to Services
        </Button>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error loading service: {error.message}
        </Alert>
        <Button onClick={() => refetch()} variant="contained" color="primary">
          Retry
        </Button>
      </Container>
    );
  }

  // Service not found
  if (!service) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, sm: 10 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Back to Services
        </Button>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Service not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, sm: 10 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div variants={contentVariants}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            Back to Services
          </Button>
        </motion.div>

        {/* Service Detail Card */}
        <motion.div variants={contentVariants}>
          <Paper 
            elevation={3} 
            sx={{ 
              overflow: 'hidden',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            }}
          >
            <Grid container>
              {/* Image Section */}
              <Grid item xs={12} md={6}>
                <motion.div variants={imageVariants}>
                  <CardMedia
                    component="img"
                    height="500"
                    image={service.image || '/api/placeholder/600/500'}
                    alt={service.name}
                    sx={{
                      objectFit: 'cover',
                      height: { xs: 300, md: 500 },
                    }}
                  />
                </motion.div>
              </Grid>

              {/* Content Section */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header with Admin Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                          fontWeight: 'bold',
                          color: 'primary.main',
                          mb: 1,
                          fontSize: { xs: '2rem', md: '2.5rem' },
                        }}
                      >
                        {service.name}
                      </Typography>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Active Service"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    {/* Admin Actions */}
                    {isAdmin && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
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
                      </Box>
                    )}
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Description */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      <BuildCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Service Description
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {service.description}
                    </Typography>
                  </Box>

                  {/* Service Info */}
                  {service.createdAt && (
                    <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
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
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </motion.div>

      {/* Edit Service Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
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
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Service Name"
              type="text"
              fullWidth
              variant="outlined"
              value={serviceForm.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={serviceForm.description}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
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
              disabled={updateServiceMutation.isPending || !serviceForm.name.trim() || !serviceForm.description.trim()}
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
            Are you sure you want to delete the service "<strong>{service?.name}</strong>"? 
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

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updateServiceMutation.isPending || deleteServiceMutation.isPending}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
    </Container>
  );
};

export default ServiceDetailPage;