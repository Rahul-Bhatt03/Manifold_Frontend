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
  Security,
  Science,
  EditLocationTwoTone
} from '@mui/icons-material';
import { Dialog } from '@mui/material';
import ContactForm from './ContactForm';

const AboutUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeLocation, setActiveLocation] = useState('headquarters');
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContactForm = () => {
    setIsContactOpen(true);
  };

  const closeContactForm = () => {
    setIsContactOpen(false);
  };

  const locations = {
    headquarters: {
      name: 'Head Office',
      address: 'Sahayoginagar 32 Koteshwor, Kandaghari, Nepal',
      embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1234567890!2d85.3240!3d27.6648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM5JzUzLjMiTiA4NcKwMTknMjYuNCJF!5e0!3m2!1sen!2snp!4v1234567890'
    }
  };

  const milestones = [
    { year: '2017', event: 'Manifold Consult Pvt. Ltd. Founded', description: 'Registered under Company Act 2006, Government of Nepal in August 2017' },
    { year: '2018', event: 'First Major Environmental Study', description: 'Completed comprehensive environmental impact assessment for infrastructure project' },
    { year: '2019', event: 'Geotechnical Services Expansion', description: 'Expanded services to include advanced geotechnical investigations' },
    { year: '2020', event: 'Multi-disciplinary Team Formation', description: 'Assembled experts from universities and government organizations' },
    { year: '2022', event: 'Advanced Geophysical Services', description: 'Introduced state-of-the-art geophysical survey equipment' },
    { year: '2025', event: 'Leading Consultancy Recognition', description: 'Recognized as premier geo-engineering consultancy in Nepal' }
  ];

  const values = [
    {
      icon: <Science />,
      title: 'Scientific Excellence',
      description: 'Applying rigorous scientific methods and cutting-edge technology in all our investigations and studies.'
    },
    {
      icon: <EmojiObjects />,
      title: 'Innovation',
      description: 'Providing innovative solutions for complex geological, environmental, and engineering challenges.'
    },
    {
      icon: <Handshake />,
      title: 'Professional Integrity',
      description: 'Maintaining highest professional standards through ethical practices and transparent communication.'
    },
    {
      icon: <EditLocationTwoTone />,
      title: 'Environmental Responsibility',
      description: 'Committed to sustainable development and environmental protection in all our projects.'
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
                           Leading Institution in Environmental Studies, Geo-Engineering & Engineering Services

            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                icon={<Construction />}
                label="Est. 2017"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<Groups />}
                label="Multi-disciplinary Team"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<EmojiEvents />}
                label="Expert Solutions"
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
        Manifold Consult Pvt. Ltd. has been established as an institution in the field of environmental 
        studies, geo-engineering and engineering services, based in Nepal. The firm is registered under 
        the company act 2006 (Office of the Company Registrar) the Government of Nepal in August 2017.
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
        Our main aim is to provide innovative solutions for all kinds of geological, geophysical, 
        geotechnical, environmental, socio-economic, and engineering problems faced by development 
        and research projects of our country. We bring together highly skilled professionals with 
        several years of experience to deliver exceptional results.
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
              8+ Years
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
              of Excellence in Geo-Engineering
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              Providing innovative solutions for geological, environmental, and engineering challenges 
              across Nepal with a team of experienced professionals.
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
                      To provide innovative solutions for all kinds of geological, geophysical, geotechnical, 
                      environmental, socio-economic, and engineering problems faced by development and research 
                      projects of our country through expert multi-disciplinary services.
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
                      To be Nepal's leading institution in environmental studies, geo-engineering and 
                      engineering services, recognized for scientific excellence, innovation, and 
                      contribution to sustainable development and research in our country.
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
                  onClick={openContactForm}
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
              <Dialog
  open={isContactOpen}
  onClose={closeContactForm}
  fullWidth
  maxWidth="sm"
>
  <ContactForm />
</Dialog>

            </Paper>
          </motion.div>
        </AnimatedSection>
      </Container>
    </Box>
  );
};

export default AboutUsPage;