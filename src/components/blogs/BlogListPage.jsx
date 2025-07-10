import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Avatar,
  Chip,
  styled,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  Error as ErrorIcon,
  BookmarkBorder as BookmarkIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useGetAllBlogs, useUserData } from '../../hooks/useBlogs';
import AddBlogModal from './AddBlogModal';
import blogBanner from '../../assets/pexels-sevenstormphotography-439416.jpg';

// ADDED: Poppins font import for entire page
const PageWrapper = styled(Box)({
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  '& *': {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif !important',
  }
});

// Styled Components - Updated to match ServiceCard styling
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100vw',
  height: '70vh',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.6) 100%)',
    zIndex: 1,
  }
}));

const HeroImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
});

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  color: 'white',
  maxWidth: '800px',
  padding: theme.spacing(0, 3),
}));

// UPDATED: BlogCard to match ProjectCard consistency - FIXED HEIGHT 600px
const BlogCard = styled(Card)(({ theme }) => ({
  height: '500px', // Same as ProjectCard
  width: '100%',
  maxWidth: '400px', // Same as ProjectCard
  minWidth: '280px', // Same as ProjectCard
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '350px',
    minWidth: '320px',
    height: '530px', // Slightly smaller on mobile, same as ProjectCard
  },
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    '& .blog-image': {
      transform: 'scale(1.1)',
    },
    '& .blog-overlay': {
      opacity: 1,
    },
    '& .blog-arrow': {
      transform: 'translateX(8px)',
    }
  },
}));

// UPDATED: BlogImage to match ProjectCard dimensions - FIXED HEIGHT 220px
const BlogImage = styled(CardMedia)(({ theme }) => ({
  height: '220px', // Same as ProjectCard
  width: '400px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0,
  [theme.breakpoints.down('sm')]: {
    height: '200px', // Same as ProjectCard mobile
  },
}));

const BlogOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.8) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

// UPDATED: BlogTitle to match ProjectCard - EXACTLY 1 LINE
const BlogTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  lineHeight: '1.3',
  color: theme.palette.grey[800],
  display: '-webkit-box',
  WebkitLineClamp: 1, // Changed to 1 line like ProjectCard
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '1.43rem', // Exact height for 1 line
  marginBottom: '8px',
  wordBreak: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    height: '1.3rem',
  },
}));

// ADDED: BlogDescription to match ProjectCard - EXACTLY 2 LINES
const BlogDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  lineHeight: '1.4',
  color: theme.palette.grey[600],
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.38rem', // Exact height for 2 lines
  marginBottom: '8px',
  wordBreak: 'break-word',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.8rem',
    height: '2.24rem',
  },
}));

// ADDED: Category/Tag styling to match ProjectCard service title
const BlogCategory = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  background: 'rgba(102, 126, 234, 0.1)',
  padding: '4px 8px',
  borderRadius: '8px',
  display: 'inline-block',
  marginBottom: '8px',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

// ADDED: Info Row styling to match ProjectCard
const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  fontSize: '0.75rem',
  color: theme.palette.grey[600],
  '& svg': {
    fontSize: '14px',
    marginRight: '6px',
    color: theme.palette.grey[500],
  },
}));

const AddBlogButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
  },
}));

// UPDATED: StyledCardContent to match ProjectCard layout structure
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: '20px',
  height: 'calc(100% - 220px)', // Match ProjectCard content height calculation
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100% - 200px)', // Adjust for mobile image height
  },
}));

// UPDATED: Author section with consistent styling
const AuthorSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
});

const BlogListPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data: blogsData, isLoading, error } = useGetAllBlogs();
  const userData = useUserData();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const isAdmin = userData && userData.role === 'admin';
  const blogs = blogsData?.blogs || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  // Extract excerpt from content (first 100 characters)
  const getExcerpt = (content) => {
    if (!content) return 'No preview available...';
    const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  };

  // Get blog category or default
  const getBlogCategory = (blog) => {
    return blog.category || blog.tags?.[0] || 'Article';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Grid container spacing={4} justifyContent="center">
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid 
                item 
                xs={12}     // 1 card per row on mobile
                sm={6}      // 2 cards per row on small tablets
                md={4}      // 3 cards per row on medium screens
                lg={3}      // 4 cards per row on large screens
                xl={2.4}    // 5 cards per row on extra large screens
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <BlogCard>
                  <Skeleton variant="rectangular" height={220} />
                  <StyledCardContent>
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" height={24} width={80} sx={{ mb: 1 }} />
                      <AuthorSection>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" height={20} width={80} />
                          <Skeleton variant="text" height={16} width={60} />
                        </Box>
                      </AuthorSection>
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} width="90%" sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} width="70%" />
                    </Box>
                    <Skeleton variant="rectangular" height={36} sx={{ mt: 2, borderRadius: 1 }} />
                  </StyledCardContent>
                </BlogCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container maxWidth="lg" sx={{ py: 8, mt: 10 }}>
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            Error loading blogs: {error.message}
          </Alert>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Modern Hero Section */}
      <HeroSection>
        <HeroImage src={blogBanner} alt="Construction Blog" />
        <HeroContent>
          <motion.div
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant={isMobile ? "h3" : "h1"}
              component="h1"
              fontWeight={800}
              sx={{ 
                mb: 2,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: 1.1,
                textShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              Our Blog
            </Typography>
            <Typography
              variant={isMobile ? "h6" : "h4"}
              sx={{ 
                mb: 4,
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}
            >
              Insights and updates from the construction industry
            </Typography>
          </motion.div>
        </HeroContent>
      </HeroSection>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight={700}
              sx={{ 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Latest Articles
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: '600px', margin: '0 auto', fontWeight: 400 }}
            >
              Discover our collection of construction insights and stories
            </Typography>
          </Box>

          {/* Add Blog Button */}
          {isAdmin && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
              <AddBlogButton
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add New Blog Post
              </AddBlogButton>
            </Box>
          )}

          {/* UPDATED: Blogs Grid with consistent layout matching ProjectCard */}
          <Grid 
            container 
            spacing={4} 
            justifyContent="center"
          >
            {blogs.length === 0 ? (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ textAlign: "center", py: 12 }}>
                    <ArticleIcon 
                      sx={{ 
                        fontSize: 120, 
                        mb: 3, 
                        color: 'primary.main',
                        opacity: 0.3
                      }} 
                    />
                    <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                      No Articles Available
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {isAdmin
                        ? "Start by adding your first blog post!"
                        : "Articles will be available soon."}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ) : blogs.map((blog, index) => (
              <Grid 
                item 
                xs={12}     // 1 card per row on mobile
                sm={6}      // 2 cards per row on small tablets
                md={4}      // 3 cards per row on medium screens
                lg={3}      // 4 cards per row on large screens
                xl={2.4}    // 5 cards per row on extra large screens
                key={blog.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  variants={cardVariants}
                  custom={index}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  <BlogCard onClick={() => handleBlogClick(blog.id)}>
                    <BlogImage
                      className="blog-image"
                      image={
                        blog.image ||
                        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      }
                      title={blog.title}
                    >
                      <BlogOverlay className="blog-overlay">
                        <Box sx={{ textAlign: 'center', color: 'white' }}>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            Read Article
                          </Typography>
                          <ArrowForwardIcon sx={{ fontSize: 28 }} />
                        </Box>
                      </BlogOverlay>
                    </BlogImage>
                    
                    <StyledCardContent>
                      <Box sx={{ flex: 1 }}>
                        {/* Blog Category */}
                        <BlogCategory variant="caption">
                          {getBlogCategory(blog)}
                        </BlogCategory>

                        {/* Author Section */}
                        <AuthorSection>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              fontSize: '0.9rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {blog.author.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {blog.author}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(blog.createdAt)}
                            </Typography>
                          </Box>
                        </AuthorSection>
                        
                        {/* Blog Title - 1 line like ProjectCard */}
                        <BlogTitle variant="h6">
                          {blog.title}
                        </BlogTitle>

                        {/* Blog Description - 2 lines like ProjectCard */}
                        <BlogDescription variant="body2">
                          {getExcerpt(blog.content)}
                        </BlogDescription>

                        {/* Blog Info - similar to ProjectCard */}
                        <Box sx={{ mb: 2 }}>
                          <InfoRow>
                            <ArticleIcon />
                            <Typography variant="caption">
                              {blog.readTime || '5 min read'}
                            </Typography>
                          </InfoRow>
                          {blog.tags && blog.tags.length > 0 && (
                            <InfoRow>
                              <BookmarkIcon />
                              <Typography variant="caption">
                                {blog.tags.slice(0, 2).join(', ')}
                              </Typography>
                            </InfoRow>
                          )}
                        </Box>
                      </Box>
                      
                      {/* View Details Button - matching ProjectCard */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: 'auto',
                        justifyContent: 'center',
                      }}>
                        <Button
                          variant="contained"
                          startIcon={<ArticleIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/blogs/${blog.id}`);
                          }}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                            }
                          }}
                        >
                          Read Article
                        </Button>
                      </Box>
                    </StyledCardContent>
                  </BlogCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      <AddBlogModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </PageWrapper>
  );
};

export default BlogListPage;