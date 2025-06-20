// src/components/projects/ProjectCard.js
import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { LocationOn, CalendarToday, Launch } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/projects/${project._id}`);

  const statusColors = {
  planned: 'default',
  ongoing: 'primary',
  completed: 'success',
  'on-hold': 'warning',
};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          cursor: 'pointer'
        },
      }}
      onClick={handleCardClick}
    >
      {/* Image with fixed aspect ratio (16:9) */}
      <Box sx={{ 
        position: 'relative',
        width: '100%',
        pt: '56.25%', // 16:9 aspect ratio
        overflow: 'hidden'
      }}>
        {project.image ? (
          <CardMedia
            component="img"
            image={project.image}
            alt={project.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ConstructionIcon sx={{ fontSize: 60, color: 'grey.500' }} />
          </Box>
        )}
      </Box>
      
      {/* Card content with fixed height */}
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        height: '220px', // Fixed height for all card contents
      }}>
        {/* Title with fixed height (2 lines max) */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '3em', // Fixed height for 2 lines
            lineHeight: 1.5
          }}
        >
          {project.title}
        </Typography>

           <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '3em',
              lineHeight: 1.5,
              flexGrow: 1
            }}
          >
            {project.title}
          </Typography>
          <Chip 
            label={project.status} 
            size="small"
            color={statusColors[project.status] || 'default'}
            sx={{ textTransform: 'capitalize', ml: 1 }}
          />
        </Box>

        {/* Description with fixed height (3 lines max) */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
            minHeight: '4.5em', // Fixed height for 3 lines
            flexGrow: 1
          }}
        >
          {project.description}
        </Typography>

        {/* Project metadata - fixed at bottom */}
        <Box sx={{ mt: 'auto' }}>
          {project.location && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 1
            }}>
              <LocationOn sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {project.location}
              </Typography>
            </Box>
          )}

          {project.date && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 2
            }}>
              <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(project.date)}
              </Typography>
            </Box>
          )}
        </Box>

        {project.link && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.link, '_blank');
              }}
              sx={{
                background: 'linear-gradient(45deg, #FF6B35 30%, #F7931E 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E55A2B 30%, #E0841A 90%)',
                },
              }}
            >
              <Launch fontSize="small" />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;