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
  Container
} from '@mui/material';
import { useEquipment, useEquipmentCategories, useEquipmentByCategory } from '../../hooks/useEquipment';
import EquipmentCard from '../equipments/EquipmentCard';
import AddEquipmentForm from '../equipments/AddEquipmentForm';

const EquipmentListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [openAddForm, setOpenAddForm] = useState(false);

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Error loading equipment: {error.message}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1">
          Our Equipment
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="category-select-label">Filter by Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Filter by Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={categoriesLoading}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isAdmin && (
            <Button 
              variant="contained" 
              onClick={() => setOpenAddForm(true)}
              sx={{ height: '40px' }}
            >
              Add Equipment
            </Button>
          )}
        </Box>
      </Box>

      {categoryFetching && selectedCategory !== 'all' && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Grid container spacing={3}>
        {equipmentToDisplay?.length > 0 ? (
          equipmentToDisplay.map((equipment) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={equipment.id}>
              <EquipmentCard equipment={equipment} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={{ py: 4 }}>
              No equipment found{selectedCategory !== 'all' ? ` in ${selectedCategory} category` : ''}
            </Typography>
          </Grid>
        )}
      </Grid>

      <AddEquipmentForm 
        open={openAddForm} 
        onClose={() => setOpenAddForm(false)} 
      />
    </Container>
  );
};

export default EquipmentListPage;