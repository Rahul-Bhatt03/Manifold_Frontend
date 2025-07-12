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
  Menu as MenuIcon,
  Close,
  ExpandLess,
  ExpandMore,
  Person,
  Logout,
  Settings,
  Dashboard,
  Group,
  MiscellaneousServices,
  Info,
  Article,
  Water,
  PowerSettingsNew,
  DirectionsRailway,
  Landscape,
  ElectricalServices,
  Mail
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/MANIFOLD_LOGO_BANNER_BLACK_3.jpg'; 

const Appbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);

  // Check for accessToken in localStorage
const isLoggedIn = !!localStorage.getItem('authToken');

let userData = {};
try {
  const userDataString = localStorage.getItem('userData');
  if (userDataString) {
    userData = JSON.parse(userDataString);
  }
} catch (error) {
  console.error('Error parsing user data:', error);
}
const isAdmin = userData?.role === 'admin';

  // Updated categories for projects
  const projectCategories = [
    { 
      title: 'Ground Water', 
      description: 'Water resource management and exploration',
      route: 'projects/category/ground-water', 
      icon: <Water />
    },
    { 
      title: 'Hydropower', 
      description: 'Renewable energy generation projects',
      route: 'projects/category/hydropower', 
      icon: <PowerSettingsNew />
    },
    { 
      title: 'Roads/Railways/Airport', 
      description: 'Transportation infrastructure development',
      route: 'projects/category/roads-railways-airport', 
      icon: <DirectionsRailway />
    },
    { 
      title: 'Slope Stability/Landslide', 
      description: 'Geological risk assessment and mitigation',
      route: 'projects/category/slope-stability-landslide', 
      icon: <Landscape />
    },
    { 
      title: 'Substation/Transmission Line', 
      description: 'Electrical infrastructure projects',
      route: 'projects/category/substation-transmission-line', 
      icon: <ElectricalServices />
    }
  ];

  const navigationItems = [
    {
      label: 'TEAM',
      icon: <Group />,
      route: 'team',
      dropdown: [
        // { title: 'Leadership Team', description: 'Meet our executive leadership', route: 'team/leadership' },
        // { title: 'Our Culture', description: 'Values that drive us forward', route: 'team/culture' },
        // { title: 'Diversity & Inclusion', description: 'Building inclusive workplaces', route: 'team/diversity' },
        // { title: 'Safety First', description: 'Commitment to zero incidents', route: 'team/safety' }
      ]
    },
    {
      label: 'PROJECTS',
      icon: <Business />,
      route: 'projects',
      dropdown: projectCategories
    },
  {
  label: 'SERVICES',
  icon: <MiscellaneousServices />,
  route: 'services',
  dropdown: [
      { 
        title: 'Engineering Geology', 
        description: 'Engineering site investigations', 
        route: 'services/category/engineering-geology',
        icon: <Engineering />
      },
      { 
        title: 'Environment Study', 
        description: 'Environmental impact assessment', 
        route: 'services/category/environment-study',
        icon: <Landscape />
      },
      { 
        title: 'General Geology', 
        description: 'Geological mapping and surveys', 
        route: 'services/category/general-geology',
        icon: <Landscape />
      },
      { 
        title: 'Geophysical Investigation', 
        description: 'Subsurface exploration', 
        route: 'services/category/geophysical-investigation',
        icon: <Water />
      },
      { 
        title: 'Geotechnical Investigation', 
        description: 'Soil and rock mechanics', 
        route: 'services/category/geotechnical-investigation',
        icon: <Engineering />
      }
  ]
}
,
    {
      label: 'ABOUT US',
      icon: <Info />,
      route: 'about',
      dropdown: [
      { 
        title: 'Equipments & Facilities', 
        description: 'facilated with all latest equipments', 
        route: 'about/equipment',
        icon: <Work />
      },
      { 
        title: 'Gallery', 
        description: 'Available opportunities', 
        route: 'about/gallery',
        icon: <Article />
      },
      // { 
      //   title: 'Benefits', 
      //   description: 'Comprehensive packages', 
      //   route: 'about/benefits',
      //   icon: <People />
      // },
      { 
        title: 'Blog', 
        description: 'Latest insights and news', 
        route: 'about/blogs',
        icon: <Article />
      }
      ]
    }
  ];

  const profileMenuItems = [
    // { label: 'Dashboard', icon: <Dashboard />, route: 'dashboard' },
    { label: 'Profile', icon: <Person />, route: 'profile' },
  ...(isAdmin? [ { label: 'Mails', icon: <Mail />, route: 'contactList' }]:[]),
    { label: 'Logout', icon: <Logout />, route: 'logout' }
  ];

  const handleNavigation = (route) => {
    setHoveredItem(null);
    setMobileMenuOpen(false);
    setExpandedMobileItem(null);
    navigate(`/${route}`);
  };

  const handleMainNavClick = (item) => {
    // Navigate to main page when clicking on the main nav item
    navigate(`/${item.route}`);
  };

  // Fixed dropdown item click handler
  const handleDropdownItemClick = (e, route) => {
    e.stopPropagation(); // Prevent event bubbling
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/login');
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
              onClick={() => handleMainNavClick(item)}
              sx={{
                color: '#e0e0e0',
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
                      onClick={(e) => handleDropdownItemClick(e, dropdownItem.route)} // Fixed click handler
                      style={{ cursor: 'pointer' }}
                    >
                      <Box sx={{ 
                        p: 2, 
                        borderBottom: idx < item.dropdown.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}>
                        {dropdownItem.icon && (
                          <Box sx={{ color: '#ff4444' }}>
                            {dropdownItem.icon}
                          </Box>
                        )}
                        <Box>
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
              <ListItemText 
                primary={item.label}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation(item.route);
                }}
                sx={{ cursor: 'pointer' }}
              />
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
                    <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                      {dropdownItem.icon}
                    </ListItemIcon>
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
        {isLoggedIn ? (
          profileMenuItems.map((item) => (
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
          ))
        ) : (
          <ListItem
            button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/login');
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,68,68,0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Sign In" />
          </ListItem>
        )}
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
          zIndex: theme.zIndex.drawer + 1,
          transition: 'all 0.3s ease',
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
                onClick={() => navigate('/')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <img 
                    src={logo}
                    alt="Company Logo"
                    style={{ 
                      height: '40px',
                      width: 'auto', 
                      objectFit: 'contain'
                    }}
                  />
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
              {/* Conditional rendering based on login status */}
              {isLoggedIn ? (
                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                  <IconButton
                    onClick={handleProfileMenuClick}
                    sx={{ color: '#ff4444' }}
                  >
                    <Avatar sx={{ 
                      width: 32, 
                      height: 32, 
                      background: 'linear-gradient(45deg, #ff4444, #cc0000)',
                      color: 'white'
                    }}>
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
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: '#ff4444',
                      backgroundColor: 'rgba(255, 68, 68, 0.1)'
                    }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              )}

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