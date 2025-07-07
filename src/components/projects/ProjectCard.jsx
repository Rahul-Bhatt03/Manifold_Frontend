// src/components/projects/ProjectCard.js
import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Tooltip,
  Button,
  IconButton,
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
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useDeleteProject, useUpdateProjectStatus } from '../../hooks/useProjects';

// Add Poppins font import
const poppinsFont = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";

// Grid View Card - FIXED HEIGHT AND CONSISTENT LAYOUT
const ProjectCardContainer = styled(Card)(({ theme }) => ({
  height: '520px', // Increased height for additional information
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  width: '100%',
  maxWidth: '400px',
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
    '& .project-image': {
      transform: 'scale(1.1)',
    },
    '& .project-overlay': {
      opacity: 1,
    },
    '& .project-arrow': {
      transform: 'translateX(8px)',
    }
  },
}));

// List View Card - FIXED HEIGHT
const ProjectListContainer = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  marginBottom: '16px',
  fontFamily: poppinsFont,
  minHeight: '200px',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
    '& .list-image': {
      transform: 'scale(1.05)',
    },
  },
}));

// FIXED IMAGE DIMENSIONS
const ProjectImage = styled(CardMedia)(({ theme }) => ({
  height: '220px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    height: '200px',
  },
}));

const ListProjectImage = styled(CardMedia)({
  width: '200px',
  height: '140px',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  flexShrink: 0,
});

const ProjectOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.9) 0%, rgba(247, 147, 30, 0.8) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

// FIXED TITLE - EXACTLY 1 LINE
const ProjectTitle = styled(Typography)(({ theme }) => ({
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
const ProjectDescription = styled(Typography)(({ theme }) => ({
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

// Service Title
const ServiceTitle = styled(Typography)(({ theme }) => ({
  fontFamily: poppinsFont,
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  background: 'rgba(255, 107, 53, 0.1)',
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

const StatusChip = styled(Chip)(({ theme, status }) => {
  let background, color;
  
  switch(status?.toLowerCase()) {
    case 'completed':
      background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      color = 'white';
      break;
    case 'active':
    case 'ongoing':
      background = 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)';
      color = 'white';
      break;
    case 'planned':
      background = 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      color = 'white';
      break;
    case 'paused':
      background = 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)';
      color = 'white';
      break;
    case 'cancelled':
      background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
      color = 'white';
      break;
    default:
      background = 'linear-gradient(135deg, #64748B 0%, #475569 100%)';
      color = 'white';
  }

  return {
    background,
    color,
    fontWeight: 600,
    fontSize: '0.7rem',
    height: '24px',
    fontFamily: poppinsFont,
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

// Quick Status Update Chip
const QuickStatusChip = styled(Chip)(({ theme, status, clickable }) => ({
  fontSize: '0.65rem',
  height: '20px',
  fontFamily: poppinsFont,
  cursor: clickable ? 'pointer' : 'default',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
  ...(clickable && {
    '&:hover': {
      opacity: 0.8,
    },
  }),
}));

const ProjectCard = ({ 
  project, 
  viewMode = 'grid', 
  isAdmin = false, 
  onEdit, 
  onDelete,
  onRefresh 
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Hooks
  const deleteProjectMutation = useDeleteProject();
  const updateStatusMutation = useUpdateProjectStatus();

  const handleCardClick = (e) => {
    if (e.target.closest('.action-button') || e.target.closest('.status-update')) {
      return;
    }
    navigate(`/projects/${project.id}`);
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Project deleted successfully!',
        severity: 'success'
      });
      onRefresh?.();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete project',
        severity: 'error'
      });
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: project.id,
        status: newStatus
      });
      setStatusUpdateOpen(false);
      setSnackbar({
        open: true,
        message: 'Status updated successfully!',
        severity: 'success'
      });
      onRefresh?.();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update status',
        severity: 'error'
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayStatus = (status) => {
    if (status?.toLowerCase() === 'ongoing') {
      return 'active';
    }
    return status?.toLowerCase() || 'unknown';
  };

  const getDisplayStatusLabel = (status) => {
    if (status?.toLowerCase() === 'ongoing') {
      return 'Active';
    }
    return status || 'Unknown';
  };

  const calculateDuration = () => {
    if (!project.startDate) return 'N/A';
    const start = new Date(project.startDate);
    const end = project.completedDate ? new Date(project.completedDate) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      return `${Math.round(diffDays / 30)} months`;
    } else {
      return `${Math.round(diffDays / 365)} years`;
    }
  };

  const projectDescription = project.description || 'No description available for this project.';
  const shouldShowReadMore = projectDescription.length > 100;

  const statusOptions = ['ONGOING', 'COMPLETED', 'PAUSED', 'CANCELLED'];

  // Grid View Component
  if (viewMode === 'grid') {
    return (
      <>
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Tooltip title={project.title} arrow>
            <ProjectCardContainer onClick={handleCardClick}>
              {/* Image Section */}
              <ProjectImage
                className="project-image"
                image={project.image || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                title={project.title}
              >
                {!project.image && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    }}
                  >
                    <ConstructionIcon sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                )}
                
                <ProjectOverlay className="project-overlay">
                  <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1, fontFamily: poppinsFont }}>
                      View Project
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 28 }} />
                  </Box>
                </ProjectOverlay>
              </ProjectImage>
              
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
                  {/* Status and Actions Row */}
                  <Box 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={1.5}
                  >
                    <Box 
                      className="status-update"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAdmin) setStatusUpdateOpen(true);
                      }}
                    >
                      <StatusChip 
                        label={getDisplayStatusLabel(project.status)} 
                        size="small" 
                        status={getDisplayStatus(project.status)}
                        clickable={isAdmin}
                      />
                    </Box>
                    
                    {isAdmin && (
                      <Box className="action-button" sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit Project">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit?.(project);
                            }}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Project">
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
                  
                  {/* Service Title */}
                  <ServiceTitle variant="caption">
                    {project.serviceTitle || 'General Service'}
                  </ServiceTitle>
                  
                  {/* Title */}
                  <ProjectTitle variant="h6">
                    {project.title}
                  </ProjectTitle>

                  {/* Description */}
                  <ProjectDescription variant="body2">
                    {projectDescription}
                  </ProjectDescription>

                  {/* Project Info */}
                  <Box sx={{ mb: 2 }}>
                    <InfoRow>
                      <LocationIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        {project.location || 'Not specified'}
                      </Typography>
                    </InfoRow>
                    <InfoRow>
                      <CategoryIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        {project.projectType || 'General'}
                      </Typography>
                    </InfoRow>
                    <InfoRow>
                      <CalendarIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        Started: {formatDate(project.startDate)}
                      </Typography>
                    </InfoRow>
                    <InfoRow>
                      <ScheduleIcon />
                      <Typography variant="caption" sx={{ fontFamily: poppinsFont }}>
                        Duration: {calculateDuration()}
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
                      navigate(`/projects/${project.id}`);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: poppinsFont,
                      fontSize: '0.8rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </ProjectCardContainer>
          </Tooltip>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteProject}
              color="error"
              disabled={deleteProjectMutation.isLoading}
            >
              {deleteProjectMutation.isLoading ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={statusUpdateOpen} onClose={() => setStatusUpdateOpen(false)}>
          <DialogTitle>Update Project Status</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Change status for "{project.title}":
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {statusOptions.map((status) => (
                <QuickStatusChip
                  key={status}
                  label={status}
                  clickable
                  onClick={() => handleStatusUpdate(status)}
                  disabled={updateStatusMutation.isLoading}
                  color={project.status === status ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusUpdateOpen(false)}>Cancel</Button>
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

  // List View Component (simplified for brevity - similar structure)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ width: '100%' }}
    >
      <ProjectListContainer onClick={handleCardClick}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          p: 2.5,
          gap: 2.5,
          minHeight: '200px',
        }}>
          {/* Image Section */}
          <ListProjectImage
            className="list-image"
            image={project.image || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
            title={project.title}
          />

          {/* Content Section */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <StatusChip 
                  label={getDisplayStatusLabel(project.status)} 
                  size="small" 
                  status={getDisplayStatus(project.status)}
                />
                {isAdmin && (
                  <Box className="action-button" sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit?.(project); }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setDeleteDialogOpen(true); }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
              
              <ServiceTitle variant="caption">
                {project.serviceTitle || 'General Service'}
              </ServiceTitle>
              
              <Typography variant="h6" sx={{ fontFamily: poppinsFont, fontWeight: 700, mb: 1 }}>
                {project.title}
              </Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {projectDescription}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  {project.location}
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  {formatDate(project.startDate)}
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/projects/${project.id}`);
              }}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: poppinsFont,
                fontSize: '0.8rem',
                alignSelf: 'flex-start',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </ProjectListContainer>
    </motion.div>
  );
};

export default ProjectCard;