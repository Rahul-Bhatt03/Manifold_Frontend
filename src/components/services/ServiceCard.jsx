// src/components/services/ServiceCard.js
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  Construction as ConstructionIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Add Poppins font import
const poppinsFont = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

// Grid View Card - FIXED HEIGHT AND CONSISTENT LAYOUT
const ServiceCardContainer = styled(Card)(({ theme }) => ({
  height: '600px',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%',
  maxWidth: '300px',
  minWidth: '280px',
  margin: '0 auto',
  fontFamily: poppinsFont,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '350px',
    minWidth: '320px',
    height: '490px',
  },
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

// List View Card - FIXED HEIGHT
const ServiceListContainer = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  // marginBottom: '4px',
  fontFamily: poppinsFont,
  maxHeight: '200px',
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection:'row',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    '& .list-image': {
      transform: 'scale(1.05)',
    },
  },
}));

// FIXED IMAGE DIMENSIONS
const ServiceImage = styled(CardMedia)(({ theme }) => ({
  height: '220px',
  width: '320px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    height: '200px',
  },
}));

const ListServiceImage = styled(CardMedia)({
  width: '200px',
  height: '140px',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
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

// FIXED TITLE - EXACTLY 1 LINE
const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontFamily: poppinsFont,
  fontWeight: 700,
  fontSize: '1.1rem',
  lineHeight: '1.3',
  color: theme.palette.grey[800],
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '1.43rem',
  marginBottom: '8px',
  wordBreak: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    height: '1.3rem',
  },
}));

// FIXED DESCRIPTION - EXACTLY 2 LINES
const ServiceDescription = styled(Typography)(({ theme }) => ({
  fontFamily: poppinsFont,
  fontSize: '0.85rem',
  lineHeight: '1.4',
  color: theme.palette.grey[600],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.38rem',
  marginBottom: '8px',
  wordBreak: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    height: '2.24rem',
  },
}));

// Category Title
const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontFamily: poppinsFont,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  background: 'rgba(33, 150, 243, 0.1)',
  padding: '4px 8px',
  borderRadius: '8px',
  display: 'inline-block',
  marginBottom: '8px',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

// Info Row
const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  fontSize: '0.75rem',
  color: theme.palette.grey[600],
  '& svg': {
    fontSize: '14px',
    marginRight: '6px',
    color: theme.palette.grey[500],
  },
}));

// Method Tags Container with fixed height
const MethodTagsContainer = styled(Box)({
  minHeight: '40px',
  maxHeight: '40px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  overflow: 'hidden',
  marginBottom: '8px',
});

const MethodChip = styled(Chip)(({ theme }) => ({
  fontFamily: poppinsFont,
  fontSize: '0.65rem',
  height: '18px',
  background: 'rgba(33, 150, 243, 0.1)',
  color: theme.palette.primary.main,
  '& .MuiChip-label': {
    padding: '0 4px',
  },
}));

