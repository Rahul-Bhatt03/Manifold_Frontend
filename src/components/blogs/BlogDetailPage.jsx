import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  styled,
  useTheme,
  alpha,
  Fab,
  Tooltip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Error as ErrorIcon,
  Article as ArticleIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  KeyboardArrowUp as ArrowUpIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useGetBlogById, useDeleteBlog, useUserData, useUpdateBlog } from '../../hooks/useBlogs';
import AddBlogModal from './AddBlogModal';

// Enhanced Styled Components
const GlassContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
}));

const FloatingNavBar = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
  backdropFilter: 'blur(20px)',
  borderRadius: '50px',
  padding: '8px 24px',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.15)}`,
}));

const StyledArticlePaper = styled(Paper)(({ theme }) => ({
  borderRadius: '32px',
  overflow: 'hidden',
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
  boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
}));

const InteractiveButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 600,
  padding: '12px 24px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
  }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  borderRadius: '50%',
  width: 48,
  height: 48,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.1)',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    '& .MuiSvgIcon-root': {
      color: 'white',
    }
  }
}));

const ActionButton = styled(IconButton)(({ theme, actiontype }) => {
  const colors = {
    edit: theme.palette.warning.main,
    delete: theme.palette.error.main,
    default: theme.palette.primary.main
  };
  
  const color = colors[actiontype] || colors.default;
  
  return {
    borderRadius: '50%',
    width: 48,
    height: 48,
    background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
    border: `1px solid ${alpha(color, 0.2)}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px) scale(1.1)',
      background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
      '& .MuiSvgIcon-root': {
        color: 'white',
      }
    }
  };
});

const ReadingProgressBar = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '4px',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  transformOrigin: '0%',
  zIndex: 1001,
}));

