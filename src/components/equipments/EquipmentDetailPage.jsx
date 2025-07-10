import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Divider,
  Container,
  CircularProgress,
  Paper,
  Grid,
  Fade,
  Backdrop,
  useTheme,
  alpha,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Construction,
  Engineering,
  Build,
  Info,
  Category,
  Share,
  Print,
  BookmarkBorder,
  Edit,
  Delete
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEquipmentById,useEquipmentActions } from '../../hooks/useEquipment';
import AddEquipmentForm from './AddEquipmentForm';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { 
    data: equipment, 
    isLoading, 
    error,
    isFetching 
  } = useEquipmentById(id);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { delete: deleteEquipment, isDeleting } = useEquipmentActions();

  const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete this equipment?')) {
    try {
      await deleteEquipment(id);
      navigate('/equipment');
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  }
};

  if (isLoading) {
    return (
      <Backdrop open={true} sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={60} sx={{ color: '#FF6B35' }} />
          <Typography variant="h6" color="white">
            Loading Equipment Details...
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
          <Construction sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Equipment Loading Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error.message}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/equipment')}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a2b, #de8419)',
              }
            }}
          >
            Back to Equipment List
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!equipment) {
    return (
      <Container sx={{ py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)'
          }}
        >
          <Construction sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Equipment Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The requested equipment could not be found in our database.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/equipment')}
            sx={{ 
              background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
              '&:hover': {
                background: 'linear-gradient(45deg, #e55a2b, #de8419)',
              }
            }}
          >
            Back to Equipment List
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      pt: 2
    }}>
      <Container maxWidth="lg" sx={{ py: 4, mt: 12 }}>
        {/* Header Section */}
        <Fade in={true} timeout={600}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ 
                borderColor: '#FF6B35',
                color: '#FF6B35',
                '&:hover': {
                  borderColor: '#e55a2b',
                  backgroundColor: alpha('#FF6B35', 0.1),
                }
              }}
            >
              Back to Equipment List
            </Button>

           <Box sx={{ display: 'flex', gap: 1 }}>
  <Tooltip title="Edit Equipment">
    <IconButton 
      onClick={() => setEditModalOpen(true)}
      sx={{ 
        color: '#FF6B35',
        '&:hover': { backgroundColor: alpha('#FF6B35', 0.1) }
      }}
    >
      <Edit />
    </IconButton>
  </Tooltip>
  
  <Tooltip title="Delete Equipment">
    <IconButton 
      onClick={handleDelete}
      disabled={isDeleting}
      sx={{ 
        color: '#f44336',
        '&:hover': { backgroundColor: alpha('#f44336', 0.1) }
      }}
    >
      <Delete />
    </IconButton>
  </Tooltip>

  <Tooltip title="Share Equipment">
    <IconButton 
      sx={{ 
        color: '#FF6B35',
        '&:hover': { backgroundColor: alpha('#FF6B35', 0.1) }
      }}
    >
      <Share />
    </IconButton>
  </Tooltip>
  
  <Tooltip title="Print Details">
    <IconButton 
      sx={{ 
        color: '#FF6B35',
        '&:hover': { backgroundColor: alpha('#FF6B35', 0.1) }
      }}
    >
      <Print />
    </IconButton>
  </Tooltip>
  
  <Tooltip title="Save to Favorites">
    <IconButton 
      sx={{ 
        color: '#FF6B35',
        '&:hover': { backgroundColor: alpha('#FF6B35', 0.1) }
      }}
    >
      <BookmarkBorder />
    </IconButton>
  </Tooltip>
