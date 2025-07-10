import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { Search, Clear, Business } from '@mui/icons-material';

import { useGetAllServices } from '../../hooks/useServices';
import { useCategories } from '../../hooks/useCategories';
import ServiceCard from '../../components/services/ServiceCard';

const ServicesByCategory = () => {
  const { category: categorySlug } = useParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const {
    data: services = [],
    isLoading: loadingServices,
    error: errorServices,
  } = useGetAllServices();

  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: errorCategories,
  } = useCategories();

  const currentCategory = useMemo(() => {
    return categories.find((cat) =>
      cat.name?.toLowerCase() === categorySlug?.toLowerCase() ||
      cat.name?.toLowerCase().replace(/\s+/g, '-') === categorySlug?.toLowerCase()
    );
  }, [categories, categorySlug]);

  // Auto-set category filter based on URL params
  useEffect(() => {
    if (currentCategory) {
      setSelectedCategoryFilter(currentCategory.id);
    } else if (categorySlug) {
      // If category slug exists but no matching category found, keep it as 'all'
      setSelectedCategoryFilter('all');
    }
  }, [currentCategory, categorySlug]);

  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(
        (service) =>
          service.category === selectedCategoryFilter ||
          service.category?.id === selectedCategoryFilter ||
          service.categoryId === selectedCategoryFilter
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((service) =>
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort services
    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title?.localeCompare(b.title));
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  }, [services, selectedCategoryFilter, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('title');
    setSelectedCategoryFilter('all');
  };

  // Get the display name for the page header
  const getPageTitle = () => {
    if (currentCategory) {
      return currentCategory.name;
    }
    if (categorySlug) {
      // Convert slug to readable format (e.g., "geophysical-investigation" -> "Geophysical Investigation")
      return categorySlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'All Services';
  };

  if (loadingServices || loadingCategories) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorServices || errorCategories) {
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {errorServices?.message || errorCategories?.message || 'Failed to load services or categories.'}
      </Alert>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '40vh', sm: '45vh', md: '50vh' },
          backgroundImage: 'url(/public\GeotechnicalInvestigation.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            px: { xs: 2, sm: 4 },
            maxWidth: '800px',
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            {getPageTitle()}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
              mb: 3,
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              opacity: 0.9,
            }}
          >
            Discover professional services tailored to your needs
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'text.primary',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} available
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>

      {/* Filter Section */}
      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 4, 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
          Filter & Search Services
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                label="Category"
                sx={{
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name} ({category._count?.services || 0})
                  </MenuItem>
                ))}
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
                sx={{
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Clear />}
              onClick={clearFilters}
              sx={{
                height: '56px',
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Paper
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.9)',
            mt: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Business sx={{ fontSize: { xs: 48, sm: 64 }, color: '#ccc', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            No services found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {selectedCategoryFilter !== 'all' || searchQuery
              ? 'Try different search terms or remove filters'
              : 'No services available at the moment'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={clearFilters}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Reset Filters
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {filteredServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service._id || service.id}>
              <Box
                sx={{
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                <ServiceCard
                  service={service}
                  viewMode="grid"
                  isAdmin={false}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
      </Box>
    </Box>
  );
};

export default ServicesByCategory;