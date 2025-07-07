import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCategories } from '../../hooks/useCategories';
import { useEquipmentActions } from '../../hooks/useEquipment';

const AddEquipmentForm = ({ open, onClose }) => {
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: '',
    description: '',
    application: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: categoryOptions } = useCategories();
  const { create, isCreating } = useEquipmentActions();

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create form data for the entire equipment including image
      const formData = new FormData();
      formData.append('name', newEquipment.name);
      formData.append('category', newEquipment.category);
      formData.append('description', newEquipment.description);
      formData.append('application', newEquipment.application);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await create(formData);
      
      onClose();
      setNewEquipment({
        name: '',
        category: '',
        description: '',
        application: '',
        image: ''
      });
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error creating equipment:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Equipment</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Equipment Name"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={newEquipment.category}
                  label="Category"
                  onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                >
                  {categoryOptions?.map((category) => (
                    <MenuItem key={category.value} value={category.label}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Description *</Typography>
              <ReactQuill
                theme="snow"
                value={newEquipment.description}
                onChange={(content) => setNewEquipment({...newEquipment, description: content})}
                modules={quillModules}
                formats={quillFormats}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Application *</Typography>
              <ReactQuill
                theme="snow"
                value={newEquipment.application}
                onChange={(content) => setNewEquipment({...newEquipment, application: content})}
                modules={quillModules}
                formats={quillFormats}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </Button>

              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Image Preview:</Typography>
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      borderRadius: 1,
                      border: '1px solid #ddd'
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isCreating || !newEquipment.name || !newEquipment.category}
        >
          {isCreating ? <CircularProgress size={24} /> : 'Save Equipment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentForm;