import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { Visibility as VisibilityIcon, Category as CategoryIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Line clamp style for one line
const clampOneLine = {
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

// Styled Components
const EquipmentCardContainer = styled(Card)(({ theme }) => ({
  height: '320px',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s ease',
  width: '100%',
  maxWidth: '360px',
  minWidth: '260px',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    '& .equipment-image': {
      transform: 'scale(1.05)',
    }
  },
}));

const EquipmentImage = styled(CardMedia)({
  height: '200px',
  width: '100%',
  transition: 'transform 0.4s ease',
  objectFit: 'cover',
});

const EquipmentTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  ...clampOneLine
}));

const EquipmentDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(2),
  ...clampOneLine
}));

const EquipmentCategory = styled(Chip)(() => ({
  maxWidth: '200px',
  ...clampOneLine,
  textTransform: 'capitalize'
}));

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Tooltip title={equipment.name} arrow>
        <EquipmentCardContainer onClick={() => navigate(`/equipment/${equipment.id}`)}>
          <EquipmentImage
            image={equipment.image || '/placeholder-equipment.jpg'}
            className="equipment-image"
            alt={equipment.name}
          />

          <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <EquipmentCategory
                icon={<CategoryIcon sx={{ fontSize: 16 }} />}
                label={equipment.category || 'Uncategorized'}
                size="small"
                color="primary"
              />
            </Box>

            <EquipmentTitle>{equipment.name}</EquipmentTitle>

            <EquipmentDescription
              dangerouslySetInnerHTML={{
                __html: equipment.description?.replace(/<[^>]+>/g, '') || 'No description available.',
              }}
            />

            <Box sx={{ mt: 'auto', textAlign: 'center' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/equipment/${equipment.id}`);
                }}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A2B 0%, #E0841A 100%)',
                  },
                }}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </EquipmentCardContainer>
      </Tooltip>
    </motion.div>
  );
};

export default EquipmentCard;