const BlogDetailPage = () => {
  const { id: blogId } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { data: blog, isLoading, error } = useGetBlogById(blogId);
  const deleteBlogMutation = useDeleteBlog();
  const updateBlogMutation = useUpdateBlog();
  const userData = useUserData();
  const theme = useTheme();
  
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const isAdmin = userData?.role === 'admin'; // Check if user is admin

  const handleBackClick = () => {
    navigate('/about/blogs');
  };

  const handleEditClick = () => {
    if (isAdmin) {
      setShowEditModal(true);
    }
  };
  

  const handleDeleteClick = () => {
    if (isAdmin) {
      setShowDeleteDialog(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBlogMutation.mutateAsync(blogId);
      setShowDeleteDialog(false);
      setSuccessMessage('Blog deleted successfully!');
      setShowSuccessSnackbar(true);
      
      setTimeout(() => {
        navigate('/about/blogs');
      }, 1500);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setShowDeleteDialog(false);
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
  };

  const handleBlogUpdate = async (updatedBlog) => {
    try {
      await updateBlogMutation.mutateAsync({
        id: blogId,
        ...updatedBlog
      });
      setShowEditModal(false);
      setSuccessMessage('Blog updated successfully!');
      setShowSuccessSnackbar(true);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      setReadingProgress(progress);
      setShowScrollTop(scrolled > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Typography 
            paragraph 
            color="textPrimary" 
            sx={{ 
              lineHeight: 1.8,
              fontSize: '1.1rem',
              fontWeight: 400,
              mb: 3,
              textAlign: 'justify'
            }}
          >
            {paragraph}
          </Typography>
        </motion.div>
      ) : null
    ));
  };

  const getRandomStats = () => ({
    views: Math.floor(Math.random() * 5000) + 1000,
    likes: Math.floor(Math.random() * 500) + 50,
    comments: Math.floor(Math.random() * 100) + 10,
    readTime: Math.floor(Math.random() * 10) + 3
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || 'Check out this blog post';
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (isLoading) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '50%',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress size={48} thickness={4} sx={{ color: 'white' }} />
          </Box>
        </motion.div>
      </Box>
    );
  }

  if (error || !blog) {
    return (
      <Box 
        minHeight="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlassContainer sx={{ p: 6, maxWidth: 500, textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
            </motion.div>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Blog Not Found
            </Typography>
            <Typography color="textSecondary" paragraph>
              The blog post you're looking for doesn't exist or has been removed.
            </Typography>
            <InteractiveButton
              variant="contained"
              onClick={handleBackClick}
              startIcon={<ArrowBackIcon />}
            >
              Back to Blogs
            </InteractiveButton>
          </GlassContainer>
        </motion.div>
      </Box>
    );
  }

  const stats = getRandomStats();

  return (
    <Box sx={{ 
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Reading Progress Bar */}
      <ReadingProgressBar style={{ scaleX: scrollYProgress }} />

      {/* Floating Navigation */}
      <FloatingNavBar
        style={{ opacity: headerOpacity }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton 
            onClick={handleBackClick}
            sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ maxWidth: 300 }}>
            {blog.title}
          </Typography>
          
          {/* Only show edit/delete buttons for admin */}
          {isAdmin && (
            <Box display="flex" gap={1}>
              <Tooltip title="Edit">
                <ActionButton actiontype="edit" onClick={handleEditClick}>
                  <EditIcon />
                </ActionButton>
              </Tooltip>
              <Tooltip title="Delete">
                <ActionButton actiontype="delete" onClick={handleDeleteClick}>
                  <DeleteIcon />
                </ActionButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </FloatingNavBar>

      {/* Hero Section */}
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
        <motion.div style={{ scale: heroScale }}>
          {blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArticleIcon sx={{ fontSize: 120, color: 'white', opacity: 0.5 }} />
            </Box>
          )}
        </motion.div>
        
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)',
          }}
        />

        {/* Hero Content */}
        <Container maxWidth="lg" sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <InteractiveButton
                variant="outlined"
                onClick={handleBackClick}
                startIcon={<ArrowBackIcon />}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Back to Articles
              </InteractiveButton>
            </Box>
            
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                color: 'white',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                lineHeight: 1.2
              }}
            >
              {blog.title}
            </Typography>

            {/* Author & Meta Info */}
            <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {blog.author.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h6" color="white" fontWeight="bold">
                    {blog.author}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Published on {formatDate(blog.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 10, mt: -12 }}>
        <StyledArticlePaper elevation={0}>
          {/* Action Bar */}
          <Box sx={{ p: 4, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" gap={2}>
                <Tooltip title={isLiked ? "Unlike" : "Like"}>
                  <SocialButton onClick={handleLike}>
                    <ThumbUpIcon sx={{ color: isLiked ? theme.palette.primary.main : 'inherit' }} />
                  </SocialButton>
                </Tooltip>
                
                <Tooltip title={isBookmarked ? "Remove Bookmark" : "Bookmark"}>
                  <SocialButton onClick={handleBookmark}>
                    {isBookmarked ? 
                      <BookmarkFilledIcon sx={{ color: theme.palette.primary.main }} /> : 
                      <BookmarkIcon />
                    }
                  </SocialButton>
                </Tooltip>
              </Box>

              <Box position="relative">
                <Tooltip title="Share">
                  <SocialButton onClick={() => setShowShareMenu(!showShareMenu)}>
                    <ShareIcon />
                  </SocialButton>
                </Tooltip>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: 8,
                        zIndex: 1000
                      }}
                    >
                      <Card sx={{ p: 2, minWidth: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Share this article
                        </Typography>
                        <Box display="flex" gap={1}>
                          <SocialButton size="small" onClick={() => handleShare('twitter')}>
                            <TwitterIcon fontSize="small" />
                          </SocialButton>
                          <SocialButton size="small" onClick={() => handleShare('facebook')}>
                            <FacebookIcon fontSize="small" />
                          </SocialButton>
                          <SocialButton size="small" onClick={() => handleShare('linkedin')}>
                            <LinkedInIcon fontSize="small" />
                          </SocialButton>
                        </Box>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </Box>

          {/* Article Content */}
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {formatContent(blog.content)}
            </motion.div>
          </Box>
        </StyledArticlePaper>
      </Container>

      {/* Edit Blog Modal */}
      <AddBlogModal
        open={showEditModal}
        onClose={handleEditModalClose}
        onSubmit={handleBlogUpdate}
     editBlog={blog}
        isEditMode={true}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this blog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            autoFocus
            disabled={deleteBlogMutation.isLoading}
          >
            {deleteBlogMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000
            }}
          >
            <Fab 
              color="primary" 
              onClick={scrollToTop}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <ArrowUpIcon />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default BlogDetailPage;