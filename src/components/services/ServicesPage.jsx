import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Skeleton,
  Snackbar,
  styled,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Construction as ConstructionIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayArrowIcon,
  ViewModule,
  ViewList,
} from "@mui/icons-material";
import { Paper } from "@mui/material";
import { useGetAllServices, useCreateService } from "../../hooks/useServices";
import servicesBanner from '../../assets/construction-site-worker-workers-background-sunrise-sunset-each-doing-his-job-work-60082711.webp';

// Styled Components
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

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: 'white',
  maxWidth: '800px',
  padding: theme.spacing(0, 3),
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '20px',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.08)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 28px rgba(33, 150, 243, 0.14)',
    background: 'rgba(255, 255, 255, 0.95)',
  },
}));
const ServiceCardContainer = styled(Card)(({ theme }) => ({
  height: '420px',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%',
  maxWidth: '400px',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    '& .service-image': {
      transform: 'scale(1.1)',
    },
    '& .service-overlay': {
      opacity: 1,
    },
    '& .service-arrow': {
      transform: 'translateX(8px)',
    }
  },
}));

const ServiceDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  lineHeight: '1.4',
  color: theme.palette.grey[600],
  display: '-webkit-box',
  WebkitLineClamp: 4, // Show up to 4 lines, truncate the rest
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minHeight: '5.2em', // This is about 4 lines at 1.3em line-height
  marginBottom: '8px',
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  height: '420px',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%',
  maxWidth: '400px',
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    '& .service-image': {
      transform: 'scale(1.1)',
    },
    '& .service-overlay': {
      opacity: 1,
    },
    '& .service-arrow': {
      transform: 'translateX(8px)',
    }
  },
}));

const ServiceImage = styled(CardMedia)({
  height: '260px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
});

const ServiceOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(33, 203, 243, 0.8) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  lineHeight: 1.3,
  color: theme.palette.grey[800],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  minHeight: '2.6rem',
}));

const AddServiceButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    minWidth: '500px',
    maxWidth: '600px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const ImageUploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed #e2e8f0',
  borderRadius: '16px',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
  '&:hover': {
    borderColor: '#3b82f6',
    background: 'linear-gradient(145deg, #eff6ff 0%, #f0f9ff 100%)',
    transform: 'scale(1.02)',
  },
}));

const ImagePreviewContainer = styled(Box)({
  width: '100%',
  height: '200px',
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  marginTop: '16px',
});

const PreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ServicesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const servicesRef = useRef(null);
  
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // React Query hooks
  const { data: services = [], isLoading, error, refetch } = useGetAllServices();
  const createServiceMutation = useCreateService();

  // Check user role from localStorage
  useEffect(() => {
    const checkUserRole = () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } else {
          setUserData(null);
        }
      } catch (error) {
        setUserData(null);
        setSnackbar({
          open: true,
          message: "Error loading user data",
          severity: "error",
        });
      }
    };
    checkUserRole();
    window.addEventListener("storage", checkUserRole);
    return () => window.removeEventListener("storage", checkUserRole);
  }, []);

  const isAdmin = userData?.role === "admin" || userData?.role === "Admin";

  const handleOpenDialog = () => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: "Only admin users can add services",
        severity: "error",
      });
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setServiceForm({ name: "", description: "", image: null });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Please select a valid image file",
          severity: "error",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }
      setServiceForm((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim() || !serviceForm.description.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }
    try {
      await createServiceMutation.mutateAsync(serviceForm);
      setSnackbar({
        open: true,
        message: "Service created successfully!",
        severity: "success",
      });
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error creating service",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, staggerChildren: 0.1 },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, mt: 10 }}>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          Error loading services: {error.message}
        </Alert>
        <Button onClick={() => refetch()} variant="contained" color="primary" sx={{ borderRadius: 3 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Hero Section */}
      <HeroSection>
        <HeroImage src={servicesBanner} alt="Construction Services" />
        <HeroContent>
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <Typography variant="h1" fontWeight={800} sx={{ mb: 2, fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, lineHeight: 1.1, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
              Our Services
            </Typography>
            <Typography variant="h4" sx={{ mb: 4, opacity: 0.95, fontWeight: 400, fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, maxWidth: '600px', margin: '0 auto 2rem' }}>
              Professional construction services built with quality and innovation
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<PlayArrowIcon />}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => {
                servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Services
            </Button>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h2" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              What We Offer
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto', fontWeight: 400 }}>
              Discover our comprehensive range of construction services designed to bring your vision to life
            </Typography>
          </Box>
          {/* Controls Section */}
          <Box sx={{ mb: 4 }}>
            <GlassCard sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' }, background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
                    Services
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '1rem' }}>
                    {Array.isArray(services) ? services.length : 0} services available
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  {/* View Toggle */}
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Tooltip title="Grid View">
                      <IconButton
                        onClick={() => setViewMode('grid')}
                        size="small"
                        sx={{
                          color: viewMode === 'grid' ? '#2196F3' : 'text.secondary',
                          background: viewMode === 'grid' ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                        }}
                      >
                        <ViewModule />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="List View">
                      <IconButton
                        onClick={() => setViewMode('list')}
                        size="small"
                        sx={{
                          color: viewMode === 'list' ? '#2196F3' : 'text.secondary',
                          background: viewMode === 'list' ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                        }}
                      >
                        <ViewList />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {isAdmin && (
                    <AddServiceButton startIcon={<AddIcon />} onClick={handleOpenDialog}>
                      Add Service
                    </AddServiceButton>
                  )}
                </Box>
              </Box>
            </GlassCard>
          </Box>
          {/* Services Grid/List */}
          <Box ref={servicesRef}>
            {isLoading ? (
              <Grid container spacing={4}>
                {[...Array(6)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : services.length === 0 ? (
              <Box textAlign="center" py={8}>
                <ConstructionIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No services yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isAdmin ? 'Start by adding your first service!' : 'Services will appear here once they are added.'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {services.map((service, idx) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === 'grid' ? 6 : 12}
                    md={viewMode === 'grid' ? 4 : 12}
                    lg={viewMode === 'grid' ? 3 : 12}
                    key={service._id || idx}
                  >
                    <motion.div variants={cardVariants}>
                      <ServiceCardContainer onClick={() => navigate(`/services/${service._id}`)}>
                        <ServiceImage
                          className="service-image"
                          image={service.image || '/placeholder-image.jpg'}
                          title={service.name}
                        />
                        <ServiceOverlay className="service-overlay">
                          <ArrowForwardIcon className="service-arrow" sx={{ color: 'white', fontSize: 36 }} />
                        </ServiceOverlay>
                        <CardContent sx={{ p: 3 }}>
                          <ServiceTitle>{service.name}</ServiceTitle>
                          <ServiceDescription>{service.description}</ServiceDescription>
                          <Box mt={2}>
                            {service.tags?.map((tag, i) => (
                              <Chip
                                key={i}
                                label={tag}
                                size="small"
                                sx={{ mr: 1, mb: 1, background: '#e3f2fd', color: '#1976d2' }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </ServiceCardContainer>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </motion.div>
      </Container>
      {/* Add Service Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Add New Service
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Service Name"
              name="name"
              value={serviceForm.name}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={serviceForm.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              minRows={3}
              required
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCameraIcon />}
              sx={{ mb: 2 }}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            {imagePreview && (
              <Box sx={{ mb: 2 }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
              </Box>
            )}
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={createServiceMutation.isLoading}>
                {createServiceMutation.isLoading ? <CircularProgress size={20} /> : "Add Service"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </StyledDialog>
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServicesPage;