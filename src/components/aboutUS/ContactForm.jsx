import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Fade,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  Subject,
  Message,
  Send,
} from '@mui/icons-material';
import { useCreateContact } from '../../hooks/useContacts';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const createContactMutation = useCreateContact();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 5000) {
      newErrors.message = 'Message must not exceed 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await createContactMutation.mutateAsync(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23667eea' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        py: 8,
        px: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(118, 75, 162, 0.04) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ mt: 2, mb: 4, position: 'relative', zIndex: 1 }}>
        <Fade in timeout={600}>
          <Paper 
            elevation={24} 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 20,
                right: 20,
                width: 100,
                height: 100,
                background: `
                  url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23667eea' fill-opacity='0.1'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E")
                `,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                opacity: 0.1,
              }
            }}
          >
            <Box textAlign="center" mb={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 53%, 80%, 100%': {
                      transform: 'translate3d(0,0,0)',
                    },
                    '40%, 43%': {
                      transform: 'translate3d(0, -15px, 0)',
                    },
                    '70%': {
                      transform: 'translate3d(0, -8px, 0)',
                    },
                    '90%': {
                      transform: 'translate3d(0, -2px, 0)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    fontSize: '2.5rem',
                    color: 'white',
                  }}
                >
                  📮
                </Box>
              </Box>
            </Box>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Send us a Message
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Drop us a line! We'd love to hear from you and will get back to you as soon as possible.
            </Typography>
            <Divider sx={{ width: '60px', height: '3px', mx: 'auto', bgcolor: 'primary.main' }} />
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  },
                }}
              />

              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  },
                }}
              />

              <TextField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.subject)}
                helperText={errors.subject}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Subject color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  },
                }}
              />

              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                multiline
                rows={6}
                error={Boolean(errors.message)}
                helperText={errors.message || `${formData.message.length}/5000`}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <Message color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  },
                }}
              />

              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createContactMutation.isPending}
                  fullWidth
                  size="large"
                  startIcon={createContactMutation.isPending ? null : <Send />}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #a0aec0 30%, #718096 90%)',
                    },
                  }}
                >
                  {createContactMutation.isPending ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Container>
    </Box>
  );
};

export default ContactForm;