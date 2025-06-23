import React, { useState, useEffect } from 'react';
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
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useCreateBlog, useUpdateBlog, useUserData } from '../../hooks/useBlogs';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  '& *': {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif !important',
  }
});

const ModalPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '1000px',
  width: '95%',
  maxHeight: '90vh',
  overflowY: 'auto',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '16px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(to right, #1976d2, #9c27b0)',
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const ImageUploadArea = styled(Box)(({ theme }) => ({
  border: '2px dashed',
  borderColor: theme.palette.primary.main,
  borderRadius: '12px',
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  minHeight: '180px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    transform: 'translateY(-2px)',
  }
}));

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  '& .MuiTextField-root': {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      fontSize: '1rem',
    }
  }
}));

const StyledTextarea = styled(TextareaAutosize)(({ theme, error }) => ({
  width: '100%',
  padding: '16px 20px',
  borderColor: error ? '#d32f2f' : '#c4c4c4',
  borderRadius: '12px',
  borderWidth: '1px',
  borderStyle: 'solid',
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem',
  lineHeight: '1.5',
  resize: 'vertical',
  minHeight: '120px',
  transition: 'border-color 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
  '&::placeholder': {
    color: '#999',
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  }
}));

const AddBlogModal = ({ open, onClose, editBlog = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [keepExistingImage, setKeepExistingImage] = useState(true);

  const userData = useUserData();
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();

  // Reset form when modal opens/closes or mode changes
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      image: null
    });
    setImagePreview(null);
    setErrors({});
    setKeepExistingImage(true);
  };

  // Populate form with existing data when editing
  useEffect(() => {
    console.log('Modal effect triggered:', { open, isEditMode, editBlog }); // DEBUG
    
    if (open) {
      if (isEditMode && editBlog) {
        console.log('Populating form with edit data:', editBlog); // DEBUG
        
        // Ensure we have valid data from editBlog
        const blogData = {
          title: editBlog.title || '',
          content: editBlog.content || '',
          author: editBlog.author || '',
          image: null // Will be handled separately for existing images
        };
        
        console.log('Setting form data:', blogData); // DEBUG
        setFormData(blogData);
        
        // Set image preview if blog has an existing image
        if (editBlog.image) {
          setImagePreview(editBlog.image);
          setKeepExistingImage(true);
        } else {
          setImagePreview(null);
          setKeepExistingImage(false);
        }
      } else {
        // Reset form for add mode
        console.log('Resetting form for add mode'); // DEBUG
        resetForm();
      }
      setErrors({});
    }
  }, [isEditMode, editBlog, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value); // DEBUG
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
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
      console.log('Image selected:', file); // DEBUG
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setKeepExistingImage(false);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    console.log('Removing image'); // DEBUG
    
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    setKeepExistingImage(false);
    
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData); // DEBUG
    
    const newErrors = {};
    
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content || !formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.author || !formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    console.log('Validation errors:', newErrors); // DEBUG
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('=== SUBMIT STARTED ==='); // DEBUG
    console.log('isEditMode:', isEditMode); // DEBUG
    console.log('editBlog:', editBlog); // DEBUG
    console.log('formData:', formData); // DEBUG
    
    if (!validateForm()) {
      console.log('Form validation failed'); // DEBUG
      return;
    }

    try {
      if (isEditMode && editBlog) {
        console.log('=== UPDATE MODE ==='); // DEBUG
        
        // Ensure we have a valid ID
        const blogId = editBlog.id || editBlog._id;
        if (!blogId) {
          console.error('No valid ID found in editBlog:', editBlog);
          throw new Error('Blog ID is required for update');
        }
        
        // Create the blogData object (separate from id)
        const blogData = {
          title: formData.title?.trim() || '',
          content: formData.content?.trim() || '',
          author: formData.author?.trim() || '',
        };
        
        // Handle image logic for updates
        if (formData.image) {
          // New image selected
          blogData.image = formData.image;
          console.log('Using new image'); // DEBUG
        } else if (keepExistingImage && editBlog.image) {
          // Keep existing image
          blogData.image = editBlog.image;
          console.log('Keeping existing image'); // DEBUG
        } else {
          // Remove image
          blogData.image = null;
          console.log('Removing image'); // DEBUG
        }
        
        // Structure the data correctly for the API - THIS IS THE KEY FIX
        const updatePayload = {
          id: blogId,
          blogData: blogData  // API expects { id, blogData }
        };
        
        console.log('Final update payload being sent:', updatePayload); // DEBUG
        console.log('updateBlogMutation object:', updateBlogMutation); // DEBUG
        
        // Validate blogData before sending
        if (!blogData.title || !blogData.content || !blogData.author) {
          throw new Error('Missing required fields in blog data');
        }
        
        const result = await updateBlogMutation.mutateAsync(updatePayload);
        console.log('Update result:', result); // DEBUG
        
      } else {
        console.log('=== CREATE MODE ==='); // DEBUG
        
        // Create new blog
        const createData = {
          title: formData.title?.trim() || '',
          content: formData.content?.trim() || '',
          author: formData.author?.trim() || '',
          image: formData.image || null
        };
        
        console.log('Creating blog with data:', createData); // DEBUG
        
        if (!createData.title || !createData.content || !createData.author) {
          throw new Error('Missing required fields in create data');
        }
        
        const result = await createBlogMutation.mutateAsync(createData);
        console.log('Create result:', result); // DEBUG
      }
      
      console.log('Operation successful, closing modal'); // DEBUG
      resetForm();
      onClose();
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} blog:`, error);
      console.error('Error details:', error.message, error.stack);
      
      // Optional: Show user-friendly error message
      setErrors({
        general: `Failed to ${isEditMode ? 'update' : 'create'} blog. Please try again.`
      });
    }
  };

  const handleClose = () => {
    console.log('Modal closing'); // DEBUG
    resetForm();
    onClose();
  };

  const isLoading = createBlogMutation.isPending || updateBlogMutation.isPending;
  const hasError = createBlogMutation.isError || updateBlogMutation.isError;

  // Debug render
  console.log('Rendering modal with:', { 
    open, 
    isEditMode, 
    editBlog: editBlog ? { ...editBlog } : null, 
    formData, 
    isLoading 
  });

  return (
    <StyledModal open={open} onClose={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <ModalPaper>
          <ModalHeader>
            <Typography variant="h4" component="h2" fontWeight="bold">
              {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
            </Typography>
            <IconButton onClick={handleClose} color="inherit" size="large">
              <CloseIcon />
            </IconButton>
          </ModalHeader>

          <FormContainer>
            {(hasError || errors.general) && (
              <Box 
                bgcolor="error.light" 
                border={1} 
                borderColor="error.main" 
                color="error.dark" 
                p={3}
                mb={4}
                borderRadius={2}
              >
                <Typography fontSize="1rem">
                  {errors.general || `Error ${isEditMode ? 'updating' : 'creating'} blog post. Please try again.`}
                </Typography>
              </Box>
            )}

            <Box display="flex" flexDirection="column" gap={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5} color="text.primary">
                  Blog Title
                </Typography>
                <TextField
                  fullWidth
                  label="Enter your blog title here..."
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                  variant="outlined"
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      padding: '4px',
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5} color="text.primary">
                  Author Name
                </Typography>
                <TextField
                  fullWidth
                  label="Enter author name here..."
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  error={Boolean(errors.author)}
                  helperText={errors.author}
                  variant="outlined"
                  size="large"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      padding: '4px',
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5} color="text.primary">
                  Blog Content
                </Typography>
                <StyledTextarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  minRows={8}
                  error={Boolean(errors.content)}
                  placeholder="Write your comprehensive blog content here. Share your insights, experiences, and valuable information with your readers..."
                />
                {errors.content && (
                  <Typography color="error" variant="body2" sx={{ mt: 1, ml: 1 }}>
                    {errors.content}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5} color="text.primary">
                  Featured Image
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
                      <Box display="flex" flexDirection="column" gap={3}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ 
                            width: '160px',
                            height: '160px',
                            objectFit: 'cover', 
                            borderRadius: '12px', 
                            margin: '0 auto',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography color="text.secondary" variant="body1" fontWeight={500}>
                            Click to change image
                          </Typography>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveImage();
                            }}
                            sx={{ alignSelf: 'center' }}
                          >
                            Remove Image
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box display="flex" flexDirection="column" gap={3} alignItems="center">
                        <CloudUploadIcon color="primary" style={{ fontSize: '64px' }} />
                        <Box textAlign="center">
                          <Typography variant="h6" fontWeight={600} mb={1}>
                            Click to upload blog image
                          </Typography>
                          <Typography color="text.secondary" variant="body1">
                            Supports JPG, PNG, GIF (Max 5MB)
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </ImageUploadArea>
                </label>
              </Box>
            </Box>
          </FormContainer>

          <Divider sx={{ mx: 0 }} />

          <Box p={4} display="flex" justifyContent="flex-end" gap={3} bgcolor="rgba(255,255,255,0.5)">
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                borderRadius: '12px',
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '120px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                }
              }}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant="contained"
              color="primary"
              size="large"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : (isEditMode ? <EditIcon /> : <AddIcon />)} 
              sx={{
                borderRadius: '12px',
                padding: '12px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '160px',
                background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(to right, #1565c0, #7b1fa2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(to right, #bdbdbd, #9e9e9e)',
                }
              }}
            >
              {isLoading ? (isEditMode ? 'Updating Blog...' : 'Creating Blog...') : (isEditMode ? 'Update Blog Post' : 'Create Blog Post')}
            </Button>
          </Box>
        </ModalPaper>
      </motion.div>
    </StyledModal>
  );
};

export default AddBlogModal;