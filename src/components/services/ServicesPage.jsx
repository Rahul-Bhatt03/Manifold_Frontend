import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Grid,
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
  Paper,
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
import {
  useGetAllServices,
  useCreateService,
  useUpdateService,
} from "../../hooks/useServices";
import { useCategories } from "../../hooks/useCategories";
import servicesBanner from "../../assets/construction-site-worker-workers-background-sunrise-sunset-each-doing-his-job-work-60082711.webp";
import { useCreateCategory } from "../../hooks/useCategories";
import CategoryForm from "../services/CategoryForm";
import ServiceCard from "../../components/services/ServiceCard";

const ServicesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const servicesRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Memoize styled components to prevent re-creation
  const StyledComponents = useMemo(() => {
    const HeroSection = styled(Box)(({ theme }) => ({
      position: "relative",
      width: "100%",
      height: isMobile ? "50vh" : "70vh",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(135deg, rgba(33, 150, 243, 0.8) 0%, rgba(33, 203, 243, 0.6) 100%)",
        zIndex: 1,
      },
    }));

    const HeroImage = styled("img")({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
    });

    const HeroContent = styled(Box)(({ theme }) => ({
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      color: "white",
      maxWidth: "800px",
      padding: theme.spacing(0, 3),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0, 1),
        "& h1": {
          fontSize: "2rem !important",
          marginBottom: "0.5rem",
        },
        "& h4": {
          fontSize: "1rem !important",
          marginBottom: "1.5rem",
        },
      },
    }));

    const GlassCard = styled(Paper)(({ theme }) => ({
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(15px)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "20px",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "0 8px 32px rgba(33, 150, 243, 0.08)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 12px 28px rgba(33, 150, 243, 0.14)",
        background: "rgba(255, 255, 255, 0.95)",
      },
    }));

    const AddServiceButton = styled(Button)(({ theme }) => ({
      borderRadius: "16px",
      padding: isMobile ? "8px 16px" : "12px 24px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontWeight: 600,
      textTransform: "none",
      fontSize: isMobile ? "0.9rem" : "1rem",
      boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.5)",
      },
    }));

    const AddCategoryButton = styled(Button)(({ theme }) => ({
      borderRadius: "16px",
      padding: isMobile ? "8px 16px" : "12px 24px",
      background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
      color: "white",
      fontWeight: 600,
      textTransform: "none",
      fontSize: isMobile ? "0.9rem" : "1rem",
      boxShadow: "0 8px 24px rgba(76, 175, 80, 0.4)",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #43a047 0%, #1b5e20 100%)",
        transform: "translateY(-2px)",
        boxShadow: "0 12px 32px rgba(76, 175, 80, 0.5)",
      },
    }));

    const StyledDialog = styled(Dialog)(({ theme }) => ({
      "& .MuiDialog-paper": {
        borderRadius: isMobile ? 0 : "24px",
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        width: isMobile ? "100%" : "500px",
        maxWidth: isMobile ? "100%" : "700px",
        maxHeight: isMobile ? "100vh" : "90vh",
        margin: isMobile ? 0 : "32px",
        boxShadow: isMobile ? "none" : "0 25px 50px rgba(0, 0, 0, 0.15)",
      },
    }));

    return {
      HeroSection,
      HeroImage,
      HeroContent,
      GlassCard,
      AddServiceButton,
      AddCategoryButton,
      StyledDialog,
    };
  }, [isMobile]);

  const {
    HeroSection,
    HeroImage,
    HeroContent,
    GlassCard,
    AddServiceButton,
    AddCategoryButton,
    StyledDialog,
  } = StyledComponents;

  // State management
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [serviceForm, setServiceForm] = useState({
    title: "",
    categoryId: "",
    descriptions: [
      {
        id: 1,
        mainTitle: "",
        summary: "",
        points: [{ id: 1, value: "" }],
      },
    ],
    methods: [{ id: 1, value: "" }],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // React Query hooks
  const {
    data: services = [],
    isLoading,
    error,
    refetch,
  } = useGetAllServices();
  const { data: categories = [], refetch: refetchCategories } = useCategories();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();

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

  const isAdmin = useMemo(() => 
    userData?.role === "admin" || userData?.role === "Admin", 
    [userData?.role]
  );

  const handleOpenDialog = useCallback(() => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: "Only admin users can add services",
        severity: "error",
      });
      return;
    }
    setOpenDialog(true);
  }, [isAdmin]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setIsEditMode(false);
    setEditingServiceId(null);
    setServiceForm({
      title: "",
      categoryId: "",
      descriptions: [
        {
          id: 1,
          mainTitle: "",
          summary: "",
          points: [{ id: 1, value: "" }],
        },
      ],
      methods: [{ id: 1, value: "" }],
      image: null,
    });
    setImagePreview(null);
  }, []);

  // Fixed form handlers - use functional updates to prevent re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setServiceForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDescriptionChange = useCallback((index, field, value) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) => 
        i === index ? { ...desc, [field]: value } : desc
      )
    }));
  }, []);

  const handlePointChange = useCallback((descIndex, pointIndex, value) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) =>
        i === descIndex
          ? {
              ...desc,
              points: desc.points.map((point, j) =>
                j === pointIndex ? { ...point, value } : point
              )
            }
          : desc
      )
    }));
  }, []);

  const addPoint = useCallback((descIndex) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) =>
        i === descIndex
          ? {
              ...desc,
              points: [
                ...desc.points,
                { id: Math.max(...desc.points.map(p => p.id), 0) + 1, value: "" }
              ]
            }
          : desc
      )
    }));
  }, []);

  const removePoint = useCallback((descIndex, pointIndex) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.map((desc, i) =>
        i === descIndex
          ? {
              ...desc,
              points: desc.points.filter((_, j) => j !== pointIndex)
            }
          : desc
      )
    }));
  }, []);

  const addDescription = useCallback(() => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: [
        ...prev.descriptions,
        {
          id: Math.max(...prev.descriptions.map(d => d.id), 0) + 1,
          mainTitle: "",
          summary: "",
          points: [{ id: 1, value: "" }],
        },
      ],
    }));
  }, []);

  const removeDescription = useCallback((index) => {
    setServiceForm(prev => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  }, []);

  const handleMethodChange = useCallback((index, value) => {
    setServiceForm(prev => ({
      ...prev,
      methods: prev.methods.map((method, i) =>
        i === index ? { ...method, value } : method
      )
    }));
  }, []);

  const addMethod = useCallback(() => {
    setServiceForm(prev => ({
      ...prev,
      methods: [
        ...prev.methods,
        { id: Math.max(...prev.methods.map(m => m.id), 0) + 1, value: "" }
      ],
    }));
  }, []);

  const removeMethod = useCallback((index) => {
    setServiceForm(prev => ({
      ...prev,
      methods: prev.methods.filter((_, i) => i !== index),
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
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
      setServiceForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
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
      const validDescriptions = serviceForm.descriptions.filter(
        (desc) => desc.mainTitle.trim() && desc.summary.trim()
      );

      if (validDescriptions.length === 0) {
        setSnackbar({
          open: true,
          message: "Please add at least one description with title and summary",
          severity: "error",
        });
        return;
      }

      try {
        const serviceData = {
          title: serviceForm.title,
          categoryId: serviceForm.categoryId,
          descriptions: validDescriptions.map((desc) => ({
            mainTitle: desc.mainTitle,
            summary: desc.summary,
            points: desc.points
              .filter((point) => point.value && point.value.trim())
              .map((point) => point.value.trim()),
          })),
          // FIX: Send methods as array of strings, not objects
          methods: serviceForm.methods
            .filter((method) => method.value && method.value.trim())
            .map((method) => method.value.trim()),
          image: serviceForm.image,
        };

        console.log("Sending service data:", JSON.stringify(serviceData, null, 2));

        if (isEditMode && editingServiceId) {
          await updateServiceMutation.mutateAsync({
            id: editingServiceId,
            ...serviceData,
          });
          setSnackbar({
            open: true,
            message: "Service updated successfully!",
            severity: "success",
          });
        } else {
          await createServiceMutation.mutateAsync(serviceData);
          setSnackbar({
            open: true,
            message: "Service created successfully!",
            severity: "success",
          });
        }

        setTimeout(() => {
          handleCloseDialog();
        }, 1500);
      } catch (error) {
        console.error("Service submission error:", error);
        setSnackbar({
          open: true,
          message:
            error.message ||
            `Error ${isEditMode ? "updating" : "creating"} service`,
          severity: "error",
        });
      }
    },
    [
      serviceForm,
      createServiceMutation,
      updateServiceMutation,
      isEditMode,
      editingServiceId,
      handleCloseDialog,
    ]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const handleCategorySuccess = useCallback(() => {
    setSnackbar({
      open: true,
      message: "Category created successfully!",
      severity: "success",
    });
    setOpenCategoryDialog(false);
    refetchCategories();
  }, [refetchCategories]);

  const handleEditService = useCallback(
    (service) => {
      if (!isAdmin) {
        setSnackbar({
          open: true,
          message: "Only admin users can edit services",
          severity: "error",
        });
        return;
      }

      setIsEditMode(true);
      setEditingServiceId(service.id);

      // Format the service data to match form structure
      const formattedDescriptions = service.descriptions?.map(
        (desc, index) => ({
          id: desc.id || index + 1,
          mainTitle: desc.mainTitle || "",
          summary: desc.summary || "",
          points: desc.points?.map((point, pointIndex) => ({
            id: point.id || pointIndex + 1,
            value: point.content || point.value || point || "",
          })) || [{ id: 1, value: "" }],
        })
      ) || [
        { id: 1, mainTitle: "", summary: "", points: [{ id: 1, value: "" }] },
      ];

      // FIX: Handle methods properly - they should be strings, not objects
      const formattedMethods = service.methods?.map((method, index) => ({
        id: method.id || index + 1,
        value: typeof method === 'string' ? method : (method.name || method.value || ""),
      })) || [{ id: 1, value: "" }];

      setServiceForm({
        title: service.title || "",
        categoryId: service.categoryId || "",
        descriptions: formattedDescriptions,
        methods: formattedMethods,
        image: null,
      });

      setOpenDialog(true);
    },
    [isAdmin]
  );

  // Memoize animation variants to prevent re-creation
  const animationVariants = useMemo(() => ({
    containerVariants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.8, staggerChildren: 0.1 },
      },
    },
    cardVariants: {
      hidden: { opacity: 0, y: 60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      },
    },
    heroVariants: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
    },
  }), []);

  const { containerVariants, cardVariants, heroVariants } = animationVariants;

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, mt: 10 }}>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          Error loading services: {error.message}
        </Alert>
        <Button
          onClick={() => refetch()}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 3 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
      <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Hero Section */}
      <HeroSection>
        <HeroImage src={servicesBanner} alt="Construction Services" />
        <HeroContent>
          <motion.div variants={heroVariants} initial="hidden" animate="visible">
            <Typography
              variant="h1"
              fontWeight={800}
              sx={{
                mb: 2,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                lineHeight: 1.1,
                textShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                maxWidth: "600px",
                margin: "0 auto 2rem",
              }}
            >
              Professional construction services built with quality and innovation
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<PlayArrowIcon />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => {
                servicesRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Services
            </Button>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h2"
              fontWeight={700}
              sx={{
                mb: 2,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              What We Offer
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "600px", margin: "0 auto", fontWeight: 400 }}
            >
              Discover our comprehensive range of construction services designed to
              bring your vision to life
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
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                }}
              >
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.25rem" },
                      background:
                        "linear-gradient(135deg, #1E293B 0%, #475569 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 0.5,
                    }}
                  >
                    Services
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 400,
                      fontSize: "1rem",
                    }}
                  >
                    {Array.isArray(services) ? services.length : 0} services
                    available
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {/* View Toggle */}
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Tooltip title="Grid View">
                      <IconButton
                        onClick={() => setViewMode("grid")}
                        size="small"
                        sx={{
                          color:
                            viewMode === "grid" ? "#2196F3" : "text.secondary",
                          background:
                            viewMode === "grid"
                              ? "rgba(33, 150, 243, 0.1)"
                              : "transparent",
                        }}
                      >
                        <ViewModule />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="List View">
                      <IconButton
                        onClick={() => setViewMode("list")}
                        size="small"
                        sx={{
                          color:
                            viewMode === "list" ? "#2196F3" : "text.secondary",
                          background:
                            viewMode === "list"
                              ? "rgba(33, 150, 243, 0.1)"
                              : "transparent",
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
                        flexDirection: { xs: "column", sm: "row" },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <AddCategoryButton
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCategoryDialog(true)}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          justifyContent: { xs: "center", sm: "flex-start" },
                        }}
                      >
                        Add Category
                      </AddCategoryButton>

                      <AddServiceButton
                        startIcon={<AddIcon />}
                        onClick={handleOpenDialog}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          justifyContent: { xs: "center", sm: "flex-start" },
                        }}
                      >
                        Add Service
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
              <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
                {[...Array(6)].map((_, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Skeleton
                      variant="rectangular"
                      height={420}
                      sx={{ borderRadius: 3 }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : services.length === 0 ? (
              <Box textAlign="center" py={8}>
                <ConstructionIcon
                  sx={{ fontSize: 80, color: "grey.400", mb: 2 }}
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No services yet
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isAdmin
                    ? "Start by adding your first service!"
                    : "Services will appear here once they are added."}
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                spacing={
                  viewMode === "list" ? (isMobile ? 1 : 2) : isMobile ? 1 : 2
                }
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                {services.map((service, idx) => (
                  <Grid
                    item
                    xs={12}
                    sm={viewMode === "list" ? 12 : 6}
                    md={viewMode === "list" ? 12 : 4}
                    lg={viewMode === "list" ? 12 : 3}
                    key={service.id || idx}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "stretch",
                      padding:
                        viewMode === "list"
                          ? "4px !important"
                          : isMobile
                          ? "4px !important"
                          : "8px !important",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    <motion.div
                      variants={cardVariants}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        minHeight: "420px",
                      }}
                    >
                      <ServiceCard
                        service={service}
                        viewMode={viewMode}
                        isAdmin={isAdmin}
                        onEdit={handleEditService}
                      />
                    </motion.div>
                  </Grid>
                ))}
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
        keepMounted={false}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {isEditMode ? "Edit Service" : "Add New Service"}
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
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#667eea",
                        },
                      },
                    },
                    marginBottom: isMobile ? 2 : 3,
                  }}
                  size={isMobile ? "small" : "medium"}
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
                      borderRadius: "12px",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
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
                        borderRadius: "12px",
                        borderColor: "#667eea",
                        color: "#667eea",
                        "&:hover": {
                          borderColor: "#5a67d8",
                          backgroundColor: "rgba(102, 126, 234, 0.04)",
                        },
                      }}
                      size={isMobile ? "small" : "medium"}
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
                        maxWidth: "100%",
                        maxHeight: "200px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
                  <Accordion
                    key={desc.id || descIndex}
                    sx={{
                      mb: isMobile ? 1 : 2,
                      borderRadius: isMobile ? "8px !important" : "12px !important",
                    }}
                  >
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
                          sx={{ ml: "auto", mr: 1 }}
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
                            onChange={(e) =>
                              handleDescriptionChange(
                                descIndex,
                                "mainTitle",
                                e.target.value
                              )
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                              },
                            }}
                            size={isMobile ? "small" : "medium"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Summary"
                            multiline
                            rows={isMobile ? 2 : 3}
                            value={desc.summary}
                            onChange={(e) =>
                              handleDescriptionChange(
                                descIndex,
                                "summary",
                                e.target.value
                              )
                            }
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                              },
                            }}
                            size={isMobile ? "small" : "medium"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 600 }}
                          >
                            Key Points
                          </Typography>
                          {desc.points.map((point, pointIndex) => (
                            <Box
                              key={point.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <TextField
                                fullWidth
                                size="small"
                                placeholder={`Point ${pointIndex + 1}`}
                                value={point.value || ""}
                                onChange={(e) =>
                                  handlePointChange(
                                    descIndex,
                                    pointIndex,
                                    e.target.value
                                  )
                                }
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                  },
                                }}
                              />
                              {desc.points.length > 1 && (
                                <IconButton
                                  onClick={() => removePoint(descIndex, pointIndex)}
                                  size="small"
                                  sx={{ color: "error.main" }}
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
                            sx={{ mt: 1, borderRadius: "8px" }}
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
                  sx={{ mt: 1, borderRadius: "12px" }}
                  size={isMobile ? "small" : "medium"}
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
                  <Box
                    key={method.id || methodIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label={`Method ${methodIndex + 1}`}
                      value={method.value || ""}
                      onChange={(e) =>
                        handleMethodChange(methodIndex, e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                      }}
                      size={isMobile ? "small" : "medium"}
                    />
                    {serviceForm.methods.length > 1 && (
                      <IconButton
                        onClick={() => removeMethod(methodIndex)}
                        sx={{ color: "error.main" }}
                        size="small"
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
                  sx={{ borderRadius: "12px" }}
                  size={isMobile ? "small" : "medium"}
                >
                  Add Method
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: isMobile ? 2 : 3,
            pt: isMobile ? 1 : 2,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 2,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              borderColor: "#e0e0e0",
              color: "#666",
              "&:hover": {
                borderColor: "#bdbdbd",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              width: isMobile ? "100%" : "auto",
            }}
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              createServiceMutation.isPending || updateServiceMutation.isPending
            }
            sx={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              },
              width: isMobile ? "100%" : "auto",
            }}
            size={isMobile ? "small" : "medium"}
          >
            {createServiceMutation.isPending ||
            updateServiceMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : isEditMode ? (
              "Update Service"
            ) : (
              "Create Service"
            )}
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Category Form Dialog */}
      <CategoryForm
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        onSuccess={handleCategorySuccess}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServicesPage;