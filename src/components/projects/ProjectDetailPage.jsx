import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Launch as LaunchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectById, useDeleteProject } from '../../hooks/useProjects';
import { toast } from 'react-hot-toast';

const StyledContainer = ({ children, ...props }) => (
  <Container
    {...props}
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
      paddingTop: 4,
      paddingBottom: 4,
    }}
  >
    {children}
  </Container>
);

const ProjectImage = ({ children, ...props }) => (
  <Box
    component="img"
    {...props}
    sx={{
      width: '100%',
      maxHeight: '500px',
      objectFit: 'cover',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    }}
  >
    {children}
  </Box>
);

const DetailCard = ({ children, ...props }) => (
  <Paper
    {...props}
    sx={{
      p: 4,
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    }}
  >
    {children}
  </Paper>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  }, []);
  const isAdmin = userData.role === 'admin';
  const { data: project, isLoading, isError, error } = useGetProjectById(id);
  const deleteProjectMutation = useDeleteProject();

  const handleBack = () => navigate('/projects');
  const handleEdit = () => navigate(`/projects/${id}/edit`);
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProjectMutation.mutateAsync(id);
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isError) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4, borderRadius: '12px' }}>
          {error?.message || 'Failed to load project details'}
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
              color: 'white',
              borderRadius: '12px',
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #E55A2B 30%, #E0841A 90%)',
              },
            }}
          >
            Back to Projects
          </Button>

          {isAdmin && (
            <Box display="flex" gap={1}>
              <IconButton
                onClick={handleEdit}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                  },
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                disabled={deleteProjectMutation.isPending}
                sx={{
                  background: 'linear-gradient(45deg, #f44336 30%, #ff5722 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #d32f2f 30%, #f57c00 90%)',
                  },
                }}
              >
                {deleteProjectMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            </Box>
          )}
        </Box>

        {isLoading ? (
          <Box>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px', mb: 3 }} />
            <DetailCard>
              <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
              <Skeleton variant="text" height={100} sx={{ mb: 2 }} />
              <Box display="flex" gap={2} mb={2}>
                <Skeleton variant="rectangular" width={150} height={30} sx={{ borderRadius: '15px' }} />
                <Skeleton variant="rectangular" width={150} height={30} sx={{ borderRadius: '15px' }} />
              </Box>
            </DetailCard>
          </Box>
        ) : project ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {project.image && (
              <Box mb={4}>
                <ProjectImage
                  src={project.image}
                  alt={project.title}
                  component={motion.img}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </Box>
            )}

            <DetailCard>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                  background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3,
                }}
              >
                {project.title}
              </Typography>

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

              <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
                {project.location && (
                  <Chip
                    icon={<LocationIcon />}
                    label={project.location}
                    sx={{
                      background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}

                {project.date && (
                  <Chip
                    icon={<CalendarIcon />}
                    label={formatDate(project.date)}
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: 'white',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                )}
              </Box>

              {project.link && (
                <Box display="flex" justifyContent="flex-start">
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<LaunchIcon />}
                    onClick={() => window.open(project.link, '_blank')}
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
                      borderRadius: '12px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #E55A2B 30%, #E0841A 90%)',
                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    View Project
                  </Button>
                </Box>
              )}
            </DetailCard>
          </motion.div>
        ) : (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>
            Project not found
          </Alert>
        )}
      </motion.div>
    </StyledContainer>
  );
};

export default ProjectDetailPage;