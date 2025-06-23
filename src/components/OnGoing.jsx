import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  LocationOn,
  CalendarToday,
  Launch,
  PlayArrow,
  Pause,
  Visibility,
  Construction,
  Engineering
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGetAllProjects } from '../hooks/useProjects';

// Construction-themed colors
const primary = '#FF6B35'; // Construction orange
const secondary = '#2E3440'; // Dark steel
const accent = '#FFA500'; // Bright orange
const constructionYellow = '#FFD60A';
const steelBlue = '#4A90A4';
const headingFont = '"Roboto Condensed", "Arial Black", sans-serif';
const bodyFont = '"Open Sans", "Helvetica", sans-serif';

const OngoingProjectsCarousel = () => {
  const { data: allProjects, isLoading, isError } = useGetAllProjects();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  // Filter and sort projects like in original code
  const projects = React.useMemo(() => {
    if (!allProjects) return [];
    return allProjects
      .filter(project => project.status === 'ongoing')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);
  }, [allProjects]);

  // Clear interval when component unmounts or dependencies change
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-play functionality with proper circular loop
  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0 || isTransitioning) return;
    
    intervalRef.current = setInterval(() => {
      goToNext();
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, projects.length, isTransitioning, currentIndex]);

  // Loading state
  if (isLoading) {
    return (
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          background: `linear-gradient(135deg, ${secondary} 0%, #1A1A1A 50%, ${primary}22 100%)`,
          py: 8
        }}
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <CircularProgress size={60} sx={{ color: primary }} />
        </motion.div>
        <Typography 
          variant="h6" 
          sx={{ color: '#fff', mt: 2, fontFamily: bodyFont }}
        >
          Loading construction projects...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          background: `linear-gradient(135deg, ${secondary} 0%, #1A1A1A 50%, ${primary}22 100%)`,
          py: 8
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Alert 
            severity="error" 
            sx={{ 
              fontSize: '1.1rem',
              bgcolor: 'rgba(255,107,53,0.1)',
              color: '#fff',
              border: `1px solid ${primary}`,
              '& .MuiAlert-message': { fontFamily: bodyFont }
            }}
          >
            Failed to load construction projects. Please try again later.
          </Alert>
        </motion.div>
      </Box>
    );
  }

  // No projects state
  if (!projects.length) {
    return (
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          background: `linear-gradient(135deg, ${secondary} 0%, #1A1A1A 50%, ${primary}22 100%)`,
          py: 8,
          textAlign: 'center'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Construction sx={{ fontSize: '4rem', mb: 2, color: primary }} />
          <Typography 
            variant="h4" 
            sx={{ color: '#fff', mb: 2, fontFamily: headingFont, fontWeight: 700 }}
          >
            NO ACTIVE CONSTRUCTION
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: bodyFont }}
          >
            New projects coming soon to our construction pipeline
          </Typography>
        </motion.div>
      </Box>
    );
  }

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    setTimeout(() => setIsTransitioning(false), 600); // Match transition duration
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTimeout(() => setIsTransitioning(false), 600); // Match transition duration
  };

  const goToIndex = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600); // Match transition duration
  };

  // Get the visible projects for the carousel (current + adjacent)
  const getVisibleProjects = () => {
    const visibleCount = 5; // Show 5 cards at a time
    const visible = [];
    
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + projects.length) % projects.length;
      visible.push({
        ...projects[index],
        displayIndex: i,
        actualIndex: index
      });
    }
    
    return visible;
  };

  // Responsive card positioning based on screen size
  const getCardStyle = (displayIndex, screenSize) => {
    // Different spacing for different screen sizes
    const spacing = {
      xs: { base: 80, increment: 60 },
      sm: { base: 100, increment: 80 },
      md: { base: 150, increment: 100 },
      lg: { base: 200, increment: 120 },
      xl: { base: 250, increment: 150 }
    };
    
    const currentSpacing = spacing[screenSize] || spacing.md;
    
    if (displayIndex === 0) {
      // Center card
      return {
        scale: 1,
        opacity: 1,
        zIndex: 50,
        x: 0,
        rotateY: 0,
        brightness: 1
      };
    } else if (Math.abs(displayIndex) === 1) {
      // Adjacent cards
      const direction = displayIndex > 0 ? 1 : -1;
      return {
        scale: 0.85,
        opacity: 0.8,
        zIndex: 40,
        x: direction * currentSpacing.base,
        rotateY: direction * -10,
        brightness: 0.8
      };
    } else if (Math.abs(displayIndex) === 2) {
      // Second level cards
      const direction = displayIndex > 0 ? 1 : -1;
      return {
        scale: 0.7,
        opacity: 0.6,
        zIndex: 30,
        x: direction * (currentSpacing.base + currentSpacing.increment),
        rotateY: direction * -20,
        brightness: 0.6
      };
    } else {
      // Hidden cards
      const direction = displayIndex > 0 ? 1 : -1;
      return {
        scale: 0.5,
        opacity: 0.3,
        zIndex: 10,
        x: direction * (currentSpacing.base + currentSpacing.increment * 2),
        rotateY: direction * -30,
        brightness: 0.4
      };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBreakpoint = () => {
    if (typeof window === 'undefined') return 'md';
    if (window.innerWidth < 600) return 'xs';
    if (window.innerWidth < 900) return 'sm';
    if (window.innerWidth < 1200) return 'md';
    if (window.innerWidth < 1536) return 'lg';
    return 'xl';
  };

  const visibleProjects = getVisibleProjects();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${secondary} 0%, 
          #1A1A1A 25%, 
          ${secondary}DD 50%, 
          #2A2A2A 75%, 
          ${primary}11 100%
        )`,
        position: 'relative',
        overflow: 'hidden',
        py: 8
      }}
    >
      {/* Construction-themed Background Effects */}
      <Box sx={{ position: 'absolute', inset: 0, opacity: 0.05 }}>
        {/* Geometric construction patterns */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: `conic-gradient(from 0deg, ${primary}, ${constructionYellow}, ${steelBlue}, ${primary})`,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: 'blur(40px)'
          }}
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '250px',
            height: '250px',
            background: `conic-gradient(from 180deg, ${steelBlue}, ${primary}, ${constructionYellow})`,
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            filter: 'blur(45px)'
          }}
        />
      </Box>

      {/* Industrial grid pattern overlay */}
      <Box 
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}
      />

      {/* Header */}
      <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center', mb: { xs: 4, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Engineering sx={{ fontSize: '3rem', color: primary, mr: 2 }} />
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontFamily: headingFont,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                color: '#fff',
                textShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
                letterSpacing: { xs: -1, md: -2 },
                textTransform: 'uppercase'
              }}
            >
              ACTIVE
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontFamily: headingFont,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
              background: `linear-gradient(45deg, ${primary}, ${constructionYellow}, ${steelBlue})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              letterSpacing: { xs: -1, md: -2 },
              textTransform: 'uppercase'
            }}
          >
            CONSTRUCTION
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontFamily: bodyFont,
              maxWidth: { xs: '90%', md: 700 },
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Building Tomorrow's Infrastructure Today
          </Typography>
        </motion.div>
      </Box>

      {/* Carousel Container */}
      <Box 
        sx={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: { xs: 500, md: 600, lg: 700 },
          px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 }
        }}
      >
        {/* Navigation Buttons */}
        <Tooltip title="Previous Project">
          <IconButton
            onClick={goToPrev}
            disabled={isTransitioning}
            sx={{
              position: 'absolute',
              left: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 },
              zIndex: 50,
              p: { xs: 1.5, md: 2 },
              bgcolor: `${primary}22`,
              backdropFilter: 'blur(10px)',
              border: `2px solid ${primary}`,
              color: '#fff',
              '&:hover': {
                bgcolor: `${primary}44`,
                transform: 'scale(1.1)',
                borderColor: constructionYellow
              },
              '&:disabled': {
                opacity: 0.5
              }
            }}
            component={motion.div}
            whileHover={{ scale: isTransitioning ? 1 : 1.1 }}
            whileTap={{ scale: isTransitioning ? 1 : 0.9 }}
          >
            <ArrowBackIos fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Next Project">
          <IconButton
            onClick={goToNext}
            disabled={isTransitioning}
            sx={{
              position: 'absolute',
              right: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 },
              zIndex: 50,
              p: { xs: 1.5, md: 2 },
              bgcolor: `${primary}22`,
              backdropFilter: 'blur(10px)',
              border: `2px solid ${primary}`,
              color: '#fff',
              '&:hover': {
                bgcolor: `${primary}44`,
                transform: 'scale(1.1)',
                borderColor: constructionYellow
              },
              '&:disabled': {
                opacity: 0.5
              }
            }}
            component={motion.div}
            whileHover={{ scale: isTransitioning ? 1 : 1.1 }}
            whileTap={{ scale: isTransitioning ? 1 : 0.9 }}
          >
            <ArrowForwardIos fontSize="large" />
          </IconButton>
        </Tooltip>

        {/* Cards Container - Responsive */}
        <Box 
          sx={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: { xs: 350, sm: 600, md: 900, lg: 1200, xl: 1600 }, 
            height: { xs: 450, md: 500, lg: 550 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AnimatePresence mode="sync">
            {visibleProjects.map((project) => {
              const style = getCardStyle(project.displayIndex, getBreakpoint());
              
              return (
                <motion.div
                  key={`${project._id}-${project.displayIndex}`}
                  style={{
                    position: 'absolute',
                    width: typeof window !== 'undefined' && window.innerWidth < 600 ? 300 : 
                           typeof window !== 'undefined' && window.innerWidth < 900 ? 320 : 350,
                    height: typeof window !== 'undefined' && window.innerWidth < 600 ? 400 : 
                            typeof window !== 'undefined' && window.innerWidth < 900 ? 430 : 450,
                    cursor: 'pointer',
                    zIndex: style.zIndex
                  }}
                  animate={{
                    scale: style.scale,
                    opacity: style.opacity,
                    x: style.x,
                    rotateY: style.rotateY,
                    filter: `brightness(${style.brightness})`,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  onClick={() => {
                    if (project.displayIndex === 0) {
                      navigate(`/projects/${project._id}`);
                    } else {
                      goToIndex(project.actualIndex);
                    }
                  }}
                  whileHover={{ 
                    scale: project.displayIndex === 0 ? 1.05 : style.scale * 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(46,52,64,0.9)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `2px solid ${project.displayIndex === 0 ? primary : 'rgba(255,107,53,0.3)'}`,
                      boxShadow: `0 20px 40px rgba(0,0,0,0.4), 
                                  inset 0 1px 0 rgba(255,255,255,0.1)`,
                      '&:hover': {
                        borderColor: constructionYellow
                      }
                    }}
                  >
                    {/* Project Image */}
                    <Box sx={{ position: 'relative', height: { xs: 180, md: 200 } }}>
                      <CardMedia
                        component="img"
                        image={project.image || 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?Text=Construction+Project'}
                        alt={project.title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(to top, ${secondary}DD, transparent 50%)`
                        }}
                      />
                      
                      {/* Status Badge */}
                      <Chip
                        label="● UNDER CONSTRUCTION"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: primary,
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          fontFamily: headingFont,
                          textTransform: 'uppercase',
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />

                      {/* View Icon */}
                      {project.displayIndex === 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12
                          }}
                        >
                          <IconButton
                            sx={{
                              bgcolor: `${primary}AA`,
                              backdropFilter: 'blur(10px)',
                              color: '#fff',
                              border: `1px solid ${constructionYellow}`,
                              '&:hover': { 
                                bgcolor: primary,
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </motion.div>
                      )}
                    </Box>

                    {/* Project Details */}
                    <CardContent sx={{ p: { xs: 2, md: 3 }, color: '#fff', height: { xs: 220, md: 250 } }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontFamily: headingFont,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: { xs: '1.1rem', md: '1.25rem' },
                          textTransform: 'uppercase',
                          letterSpacing: 0.5
                        }}
                      >
                        {project.title}
                      </Typography>
                      
                      <Typography
                        sx={{
                          fontFamily: bodyFont,
                          color: 'rgba(255,255,255,0.8)',
                          mb: 2,
                          fontSize: { xs: '0.85rem', md: '0.9rem' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: 1.4
                        }}
                      >
                        {project.description}
                      </Typography>

                      {/* Location and Date */}
                      <Box sx={{ mb: 2 }}>
                        {project.location && (
                          <Box display="flex" alignItems="center" mb={1}>
                            <LocationOn sx={{ mr: 1, color: constructionYellow, fontSize: '1rem' }} />
                            <Typography 
                              sx={{ 
                                fontFamily: bodyFont, 
                                fontSize: { xs: '0.8rem', md: '0.85rem' },
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 500
                              }}
                            >
                              {project.location}
                            </Typography>
                          </Box>
                        )}
                        {project.date && (
                          <Box display="flex" alignItems="center">
                            <CalendarToday sx={{ mr: 1, color: constructionYellow, fontSize: '1rem' }} />
                            <Typography 
                              sx={{ 
                                fontFamily: bodyFont, 
                                fontSize: { xs: '0.8rem', md: '0.85rem' },
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 500
                              }}
                            >
                              {formatDate(project.date)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Action Button */}
                      {project.displayIndex === 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Button
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              if (project.link) {
                                window.open(project.link, '_blank');
                              } else {
                                navigate(`/projects/${project._id}`);
                              }
                            }}
                            sx={{
                              py: 1.5,
                              background: `linear-gradient(45deg, ${primary}, ${constructionYellow})`,
                              color: '#fff',
                              fontWeight: 700,
                              fontFamily: headingFont,
                              borderRadius: 2,
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              border: `1px solid ${steelBlue}33`,
                              '&:hover': {
                                background: `linear-gradient(45deg, ${constructionYellow}, ${primary})`,
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 25px ${primary}44`
                              }
                            }}
                            endIcon={<Launch />}
                          >
                            View Project
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Bottom Controls */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 10, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: { xs: 2, md: 4 },
          mt: { xs: 4, md: 6 },
          flexWrap: 'wrap'
        }}
      >
        {/* Auto-play Toggle */}
        <Button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1,
            bgcolor: `${primary}22`,
            backdropFilter: 'blur(10px)',
            color: '#fff',
            borderRadius: 3,
            textTransform: 'uppercase',
            fontFamily: headingFont,
            fontWeight: 600,
            border: `1px solid ${primary}66`,
            '&:hover': {
              bgcolor: `${primary}44`,
              borderColor: constructionYellow
            }
          }}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAutoPlaying ? <Pause /> : <PlayArrow />}
          {isAutoPlaying ? 'Pause' : 'Auto Play'}
        </Button>

        {/* Progress Indicators */}
        <Box display="flex" gap={1}>
          {projects.map((_, index) => (
            <IconButton
              key={index}
              onClick={() => goToIndex(index)}
              disabled={isTransitioning}
              sx={{
                width: 14,
                height: 14,
                minWidth: 'unset',
                p: 0,
                bgcolor: index === currentIndex ? primary : 'rgba(255,107,53,0.3)',
                borderRadius: '50%',
                border: `1px solid ${index === currentIndex ? constructionYellow : 'transparent'}`,
                '&:hover': {
                  bgcolor: index === currentIndex ? primary : 'rgba(255,107,53,0.6)',
                  transform: 'scale(1.3)',
                  borderColor: constructionYellow
                },
                '&:disabled': {
                  opacity: 0.5
                }
              }}
              component={motion.div}
              whileHover={{ scale: isTransitioning ? 1 : 1.3 }}
              whileTap={{ scale: isTransitioning ? 1 : 0.8 }}
            />
          ))}
        </Box>

        {/* Counter */}
        <Typography 
          sx={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: { xs: '0.85rem', md: '0.9rem' },
            fontFamily: headingFont,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}
        >
          Project {currentIndex + 1} of {projects.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default OngoingProjectsCarousel;