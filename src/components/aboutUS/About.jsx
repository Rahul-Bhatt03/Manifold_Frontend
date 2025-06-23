import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Construction,
  Groups,
  EmojiEvents,
  Timeline,
  LocationOn,
  Phone,
  Email,
  LinkedIn,
  Facebook,
  Twitter,
  Visibility,
  EmojiObjects,
  Handshake,
  Security
} from '@mui/icons-material';

const AboutUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeLocation, setActiveLocation] = useState('kathmandu');

  const locations = {
    kathmandu: {
      name: 'Kathmandu Headquarters',
      address: 'Thamel, Kathmandu 44600, Nepal',
      embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1234567890!2d85.3240!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQzJzAyLjAiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1234567890'
    },
    pokhara: {
      name: 'Pokhara Office',
      address: 'Lakeside, Pokhara 33700, Nepal',
      embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.1234567890!2d83.9856!3d28.2096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDEyJzM0LjYiTiA4M8KwNTknMDguMSJF!5e0!3m2!1sen!2snp!4v1234567890'
    },
    chitwan: {
      name: 'Chitwan Branch',
      address: 'Bharatpur, Chitwan 44200, Nepal',
      embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.1234567890!2d84.4359!3d27.6588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM5JzMxLjciTiA4NMKwMjYnMDkuMiJF!5e0!3m2!1sen!2snp!4v1234567890'
    }
  };

  const teamMembers = [
    {
      name: 'Rajesh Sharma',
      position: 'Founder & CEO',
      image: '/api/placeholder/150/150',
      experience: '15+ years',
      specialty: 'Structural Engineering'
    },
    {
      name: 'Priya Thapa',
      position: 'Chief Architect',
      image: '/api/placeholder/150/150',
      experience: '12+ years',
      specialty: 'Sustainable Design'
    },
    {
      name: 'Amit Gurung',
      position: 'Project Manager',
      image: '/api/placeholder/150/150',
      experience: '10+ years',
      specialty: 'Construction Management'
    },
    {
      name: 'Sita Rai',
      position: 'Quality Assurance Head',
      image: '/api/placeholder/150/150',
      experience: '8+ years',
      specialty: 'Quality Control'
    }
  ];

  const milestones = [
    { year: '2015', event: 'Manifold Consult Founded', description: 'Started with a vision to transform Nepal\'s construction industry' },
    { year: '2017', event: 'First Major Project', description: 'Completed 50-unit residential complex in Kathmandu' },
    { year: '2019', event: 'Expansion to Pokhara', description: 'Opened second office to serve western Nepal' },
    { year: '2021', event: 'Sustainable Building Certification', description: 'Became certified green building consultants' },
    { year: '2023', event: 'Digital Innovation', description: 'Launched BIM and 3D modeling services' },
    { year: '2025', event: 'Regional Leadership', description: 'Recognized as top construction consultant in Nepal' }
  ];

  const values = [
    {
      icon: <Visibility />,
      title: 'Transparency',
      description: 'We believe in honest communication and clear project visibility throughout every phase.'
    },
    {
      icon: <EmojiObjects />,
      title: 'Innovation',
      description: 'Embracing cutting-edge technology and sustainable practices in modern construction.'
    },
    {
      icon: <Handshake />,
      title: 'Integrity',
      description: 'Building trust through ethical practices and commitment to quality excellence.'
    },
    {
      icon: <Security />,
      title: 'Safety First',
      description: 'Prioritizing the safety of our workers and the communities we serve.'
    }
  ];

  const AnimatedSection = ({ children, delay = 0 }) => {
    const controls = useAnimation();
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
      if (inView) {
        controls.start('visible');
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={{
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
          hidden: { opacity: 0, y: 50 }
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/api/placeholder/1920/1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                lineHeight: 1.2
              }}
            >
              About Manifold Consult
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: '800px',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                lineHeight: 1.5
              }}
            >
              Building Nepal's Future, One Project at a Time
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Construction />}
                label="Founded 2015"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<Groups />}
                label="50+ Projects"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<EmojiEvents />}
                label="Award Winning"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
       
       {/* Company Story */}
