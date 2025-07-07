import React from 'react';
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
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useEquipmentById } from '../../hooks/useEquipment';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    data: equipment, 
    isLoading, 
    error,
    isFetching 
  } = useEquipmentById(id);

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
        <Button 
          variant="outlined" 
          onClick={() => navigate('/equipment')}
          sx={{ mt: 2 }}
        >
          Back to Equipment List
        </Button>
      </Container>
    );
  }

  if (!equipment) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6">Equipment not found</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/equipment')}
          sx={{ mt: 2 }}
        >
          Back to Equipment List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Equipment List
      </Button>

      {isFetching && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Card>
        <CardMedia
          component="img"
          height="400"
          image={equipment.image || '/placeholder-equipment.jpg'}
          alt={equipment.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h3" component="h1">
              {equipment.name}
            </Typography>
            <Chip 
              label={equipment.category} 
              color="primary"
              size="medium"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Description
            </Typography>
            <Box 
              dangerouslySetInnerHTML={{ __html: equipment.description }} 
              sx={{ 
                '& p': { mb: 2 },
                '& ul, & ol': { pl: 4, mb: 2 },
                '& li': { mb: 1 },
                '& h2, & h3, & h4': { mt: 3, mb: 1.5 }
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              Applications
            </Typography>
            <Box 
              dangerouslySetInnerHTML={{ __html: equipment.application }} 
              sx={{ 
                '& p': { mb: 2 },
                '& ul, & ol': { pl: 4, mb: 2 },
                '& li': { mb: 1 },
                '& h2, & h3, & h4': { mt: 3, mb: 1.5 }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EquipmentDetailPage;