import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const ConstructionHero = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (route) => {
    setCurrentPage(route);
    navigate(`/${route}`);
    console.log(`Navigating to: ${route}`);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'leadership':
        return (
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                Leadership Team
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, maxWidth: '600px' }}>
                Meet our executive leadership and their vision for construction excellence.
                Our team brings decades of experience in delivering complex projects worldwide.
              </Typography>
            </motion.div>
          </Container>
        );
      case 'energy':
        return (
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                Energy Projects
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, maxWidth: '600px' }}>
                Power generation and distribution projects that energize communities worldwide.
                From renewable energy to traditional power plants, we build the infrastructure that powers progress.
              </Typography>
            </motion.div>
          </Container>
        );
      case 'infrastructure':
        return (
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h2" sx={{ color: 'white', mb: 4, fontWeight: 'bold' }}>
                Infrastructure Projects
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, maxWidth: '600px' }}>
                Transportation and utilities infrastructure that connects communities and enables commerce.
                Building the backbone of modern society.
              </Typography>
            </motion.div>
          </Container>
        );
      default:
        return (
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                  lineHeight: 1.1,
                  mb: 4
                }}
              >
                We Live for a<br />Challenge
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white',
                  opacity: 0.9,
                  maxWidth: '600px',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                }}
              >
                At Manifold, we partner with our customers to bring their ambitions to life,
                delivering projects that make a lasting, meaningful difference for people and
                communities around the world.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(45deg, #ff4444, #cc0000)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '25px',
                  textTransform: 'none',
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #cc0000, #aa0000)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(255,68,68,0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleNavigation('projects')}
              >
                Explore Our Projects
              </Button>
            </motion.div>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Video Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      >
        {/* Video Element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <source src="/assets/construction-hero-video.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
        </video>
        
        {/* Fallback Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Video Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3))',
            zIndex: 1
          }}
        />
      </Box>

      {/* Hero Content */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
        pt: { xs: 8, sm: 10 } // Account for AppBar height
      }}>
        {renderCurrentPage()}
      </Box>

      {/* Back to Home Button for non-home pages */}
      {currentPage !== 'home' && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 20 },
            right: { xs: 16, sm: 20 },
            zIndex: 1000
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleNavigation('home')}
            sx={{
              background: 'linear-gradient(45deg, #ff4444, #cc0000)',
              color: 'white',
              borderRadius: '25px',
              px: 3,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(45deg, #cc0000, #aa0000)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255,68,68,0.4)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Back to Home
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ConstructionHero;