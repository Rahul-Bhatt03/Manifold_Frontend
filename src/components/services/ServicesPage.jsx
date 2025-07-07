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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
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
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Paper } from "@mui/material";
import { 
  useGetAllServices, 
  useCreateService, 
  useGetServicesByCategory 
} from "../../hooks/useServices";
import { useCategories } from "../../hooks/useCategories"; 
import servicesBanner from '../../assets/construction-site-worker-workers-background-sunrise-sunset-each-doing-his-job-work-60082711.webp';
import { useCreateCategory } from "../../hooks/useCategories";
import CategoryForm from "../services/CategoryForm";

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

// Fixed Grid View Service Card
const ServiceCard = styled(Card)(({ theme }) => ({
  height: '420px', // Fixed height for all cards
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
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

// Fixed List View Service Card
const ListServiceCard = styled(Card)(({ theme }) => ({
  height: '180px', // Fixed height for list view
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%',
  display: 'flex',
  marginBottom: theme.spacing(3),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    '& .service-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const ServiceImage = styled(CardMedia)({
  height: '260px', // Fixed height for grid view
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
  flexShrink: 0,
});

const ListServiceImage = styled(CardMedia)({
  width: '280px', // Fixed width for list view
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
  flexShrink: 0,
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
  textOverflow: 'ellipsis',
  height: '3.25rem', // Fixed height for 2 lines
  marginBottom: theme.spacing(1),
}));

const ServiceDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  lineHeight: '1.4',
  color: theme.palette.grey[600],
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '4.2rem', // Fixed height for 3 lines
  marginBottom: theme.spacing(1),
}));

const ListServiceTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  lineHeight: 1.3,
  color: theme.palette.grey[800],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.86rem', // Fixed height for 2 lines
  marginBottom: theme.spacing(1),
}));

const ListServiceDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  lineHeight: '1.4',
  color: theme.palette.grey[600],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.8rem', // Fixed height for 2 lines
  marginBottom: theme.spacing(1),
}));

const TagsContainer = styled(Box)({
  minHeight: '32px', // Reserve space for tags
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  overflow: 'hidden',
});

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
  // Mobile responsive styles
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.9rem',
    minWidth: '120px',
  },
}));

const AddCategoryButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 8px 24px rgba(76, 175, 80, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(76, 175, 80, 0.5)',
  },
  // Mobile responsive styles
  [theme.breakpoints.down('sm')]: {
    padding: '8px 16px',
    fontSize: '0.9rem',
    minWidth: '120px',
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '24px',
    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
    minWidth: '500px',
    maxWidth: '700px',
    maxHeight: '90vh',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const ServicesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const servicesRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [serviceForm, setServiceForm] = useState({
    title: "",
    categoryId: "",
    descriptions: [
      {
        mainTitle: "",
        summary: "",
        points: [""]
      }
    ],
    methods: [""],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  // React Query hooks
  const { data: services = [], isLoading, error, refetch } = useGetAllServices();
  const { data: categories = [], refetch: refetchCategories } = useCategories();
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
    setServiceForm({
      title: "",
      categoryId: "",
      descriptions: [
        {
          mainTitle: "",
          summary: "",
          points: [""]
        }
      ],
      methods: [""],
      image: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (index, field, value) => {
    const newDescriptions = [...serviceForm.descriptions];
    newDescriptions[index] = { ...newDescriptions[index], [field]: value };
    setServiceForm((prev) => ({ ...prev, descriptions: newDescriptions }));
  };

  const handlePointChange = (descIndex, pointIndex, value) => {
    const newDescriptions = [...serviceForm.descriptions];
    const newPoints = [...newDescriptions[descIndex].points];
    newPoints[pointIndex] = value;
    newDescriptions[descIndex] = { ...newDescriptions[descIndex], points: newPoints };
    setServiceForm((prev) => ({ ...prev, descriptions: newDescriptions }));
  };

  const addPoint = (descIndex) => {
    const newDescriptions = [...serviceForm.descriptions];
    newDescriptions[descIndex].points.push("");
    setServiceForm((prev) => ({ ...prev, descriptions: newDescriptions }));
  };

  const removePoint = (descIndex, pointIndex) => {
    const newDescriptions = [...serviceForm.descriptions];
    newDescriptions[descIndex].points.splice(pointIndex, 1);
    setServiceForm((prev) => ({ ...prev, descriptions: newDescriptions }));
  };

  const addDescription = () => {
    setServiceForm((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, { mainTitle: "", summary: "", points: [""] }]
    }));
  };

  const removeDescription = (index) => {
    const newDescriptions = serviceForm.descriptions.filter((_, i) => i !== index);
    setServiceForm((prev) => ({ ...prev, descriptions: newDescriptions }));
  };

  const handleMethodChange = (index, value) => {
    const newMethods = [...serviceForm.methods];
    newMethods[index] = value;
    setServiceForm((prev) => ({ ...prev, methods: newMethods }));
  };

  const addMethod = () => {
    setServiceForm((prev) => ({ ...prev, methods: [...prev.methods, ""] }));
  };

  const removeMethod = (index) => {
    const newMethods = serviceForm.methods.filter((_, i) => i !== index);
    setServiceForm((prev) => ({ ...prev, methods: newMethods }));
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
    
    if (!serviceForm.title.trim() || !serviceForm.categoryId) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    // Validate descriptions
    const validDescriptions = serviceForm.descriptions.filter(desc => 
      desc.mainTitle.trim() && desc.summary.trim()
    );

    if (validDescriptions.length === 0) {
      setSnackbar({
        open: true,
        message: "Please add at least one description with title and summary",
        severity: "error",
      });
      return;
    }

    // Filter out empty points and methods
    const cleanedDescriptions = validDescriptions.map(desc => ({
      ...desc,
      points: desc.points.filter(point => point.trim())
    }));

    const cleanedMethods = serviceForm.methods.filter(method => method.trim());

    try {
      await createServiceMutation.mutateAsync({
        title: serviceForm.title,
        categoryId: serviceForm.categoryId,
        descriptions: cleanedDescriptions,
        methods: cleanedMethods,
        image: serviceForm.image,
      });
      
      setSnackbar({
        open: true,
        message: "Service created successfully!",
        severity: "success",
      });
      
      // Close dialog after a short delay to show success message
      setTimeout(() => {
        handleCloseDialog();
      }, 1500);
      
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

  const handleCategorySuccess = () => {
    setSnackbar({
      open: true,
      message: "Category created successfully!",
      severity: "success",
    });
    setOpenCategoryDialog(false);
    refetchCategories(); // Refresh categories list
  };

  // Get display data from service
  const getServiceDisplayData = (service) => {
    // Extract first image URL
    const imageUrl = service.images?.[0]?.url || service.image || '/placeholder-image.jpg';
    
    // Extract first description summary as main description
    const mainDescription = service.descriptions?.[0]?.summary || service.description || '';
    
    // Extract methods as tags
    const methodTags = service.methods?.map(method => method.name) || [];
    
    return {
      title: service.title,
      description: mainDescription,
      image: imageUrl,
      tags: methodTags,
      category: service.category?.title || '',
    };
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
              <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                flexWrap="wrap" 
                gap={2}
                sx={{
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'center', sm: 'center' }
                }}
              >
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' }, background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 0.5 }}>
                    Services
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '1rem' }}>
                    {Array.isArray(services) ? services.length : 0} services available
                  </Typography>
                </Box>
                
                <Box 
                  display="flex" 
                  alignItems="center" 
                  gap={1.5}
                  sx={{
                    flexDirection: { xs: 'column', sm: 'row' },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
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
                    <Box 
                      display="flex" 
                      gap={1}
                      sx={{
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      <AddCategoryButton
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCategoryDialog(true)}
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}
                      >
                        {isSmallScreen ? 'Add Category' : 'Add Category'}
                      </AddCategoryButton>
                      
                      <AddServiceButton 
                        startIcon={<AddIcon />} 
                        onClick={handleOpenDialog}
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          justifyContent: { xs: 'center', sm: 'flex-start' }
                        }}
                      >
                        {isSmallScreen ? 'Add Service' : 'Add Service'}
                      </AddServiceButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </GlassCard>
          </Box>

          {/* Services Grid/List */}
          <Box ref={servicesRef}>
            {isLoading ? (
              <Grid container spacing={4} justifyContent="center">
                {[...Array(6)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3 }} />
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
            ) : viewMode === 'list' ? (
              // List View Layout - Responsive Grid
              <Grid container spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {services.map((service, idx) => {
                  const displayData = getServiceDisplayData(service);
                  return (
                    <Grid 
                      item 
                      xs={12}
                                            key={service.id || idx}
                      sx={{ 
                        display: 'flex',
                        justifyContent: { xs: 'center', md: 'flex-start' }
                      }}
                    >
                      <motion.div variants={cardVariants} style={{ width: '100%', maxWidth: '500px' }}>
                        <ListServiceCard onClick={() => navigate(`/services/${service.id}`)}>
                          <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
                            {/* Image Section */}
                            <Box sx={{ width: { xs: '120px', sm: '140px' }, flexShrink: 0 }}>
                              <ListServiceImage
                                className="service-image"
                                image={displayData.image}
                                title={displayData.title}
                                sx={{ width: '100%', height: '100%' }}
                              />
                            </Box>
                            
                            {/* Content Section */}
                            <Box sx={{ 
                              p: 2, 
                              flexGrow: 1, 
                              display: 'flex', 
                              flexDirection: 'column',
                              overflow: 'hidden',
                              minWidth: 0 // Allows text truncation
                            }}>
                              <ListServiceTitle>
                                {displayData.title}
                              </ListServiceTitle>
                              
                              <ListServiceDescription>
                                {displayData.description}
                              </ListServiceDescription>
                              
                              {/* Tags - Limited to 2-3 tags in list view */}
                              <TagsContainer sx={{ mt: 'auto' }}>
                                {displayData.tags?.slice(0, 2).map((tag, i) => (
                                  <Chip
                                    key={i}
                                    label={tag}
                                    size="small"
                                    sx={{ 
                                      background: '#e3f2fd', 
                                      color: '#1976d2',
                                      fontSize: '0.75rem',
                                      height: '24px'
                                    }}
                                  />
                                ))}
                                {displayData.tags?.length > 2 && (
                                  <Chip
                                    label={`+${displayData.tags.length - 2}`}
                                    size="small"
                                    sx={{ 
                                      background: '#f5f5f5', 
                                      color: '#666',
                                      fontSize: '0.75rem',
                                      height: '24px'
                                    }}
                                  />
                                )}
                              </TagsContainer>
                            </Box>
                          </Box>
                        </ListServiceCard>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              // Grid View Layout
              <Grid container spacing={4} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                {services.map((service, idx) => {
                  const displayData = getServiceDisplayData(service);
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={service.id || idx}
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <motion.div variants={cardVariants} style={{ width: '100%', maxWidth: '350px' }}>
                        <ServiceCard onClick={() => navigate(`/services/${service.id}`)}>
                          <ServiceImage
                            className="service-image"
                            image={displayData.image}
                            title={displayData.title}
                          />
                          <ServiceOverlay className="service-overlay">
                            <Button
                              variant="contained"
                              endIcon={<ArrowForwardIcon className="service-arrow" />}
                              sx={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#1976d2',
                                fontWeight: 600,
                                borderRadius: '25px',
                                px: 3,
                                py: 1,
                                '&:hover': {
                                  background: 'rgba(255, 255, 255, 1)',
                                },
                              }}
                            >
                              View Details
                            </Button>
                          </ServiceOverlay>
                          <CardContent sx={{ p: 3, height: '160px', display: 'flex', flexDirection: 'column' }}>
                            <ServiceTitle>
                              {displayData.title}
                            </ServiceTitle>
                            
                            <ServiceDescription>
                              {displayData.description}
                            </ServiceDescription>
                            
                            <TagsContainer sx={{ mt: 'auto' }}>
                              {displayData.tags?.slice(0, 3).map((tag, i) => (
                                <Chip
                                  key={i}
                                  label={tag}
                                  size="small"
                                  sx={{ 
                                    background: '#e3f2fd', 
                                    color: '#1976d2',
                                    fontSize: '0.75rem',
                                    height: '24px'
                                  }}
                                />
                              ))}
                              {displayData.tags?.length > 3 && (
                                <Chip
                                  label={`+${displayData.tags.length - 3}`}
                                  size="small"
                                  sx={{ 
                                    background: '#f5f5f5', 
                                    color: '#666',
                                    fontSize: '0.75rem',
                                    height: '24px'
                                  }}
                                />
                              )}
                            </TagsContainer>
                          </CardContent>
                        </ServiceCard>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </motion.div>
      </Container>

      {/* Add/Edit Service Dialog */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.5rem', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Add New Service
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Title"
                  name="title"
                  value={serviceForm.title}
                  onChange={handleInputChange}
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: '12px',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                      },
                    },
                  }}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={serviceForm.categoryId}
                    onChange={handleInputChange}
                    label="Category"
                    sx={{ 
                      borderRadius: '12px',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCameraIcon />}
                      sx={{ 
                        borderRadius: '12px',
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a67d8',
                          backgroundColor: 'rgba(102, 126, 234, 0.04)',
                        },
                      }}
                    >
                      Upload Image
                    </Button>
                  </label>
                  {serviceForm.image && (
                    <Typography variant="body2" color="text.secondary">
                      {serviceForm.image.name}
                    </Typography>
                  )}
                </Box>
                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Service Descriptions */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Service Descriptions
                </Typography>
                {serviceForm.descriptions.map((desc, descIndex) => (
                  <Accordion key={descIndex} sx={{ mb: 2, borderRadius: '12px !important' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {desc.mainTitle || `Description ${descIndex + 1}`}
                      </Typography>
                      {serviceForm.descriptions.length > 1 && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDescription(descIndex);
                          }}
                          sx={{ ml: 'auto', mr: 1 }}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Main Title"
                            value={desc.mainTitle}
                            onChange={(e) => handleDescriptionChange(descIndex, 'mainTitle', e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Summary"
                            multiline
                            rows={3}
                            value={desc.summary}
                            onChange={(e) => handleDescriptionChange(descIndex, 'summary', e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Key Points
                          </Typography>
                          {desc.points.map((point, pointIndex) => (
                            <Box key={pointIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder={`Point ${pointIndex + 1}`}
                                value={point}
                                onChange={(e) => handlePointChange(descIndex, pointIndex, e.target.value)}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                              />
                              {desc.points.length > 1 && (
                                <IconButton
                                  onClick={() => removePoint(descIndex, pointIndex)}
                                  size="small"
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                          ))}
                          <Button
                            onClick={() => addPoint(descIndex)}
                            variant="outlined"
                            size="small"
                            startIcon={<AddIcon />}
                            sx={{ mt: 1, borderRadius: '8px' }}
                          >
                            Add Point
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
                <Button
                  onClick={addDescription}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ mt: 1, borderRadius: '12px' }}
                >
                  Add Description
                </Button>
              </Grid>

              {/* Service Methods */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Service Methods
                </Typography>
                {serviceForm.methods.map((method, methodIndex) => (
                  <Box key={methodIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Method ${methodIndex + 1}`}
                      value={method}
                      onChange={(e) => handleMethodChange(methodIndex, e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    />
                    {serviceForm.methods.length > 1 && (
                      <IconButton
                        onClick={() => removeMethod(methodIndex)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  onClick={addMethod}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{ borderRadius: '12px' }}
                >
                  Add Method
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              borderRadius: '12px',
              borderColor: '#e0e0e0',
              color: '#666',
              '&:hover': {
                borderColor: '#bdbdbd',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={createServiceMutation.isPending}
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              },
            }}
          >
            {createServiceMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create Service'
            )}
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Category Form Dialog */}
      <CategoryForm 
        open={openCategoryDialog} 
        onClose={() => setOpenCategoryDialog(false)}
        onSuccess={() => {
          setSnackbar({
            open: true,
            message: "Category created successfully!",
            severity: "success",
          });
          refetchCategories();
        }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServicesPage;