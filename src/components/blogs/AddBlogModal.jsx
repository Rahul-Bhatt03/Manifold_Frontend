import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Modal,
  Box,
  Typography,
  TextField,
  TextareaAutosize,
  Button,
  IconButton,
  Divider,
  Paper,
  Avatar,
  LinearProgress,
  styled,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useCreateBlog, useUserData } from '../../hooks/useBlogs';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem'
});

const ModalPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '800px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #1976d2, #9c27b0)',
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ImageUploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light
  }
}));

const AddBlogModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const userData = useUserData();
  const createBlogMutation = useCreateBlog();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await createBlogMutation.mutateAsync(formData);
      setFormData({
        title: '',
        content: '',
        author: '',
        image: null
      });
      setImagePreview(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      image: null
    });
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  return (
    <StyledModal open={open} onClose={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <ModalPaper>
          <ModalHeader>
            <Typography variant="h5" component="h2" fontWeight="bold">
              Add New Blog Post
            </Typography>
            <IconButton onClick={handleClose} color="inherit">
              <CloseIcon />
            </IconButton>
          </ModalHeader>

          <Box p={3}>
            {createBlogMutation.isError && (
              <Box bgcolor="error.light" border={1} borderColor="error.main" color="error.dark" p={2} mb={3} borderRadius={1}>
                <Typography>Error creating blog post. Please try again.</Typography>
              </Box>
            )}

            <Box display="flex" flexDirection="column" gap={3}>
              <div>
                <TextField
                  fullWidth
                  label="Blog Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                  variant="outlined"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  label="Author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  error={Boolean(errors.author)}
                  helperText={errors.author}
                  variant="outlined"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Content
                </Typography>
                <TextareaAutosize
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  minRows={6}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderColor: errors.content ? 'red' : '#ccc',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: 'inherit'
                  }}
                  placeholder="Write your blog content here..."
                />
                {errors.content && (
                  <Typography color="error" variant="caption">{errors.content}</Typography>
                )}
              </div>

              <div>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Blog Image
                </Typography>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload">
                  <ImageUploadArea>
                    {imagePreview ? (
                      <Box display="flex" flexDirection="column" gap={2}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '8px', margin: '0 auto' }}
                        />
                        <Typography color="textSecondary">Click to change image</Typography>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                        <CloudUploadIcon color="primary" style={{ fontSize: '48px' }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Click to upload blog image
                        </Typography>
                        <Typography color="textSecondary">Supports JPG, PNG, GIF</Typography>
                      </Box>
                    )}
                  </ImageUploadArea>
                </label>
              </div>
            </Box>
          </Box>

          <Divider />

          <Box p={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              size="large"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={createBlogMutation.isPending}
              variant="contained"
              color="primary"
              size="large"
              startIcon={createBlogMutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1565c0, #7b1fa2)'
                }
              }}
            >
              {createBlogMutation.isPending ? 'Creating...' : 'Create Blog Post'}
            </Button>
          </Box>
        </ModalPaper>
      </motion.div>
    </StyledModal>
  );
};

export default AddBlogModal;