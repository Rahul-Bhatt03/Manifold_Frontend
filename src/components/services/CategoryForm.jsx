// components/CategoryForm.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  IconButton,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import { PhotoCamera, Close } from "@mui/icons-material";
import { useCreateCategory } from "../../hooks/useCategories";

const CategoryForm = ({ open, onClose }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const createCategoryMutation = useCreateCategory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({ ...prev, [name]: value }));
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
      setCategoryData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Category name is required",
        severity: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      formData.append('description', categoryData.description);
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }

      await createCategoryMutation.mutateAsync(formData);
      
      setSnackbar({
        open: true,
        message: "Category created successfully!",
        severity: "success",
      });
      handleClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error creating category",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setCategoryData({
      name: "",
      description: "",
      image: null
    });
    setImagePreview(null);
    onClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Category</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Category Name"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={categoryData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              margin="normal"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="category-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="category-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                >
                  Upload Image
                </Button>
              </label>
              {categoryData.image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {categoryData.image.name}
                </Typography>
              )}
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending ? (
              <CircularProgress size={24} />
            ) : (
              'Create Category'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryForm;