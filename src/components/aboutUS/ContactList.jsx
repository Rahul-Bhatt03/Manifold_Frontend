// ContactList.jsx (Enhanced MUI version)
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Box,
  Pagination,
  Stack,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  alpha,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Subject as SubjectIcon,
} from '@mui/icons-material';
import { useContacts, useDeleteContact } from '../../hooks/useContacts';

const ContactList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = useContacts(page, limit);
  const deleteContactMutation = useDeleteContact();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContactMutation.mutateAsync(id);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to generate color based on name
  const getAvatarColor = (name) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <Box>
        {/* Banner */}
        <Box
          sx={{
            height: '50vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/banner-image.jpg)', // Replace with your banner image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.8,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
              Loading Contacts...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        {/* Banner */}
        <Box
          sx={{
            height: '50vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/banner-image.jpg)', // Replace with your banner image
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.8,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              Contact Management
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Manage all your contact submissions
            </Typography>
          </Box>
        </Box>

        {/* Error Content */}
        <Box maxWidth="lg" mx="auto" p={3}>
          <Card 
            sx={{ 
              textAlign: 'center', 
              py: 5,
              background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
              border: '1px solid #f8bbd9'
            }}
          >
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom>
                Error loading contacts: {error.message}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => window.location.reload()} 
                sx={{ 
                  mt: 2,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                }}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  const contacts = data?.data?.contacts || [];
  const pagination = data?.data?.pagination || {};

  return (
    <Box>
      {/* Banner Section */}
      <Box
        sx={{
          height: '50vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/public/Fast-track.jpg)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8,
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            color: 'white',
            maxWidth: '800px',
            px: 3,
          }}
        >
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Contact Management
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              opacity: 0.9,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Manage and organize all your contact submissions
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box maxWidth="lg" mx="auto" p={3} sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        <Card 
          sx={{ 
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, pb: 2 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Contact Submissions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>

            <Divider />

            {contacts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No contact submissions found.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Contact submissions will appear here when available.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: 'linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)',
                        '& .MuiTableCell-root': {
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          color: 'text.primary',
                          borderBottom: '2px solid #dee2e6',
                        }
                      }}
                    >
                      <TableCell>Contact</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contacts.map((contact, index) => (
                      <TableRow 
                        key={contact.id} 
                        hover
                        sx={{
                          '&:hover': {
                            background: alpha('#667eea', 0.04),
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          },
                          transition: 'all 0.2s ease',
                          '&:nth-of-type(odd)': {
                            backgroundColor: alpha('#f8f9fa', 0.5),
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: getAvatarColor(contact.name),
                                width: 45,
                                height: 45,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {getInitials(contact.name)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                {contact.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {contact.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SubjectIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {contact.subject}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="New"
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete Contact">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(contact.id)}
                              disabled={deleteContactMutation.isPending}
                              sx={{
                                '&:hover': {
                                  background: alpha('#f44336', 0.1),
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {deleteContactMutation.isPending ? (
                                <CircularProgress size={20} />
                              ) : (
                                <DeleteIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ p: 3, pt: 2 }}>
                <Stack spacing={2} alignItems="center">
                  <Pagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontWeight: 'bold',
                        '&.Mui-selected': {
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          color: 'white',
                        },
                      },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} contacts
                  </Typography>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ContactList;