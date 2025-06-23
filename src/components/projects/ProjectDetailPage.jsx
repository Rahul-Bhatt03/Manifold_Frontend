import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Avatar,
  Divider,
  Container,
  Chip,
  CircularProgress,
  styled,
  useTheme,
  alpha,
  Fab,
  Tooltip,
  Card,
  CardContent,
  Alert,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Launch as LaunchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Share as ShareIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useGetProjectById, useDeleteProject } from '../../hooks/useProjects';
import { toast } from 'react-hot-toast';
import AddProjectModal from './AddProjectModal';

// Enhanced Styled Components
const GlassContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
}));

const FloatingNavBar = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: '50px',
  padding: '8px 24px',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
}));

const StyledArticlePaper = styled(Paper)(({ theme }) => ({
  borderRadius: '32px',
  overflow: 'hidden',
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '50%',
  width: 48,
  height: 48,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.1)',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    '& .MuiSvgIcon-root': {
      color: 'white',
    }
  }
}));

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const theme = useTheme();
  
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = userData.role === 'admin';
  const { data: project, isLoading, isError, error } = useGetProjectById(id);
  const deleteProjectMutation = useDeleteProject();

  const handleBack = () => navigate('/projects');
  
  const handleEdit = () => setShowEditModal(true);
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProjectMutation.mutateAsync(id);
        toast.success('Project deleted successfully');
        navigate('/projects');
      } catch (error) {
        toast.error('Failed to delete project');
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = project?.title || 'Check out this project';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '50%',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress size={48} thickness={4} sx={{ color: 'white' }} />
          </Box>
        </motion.div>
      </Box>
    );
  }

  if (isError || !project) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassContainer sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
            </motion.div>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Project Not Found
            </Typography>
            <Typography color="textSecondary" paragraph>
              The project you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              variant="contained"
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                borderRadius: '12px',
                px: 3,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
                }
              }}
            >
              Back to Projects
            </Button>
          </GlassContainer>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Floating Navigation */}
      <FloatingNavBar
        style={{ opacity: headerOpacity }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={handleBack}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ maxWidth: 300 }}>
            {project.title}
          </Typography>
        </Box>
      </FloatingNavBar>

      {/* Hero Section */}
      <Box
        sx={{
          width: '100vw',
          height: '60vh',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          overflow: 'hidden',
        }}
      >
        <motion.div style={{ scale: heroScale }}>
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LocationIcon sx={{ fontSize: 120, color: 'white', opacity: 0.5 }} />
            </Box>
          )}
        </motion.div>
        
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)',
          }}
        />

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Button
                variant="outlined"
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Back to Projects
              </Button>
            </Box>
            
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                color: 'white',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.2
              }}
            >
              {project.title}
            </Typography>

            {/* Project Meta Info */}
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Box display="flex" gap={2} flexWrap="wrap">
                {project.location && (
                  <Chip
                    icon={<LocationIcon />}
                    label={project.location}
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}

                {project.date && (
                  <Chip
                    icon={<CalendarIcon />}
                    label={formatDate(project.date)}
                    sx={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                )}
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 10, mt: -12 }}>
        <StyledArticlePaper elevation={0}>
          {/* Action Bar */}
          <Box sx={{ p: 4, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {isAdmin && (
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleEdit}
                    startIcon={<EditIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1976D2 0%, #0288D1 100%)',
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDelete}
                    startIcon={<DeleteIcon />}
                    disabled={deleteProjectMutation.isPending}
                    sx={{
                      background: 'linear-gradient(135deg, #f44336 0%, #ff5722 100%)',
                      borderRadius: '12px',
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)',
                      }
                    }}
                  >
                    {deleteProjectMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </Box>
              )}

              <Box position="relative">
                <Tooltip title="Share">
                  <SocialButton onClick={() => setShowShareMenu(!showShareMenu)}>
                    <ShareIcon />
                  </SocialButton>
                </Tooltip>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 8,
                        zIndex: 1000
                      }}
                    >
                      <Card sx={{ p: 2, minWidth: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Share this project
                        </Typography>
                        <Box display="flex" gap={1}>
                          <SocialButton size="small" onClick={() => handleShare('twitter')}>
                            <TwitterIcon fontSize="small" />
                          </SocialButton>
                          <SocialButton size="small" onClick={() => handleShare('facebook')}>
                            <FacebookIcon fontSize="small" />
                          </SocialButton>
                          <SocialButton size="small" onClick={() => handleShare('linkedin')}>
                            <LinkedInIcon fontSize="small" />
                          </SocialButton>
                        </Box>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </Box>

          {/* Project Content */}
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                }}
              >
                {project.description}
              </Typography>

              {project.link && (
                <Box display="flex" justifyContent="flex-start" mt={4}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<LaunchIcon />}
                    onClick={() => window.open(project.link, '_blank')}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    View Project
                  </Button>
                </Box>
              )}
            </motion.div>
          </Box>
        </StyledArticlePaper>
      </Container>

      {/* Edit Project Modal */}
      <AddProjectModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        projectData={project}
        isEdit={true}
      />

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000
            }}
          >
            <Fab 
              color="primary" 
              onClick={scrollToTop}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <ArrowUpIcon />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default ProjectDetailPage;