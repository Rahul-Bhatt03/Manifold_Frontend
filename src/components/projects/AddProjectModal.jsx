import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  styled,
  CircularProgress,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useCreateProject, useUpdateProject } from "../../hooks/useProjects";
import { toast } from 'react-hot-toast';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
    [theme.breakpoints.up('sm')]: {
      minWidth: "500px",
      maxWidth: "600px",
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      width: 'calc(100% - 32px)',
    },
  },
}));

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: "12px",
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
}));

const ImagePreviewContainer = styled(Box)({
  width: "200px",
  height: "150px",
  margin: "16px auto 0",
  borderRadius: "8px",
  overflow: "hidden",
  position: "relative",
  backgroundColor: "#f5f5f5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const PreviewImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
});

const AddProjectModal = ({ open, onClose, projectData = null, isEdit = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    title: "",
    serviceTitle: "",
    description: "",
    location: "",
    projectType: "",
    link: "",
    status: "ONGOING",
    startDate: new Date().toISOString().split('T')[0],
    completedDate: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const categories = [
    "ground water",
    "hydropower",
    "roads/railways/airport",
    "slope stability/landslide",
    "substation/transmission line"
  ];

  // Populate form data when editing
  useEffect(() => {
    if (isEdit && projectData) {
      setFormData({
        title: projectData.title || "",
        serviceTitle: projectData.serviceTitle || "",
        description: projectData.description || "",
        location: projectData.location || "",
        projectType: projectData.projectType || "",
        link: projectData.link || "",
        status: projectData.status || "ONGOING",
        startDate: projectData.startDate ? new Date(projectData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        completedDate: projectData.completedDate ? new Date(projectData.completedDate).toISOString().split('T')[0] : "",
        image: null,
      });

      // Set image preview if existing image URL exists
      if (projectData.image) {
        setImagePreview({
          url: projectData.image,
          name: "Current image",
          size: "N/A",
          isExisting: true
        });
      }
    } else {
      // Reset form for new project
      setFormData({
        title: "",
        serviceTitle: "",
        description: "",
        location: "",
        projectType: "",
        link: "",
        status: "ONGOING",
        startDate: new Date().toISOString().split('T')[0],
        completedDate: "",
        image: null,
      });
      setImagePreview(null);
    }
  }, [isEdit, projectData, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview({
          url: reader.result,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2),
          isExisting: false
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['title', 'serviceTitle', 'description', 'location', 'projectType'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate dates if completed date is provided
    if (formData.completedDate) {
      const startDate = new Date(formData.startDate);
      const completedDate = new Date(formData.completedDate);
      
      if (completedDate <= startDate) {
        toast.error('Completed date must be after start date');
        return;
      }
    }

    try {
      const projectPayload = {
        ...formData,
        startDate: formData.startDate,
        completedDate: formData.completedDate || null,
      };

      if (isEdit && projectData) {
        await updateProjectMutation.mutateAsync({
          id: projectData.id,
          projectData: projectPayload,
          image: formData.image
        });
      } else {
        await createProjectMutation.mutateAsync({
          projectData: projectPayload,
          imageFile: formData.image
        });
      }
      
      toast.success(isEdit ? "Project updated successfully" : "Project created successfully");
      handleClose();
    } catch (error) {
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(isEdit ? "Failed to update project" : "Failed to create project");
      }
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      serviceTitle: "",
      description: "",
      location: "",
      projectType: "",
      link: "",
      status: "ONGOING",
      startDate: new Date().toISOString().split('T')[0],
      completedDate: "",
      image: null,
    });
    setImagePreview(null);
    onClose();
  };

  const isLoading = createProjectMutation.isPending || updateProjectMutation.isPending;

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      component={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 2,
          background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
          color: "white",
          m: 0,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
          {isEdit ? "Edit Project" : "Add New Project"}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            select
            label="Project Category *"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Service Title *"
            name="serviceTitle"
            value={formData.serviceTitle}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={isMobile ? 2 : 3}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Location *"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Project Type *"
            name="projectType"
            value={formData.projectType}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
            <TextField
              fullWidth
              label="Start Date *"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Completed Date"
              name="completedDate"
              type="date"
              value={formData.completedDate}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              disabled={formData.status !== 'COMPLETED'}
            />
          </Box>

          <TextField
            fullWidth
            select
            label="Project Status *"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <MenuItem value="ONGOING">Ongoing</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="PAUSED">Paused</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Project Link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <ImageUploadBox component={motion.div} whileHover={{ scale: 1.02 }}>
              <CloudUploadIcon
                sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
              />
              <Typography variant={isMobile ? "body2" : "body1"} color="textSecondary">
                {imagePreview ? "Change Image" : "Upload Project Image"}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Recommended: 4:3 aspect ratio (e.g., 800x600px) • Max 5MB
              </Typography>
              
              {imagePreview && (
                <ImagePreviewContainer>
                  <PreviewImage
                    src={imagePreview.url}
                    alt="Project preview"
                  />
                </ImagePreviewContainer>
              )}
              
              {imagePreview && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    {imagePreview.isExisting ? "Current image" : `${imagePreview.name} (${imagePreview.size}MB)`}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveImage();
                    }}
                    sx={{ minWidth: "auto", p: 0.5 }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </ImageUploadBox>
          </label>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: isMobile ? 2 : 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size={isMobile ? "medium" : "large"}
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size={isMobile ? "medium" : "large"}
          disabled={isLoading}
          sx={{
            background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
            minWidth: "120px",
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            isEdit ? "Update" : "Add"
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddProjectModal;