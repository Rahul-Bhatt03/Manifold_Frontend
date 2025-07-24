import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Container,
  Paper,
  Fade,
  Backdrop,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import {
  Construction,
  FilterList,
  Add,
  GridView,
  ViewList,
  Search
} from '@mui/icons-material';
import { useEquipment, useEquipmentCategories, useEquipmentByCategory } from '../../hooks/useEquipment';
import EquipmentCard from '../equipments/EquipmentCard';
import AddEquipmentForm from '../equipments/AddEquipmentForm';

const EquipmentListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);
  // const [viewMode, setViewMode] = useState('grid');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Fetch all equipment and categories
  const { 
    data: allEquipmentData, 
    isLoading: allLoading, 
    error: allError 
  } = useEquipment();

  const { 
    data: categories, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useEquipmentCategories();

  // Fetch equipment by category when a category is selected
  const { 
    data: categoryEquipmentData, 
    isLoading: categoryLoading, 
    error: categoryError,
    isFetching: categoryFetching
  } = useEquipmentByCategory(selectedCategory !== 'all' ? selectedCategory : null);

  // Check admin status
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setIsAdmin(userData.role === 'admin');
  }, []);

  // Determine which equipment to display
  const equipmentToDisplay = selectedCategory === 'all' 
    ? allEquipmentData?.equipment 
    : categoryEquipmentData;

  const isLoading = allLoading || categoriesLoading || (selectedCategory !== 'all' && categoryLoading);
  const error = allError || categoriesError || categoryError;

  // Dynamic grid columns based on screen size
const getGridColumns = () => {
  if (isMobile) return { xs: 12 };  // Full width on mobile
  if (isTablet) return { xs: 12, sm: 6, md: 4 };
  return { xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 };
};


  if (isLoading) {
    return (
      <Backdrop open={true} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={60} sx={{ color: '#FF6B35' }} />
          <Typography variant="h6" color="white">
            Loading Equipment...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffebee, #fff3e0)',
            border: '1px solid #f44336'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Equipment Loading Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error.message}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    }}>
      {/* Hero Banner Section */}
      <Box sx={{ 
        position: 'relative',
        height: { xs: '50vh', md: '60vh' },
        background: 'rgb(46, 116, 192)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/construction-banner.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Fade in={true} timeout={800}>
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3 
              }}>
                <Construction sx={{ 
                  fontSize: { xs: 60, md: 80 }, 
                  color: 'white',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }} />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Premium Construction Equipment
                </Typography>
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'rgba(255,255,255,0.95)',
                  maxWidth: 800,
                  mx: 'auto',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Discover our comprehensive range of professional-grade construction equipment, 
                engineered for excellence and built to power your most ambitious projects.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

   <Container 
  maxWidth="xl" 
  sx={{ 
    py: { xs: 3, sm: 4 }, 
    mt: { xs: -4, sm: -6, md: -8 }, 
    position: 'relative', 
    zIndex: 3 
  }}
>
        {/* Enhanced Controls Section */}
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={12} 
            sx={{ 
              p: { xs: 2, md: 4 }, 
              mb: 4,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,249,250,0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
      <Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    justifyContent: 'space-between',
    gap: 2,
    width: '100%'
  }}
>
  {/* Filter Section */}
  <Box sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: 2,
    flex: 1,
    minWidth: { xs: '100%', sm: 'auto' }
  }}>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: 2,
      background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
      color: 'white',
      width: { xs: '100%', sm: 'auto' },
      justifyContent: { xs: 'center', sm: 'flex-start' }
    }}>
      <FilterList />
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Filter Equipment
      </Typography>
    </Box>
    
    <FormControl sx={{ 
      minWidth: { xs: '100%', sm: 240, md: 300 },
      width: { xs: '100%', sm: 'auto' }
    }} size="medium">
      <InputLabel 
        id="category-select-label"
        sx={{ 
          color: '#FF6B35',
          '&.Mui-focused': { color: '#FF6B35' }
        }}
      >
        Select Category
      </InputLabel>
      <Select
        labelId="category-select-label"
        id="category-select"
        value={selectedCategory}
        label="Select Category"
        onChange={(e) => setSelectedCategory(e.target.value)}
        disabled={categoriesLoading}
        sx={{
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#FF6B35', 0.3),
            borderWidth: 2,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF6B35',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF6B35',
          }
        }}
      >
        <MenuItem value="all">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GridView fontSize="small" color="primary" />
            <Typography sx={{ fontWeight: 'bold' }}>All Categories</Typography>
          </Box>
        </MenuItem>
        {categories?.map((category) => (
          <MenuItem key={category} value={category}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Construction fontSize="small" color="primary" />
              <Typography>{category}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>

  {/* View Controls and Add Button */}
  <Box sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column-reverse', sm: 'row' },
    alignItems: 'center', 
    gap: 2,
    width: { xs: '100%', sm: 'auto' },
    justifyContent: { xs: 'center', sm: 'flex-end' }
  }}>
    <Box sx={{ 
      display: 'flex', 
      gap: 1,
      p: 0.5,
      borderRadius: 2,
      background: alpha('#FF6B35', 0.1),
      border: `1px solid ${alpha('#FF6B35', 0.3)}`,
      width: { xs: '100%', sm: 'auto' },
      justifyContent: 'center'
    }}>
      <Tooltip title="Grid View">
        <IconButton 
          sx={{ 
            color: 'white',
            bgcolor: '#FF6B35',
            '&:hover': {
              bgcolor: '#e55a2b'
            }
          }}
        >
          <GridView />
        </IconButton>
      </Tooltip>
    </Box>

    {isAdmin && (
      <Button 
        variant="contained" 
        startIcon={<Add />}
        onClick={() => setOpenAddForm(true)}
        size="large"
        sx={{ 
          background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
          '&:hover': {
            background: 'linear-gradient(45deg, #e55a2b, #de8419)',
            transform: 'translateY(-2px)',
          },
          boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
          textTransform: 'none',
          fontWeight: 'bold',
          px: 4,
          py: 1.5,
          borderRadius: 3,
          transition: 'all 0.3s ease',
          width: { xs: '100%', sm: 'auto' }
        }}
      >
        Add New Equipment
      </Button>
    )}
  </Box>
</Box>
          </Paper>
        </Fade>

        {/* Loading indicator for category filtering */}
        {categoryFetching && selectedCategory !== 'all' && (
          <Box display="flex" justifyContent="center" mb={3}>
            <Paper 
              elevation={6} 
              sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9))',
                borderRadius: 3,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={24} sx={{ color: '#FF6B35' }} />
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Loading {selectedCategory} equipment...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Equipment Grid with Dynamic Columns */}
        <Fade in={true} timeout={1200}>
          <Box>
            {equipmentToDisplay?.length > 0 ? (
             <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                {equipmentToDisplay.map((equipment, index) => (
                  <Fade 
                    in={true} 
                    timeout={800 + (index * 100)} 
                    key={equipment.id}
                  >
                    <Grid item {...getGridColumns()}>
                      <EquipmentCard equipment={equipment} />
                    </Grid>
                  </Fade>
                ))}
              </Grid>
            ) : (
              <Paper 
                elevation={6} 
                sx={{ 
                  p: 8, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,249,250,0.9))',
                  borderRadius: 4,
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Construction sx={{ fontSize: 100, color: '#ddd', mb: 3 }} />
                <Typography variant="h4" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
                  No Equipment Found
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {selectedCategory !== 'all' 
                    ? `No equipment available in "${selectedCategory}" category` 
                    : 'No equipment available at the moment'
                  }
                </Typography>
              </Paper>
            )}
          </Box>
        </Fade>

        {/* Enhanced Equipment Count */}
        {equipmentToDisplay?.length > 0 && (
          <Fade in={true} timeout={1400}>
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Paper 
                elevation={6} 
                sx={{ 
                  display: 'inline-block',
                  px: 4,
                  py: 2,
                  background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                  borderRadius: 3,
                  color: 'white',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {equipmentToDisplay.length} Equipment Found
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </Typography>
              </Paper>
            </Box>
          </Fade>
        )}

        <AddEquipmentForm 
          open={openAddForm} 
          onClose={() => setOpenAddForm(false)} 
        />
      </Container>
    </Box>
  );
};

export default EquipmentListPage;