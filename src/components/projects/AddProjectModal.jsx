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
    minWidth: "500px",
    maxWidth: "600px",
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    link: "",
    status: "ongoing",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  // Populate form data when editing
  useEffect(() => {
    if (isEdit && projectData) {
      setFormData({
        title: projectData.title || "",
        description: projectData.description || "",
        location: projectData.location || "",
        date: projectData.date ? new Date(projectData.date).toISOString().split('T')[0] : "",
        link: projectData.link || "",
        status: projectData.status || "ongoing",
        image: null, // Don't set the existing image as a file
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
        description: "",
        location: "",
        date: "",
        link: "",
        status: "ongoing",
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

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (isEdit && projectData) {
        // Update existing project
        await updateProjectMutation.mutateAsync({
          id: projectData._id,
          projectData: {
            ...formData,
            // Only include image if a new one was selected
            ...(formData.image && { image: formData.image })
          }
        });
        toast.success("Project updated successfully");
      } else {
        // Create new project
        await createProjectMutation.mutateAsync(formData);
        toast.success("Project created successfully");
      }
      handleClose();
    } catch (error) {
      toast.error(isEdit ? "Failed to update project" : "Failed to create project");
      console.error("Error submitting project:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      date: "",
      link: "",
      status: "ongoing",
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
        <Typography variant="h5" fontWeight="bold">
          {isEdit ? "Edit Project" : "Add New Project"}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Project Title *"
            name="title"
            value={formData.title}
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
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Project Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Project Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <MenuItem value="planned">Planned</MenuItem>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="on-hold">On Hold</MenuItem>
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
              <Typography variant="body1" color="textSecondary">
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

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          size="large"
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{
            background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
            minWidth: "120px",
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            isEdit ? "Update Project" : "Add Project"
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddProjectModal;