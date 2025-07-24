import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Paper,
  InputAdornment,
  Fade,
  Slide,
  Zoom,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentUser, useUpdatePassword, useUpdateUser, useVerifyPassword } from '../hooks/useAuth';

const ProfilePage = () => {
  // Use the actual user data from the hook
  const { data: userData, isLoading, error } = useCurrentUser();
  const updateUserMutation = useUpdateUser();
  const verifyPasswordMutation = useVerifyPassword();
  const updatePasswordMutation = useUpdatePassword();

  // Username editing states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  // Password update states
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [oldPasswordVerified, setOldPasswordVerified] = useState(false);
  const [isVerifyingOldPassword, setIsVerifyingOldPassword] = useState(false);

  // Notification states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Validation states
  const [errors, setErrors] = useState({});

  // Initialize username when userData is available
  useEffect(() => {
    if (userData?.username) {
      setNewUsername(userData.username);
    }
  }, [userData]);

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (firstname, lastname) => {
    return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error';
      case 'user': return 'primary';
      case 'moderator': return 'warning';
      default: return 'default';
    }
  };

  // Username update functionality
  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setNewUsername(userData.username);
  };

  const handleUsernameCancel = () => {
    setIsEditingUsername(false);
    setNewUsername(userData.username);
    setErrors(prev => ({ ...prev, username: '' }));
  };

