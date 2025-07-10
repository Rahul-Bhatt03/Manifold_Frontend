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
  Paper,
  Chip,
  IconButton,
  Tooltip,
  createTheme,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Construction as ConstructionIcon,
  ViewModule,
  ViewList,
  FilterList,
  Search,
  TrendingUp,
  Business,
  Timeline,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetAllProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/projects/ProjectCard';
import AddProjectModal from '../../components/projects/AddProjectModal';
import constructionBanner from '../../assets/Buildiing-Material.jpeg';

const theme=createTheme({
   typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    }
  },
   components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
        },
      },
    },
  },
})

const StyledContainer = ({ children, ...props }) => (
  <Box
    {...props}
    sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)',
      paddingBottom: 4,
    }}
  >
    {children}
  </Box>
);

const GlassCard = ({ children, elevation = 1, ...props }) => (
  <Paper
    {...props}
    elevation={0}
    sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.12)',
        background: 'rgba(255, 255, 255, 0.95)',
      },
      ...props.sx,
    }}
  >
    {children}
  </Paper>
);

const StatsCard = ({ icon: Icon, title, value, trend, color = '#FF6B35', isActive = false, onClick }) => (
  <GlassCard 
    sx={{ 
      p: 2.5, 
      height: '100%',
      cursor: 'pointer',
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      background: isActive 
        ? 'rgba(255, 107, 53, 0.1)' 
        : 'rgba(255, 255, 255, 0.9)',
      border: isActive 
        ? '2px solid #FF6B35' 
        : '1px solid rgba(255, 255, 255, 0.3)',
           display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      '&:hover': {
        transform: isActive ? 'scale(1.05)' : 'scale(1.02)',
        background: isActive 
          ? 'rgba(255, 107, 53, 0.15)' 
          : 'rgba(255, 255, 255, 0.95)',
      }
    }}
    onClick={onClick}
  >
    <Box display="flex" alignItems="center" justifyContent="center" mb={1.5}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ fontSize: 20, color }} />
      </Box>
      {trend && (
        <Chip
          icon={<TrendingUp sx={{ fontSize: '14px !important' }} />}
          label={trend}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            fontSize: '0.7rem',
            height: 20,
          }}
        />
      )}
    </Box>
     <Typography variant="body2" color="text.secondary" fontWeight="500" fontSize="0.85rem">
      {title}
    </Typography>
    <Typography variant="h5" fontWeight="700"  color="text.primary" mb={0.5}>
      {value}
    </Typography>
   
  </GlassCard>
);

