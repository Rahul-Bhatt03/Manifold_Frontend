import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Launch,
  ArrowBackIos,
  ArrowForwardIos
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useNavigate } from 'react-router-dom';
import { useGetAllProjects } from '../hooks/useProjects';

const primary = '#1e88e5';
const accent = '#ff9800';
const headingFont = '"Montserrat", sans-serif';
const bodyFont = '"Open Sans", sans-serif';

const transition = {
  type: 'spring',
  stiffness: 120,
  damping: 20
};

const OngoingProjectsCarousel = () => {
  const { data: allProjects, isLoading, isError } = useGetAllProjects();
  const navigate = useNavigate();

  const projects = React.useMemo(() => {
    if (!allProjects) return [];
    return allProjects
      .filter(project => project.status === 'ongoing')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [allProjects]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: primary, opacity: 0.2 }} />
        </motion.div>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error" variant="h6" fontFamily={bodyFont}>
          Failed to load ongoing projects. Please try again later.
        </Typography>
      </Box>
    );
  }

  if (!projects.length) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary" fontFamily={bodyFont}>
          No ongoing projects at the moment. Check back soon!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        overflow: 'hidden',
        my: 8,
        px: { xs: 0, md: 2 }
      }}
    >
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 6,
          fontWeight: 800,
          fontFamily: headingFont,
          fontSize: { xs: '2.2rem', md: '3.5rem' },
          background: `linear-gradient(90deg, ${primary}, ${accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: -1
        }}
      >
        Building the Future, Today
      </Typography>

      <Carousel
        showArrows
        showStatus={false}
        showThumbs
        thumbWidth={80}
        infiniteLoop
        autoPlay={false} // Manual navigation preferred
        swipeable
        emulateTouch
        renderThumbs={() =>
          projects.map((project) => (
            <img
              key={project._id}
              src={project.image || 'https://via.placeholder.com/80/cccccc/000000?Text=Project'}
              alt={project.title}
              style={{ borderRadius: 8, objectFit: 'cover', height: 50 }}
            />
          ))
        }
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <Tooltip title="Previous Project">
              <IconButton
                onClick={onClickHandler}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(30,136,229,0.7)',
                  color: '#fff',
                  zIndex: 2,
                  '&:hover': { bgcolor: accent }
                }}
                aria-label="Previous Slide"
              >
                <ArrowBackIos />
              </IconButton>
            </Tooltip>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <Tooltip title="Next Project">
              <IconButton
                onClick={onClickHandler}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 16,
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(30,136,229,0.7)',
                  color: '#fff',
                  zIndex: 2,
                  '&:hover': { bgcolor: accent }
                }}
                aria-label="Next Slide"
              >
                <ArrowForwardIos />
              </IconButton>
            </Tooltip>
          )
        }
      >
        {projects.map((project, idx) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: idx * 0.1 }}
          >
            <Box
              onClick={() => navigate(`/projects/${project._id}`)}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.015)' }
              }}
            >
              <Card
                sx={{
                  height: { xs: 'auto', md: 480 },
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: 8,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid #e3e3e3',
                  position: 'relative'
                }}
                elevation={0}
              >
                {/* Text Section */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '52%' },
                    p: { xs: 3, md: 5 },
                    color: '#222',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Chip
                    label="Ongoing Project"
                    sx={{
                      bgcolor: accent,
                      color: '#fff',
                      mb: 2,
                      fontWeight: 600,
                      fontFamily: bodyFont,
                      fontSize: 15,
                      px: 2
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontFamily: headingFont,
                      mb: 1,
                      color: primary,
                      textShadow: '0 2px 8px rgba(30,136,229,0.07)'
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: bodyFont,
                      fontSize: '1.08rem',
                      lineHeight: 1.7,
                      color: '#444',
                      mb: 2,
                      minHeight: 58
                    }}
                  >
                    {project.description}
                  </Typography>
                  {project.location && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn sx={{ mr: 1, color: accent }} />
                      <Typography fontFamily={bodyFont}>
                        {project.location}
                      </Typography>
                    </Box>
                  )}
                  {project.date && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarToday sx={{ mr: 1, color: accent }} />
                      <Typography fontFamily={bodyFont}>
                        {new Date(project.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  )}
                  {project.link && (
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        window.open(project.link, '_blank');
                      }}
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        background: `linear-gradient(45deg, ${accent}, ${primary})`,
                        color: '#fff',
                        fontWeight: 'bold',
                        fontFamily: bodyFont,
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: `0 4px 14px 0 rgba(0,0,0,0.13)`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${primary}, ${accent})`
                        }
                      }}
                      endIcon={<Launch />}
                    >
                      View Details
                    </Button>
                  )}
                </Box>

                {/* Image Section */}
                <Box
                  sx={{
                    width: { xs: '100%', md: '48%' },
                    height: { xs: 260, md: '100%' },
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={transition}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        project.image ||
                        'https://via.placeholder.com/600/cccccc/000000?Text=Project+Image'
                      }
                      alt={project.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s',
                        '&:hover': { transform: 'scale(1.03)' }
                      }}
                    />
                  </motion.div>
                </Box>
              </Card>
            </Box>
          </motion.div>
        ))}
      </Carousel>
    </Box>
  );
};

export default OngoingProjectsCarousel;
