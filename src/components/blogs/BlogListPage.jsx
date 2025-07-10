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

// UPDATED: BlogCard with exact fixed dimensions for all screen sizes
const BlogCard = styled(Card)(({ theme }) => ({
  height: '450px', // Increased fixed height for better proportions
  width: '100%',
  maxWidth: '350px', // Maximum width to prevent cards from being too wide
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  cursor: 'pointer',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
  border: '1px solid rgba(226, 232, 240, 0.8)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto', // Center the card within its grid item
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

// UPDATED: BlogImage with exact fixed dimensions
const BlogImage = styled(CardMedia)({
  height: '200px', // Exact fixed height for all images
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.6s ease',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  flexShrink: 0, // Prevent any shrinking
});

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

// UPDATED: BlogTitle with strict line clamping and fixed height
const BlogTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  lineHeight: 1.3,
  color: theme.palette.grey[800],
  display: '-webkit-box',
  WebkitLineClamp: 2, // Exactly 2 lines
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  height: '2.6rem', // Exact height for 2 lines (1.3 line-height * 1.1rem * 2)
  marginBottom: theme.spacing(1),
  wordBreak: 'break-word', // Handle long words properly
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

// UPDATED: StyledCardContent with exact fixed height and structured layout
const StyledCardContent = styled(CardContent)({
  padding: '20px',
  height: '250px', // Exact fixed height for content area (450px total - 200px image)
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 0, // Don't allow growing
  flexShrink: 0, // Don't allow shrinking
});

// UPDATED: Author section with fixed height
const AuthorSection = styled(Box)({
  height: '56px', // Fixed height for author section
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
  flexShrink: 0,
});

// UPDATED: Title section with fixed height
const TitleSection = styled(Box)({
  height: '3.6rem', // Fixed height to accommodate title + margin
  marginBottom: '16px',
  flexShrink: 0,
});

// UPDATED: Footer section with fixed height
const FooterSection = styled(Box)({
  height: '24px', // Fixed height for read more section
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  flexShrink: 0,
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
                  <Skeleton variant="rectangular" height={200} />
                  <StyledCardContent>
                    <AuthorSection>
                      <Skeleton variant="circular" width={32} height={32} />
                      <Box>
                        <Skeleton variant="text" height={20} width={80} />
                        <Skeleton variant="text" height={16} width={60} />
                      </Box>
                    </AuthorSection>
                    <TitleSection>
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={24} width="80%" />
                    </TitleSection>
                    <FooterSection>
                      <Skeleton variant="text" height={20} width={100} />
                    </FooterSection>
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

          {/* UPDATED: Blogs Grid with perfect centering */}
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
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
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
                      
                      <TitleSection>
                        <BlogTitle variant="h6">
                          {blog.title}
                        </BlogTitle>
                      </TitleSection>
                      
                      <FooterSection>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight={600}
                          sx={{ mr: 1 }}
                        >
                          Read More
                        </Typography>
                        <ArrowForwardIcon 
                          className="blog-arrow"
                          sx={{ 
                            fontSize: 18, 
                            color: 'primary.main',
                            transition: 'transform 0.3s ease'
                          }} 
                        />
                      </FooterSection>
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