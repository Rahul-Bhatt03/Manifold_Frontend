// pages/ServicesPage.jsx
import React, { useState, useEffect } from "react";
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
  Fab,
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
  CardActionArea,
} from "@mui/material";
import {
  Add as AddIcon,
  Construction as ConstructionIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  BuildCircle as BuildCircleIcon,
} from "@mui/icons-material";
import { useGetAllServices, useCreateService } from "../../hooks/useServices";
import servicesBanner from '../../assets/construction-site-worker-workers-background-sunrise-sunset-each-doing-his-job-work-60082711.webp'; 


const ServicesPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
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
  const { data: services, isLoading, error, refetch } = useGetAllServices();
  const createServiceMutation = useCreateService();

  // Check user role from localStorage on component mount
  useEffect(() => {
    const checkUserRole = () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
        } else {
          // If no userData in localStorage, user is not logged in
          setUserData(null);
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
        setUserData(null);
        setSnackbar({
          open: true,
          message: "Error loading user data",
          severity: "error",
        });
      }
    };

    checkUserRole();

    // Listen for storage changes (if user logs in/out in another tab)
    window.addEventListener("storage", checkUserRole);

    return () => {
      window.removeEventListener("storage", checkUserRole);
    };
  }, []);

  // Check if user is admin
  const isAdmin = userData?.role === "admin" || userData?.role === "Admin";
  const isLoggedIn = userData !== null;

  const handleCardClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

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
      name: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSnackbar({
          open: true,
          message: "Please select a valid image file",
          severity: "error",
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 5MB",
          severity: "error",
        });
        return;
      }

      setServiceForm((prev) => ({
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
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const fabVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 90,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, sm: 10 } }}>
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          Error loading services: {error.message}
        </Alert>
        <Button
          onClick={() => refetch()}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
     <Box sx={{ width: '100%' }}>
      {/* Hero Banner - Full Width */}
      <Box
        sx={{
          width: '100vw',
          height: '60vh',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          overflow: 'hidden',
        }}
      >
        <img
          src={servicesBanner}
          alt="Construction Services"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Typography variant="h2" component="h1" color="white" fontWeight="bold">
            Our Services
          </Typography>
          <Typography variant="h5" color="rgba(255,255,255,0.9)">
            Professional construction services built with quality and innovation
          </Typography>
        </Box>
      </Box>

    <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 8, sm: 10 } }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
       
        {isAdmin && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)",
                },
              }}
            >
              Add Service
            </Button>
          </Box>
        )}

        {/* Services Grid */}
        <Grid container spacing={4}>
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: 420, // Fixed height for consistency
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent
                      sx={{
                        height: 220,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : services?.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service._id}>
                  <motion.div variants={cardVariants} whileHover="hover" layout>
                    <Card
                      sx={{
                        height: 420, // Fixed height for all cards
                        cursor: "pointer",
                        overflow: "hidden",
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <CardActionArea
                        onClick={() => handleCardClick(service._id)}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                          justifyContent: "flex-start",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200" // Fixed height for consistency
                          image={
                            service.image ||
                            "https://via.placeholder.com/400x200?text=Service+Image"
                          }
                          alt={service.name}
                          sx={{
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            p: 3,
                            height: 220, // Fixed height for content area
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                              sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                                mb: 2,
                                fontSize: "1.3rem",
                                lineHeight: 1.2,
                                // Ensure title doesn't overflow
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {service.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 4, // Show max 4 lines
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.6,
                                fontSize: "0.95rem",
                                height: "6.4rem", // Fixed height based on 4 lines
                              }}
                            >
                              {service.description}
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
        </Grid>

        {/* Empty State */}
        {!isLoading && services?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <ConstructionIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" gutterBottom>
                No Services Available
              </Typography>
              <Typography variant="body1">
                {isAdmin
                  ? "Start by adding your first service!"
                  : "Services will be available soon."}
              </Typography>
            </Box>
          </motion.div>
        )}
      </motion.div>

      {/* Add Service Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
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
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Add New Service
          </Typography>
          <IconButton
            onClick={handleCloseDialog}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
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
                sx: { borderRadius: 2 },
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
                sx: { borderRadius: 2 },
              }}
            />

            {/* Image Upload */}
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="service-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="service-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  fullWidth
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    py: 1.5,
                    borderStyle: "dashed",
                  }}
                >
                  Upload Image
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "cover",
                      borderRadius: 12,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              )}
            </Box>

            {createServiceMutation.error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {createServiceMutation.error.message}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseDialog}
              disabled={createServiceMutation.isPending}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createServiceMutation.isPending ||
                !serviceForm.name.trim() ||
                !serviceForm.description.trim()
              }
              startIcon={
                createServiceMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : null
              }
              sx={{
                borderRadius: 2,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #1BA3D3 90%)",
                },
              }}
            >
              {createServiceMutation.isPending
                ? "Creating..."
                : "Create Service"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </Box>
  );
};

export default ServicesPage;
