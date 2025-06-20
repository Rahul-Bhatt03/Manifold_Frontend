import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Avatar,
  Divider,
  Chip,
  styled
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowForwardIcon,
  Article as ArticleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useGetAllBlogs, useUserData } from '../../hooks/useBlogs';
import AddBlogModal from './AddBlogModal';
import blogBanner  from '../../assets/pexels-sevenstormphotography-439416.jpg';


const HeroBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(4, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6, 0)
  }
}));

const BlogCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.shadows[8]
  }
}));

const BlogListPage = ({ onBlogClick }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: blogsData, isLoading, error } = useGetAllBlogs();
  const userData = useUserData();

  const isAdmin = userData && userData.role === 'admin';
  const blogs = blogsData?.blogs || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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
              Error loading blogs
            </Typography>
            <Typography color="textSecondary" paragraph>
              {error.message}
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Banner - Full Width */}
      <Box
        sx={{
          width: '100vw',
          height: '60vh',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          overflow: 'hidden',
        }}
      >
        <img
          src={blogBanner}
          alt="Construction Blog"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Typography variant="h2" component="h1" color="white" fontWeight="bold">
            Construction Blog
          </Typography>
          <Typography variant="h5" color="rgba(255,255,255,0.9)">
            Latest insights and updates from our construction projects
          </Typography>
        </Box>
      </Box>
    <Box 
      minHeight="100vh" 
      sx={{
        background: 'linear-gradient(to bottom right, #e3f2fd, #f3e5f5)'
      }}
    >
      <HeroBox>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
    
            
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    background: 'linear-gradient(to right, #1976d2, #9c27b0)',
                    boxShadow: 3,
                    '&:hover': {
                      boxShadow: 6,
                      background: 'linear-gradient(to right, #1565c0, #7b1fa2)'
                    }
                  }}
                >
                  Add Blog Post
                </Button>
              </motion.div>
            )}
          </Box>
        </Container>
      </HeroBox>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '64px 0' }}
          >
            <ArticleIcon sx={{ fontSize: 96, color: 'grey.400', mb: 3 }} />
            <Typography variant="h4" color="textSecondary" gutterBottom>
              No Blog Posts Yet
            </Typography>
            <Typography color="textSecondary">
              {isAdmin ? 'Click the "Add Blog Post" button to create your first post.' : 'Check back later for updates!'}
            </Typography>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {blogs.map((blog, index) => (
              <Grid item xs={12} sm={6} md={4} key={blog._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <BlogCard onClick={() => onBlogClick && onBlogClick(blog._id)}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        position: 'relative',
                        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
                        overflow: 'hidden'
                      }}
                    >
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s'
                          }}
                        />
                      ) : (
                        <Box 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center" 
                          height="100%"
                        >
                          <ArticleIcon sx={{ fontSize: 64, color: 'common.white' }} />
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)'
                        }}
                      />
                    </CardMedia>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary" mr={2}>
                          {blog.author}
                        </Typography>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(blog.createdAt)}
                        </Typography>
                      </Box>

                      <Typography gutterBottom variant="h5" component="h2" noWrap>
                        {blog.title}
                      </Typography>

                      <Typography variant="body2" color="textSecondary" paragraph sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {truncateContent(blog.content)}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                      >
                        Read More
                      </Button>
                    </CardActions>
                  </BlogCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <AddBlogModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </Box>
     </Box>
  );
};

export default BlogListPage;