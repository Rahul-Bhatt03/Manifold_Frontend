import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Alert, 
  Fade,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  Button
} from '@mui/material';
import {
  Search,
  FilterList,
  CalendarToday,
  LocationOn,
  Engineering,
  Visibility,
  ArrowForward,
  Water,
  PowerSettingsNew,
  DirectionsRailway,
  Landscape,
  ElectricalServices,
  Business,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Home,
  Clear,
  Sort
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllProjects } from '../../hooks/useProjects';
import ProjectCard from './ProjectCard'; // Import the ProjectCard component

const DDLProjectPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch all projects using the simple /projects API
  const { data: projects = [], isLoading, error, refetch } = useGetAllProjects();

  // Category mapping for filtering and display - based on title field
  const categoryMapping = {
    'hydropower': 'hydropower',
    'ground-water': 'ground water',
    'roads-railways-airport': 'roads/railways/airport',
    'slope-stability-landslide': 'slope stability/landslide',
    'substation-transmission-line': 'substation/transmission line',
    'test2': 'test2',
    'teset': 'teset'
  };

  const categoryIcons = {
    'hydropower': <PowerSettingsNew />,
    'ground water': <Water />,
    'roads/railways/airport': <DirectionsRailway />,
    'slope stability/landslide': <Landscape />,
    'substation/transmission line': <ElectricalServices />,
    'test2': <Engineering />,
    'teset': <Engineering />
  };

  const statusIcons = {
    'ONGOING': <Schedule color="warning" />,
    'COMPLETED': <CheckCircle color="success" />,
    'CANCELLED': <Cancel color="error" />,
    'PENDING': <Pending color="info" />
  };

  const statusColors = {
    'ONGOING': 'warning',
    'COMPLETED': 'success',
    'CANCELLED': 'error',
    'PENDING': 'info'
  };

  // Get current category display name
  const currentCategoryName = category ? categoryMapping[category] : 'All Projects';

  // Filter projects based on title and search - CLIENT SIDE FILTERING
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category if specified - using title field (CLIENT SIDE)
    if (category && categoryMapping[category]) {
      const categoryTitle = categoryMapping[category];
      filtered = filtered.filter(project => 
        project.title && 
        project.title.toLowerCase() === categoryTitle.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.projectType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Sort projects
    switch (sortBy) {
      case 'date':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'title':
        filtered.sort((a, b) => a.title?.localeCompare(b.title) || 0);
        break;
      case 'status':
        filtered.sort((a, b) => a.status?.localeCompare(b.status) || 0);
        break;
      case 'startDate':
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
      default:
        break;
    }

    return filtered;
  }, [projects, category, searchQuery, selectedStatus, sortBy]);

  // Get unique categories from projects for tabs - based on title field
  const availableCategories = useMemo(() => {
    const categories = new Set();
    projects.forEach(project => {
      if (project.title) {
        const title = project.title.toLowerCase();
        // Check if this title exists in our category mapping
        Object.entries(categoryMapping).forEach(([key, value]) => {
          if (title === value.toLowerCase()) {
            categories.add(key);
          }
        });
      }
    });
    return Array.from(categories);
  }, [projects]);

  const handleCategoryChange = (newCategory) => {
    if (newCategory === 'all') {
      navigate('/projects');
    } else {
      navigate(`/projects/category/${newCategory}`);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('all');
    setSortBy('date');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* <Breadcrumbs
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                mb: 3,
                '& .MuiBreadcrumbs-separator': {
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              <Link 
                color="inherit" 
                href="#" 
                onClick={() => navigate('/')}
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                <Home sx={{ mr: 0.5, fontSize: 16 }} />
                Home
              </Link>
              <Typography color="white">Projects</Typography>
              {category && (
                <Typography color="white" sx={{ textTransform: 'capitalize' }}>
                  {currentCategoryName}
                </Typography>
              )}
            </Breadcrumbs>
             */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 ,mt:6}}>
              {category && categoryIcons[categoryMapping[category]] && (
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(255, 68, 68, 0.2)',
                  color: '#ff4444'
                }}>
                  {categoryIcons[categoryMapping[category]]}
                </Box>
              )}
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {currentCategoryName}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                  {category 
                    ? `Explore our ${categoryMapping[category]} projects` 
                    : 'Discover our comprehensive project portfolio'
                  }
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600 }}>
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Filter and Search Section */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            mb: 4
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                        sx={{ color: '#666' }}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="ONGOING">Ongoing</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="date">Date Created</MenuItem>
                  <MenuItem value="startDate">Start Date</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={clearFilters}
                sx={{
                  borderColor: '#ff4444',
                  color: '#ff4444',
                  '&:hover': {
                    borderColor: '#cc0000',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)'
                  }
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Category Tabs */}
        {availableCategories.length > 0 && (
          <Paper elevation={1} sx={{ mb: 4, borderRadius: 2 }}>
            <Tabs
              value={category ? availableCategories.indexOf(category) + 1 : 0}
              onChange={(e, newValue) => {
                if (newValue === 0) {
                  handleCategoryChange('all');
                } else {
                  handleCategoryChange(availableCategories[newValue - 1]);
                }
              }}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 60
                },
                '& .Mui-selected': {
                  color: '#ff4444'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#ff4444'
                }
              }}
            >
              <Tab label="All Projects" />
              {availableCategories.map((cat) => (
                <Tab 
                  key={cat} 
                  label={categoryMapping[cat]} 
                  icon={categoryIcons[categoryMapping[cat]]}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Paper>
        )}

        {/* Projects Grid */}
        <Box sx={{ pb: 6 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Retry
                </Button>
              }
            >
              Failed to load projects. Please try again.
            </Alert>
          )}

          {isLoading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ 
                    height: 520, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography>Loading...</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : filteredProjects.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              <Business sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: '#666' }}>
                No projects found
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#999' }}>
                {searchQuery || selectedStatus !== 'all' || category
                  ? 'Try adjusting your search criteria or filters'
                  : 'No projects are available at the moment'
                }
              </Typography>
              {(searchQuery || selectedStatus !== 'all') && (
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    borderColor: '#ff4444',
                    color: '#ff4444',
                    '&:hover': {
                      borderColor: '#cc0000',
                      backgroundColor: 'rgba(255, 68, 68, 0.1)'
                    }
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Paper>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <Grid item xs={12} sm={6} md={4} key={project.id}>
                    <ProjectCard 
                      project={project} 
                      viewMode="grid"
                      onRefresh={refetch}
                      isAdmin={false} // Set based on user role
                    />
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default DDLProjectPage;