<AnimatedSection>
  <Grid container spacing={4} alignItems="stretch" sx={{ mb: { xs: 6, md: 8 } }}>
    <Grid item xs={12} md={6}>
      <Typography 
        variant="h3" 
        component="h2" 
        gutterBottom 
        color="primary"
        sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}
      >
        Our Story
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        Founded in 2015 in the heart of Kathmandu, Manifold Consult emerged from a vision to 
        revolutionize Nepal's construction industry. What started as a small team of passionate 
        engineers and architects has grown into one of Nepal's most trusted construction consultancy firms.
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        Our journey began with a simple belief: that every structure should not only be built to last 
        but should also contribute positively to the community it serves. Today, we're proud to have 
        delivered over 50 successful projects across Nepal, each one a testament to our commitment 
        to excellence and innovation.
      </Typography>
    </Grid>
    <Grid item xs={12} md={6}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        style={{ height: '100%' }}
      >
        <Card
          elevation={4}
          sx={{
            height: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
              10 Years
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
              of Excellence in Construction
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              Transforming skylines and communities across Nepal with innovative, 
              sustainable construction solutions.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  </Grid>
</AnimatedSection>

        {/* Mission & Vision */}
        <AnimatedSection delay={0.2}>
          <Grid container spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
            <Grid item xs={12} md={6}>
              <motion.div whileHover={{ y: -5 }}>
                <Card 
                  elevation={4} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <Visibility />
                      </Avatar>
                      <Typography variant="h4" component="h3" sx={{ fontSize: { xs: '1.6rem', md: '1.8rem' } }}>
                        Our Mission
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                      To deliver exceptional construction consultancy services that exceed client expectations 
                      while contributing to Nepal's sustainable development. We strive to build not just 
                      structures, but lasting relationships and thriving communities.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div whileHover={{ y: -5 }}>
                <Card 
                  elevation={4} 
                  sx={{ 
                    height: '100%', 
                    borderRadius: 3,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                        <EmojiObjects />
                      </Avatar>
                      <Typography variant="h4" component="h3" sx={{ fontSize: { xs: '1.6rem', md: '1.8rem' } }}>
                        Our Vision
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                      To be Nepal's leading construction consultancy firm, recognized for innovation, 
                      sustainability, and excellence. We envision a future where every project we 
                      undertake contributes to a more resilient and beautiful Nepal.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </AnimatedSection>

        {/* Core Values with Fixed Width and Height */}
        <AnimatedSection delay={0.3}>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom 
            sx={{ mb: 6, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
          >
            Our Core Values
          </Typography>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mb: { xs: 6, md: 8 }
          }}>
            {values.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%' }}
              >
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    minHeight: 250,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center', 
                    borderRadius: 3,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: 3,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 60,
                        height: 60,
                        mb: 3
                      }}
                    >
                      {value.icon}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </AnimatedSection>

      {/* Interactive Map Section */}
<AnimatedSection delay={0.4}>
  <Typography 
    variant="h3" 
    component="h2" 
    align="center" 
    gutterBottom 
    sx={{ mb: 6, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
  >
    Our Locations
  </Typography>
  
  <Box sx={{ 
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 3,
    mb: { xs: 6, md: 8 },
    width: '100%',
    maxWidth: '100%',
    mx: 'auto'
  }}>
    {/* Location Selector - Left Side */}
    <Box sx={{ 
      width: { xs: '100%', md: '30%' },
      minWidth: { md: 300 }
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Select Office Location
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Object.entries(locations).map(([key, location]) => (
            <motion.div 
              key={key} 
              whileHover={{ scale: 1.02 }}
              style={{ flex: 1 }}
            >
              <Button
                fullWidth
                variant={activeLocation === key ? 'contained' : 'outlined'}
                onClick={() => setActiveLocation(key)}
                sx={{
                  height: '100%',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'left'
                }}
                startIcon={<LocationOn />}
              >
                <Box>
                  <Typography variant="subtitle1">{location.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {location.address}
                  </Typography>
                </Box>
              </Button>
            </motion.div>
          ))}
        </Box>
      </Paper>
    </Box>

    {/* Map - Right Side */}
    <Box sx={{ 
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      px: { xs: 2, md: 0 } // Equal padding on left/right for mobile
    }}>
      <motion.div
        key={activeLocation}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ 
          width: '100%',
          maxWidth: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: theme.shadows[4]
        }}
      >
        <Box
          sx={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            width: '100%'
          }}
        >
          <iframe
            src={locations[activeLocation].embed}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 0
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${locations[activeLocation].name}`}
          />
        </Box>
      </motion.div>
    </Box>
  </Box>
</AnimatedSection>

        {/* Timeline with Alternating Layout */}
     <AnimatedSection delay={0.5}>
  <Typography 
    variant="h3" 
    component="h2" 
    align="center" 
    gutterBottom 
    sx={{ mb: 6, fontSize: { xs: '1.8rem', md: '2.4rem' } }}
  >
    Our Journey
  </Typography>
  
  <Box sx={{ 
    position: 'relative',
    mb: { xs: 6, md: 8 },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: { xs: 'calc(50% - 2px)', md: '50%' },
      width: '4px',
      height: '100%',
      bgcolor: 'primary.main',
      zIndex: 1
    }
  }}>
    {milestones.map((milestone, index) => {
      const isEven = index % 2 === 0;
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: { md: isEven ? 'flex-start' : 'flex-end' },
            mb: 4,
            position: 'relative',
            zIndex: 2
          }}
        >
          <Box sx={{
            width: { xs: '100%', md: '50%' },
            pl: { md: isEven ? 0 : 4 },
            pr: { md: isEven ? 4 : 0 },
            display: 'flex',
            flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' },
            alignItems: 'center'
          }}>
            {/* Content Card */}
            <Card 
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                width: { xs: '100%', md: 'calc(100% - 60px)' },
                '&:hover': {
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                {milestone.year}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {milestone.event}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {milestone.description}
              </Typography>
            </Card>
            
            {/* Circle */}
            <Box sx={{
              mx: { xs: 0, md: 2 },
              my: { xs: 2, md: 0 },
              width: 50,
              height: 50,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme.shadows[4],
              flexShrink: 0
            }}>
              <Timeline sx={{ color: 'white' }} />
            </Box>
          </Box>
        </Box>
      );
    })}
  </Box>
</AnimatedSection>
        {/* Contact CTA */}
        <AnimatedSection delay={0.7}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 4, md: 6 },
                textAlign: 'center',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' } }}
              >
                Ready to Build Your Dream Project?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                Let's discuss how we can bring your vision to life
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                '& .MuiButton-root': {
                  minWidth: 180
                }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    borderRadius: 2,
                    px: 4
                  }}
                  startIcon={<Phone />}
                >
                  Call Us
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                    borderRadius: 2,
                    px: 4
                  }}
                  startIcon={<Email />}
                >
                  Email Us
                </Button>
              </Box>
              <Box sx={{ 
                mt: 4, 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 2,
                '& .MuiIconButton-root': {
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.2)'
                  }
                }
              }}>
                <IconButton sx={{ color: 'white' }}>
                  <LinkedIn />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: 'white' }}>
                  <Twitter />
                </IconButton>
              </Box>
            </Paper>
          </motion.div>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default AboutUsPage;