const ServiceCard = ({ 
  service, 
  viewMode = 'grid', 
  isAdmin = false, 
  onEdit, 
  onDelete,
  onRefresh 
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCardClick = (e) => {
    if (e.target.closest('.action-button')) {
      return;
    }
    navigate(`/services/${service.id}`);
  };

  const handleDeleteService = async () => {
    try {
      // Add your delete mutation logic here
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Service deleted successfully!',
        severity: 'success'
      });
      onRefresh?.();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete service',
        severity: 'error'
      });
    }
  };

  // Extract display data from service
  const imageUrl = service.images?.[0]?.url || service.image || "https://images.unsplash.com/photo-1521791136501-1e5f128acba2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
  const mainDescription = service.descriptions?.[0]?.summary || service.description || 'No description available for this service.';
  const methodTags = service.methods?.map(method => method.name) || [];
  const categoryName = service.category?.name || service.category || 'General Service';

  // Grid View Component
  if (viewMode === 'grid') {
    return (
      <>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Tooltip title={service.title} arrow>
            <ServiceCardContainer onClick={handleCardClick}>
              {/* Image Section */}
              <ServiceImage
                className="service-image"
                image={imageUrl}
                title={service.title}
              >
                {!imageUrl && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                    }}
                  >
                    <ConstructionIcon sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                )}
                
                <ServiceOverlay className="service-overlay">
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, fontFamily: poppinsFont }}>
                      View Service
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 28 }} />
                  </Box>
                </ServiceOverlay>
              </ServiceImage>
              
              {/* Content Section */}
              <CardContent sx={{ 
                p: 2.5, 
                flex: 1,
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: 'calc(100% - 220px)',
              }}>
                <Box sx={{ flex: 1 }}>
                  {/* Actions Row */}
                  <Box 
                    display="flex" 
                    justifyContent="flex-end" 
                    alignItems="center" 
                    mb={1}
                  >
                    {isAdmin && (
                      <Box className="action-button" sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Service">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(service);
                            }}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Service">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialogOpen(true);
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Category Title */}
                  <CategoryTitle variant="caption">
                    {categoryName}
                  </CategoryTitle>
                  
                  {/* Title */}
                  <ServiceTitle variant="h6">
                    {service.title}
                  </ServiceTitle>

                  {/* Description */}
                  <ServiceDescription variant="body2">
                    {mainDescription}
                  </ServiceDescription>

                  {/* Method Tags */}
                  <MethodTagsContainer>
                    {methodTags.slice(0, 4).map((tag, i) => (
                      <MethodChip
                        key={i}
                        label={tag}
                        size="small"
                      />
                    ))}
                    {methodTags.length > 4 && (
                      <MethodChip
                        label={`+${methodTags.length - 4} more`}
                        size="small"
                      />
                    )}
                  </MethodTagsContainer>

                  {/* Service Info */}
                  <Box sx={{ mb: 2 }}>
                    <InfoRow>
                      <CategoryIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        Category: {categoryName}
                      </Typography>
                    </InfoRow>
                    <InfoRow>
                      <BuildIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        Methods: {methodTags.length || 0} available
                      </Typography>
                    </InfoRow>
                    <InfoRow>
                      <DescriptionIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        Full description available
                      </Typography>
                    </InfoRow>
                  </Box>
                </Box>
                
                {/* View Details Button */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mt: 'auto',
                  justifyContent: 'center',
                }}>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/services/${service.id}`);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: poppinsFont,
                      fontSize: '0.8rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </ServiceCardContainer>
          </Tooltip>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{service.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteService}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </>
    );
  }

  // List View Component
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ width: '100%' }}
    >
      <ServiceListContainer onClick={handleCardClick}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          p: 2.5,
          gap: 2.5,
          minHeight: '200px',
        }}>
          {/* Image Section */}
          <ListServiceImage
            className="list-image"
            image={imageUrl}
            title={service.title}
          />

          {/* Content Section */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <CategoryTitle variant="caption">
                  {categoryName}
                </CategoryTitle>
                {isAdmin && (
                  <Box className="action-button" sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit?.(service); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDeleteDialogOpen(true); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              
              <Typography variant="h6" sx={{ fontFamily: poppinsFont, fontWeight: 700, mb: 1 }}>
                {service.title}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {mainDescription}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                {methodTags.slice(0, 3).map((tag, i) => (
                  <MethodChip
                    key={i}
                    label={tag}
                    size="small"
                  />
                ))}
                {methodTags.length > 3 && (
                  <MethodChip
                    label={`+${methodTags.length - 3} more`}
                    size="small"
                  />
                )}
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/services/${service.id}`);
              }}
              sx={{
                background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: poppinsFont,
                fontSize: '0.8rem',
                alignSelf: 'flex-start',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)',
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </ServiceListContainer>
    </motion.div>
  );
};

export default ServiceCard;