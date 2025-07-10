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
import { useEquipmentById, useEquipmentActions } from '../../hooks/useEquipment';
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
        navigate('/about/equipment');
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
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hero Background Section with Equipment Image */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          backgroundImage: `url(${equipment.image || '/placeholder-equipment.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(255,107,53,0.3) 100%)',
            backdropFilter: 'blur(2px)'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Header Navigation */}
          <Fade in={true} timeout={600}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.2)',
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
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
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
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share Equipment">
                  <IconButton 
                    sx={{ 
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Print Details">
                  <IconButton 
                    sx={{ 
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <Print />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Save to Favorites">
                  <IconButton 
                    sx={{ 
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <BookmarkBorder />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Fade>

          {/* Hero Content */}
          <Fade in={true} timeout={1000}>
            <Box sx={{ 
              maxWidth: '800px',
              color: 'white'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mb: 3
              }}>
                <Construction sx={{ fontSize: 60, color: '#FF6B35' }} />
                <Typography 
                  variant="h2" 
                  component="h1"
                  sx={{ 
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    fontSize: { xs: '2.5rem', md: '3.5rem' }
                  }}
                >
                  {equipment.name}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Chip 
                  icon={<Category />}
                  label={equipment.category} 
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    height: 50,
                    px: 2,
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>

              {/* Quick Stats in Hero */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                <Chip 
                  icon={<Engineering />}
                  label="Professional Grade"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
                <Chip 
                  icon={<Build />}
                  label="Heavy Duty"
                  sx={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                />
              </Box>

              {/* Loading indicator */}
              {isFetching && (
                <Box display="flex" alignItems="center" gap={2} sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CircularProgress size={20} sx={{ color: '#FF6B35' }} />
                  <Typography variant="body2">Refreshing data...</Typography>
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Content Section */}
      <Box sx={{ 
        backgroundColor: '#f8f9fa',
        position: 'relative',
        zIndex: 1,
        py: 6
      }}>
        <Container maxWidth="lg">
          {/* Description and Applications */}
          <Fade in={true} timeout={1200}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={8}
                  sx={{ 
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #fff, #f8f9fa)',
                    border: '1px solid #e9ecef',
                    height: 'fit-content',
                    transform: 'translateY(-60px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography 
                    variant="h4" 
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
                        lineHeight: 1.8,
                        color: '#555',
                        fontSize: '1.1rem'
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
                  elevation={8}
                  sx={{ 
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #fff, #f8f9fa)',
                    border: '1px solid #e9ecef',
                    height: 'fit-content',
                    transform: 'translateY(-60px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                >
                  <Typography 
                    variant="h4" 
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
                        lineHeight: 1.8,
                        color: '#555',
                        fontSize: '1.1rem'
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
              elevation={8}
              sx={{ 
                p: 6,
                mt: 4,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                color: 'white',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(255,107,53,0.3)'
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Need This Equipment for Your Project?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Contact our team to discuss availability, pricing, and delivery options.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                  onClick={() => navigate('/about')}
                >
                  Contact Us
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Edit Modal */}
      <AddEquipmentForm
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        equipmentData={equipment}
        isEdit={true}
      />
    </Box>
  );
};

export default EquipmentDetailPage;