const handleUsernameUpdate = async () => {
  if (!newUsername.trim()) {
    setErrors(prev => ({ ...prev, username: 'Username cannot be empty' }));
    return;
  }

  if (!userData?.id) {
    showNotification('User ID not found', 'error');
    return;
  }

  if (newUsername === userData.username) {
    setIsEditingUsername(false);
    return;
  }

  try {
    await updateUserMutation.mutateAsync({
      userId: userData.id,  
      updateData: {          
        username: newUsername.trim()
      }
    });
    
    setIsEditingUsername(false);
    setErrors(prev => ({ ...prev, username: '' }));
    showNotification('Username updated successfully!', 'success');
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update username';
    setErrors(prev => ({ ...prev, username: errorMessage }));
    showNotification(errorMessage, 'error');
  }
};

  // Password validation
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  // Fixed: Added missing handleOldPasswordChange function
  const handleOldPasswordChange = (e) => {
    const value = e.target.value;
    setPasswordData(prev => ({ ...prev, oldPassword: value }));
    setOldPasswordVerified(false);
    setErrors(prev => ({ ...prev, oldPassword: '' }));
  };

 const verifyOldPassword = async () => {
  if (!passwordData.oldPassword.trim()) {
    showNotification('Please enter your current password', 'error');
    return;
  }

  setIsVerifyingOldPassword(true);
  
  try {
    await verifyPasswordMutation.mutateAsync({
      userId: userData.id,
      oldPassword: passwordData.oldPassword // This will be sent as 'password' to backend
    });
    setOldPasswordVerified(true);
    showNotification('Current password verified', 'success');
  } catch (error) {
    setOldPasswordVerified(false);
    const errorMessage = error.response?.data?.message || 'Incorrect current password';
    showNotification(errorMessage, 'error');
    setErrors(prev => ({ ...prev, oldPassword: errorMessage }));
  } finally {
    setIsVerifyingOldPassword(false);
  }
};


 const handlePasswordUpdate = async () => {
  // Validate new password
  const passwordValidation = validatePassword(passwordData.newPassword);
  if (!passwordValidation.isValid) {
    showNotification('Password must be at least 8 characters with uppercase, lowercase, number, and special character', 'error');
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  try {
    await updatePasswordMutation.mutateAsync({
      userId: userData.id,
      newPassword: passwordData.newPassword // This will be sent as 'password' to backend
    });
    
    showNotification('Password updated successfully!', 'success');
    setPasswordDialog(false);
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setOldPasswordVerified(false);
    setShowPasswords({
      old: false,
      new: false,
      confirm: false
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update password';
    showNotification(errorMessage, 'error');
  }
};

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const resetPasswordDialog = () => {
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setOldPasswordVerified(false);
    setShowPasswords({ old: false, new: false, confirm: false });
    setErrors({});
    setPasswordDialog(false);
  };

  const passwordValidation = validatePassword(passwordData.newPassword);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          Failed to load user data: {error.message}
        </Alert>
      </Box>
    );
  }

  // No user data
  if (!userData) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Alert severity="warning" sx={{ maxWidth: 400 }}>
          No user data available
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100vw',
      background: 'rgb(46, 116, 192)',
      overflowY: 'auto',
      p: 0
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, pt: '50px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h4" component="h1" sx={{ color: 'white', mb: 4, mt: 7, fontWeight: 'bold', textAlign: 'center' }}>
            Profile Dashboard
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Profile Information Card */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <Box sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', p: 3, color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          fontSize: '2rem',
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255,255,255,0.3)'
                        }}
                      >
                        {getInitials(userData.firstname, userData.lastname)}
                      </Avatar>
                    </motion.div>
                    <Box>
                      <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {userData.firstname} {userData.lastname}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {isEditingUsername ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TextField
                              size="small"
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              error={!!errors.username}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  backgroundColor: 'rgba(255,255,255,0.1)',
                                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' }
                                },
                                '& .MuiInputBase-input': { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                              }}
                            />
                            <IconButton 
                              onClick={handleUsernameUpdate} 
                              disabled={updateUserMutation.isPending}
                              sx={{ color: 'white' }}
                            >
                              {updateUserMutation.isPending ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <SaveIcon />}
                            </IconButton>
                            <IconButton onClick={handleUsernameCancel} sx={{ color: 'white' }}>
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                              @{userData.username}
                            </Typography>
                            <IconButton onClick={handleUsernameEdit} sx={{ color: 'white', p: 0.5 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                      {errors.username && (
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>
                          {errors.username}
                        </Typography>
                      )}
                      <Chip 
                        label={userData.role.toUpperCase()} 
                        color={getRoleColor(userData.role)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(45deg, #f3f4f6, #ffffff)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <PersonIcon color="primary" />
                            <Typography variant="h6" component="h3">Personal Info</Typography>
                          </Box>
                          <Typography><strong>First Name:</strong> {userData.firstname}</Typography>
                          <Typography><strong>Last Name:</strong> {userData.lastname}</Typography>
                          <Typography><strong>Username:</strong> {userData.username}</Typography>
                        </Paper>
                      </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(45deg, #f3f4f6, #ffffff)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <EmailIcon color="primary" />
                            <Typography variant="h6" component="h3">Contact</Typography>
                          </Box>
                          <Typography><strong>Email:</strong></Typography>
                          <Typography sx={{ wordBreak: 'break-all', color: 'primary.main' }}>
                            {userData.email}
                          </Typography>
                          <Typography><strong>Role:</strong> {userData.role}</Typography>
                        </Paper>
                      </motion.div>
                    </Grid>

                    <Grid item xs={12}>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                        <Paper sx={{ p: 3, borderRadius: 2, background: 'linear-gradient(45deg, #f3f4f6, #ffffff)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <CalendarIcon color="primary" />
                            <Typography variant="h6" component="h3">Account Timeline</Typography>
                          </Box>
                          <Typography><strong>Account Created:</strong> {formatDate(userData.createdAt)}</Typography>
                          <Typography><strong>Last Updated:</strong> {formatDate(userData.updatedAt)}</Typography>
                          <Typography><strong>User ID:</strong> <code>{userData.id}</code></Typography>
                        </Paper>
                      </motion.div>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Security Settings Card */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                <Box sx={{ background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)', p: 3, color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SecurityIcon />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      Security Settings
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    Keep your account secure by updating your password regularly.
                  </Typography>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<LockIcon />}
                      onClick={() => setPasswordDialog(true)}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        borderRadius: 2,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1.1rem'
                      }}
                    >
                      Update Password
                    </Button>
                  </motion.div>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>Security Tips</Typography>
                  <Box sx={{ '& > *': { mb: 1 } }}>
                    <Typography variant="body2" color="text.secondary">
                      • Use a strong, unique password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Include uppercase, lowercase, numbers, and symbols
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Avoid using personal information
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Update password regularly
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Password Update Dialog */}
        <Dialog
          open={passwordDialog}
          onClose={resetPasswordDialog}
          maxWidth="sm"
          fullWidth
          TransitionComponent={Slide}
          TransitionProps={{ direction: "up" }}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LockIcon color="primary" />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Update Password
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 2 }}>
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Current Password */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type={showPasswords.old ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={handleOldPasswordChange}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    disabled={oldPasswordVerified}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => togglePasswordVisibility('old')}>
                            {showPasswords.old ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                          {oldPasswordVerified && (
                            <CheckIcon sx={{ color: 'success.main', ml: 1 }} />
                          )}
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                  />
                  
                  {!oldPasswordVerified && passwordData.oldPassword && (
                    <Button
                      variant="outlined"
                      onClick={verifyOldPassword}
                      disabled={isVerifyingOldPassword}
                      sx={{ textTransform: 'none' }}
                    >
                      {isVerifyingOldPassword ? 'Verifying...' : 'Verify Current Password'}
                    </Button>
                  )}
                </Box>

                {/* New Password Fields */}
                <Fade in={oldPasswordVerified}>
                  <Box>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      disabled={!oldPasswordVerified}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => togglePasswordVisibility('new')}>
                              {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ mb: 2 }}
                    />

                    {/* Password Strength Indicator */}
                    {passwordData.newPassword && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>Password Strength:</Typography>
                        <Grid container spacing={1}>
                          {[
                            { key: 'minLength', label: '8+ characters' },
                            { key: 'hasUpper', label: 'Uppercase' },
                            { key: 'hasLower', label: 'Lowercase' },
                            { key: 'hasNumber', label: 'Number' },
                            { key: 'hasSpecial', label: 'Special char' }
                          ].map(({ key, label }) => (
                            <Grid item key={key}>
                              <Chip
                                label={label}
                                size="small"
                                color={passwordValidation[key] ? 'success' : 'default'}
                                icon={passwordValidation[key] ? <CheckIcon /> : <CloseIcon />}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      disabled={!oldPasswordVerified}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                              {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Box>
                </Fade>
              </motion.div>
            </AnimatePresence>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={resetPasswordDialog} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handlePasswordUpdate}
                variant="contained"
                disabled={!oldPasswordVerified || !passwordData.newPassword || !passwordData.confirmPassword || updatePasswordMutation.isPending}
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  px: 3
                }}
              >
                {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          TransitionComponent={Zoom}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ProfilePage;