import React, { useState } from "react";
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
import { useCreateProject } from "../../hooks/useProjects";

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

const AddProjectModal = ({ open, onClose }) => {
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
      setFormData((prev) => ({
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

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createProjectMutation.mutateAsync(formData);
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      date: "",
      link: "",
      image: null,
    });
    setImagePreview(null);
    onClose();
  };

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
          Add New Project
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
              {imagePreview && (
                <Box mt={2}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />
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
          disabled={createProjectMutation.isPending}
          sx={{
            background: "linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)",
            minWidth: "120px",
          }}
        >
          {createProjectMutation.isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Project"
          )}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AddProjectModal;
