// src/pages/ProjectsPage/index.js
import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material';
import { Add as AddIcon, Construction as ConstructionIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useGetAllProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/projects/ProjectCard';
import AddProjectModal from '../../components/projects/AddProjectModal';
import constructionBanner from '../../assets/Buildiing-Material.jpeg';

const StyledContainer = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)',
      paddingBottom: 4,
      width: '100%',
      maxWidth: '100%',
      margin: 0,
    }}
  >
    {children}
  </Box>
);

const HeaderSection = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      borderRadius: '20px',
      p: 4,
      color: 'white',
      mb: 4,
      boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)',
    }}
  >
    {children}
  </Box>
);

const AddButton = ({ children, ...props }) => (
  <Button
    {...props}
    sx={{
      background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
      borderRadius: '12px',
      padding: '12px 24px',
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
    {children}
  </Button>
);

const ProjectsPage = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  }, []);
  const isAdmin = userData.role === 'admin';
  const { data: projects = [], isLoading, isError, error, refetch } = useGetAllProjects();

  const handleAddProject = () => setAddModalOpen(true);
  const handleCloseModal = () => setAddModalOpen(false);

  if (isError) {
    return (
      <StyledContainer>
        <Container maxWidth="lg">
          <Alert 
            severity="error" 
            sx={{ mt: 4, borderRadius: '12px' }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                Retry
              </Button>
            }
          >
            {error?.message || 'Failed to load projects. Please try again.'}
          </Alert>
        </Container>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* Hero Banner - full width */}
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
          mb: 4,
        }}
      >
        <img
          src={constructionBanner}
          alt="Construction Site"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Typography variant="h2" component="h1" color="white" fontWeight="bold">
            Building the Future
          </Typography>
          <Typography variant="h5" color="rgba(255,255,255,0.9)">
            Quality construction projects that stand the test of time
          </Typography>
        </Box>
      </Box>

      {/* Projects Content */}
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeaderSection>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <ConstructionIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    Our Projects
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Showcasing excellence in construction and development
                  </Typography>
                </Box>
              </Box>
              
              {isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AddButton
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddProject}
                    size="large"
                  >
                    Add New Project
                  </AddButton>
                </motion.div>
              )}
            </Box>
          </HeaderSection>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <CircularProgress size={60} sx={{ color: '#FF6B35' }} />
              </motion.div>
            </Box>
          ) : (
            <Fade in={!isLoading}>
              <Box>
                {projects.length === 0 ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="400px"
                    textAlign="center"
                  >
                    <ConstructionIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                      No projects yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {isAdmin 
                        ? 'Start by adding your first project!' 
                        : 'Projects will appear here once they are added.'
                      }
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {projects.map((project, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={project._id}>
                        <ProjectCard project={project} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Fade>
          )}

          <AddProjectModal 
            open={addModalOpen} 
            onClose={handleCloseModal}
          />
        </motion.div>
      </Container>
    </StyledContainer>
  );
};

export default ProjectsPage;