import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Construction,
  Engineering,
  Architecture,
  Home,
  ArrowUpward,
  ContactSupport,
  PrivacyTip,
  Description
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  const socialLinks = [
    { icon: <Facebook />, name: 'Facebook', url: 'https://www.facebook.com/manifoldconsult/' },
    { icon: <Twitter />, name: 'Twitter', url: '#' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: 'https://www.linkedin.com/company/manifold-consult/' },
    { icon: <YouTube />, name: 'YouTube', url: '#' }
  ];

  const servicesLinks = [
    { icon: <Construction />, text: 'Construction' },
    { icon: <Engineering />, text: 'Engineering' },
    { icon: <Architecture />, text: 'Architecture'},
    { icon: <Home />, text: 'Renovation' }
  ];

  const contactLinks = [
    { icon: <Phone />, text: '+977-1-4154876, 9860816776, 9860131300' },
    { icon: <Email />, text: 'manifoldhelp@gmail.com | manifoldconsult@gmail.com | contact@manifoldconsult.com.np' },
    { icon: <LocationOn />, text: 'Sahayoginagar, Koteshwor, Kathmandu, Nepal' }
  ];

  const infoLinks = [
    { icon: <ContactSupport />, text: 'Contact Us', url: '#' },
    { icon: <PrivacyTip />, text: 'Privacy Policy', url: '#' },
    { icon: <Description />, text: 'Terms of Service', url: '#' },
    { text: 'Careers', url: '#' },
    { text: 'Projects', url: '#' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        pt: 6,
        pb: 3,
        position: 'relative'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      color: '#ff6b6b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Construction fontSize="large" />
                    Manifold Consult Pvt. Ltd.
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Building the future with innovative construction solutions and sustainable development.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -3, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        href={social.url}
                        target="_blank"
                        rel="noopener"
                        aria-label={social.name}
                        sx={{
                          color: '#ffffff',
                          backgroundColor: '#333333',
                          '&:hover': {
                            backgroundColor: '#ff6b6b'
                          }
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Services */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff6b6b' }}>
                  Our Services
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {servicesLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        href={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 0.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#ff6b6b'
                          }
                        }}
                      >
                        <Box sx={{ mr: 1, display: 'flex' }}>{link.icon}</Box>
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff6b6b' }}>
                  Contact Us
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  {contactLinks.map((link, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        href={link.url}
                        color="inherit"
                        underline="hover"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          py: 0.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#ff6b6b'
                          }
                        }}
                      >
                        <Box sx={{ mr: 1, display: 'flex' }}>{link.icon}</Box>
                        {link.text}
                      </Link>
                    </motion.li>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          {/* Divider */}
          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.12)' }} />
          </motion.div>

          {/* Bottom Section */}
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <motion.div variants={itemVariants}>
                <Typography variant="body2">
                  © {new Date().getFullYear()} Manifold Consult Pvt. Ltd. All rights reserved.
                </Typography>
              </motion.div>
            </Grid>
            <Grid item>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={scrollToTop}
                  aria-label="scroll back to top"
                  sx={{
                    color: '#ffffff',
                    backgroundColor: '#333333',
                    '&:hover': {
                      backgroundColor: '#ff6b6b'
                    }
                  }}
                >
                  <ArrowUpward />
                </IconButton>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Footer;