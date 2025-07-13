import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tab,
  Tabs,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Container,
  Paper,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Business,
  Engineering,
  Construction
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// Move form components outside to prevent recreation on every render
const LoginForm = ({ 
  loginData, 
  handleLoginChange, 
  handleLoginSubmit, 
  isLoggingIn, 
  showPassword, 
  setShowPassword,
  validateEmail 
}) => (
  <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 2 }}>
    <TextField
      fullWidth
      label="Email Address"
      type="email"
      value={loginData.email}
      onChange={handleLoginChange('email')}
      margin="normal"
      required
      error={loginData.email && !validateEmail(loginData.email)}
      helperText={loginData.email && !validateEmail(loginData.email) ? 'Invalid email format' : ''}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email sx={{ color: '#ff6b35' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': { borderColor: '#ff6b35' },
          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
      }}
    />
    <TextField
      fullWidth
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={loginData.password}
      onChange={handleLoginChange('password')}
      margin="normal"
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock sx={{ color: '#ff6b35' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': { borderColor: '#ff6b35' },
          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
      }}
    />
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={isLoggingIn}
      sx={{
        mt: 3,
        mb: 2,
        py: 1.5,
        backgroundColor: '#ff6b35',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#e55a2b',
        },
        '&:disabled': {
          backgroundColor: '#ccc',
        },
      }}
    >
      {isLoggingIn ? 'Signing In...' : 'Sign In'}
    </Button>
  </Box>
);

const RegisterForm = ({ 
  registerData, 
  handleRegisterChange, 
  handleRegisterSubmit, 
  isRegistering, 
  showPassword, 
  setShowPassword,
  validateEmail,
  validatePassword 
}) => (
  <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 2 }}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={registerData.firstname}
          onChange={handleRegisterChange('firstname')}
          required
          error={!registerData.firstname}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person sx={{ color: '#ff6b35' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#ff6b35' },
              '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          value={registerData.lastname}
          onChange={handleRegisterChange('lastname')}
          required
          error={!registerData.lastname}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#ff6b35' },
              '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
          }}
        />
      </Grid>
    </Grid>
    <TextField
      fullWidth
      label="Username"
      value={registerData.username}
      onChange={handleRegisterChange('username')}
      margin="normal"
      required
      error={!registerData.username}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Business sx={{ color: '#ff6b35' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': { borderColor: '#ff6b35' },
          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
      }}
    />
    <TextField
      fullWidth
      label="Email Address"
      type="email"
      value={registerData.email}
      onChange={handleRegisterChange('email')}
      margin="normal"
      required
      error={registerData.email && !validateEmail(registerData.email)}
      helperText={registerData.email && !validateEmail(registerData.email) ? 'Invalid email format' : ''}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email sx={{ color: '#ff6b35' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': { borderColor: '#ff6b35' },
          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
      }}
    />
    <TextField
      fullWidth
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={registerData.password}
      onChange={handleRegisterChange('password')}
      margin="normal"
      required
      error={registerData.password && !validatePassword(registerData.password)}
      helperText={registerData.password && !validatePassword(registerData.password) ? 'Password must be at least 8 characters' : ''}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock sx={{ color: '#ff6b35' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': { borderColor: '#ff6b35' },
          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
      }}
    />
    <TextField
      fullWidth
      label="Confirm Password"
      type={showPassword ? 'text' : 'password'}
      value={registerData.confirmPassword}
      onChange={handleRegisterChange('confirmPassword')}
      margin="normal"
      required
      error={registerData.confirmPassword && registerData.password !== registerData.confirmPassword}
      helperText={registerData.confirmPassword && registerData.password !== registerData.confirmPassword ? 'Passwords do not match' : ''}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': { borderColor: '#ff6b35' },
          '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
        },
        '& .MuiInputLabel-root.Mui-focused': { color: '#ff6b35' },
      }}
    />
    <Button
      type="submit"
      fullWidth
      variant="contained"
      disabled={isRegistering}
      sx={{
        mt: 3,
        mb: 2,
        py: 1.5,
        backgroundColor: '#ff6b35',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#e55a2b',
        },
        '&:disabled': {
          backgroundColor: '#ccc',
        },
      }}
    >
      {isRegistering ? 'Creating Account...' : 'Create Account'}
    </Button>
  </Box>
);

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  
  const { register, login, isRegistering, isLoggingIn, currentUser } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin' // Default role for registration
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setAlert({ show: false, message: '', type: 'success' });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing alerts
    setAlert({ show: false, message: '', type: 'success' });
    
    if (!validateEmail(loginData.email)) {
      setAlert({ show: true, message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    
    if (!loginData.password) {
      setAlert({ show: true, message: 'Please enter your password', type: 'error' });
      return;
    }
    
    try {
      await login(loginData);
      // Success message will be handled by navigation
    } catch (error) {
      setAlert({ 
        show: true, 
        message: error.response?.data?.message || error.message || 'Login failed. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing alerts
    setAlert({ show: false, message: '', type: 'success' });
    
    if (!registerData.firstname || !registerData.lastname) {
      setAlert({ show: true, message: 'Please enter your full name', type: 'error' });
      return;
    }
    
    if (!registerData.username) {
      setAlert({ show: true, message: 'Please choose a username', type: 'error' });
      return;
    }
    
    if (!validateEmail(registerData.email)) {
      setAlert({ show: true, message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    
    if (!validatePassword(registerData.password)) {
      setAlert({ show: true, message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setAlert({ show: true, message: 'Passwords do not match!', type: 'error' });
      return;
    }
    
    try {
      const { confirmPassword, ...submitData } = registerData;
      await register(submitData);
      // Success message will be handled by navigation
      // Only show success if we reach this point without errors
      setAlert({ show: true, message: 'Registration successful! Redirecting...', type: 'success' });
    } catch (error) {
      setAlert({ 
        show: true, 
        message: error.response?.data?.message || error.message || 'Registration failed. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleLoginChange = (field) => (e) => {
    setLoginData({ ...loginData, [field]: e.target.value });
  };

  const handleRegisterChange = (field) => (e) => {
    setRegisterData({ ...registerData, [field]: e.target.value });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={20}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%)',
              color: 'white',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                opacity: 0.1,
              }}
            >
              <Construction sx={{ fontSize: 100 }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Manifold Consult
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Construction Management System
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {/* Alert */}
            {alert.show && (
              <Alert
                severity={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
                sx={{ mb: 3 }}
              >
                {alert.message}
              </Alert>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    minWidth: 120,
                  },
                  '& .Mui-selected': {
                    color: '#ff6b35 !important',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#ff6b35',
                    height: 3,
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Register" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            {activeTab === 0 && (
              <LoginForm
                loginData={loginData}
                handleLoginChange={handleLoginChange}
                handleLoginSubmit={handleLoginSubmit}
                isLoggingIn={isLoggingIn}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                validateEmail={validateEmail}
              />
            )}
            {activeTab === 1 && (
              <RegisterForm
                registerData={registerData}
                handleRegisterChange={handleRegisterChange}
                handleRegisterSubmit={handleRegisterSubmit}
                isRegistering={isRegistering}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                validateEmail={validateEmail}
                validatePassword={validatePassword}
              />
            )}

            {/* Footer */}
            <Divider sx={{ my: 3 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              © {new Date().getFullYear()} Manifold Consult Construction Management System
            </Typography>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;