const ActionButton = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = {
    borderRadius: '12px',
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
      color: 'white',
      boxShadow: '0 3px 15px rgba(255, 107, 53, 0.3)',
      '&:hover': {
        background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
        transform: 'translateY(-1px)',
      },
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#475569',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      backdropFilter: 'blur(10px)',
      '&:hover': {
        background: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-1px)',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.1)',
      },
    },
  };

  return (
    <Button
      {...props}
      sx={{
        ...baseStyles,
        ...variants[variant],
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};

const ProjectsPage = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'completed'
  
  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}');
    } catch {
      return {};
    }
  }, []);
  
  const isAdmin = userData.role === 'admin';
  const { data: projects = [], isLoading, isError, error, refetch } = useGetAllProjects();

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'ongoing').length,
    completed: projects.filter(p => p.status?.toLowerCase() === 'completed').length,
  }), [projects]);

  // Filtered projects based on active filter
  const filteredProjects = useMemo(() => {
    switch (activeFilter) {
      case 'active':
        return projects.filter(p => p.status?.toLowerCase() === 'active' || p.status?.toLowerCase() === 'ongoing');
      case 'completed':
        return projects.filter(p => p.status?.toLowerCase() === 'completed');
      default:
        return projects;
    }
  }, [projects, activeFilter]);

  const handleAddProject = () => setAddModalOpen(true);
  const handleCloseModal = () => setAddModalOpen(false);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Function to determine grid layout based on view mode
  const getGridLayout = () => {
    if (viewMode === 'grid') {
      return {
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)'
      };
    } else {
      // List view - responsive columns
      return {
        xs: 'repeat(1, 1fr)', // 1 column on mobile (perfect for list)
        sm: 'repeat(1, 1fr)',  // 1 column on small tablets
        md: 'repeat(2, 1fr)',  // 2 columns on medium screens
        lg: 'repeat(3, 1fr)',  // 3 columns on large screens
        xl: 'repeat(3, 1fr)'   // 3 columns on extra large screens
      };
    }
  };

  if (isError) {
    return (
      <StyledContainer>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard sx={{ p: 4 }}>
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                  border: '1px solid #FECACA',
                }}
                action={
                  <ActionButton variant="secondary" size="small" onClick={() => refetch()}>
                    Retry
                  </ActionButton>
                }
              >
                <Typography variant="h6" fontWeight="600" mb={1}>
                  Something went wrong
                </Typography>
                <Typography variant="body2">
                  {error?.message || 'Failed to load projects. Please try again.'}
                </Typography>
              </Alert>
            </GlassCard>
          </motion.div>
        </Container>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* Hero Banner - Increased height for mobile */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '60vh', md: '70vh' }, 
          position: 'relative',
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
            objectPosition: 'center',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 4 },
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                Building Excellence
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  maxWidth: '500px',
                  textShadow: '0 1px 5px rgba(0,0,0,0.3)',
                }}
              >
                Quality construction projects that stand the test of time
              </Typography>
            </motion.div>
          </Container>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Stats Section - Centered on mobile with clickable filters */}
          <Box mb={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '100%' } }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={4} sm={4} md={4}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <StatsCard
                      icon={Business}
                      title="Total Projects"
                      value={stats.total}
                      color="#FF6B35"
                      isActive={activeFilter === 'all'}
                      onClick={() => handleFilterChange('all')}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <StatsCard
                      icon={Timeline}
                      title="Active Projects"
                      value={stats.active}
                      color="#10B981"
                      isActive={activeFilter === 'active'}
                      onClick={() => handleFilterChange('active')}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={4} sm={4} md={4}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <StatsCard
                      icon={ConstructionIcon}
                      title="Completed"
                      value={stats.completed}
                      color="#8B5CF6"
                      isActive={activeFilter === 'completed'}
                      onClick={() => handleFilterChange('completed')}
                    />
                  </motion.div>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Header Section */}
          <GlassCard sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    background: 'linear-gradient(135deg, #1E293B 0%, #475569 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5,
                  }}
                >
                  Our Projects
                  {activeFilter !== 'all' && (
                    <Chip
                      label={activeFilter === 'active' ? 'Active' : 'Completed'}
                      size="small"
                      sx={{
                        ml: 2,
                        background: activeFilter === 'active' 
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 400,
                    fontSize: '1rem',
                  }}
                >
                  {activeFilter === 'all' 
                    ? 'Showcasing excellence in construction and development'
                    : activeFilter === 'active'
                    ? 'Currently ongoing construction projects'
                    : 'Successfully completed construction projects'
                  }
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1.5}>
                {/* View Toggle */}
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Tooltip title="Grid View">
                    <IconButton
                      onClick={() => setViewMode('grid')}
                      size="small"
                      sx={{
                        color: viewMode === 'grid' ? '#FF6B35' : 'text.secondary',
                        background: viewMode === 'grid' ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                      }}
                    >
                      <ViewModule fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List View">
                    <IconButton
                      onClick={() => setViewMode('list')}
                      size="small"
                      sx={{
                        color: viewMode === 'list' ? '#FF6B35' : 'text.secondary',
                        background: viewMode === 'list' ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                      }}
                    >
                      <ViewList fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                {isAdmin && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ActionButton
                      variant="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddProject}
                    >
                      Add Project
                    </ActionButton>
                  </motion.div>
                )}
              </Box>
            </Box>
          </GlassCard>

          {/* Projects Content */}
          {isLoading ? (
            <GlassCard sx={{ p: 6 }}>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <CircularProgress size={50} sx={{ color: '#FF6B35' }} />
                </motion.div>
                <Typography variant="h6" color="text.secondary" fontWeight="500">
                  Loading projects...
                </Typography>
              </Box>
            </GlassCard>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`projects-content-${activeFilter}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {filteredProjects.length === 0 ? (
                  <GlassCard sx={{ p: 6 }}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent={{ xs: 'center', md: 'flex-start' }}
                      textAlign="center"
                      gap={3}
                    >
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                        }}
                      >
                        <ConstructionIcon sx={{ fontSize: 50, color: '#94A3B8' }} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="700" color="text.primary" gutterBottom>
                          {activeFilter === 'all' 
                            ? 'No projects yet'
                            : activeFilter === 'active'
                            ? 'No active projects'
                            : 'No completed projects'
                          }
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                          {activeFilter === 'all' 
                            ? (isAdmin 
                                ? 'Ready to showcase your first project? Click the button above to get started!' 
                                : 'Amazing projects will appear here once they are added.'
                              )
                            : activeFilter === 'active'
                            ? 'Currently no active projects in progress.'
                            : 'No projects have been completed yet.'
                          }
                        </Typography>
                      </Box>
                      {isAdmin && activeFilter === 'all' && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ActionButton
                            variant="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddProject}
                            sx={{ mt: 1 }}
                          >
                            Create Your First Project
                          </ActionButton>
                        </motion.div>
                      )}
                    </Box>
                  </GlassCard>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'grid',
                      gridTemplateColumns: getGridLayout(),
                      gap: 3,
                      justifyContent: {
                        xs: 'center',
                        sm: 'flex-start'
                      }
                    }}
                  >
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.05,
                          ease: "easeOut"
                        }}
                      >
                        <ProjectCard project={project} viewMode={viewMode} />
                      </motion.div>
                    ))}
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
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