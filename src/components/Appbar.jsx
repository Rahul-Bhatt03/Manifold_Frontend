import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  People,
  Business,
  Engineering,
  Work,
  Search,
  Menu as MenuIcon,
  Close,
  ExpandLess,
  ExpandMore,
  Person,
  Logout,
  Settings,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Appbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);

  // Logo image URL - you can replace this with your actual logo
  const logoImageUrl = "https://via.placeholder.com/50x50/ff4444/ffffff?text=MC";

  const navigationItems = [
    {
      label: 'PEOPLE',
      icon: <People />,
      dropdown: [
        { title: 'Leadership Team', description: 'Meet our executive leadership', route: 'leadership' },
        { title: 'Our Culture', description: 'Values that drive us forward', route: 'culture' },
        { title: 'Diversity & Inclusion', description: 'Building inclusive workplaces', route: 'diversity' },
        { title: 'Safety First', description: 'Commitment to zero incidents', route: 'safety' }
      ]
    },
    {
      label: 'PROJECTS',
      icon: <Business />,
      dropdown: [
        { title: 'Energy', description: 'Power generation and distribution', route: 'energy' },
        { title: 'Infrastructure', description: 'Transportation and utilities', route: 'infrastructure' },
        { title: 'Manufacturing', description: 'Industrial facilities', route: 'manufacturing' },
        { title: 'Mining', description: 'Resource extraction projects', route: 'mining' },
        { title: 'Nuclear Power', description: 'Clean energy solutions', route: 'nuclear' },
        { title: 'Environmental', description: 'Cleanup and restoration', route: 'environmental' }
      ]
    },
    {
      label: 'APPROACH',
      icon: <Engineering />,
      dropdown: [
        { title: 'Innovation', description: 'Cutting-edge solutions', route: 'innovation' },
        { title: 'Sustainability', description: 'Environmental responsibility', route: 'sustainability' },
        { title: 'Technology', description: 'Digital transformation', route: 'technology' },
        { title: 'Quality Assurance', description: 'Excellence in delivery', route: 'quality' }
      ]
    },
    {
      label: 'CAREERS',
      icon: <Work />,
      dropdown: [
        { title: 'Open Positions', description: 'Join our growing team', route: 'positions' },
        { title: 'Internships', description: 'Start your career with us', route: 'internships' },
        { title: 'Benefits', description: 'Comprehensive packages', route: 'benefits' },
        { title: 'Training', description: 'Professional development', route: 'training' }
      ]
    }
  ];

  const profileMenuItems = [
    { label: 'Dashboard', icon: <Dashboard />, route: 'dashboard' },
    { label: 'Profile', icon: <Person />, route: 'profile' },
    { label: 'Settings', icon: <Settings />, route: 'settings' },
    { label: 'Logout', icon: <Logout />, route: 'logout' }
  ];

  const handleNavigation = (route) => {
    setHoveredItem(null);
    setMobileMenuOpen(false);
    setExpandedMobileItem(null);
    navigate(`/${route}`);
  };

  const handleProfileMenuClick = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleProfileMenuItemClick = (route) => {
    handleProfileMenuClose();
    setMobileMenuOpen(false);
    if (route === 'logout') {
      // Handle logout logic here
      console.log('Logging out...');
    } else {
      navigate(`/${route}`);
    }
  };

  const toggleMobileMenuItem = (itemLabel) => {
    setExpandedMobileItem(expandedMobileItem === itemLabel ? null : itemLabel);
  };

  // Desktop Navigation with hover dropdowns
  const DesktopNavigation = () => (
    <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0, position: 'relative' }}>
      {navigationItems.map((item) => (
        <Box
          key={item.label}
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
          sx={{ position: 'relative' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              sx={{
                color: 'white',
                px: 3,
                py: 2,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'none',
                borderRadius: 0,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: hoveredItem === item.label ? '80%' : '0%',
                  height: '2px',
                  background: 'linear-gradient(45deg, #ff4444, #cc0000)',
                  transition: 'width 0.3s ease'
                }
              }}
            >
              {item.label}
            </Button>
          </motion.div>

          {/* Desktop Dropdown Menu */}
          <AnimatePresence>
            {hoveredItem === item.label && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  minWidth: '320px'
                }}
              >
                <Box
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    mt: 1
                  }}
                >
                  {item.dropdown.map((dropdownItem, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ backgroundColor: 'rgba(255,68,68,0.1)' }}
                      onClick={() => handleNavigation(dropdownItem.route)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ p: 2, borderBottom: idx < item.dropdown.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: '#333',
                            mb: 0.5
                          }}
                        >
                          {dropdownItem.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            fontSize: '0.85rem'
                          }}
                        >
                          {dropdownItem.description}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      ))}
    </Box>
  );

  // Mobile Navigation Drawer - Full navigation for small screens
  const MobileNavigationDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        display: { xs: 'block', lg: 'none' },
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Manifold Consult
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <List>
        {navigationItems.map((item) => (
          <Box key={item.label}>
            <ListItem
              button
              onClick={() => toggleMobileMenuItem(item.label)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,68,68,0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
              {expandedMobileItem === item.label ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            
            <Collapse in={expandedMobileItem === item.label} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.dropdown.map((dropdownItem, idx) => (
                  <ListItem
                    key={idx}
                    button
                    onClick={() => handleNavigation(dropdownItem.route)}
                    sx={{
                      pl: 4,
                      '&:hover': {
                        backgroundColor: 'rgba(255,68,68,0.2)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={dropdownItem.title}
                      secondary={dropdownItem.description}
                      secondaryTypographyProps={{
                        sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 2 }} />
        
        {/* Profile options in mobile */}
        {profileMenuItems.map((item) => (
          <ListItem
            key={item.label}
            button
            onClick={() => handleProfileMenuItemClick(item.route)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,68,68,0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  // Desktop Profile Menu Drawer - Only profile options for large screens
  const DesktopProfileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        display: { xs: 'none', lg: 'block' },
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Account Menu
        </Typography>
        <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <List>
        {profileMenuItems.map((item) => (
          <ListItem
            key={item.label}
            button
            onClick={() => handleProfileMenuItemClick(item.route)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,68,68,0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="absolute" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          zIndex: 10
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            py: 2
          }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleNavigation('home')}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #ff4444, #cc0000)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={logoImageUrl}
                    alt="Manifold Consult Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      display: 'none'
                    }}
                  >
                    MC
                  </Typography>
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Manifold Consult
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Navigation - Show navigation links */}
            <DesktopNavigation />

            {/* Right Side Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton sx={{ color: 'white' }}>
                <Search />
              </IconButton>
              
              {/* Profile Avatar for Desktop - Click to open profile dropdown */}
              <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <IconButton
                  onClick={handleProfileMenuClick}
                  sx={{ color: 'white' }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff4444' }}>
                    <Person />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileMenuAnchor}
                  open={Boolean(profileMenuAnchor)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      mt: 1,
                      minWidth: 200
                    }
                  }}
                >
                  {profileMenuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      onClick={() => handleProfileMenuItemClick(item.route)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255,68,68,0.1)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#333' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
                </Menu>
              </Box>

              {/* Hamburger Menu Button */}
              <IconButton
                sx={{ 
                  color: 'white',
                  display: { xs: 'block', lg: 'none' }
                }}
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer - Full menu for small screens */}
      <MobileNavigationDrawer />
    </>
  );
};

export default Appbar;