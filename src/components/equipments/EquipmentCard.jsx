import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const ClampedText = styled(Typography)({
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.5rem',
  maxHeight: '4.5rem' // 3 lines * 1.5 line-height
});

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 3
      }
    }}>
      {/* Image at the top */}
      <CardMedia
        component="img"
        height="200"
        image={equipment.image || '/placeholder-equipment.jpg'}
        alt={equipment.name}
        sx={{ 
          objectFit: 'cover',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      />

      {/* Content below image */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Equipment name */}
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            mt: 1
          }}
        >
          {equipment.name}
        </Typography>

        {/* Category chip */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Chip 
            label={equipment.category} 
            size="small" 
            color="primary"
          />
        </Box>

        {/* Clamped description */}
        <ClampedText 
          variant="body2" 
          color="text.secondary"
          dangerouslySetInnerHTML={{ 
            __html: equipment.description.replace(/<[^>]+>/g, '') 
          }}
        />
      </CardContent>

      {/* View button at bottom */}
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => navigate(`/equipment/${equipment.id}`)}
          sx={{
            width: '100%',
            fontWeight: 500
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default EquipmentCard;