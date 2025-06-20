import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Avatar,
  Divider,
  Container,
  Chip,
  CircularProgress,
  styled
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Error as ErrorIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import { useGetBlogById, useUserData } from '../../hooks/useBlogs';

const ArticlePaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[6]
}));

const BlogDetailPage = ({ blogId, onBackClick }) => {
  const { data: blog, isLoading, error } = useGetBlogById(blogId);
  const userData = useUserData();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <Typography key={index} paragraph color="textPrimary" sx={{ lineHeight: 1.8 }}>
          {paragraph}
        </Typography>
      ) : null
    ));
  };

  if (isLoading) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(to bottom right, #e3f2fd, #f3e5f5)'
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={64} thickness={4} color="primary" />
        </motion.div>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(to bottom right, #e3f2fd, #f3e5f5)'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500 }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <ErrorIcon color="error" sx={{ fontSize: 48 }} />
            <Typography variant="h5" color="error" gutterBottom>
              Error loading blog
            </Typography>
            <Typography color="textSecondary" paragraph>
              {error.message}
            </Typography>
            <Button
              onClick={onBackClick}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(to bottom right, #e3f2fd, #f3e5f5)'
        }}
      >
        <Box textAlign="center">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Blog not found
          </Typography>
          <Button
            onClick={onBackClick}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Go Back to Blogs
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      minHeight="100vh" 
      sx={{
        background: 'linear-gradient(to bottom right, #e3f2fd, #f3e5f5)'
      }}
    >
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Container maxWidth="lg">
          <Box py={3}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -5 }}
            >
              <Button
                onClick={onBackClick}
                color="primary"
                startIcon={<ArrowBackIcon />}
                sx={{ fontWeight: 'bold' }}
              >
                Back to Blogs
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ArticlePaper>
            {blog.image && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Box
                  sx={{
                    height: { xs: 256, sm: 320, md: 384 },
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                    }}
                  />
                </Box>
              </motion.div>

            )}

            <Box p={{ xs: 3, sm: 4, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Box mb={4}>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    fontWeight="bold" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                  >
                    {blog.title}
                  </Typography>

                  <Box display="flex" flexWrap="wrap" alignItems="center" gap={3} mb={4}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        mr: 2,
                        background: 'linear-gradient(to right, #1976d2, #9c27b0)'
                      }}>
                        <PersonIcon />
                      </Avatar>
                      <Box>
                        <Typography fontWeight="medium">{blog.author}</Typography>
                        <Typography variant="body2" color="textSecondary">Author</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" color="text.secondary">
                      <CalendarIcon sx={{ mr: 1 }} />
                      <Typography>{formatDate(blog.createdAt)}</Typography>
                    </Box>
                  </Box>

                  <Divider 
                    sx={{ 
                      width: 96, 
                      height: 4, 
                      bgcolor: 'primary.main', 
                      mb: 4,
                      background: 'linear-gradient(to right, #1976d2, #9c27b0)'
                    }} 
                  />
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Box sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {formatContent(blog.content)}
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Divider sx={{ my: 4 }} />
                <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                  <Box mb={{ xs: 2, sm: 0 }}>
                    <Typography color="textSecondary">
                      Published on {formatDate(blog.createdAt)}
                    </Typography>
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <Typography variant="body2" color="textSecondary">
                        Last updated: {formatDate(blog.updatedAt)}
                      </Typography>
                    )}
                  </Box>

                  <Box display="flex" gap={2}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<FavoriteIcon />}
                      sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}
                    >
                      Like
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      startIcon={<ShareIcon />}
                      sx={{ bgcolor: 'grey.100', color: 'grey.800' }}
                    >
                      Share
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </ArticlePaper>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            sx={{ mt: 6 }}
          >
            <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
              Related Articles
            </Typography>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <ArticleIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
              <Typography color="textSecondary">
                More related articles coming soon...
              </Typography>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
};

export default BlogDetailPage;