</Box>
          </Box>
        </Fade>

        {/* Loading indicator */}
        {isFetching && (
          <Box display="flex" justifyContent="center" mb={2}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                background: 'rgba(255, 107, 53, 0.1)',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <CircularProgress size={20} sx={{ color: '#FF6B35' }} />
                <Typography variant="body2">Refreshing data...</Typography>
              </Box>
            </Paper>
          </Box>
        )}

        <Grid container spacing={4}>
          {/* Equipment Image */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={800}>
              <Card 
                elevation={8}
                sx={{ 
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #fff, #f8f9fa)'
                }}
              >
                <CardMedia
                  component="img"
                  height="500"
                  image={equipment.image || '/placeholder-equipment.jpg'}
                  alt={equipment.name}
                  sx={{ 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Card>
            </Fade>
          </Grid>

          {/* Equipment Details */}
          <Grid item xs={12} md={6}>
            <Fade in={true} timeout={1000}>
              <Box>
                {/* Title and Category */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    mb: 2
                  }}>
                    <Construction sx={{ fontSize: 40, color: '#FF6B35' }} />
                    <Typography 
                      variant="h3" 
                      component="h1"
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#333',
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}
                    >
                      {equipment.name}
                    </Typography>
                  </Box>
                  
                  <Chip 
                    icon={<Category />}
                    label={equipment.category} 
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      height: 40,
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                </Box>

                {/* Quick Stats */}
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3,
                    mb: 3,
                    background: 'linear-gradient(135deg, #fff, #f8f9fa)',
                    borderRadius: 3,
                    border: '1px solid #e9ecef'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                    <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Quick Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Chip 
                      icon={<Engineering />}
                      label="Professional Grade"
                      variant="outlined"
                      sx={{ borderColor: '#FF6B35', color: '#FF6B35' }}
                    />
                    <Chip 
                      icon={<Build />}
                      label="Heavy Duty"
                      variant="outlined"
                      sx={{ borderColor: '#28a745', color: '#28a745' }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Fade>
          </Grid>
        </Grid>

        {/* Description and Applications */}
        <Fade in={true} timeout={1200}>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6}
                sx={{ 
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #fff, #f8f9fa)',
                  border: '1px solid #e9ecef',
                  height: 'fit-content'
                }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    mb: 3,
                    color: '#333',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Info sx={{ color: '#FF6B35' }} />
                  Description
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ __html: equipment.description }} 
                  sx={{ 
                    '& p': { 
                      mb: 2, 
                      lineHeight: 1.7,
                      color: '#555'
                    },
                    '& ul, & ol': { 
                      pl: 4, 
                      mb: 2 
                    },
                    '& li': { 
                      mb: 1,
                      color: '#555'
                    },
                    '& h2, & h3, & h4': { 
                      mt: 3, 
                      mb: 1.5,
                      color: '#333'
                    }
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6}
                sx={{ 
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #fff, #f8f9fa)',
                  border: '1px solid #e9ecef',
                  height: 'fit-content'
                }}
              >
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    mb: 3,
                    color: '#333',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Build sx={{ color: '#FF6B35' }} />
                  Applications
                </Typography>
                <Box 
                  dangerouslySetInnerHTML={{ __html: equipment.application }} 
                  sx={{ 
                    '& p': { 
                      mb: 2, 
                      lineHeight: 1.7,
                      color: '#555'
                    },
                    '& ul, & ol': { 
                      pl: 4, 
                      mb: 2 
                    },
                    '& li': { 
                      mb: 1,
                      color: '#555'
                    },
                    '& h2, & h3, & h4': { 
                      mt: 3, 
                      mb: 1.5,
                      color: '#333'
                    }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Fade>

        {/* Call to Action */}
        <Fade in={true} timeout={1400}>
          <Paper 
            elevation={6}
            sx={{ 
              p: 4,
              mt: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
              color: 'white',
              borderRadius: 4
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Need This Equipment for Your Project?
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Contact our team to discuss availability, pricing, and delivery options.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: 'white',
                  color: '#FF6B35',
                  '&:hover': {
                    bgcolor: '#f8f9fa',
                  },
                  fontWeight: 'bold',
                  px: 4
                }}
              >
                Get Quote
              </Button>
              <Button 
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  fontWeight: 'bold',
                  px: 4
                }}
              >
                Contact Us
              </Button>
            </Box>
          </Paper>
        </Fade>
        {/* edit modal  */}
        <AddEquipmentForm
        open={editModalOpen}
        onClose={()=>setEditModalOpen(false)}
        equipmentData={equipment}
        isEdit={true}
        />
      </Container>
    </Box>
  );
};

export default EquipmentDetailPage;