import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from "@mui/material";
import { CloudUpload, Image as ImageIcon, CheckCircle, Error } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCategories } from "../../hooks/useCategories";
import { useEquipmentActions } from "../../hooks/useEquipment";

const AddEquipmentForm = ({ open, onClose, equipmentData = null, isEdit = false }) => {
  const [newEquipment, setNewEquipment] = useState({
    name: equipmentData?.name || "",
    category: equipmentData?.category || "",
    description: equipmentData?.description || "",
    application: equipmentData?.application || "",
    image: equipmentData?.image || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Notification states
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { create, update, isCreating, isUpdating } = useEquipmentActions();

  useEffect(() => {
    if (isEdit && equipmentData) {
      setNewEquipment({
        name: equipmentData.name || "",
        category: equipmentData.category || "",
        description: equipmentData.description || "",
        application: equipmentData.application || "",
        image: equipmentData.image || "",
      });
      if (equipmentData.image) {
        setImagePreview(equipmentData.image);
      }
    }
  }, [isEdit, equipmentData]);

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
  ];

  // Show notification helper
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Close notification
  const handleNotificationClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Validate image file type - only PNG and JPG
  const isValidImageType = (file) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    return allowedTypes.includes(file.type.toLowerCase());
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - only PNG and JPG
    if (!isValidImageType(file)) {
      showNotification(
        "Invalid image format. Please select only PNG or JPG files.",
        "error"
      );
      // Clear the input
      e.target.value = '';
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        "Image size should be less than 5MB. Please select a smaller image.",
        "error"
      );
      // Clear the input
      e.target.value = '';
      return;
    }

    setError("");
    setUploading(true);
    setImageFile(file);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUploading(false);
        showNotification("Image uploaded successfully!", "success");
      };
      reader.onerror = () => {
        setUploading(false);
        showNotification("Error reading image file. Please try again.", "error");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      showNotification("Error processing image. Please try again.", "error");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsSubmitting(true);

  // Validate required fields
  if (
    !newEquipment.name.trim() ||
    !newEquipment.category ||
    !newEquipment.description.replace(/<[^>]*>/g, "").trim() ||
    !newEquipment.application.replace(/<[^>]*>/g, "").trim()
  ) {
    setError("Please fill in all required fields");
    setIsSubmitting(false);
    return;
  }

  try {
    const name = newEquipment.name?.trim() || "";
    const category = newEquipment.category || "";
    const description = newEquipment.description || "";
    const application = newEquipment.application || "";

    // Use imageFile if a new image is selected, otherwise fall back to existing one (for update)
    const payload = {
      name,
      category,
      description,
      application,
      image: imageFile || newEquipment.image,
    };

    let response;
    if (isEdit && equipmentData) {
      // Update existing equipment
      response = await update({
        id: equipmentData._id || equipmentData.id,
        ...payload,
      });
    } else {
      // Create new equipment
      response = await create(payload);
    }

    // Better response handling - check for explicit error indicators
    const hasError = response?.success === false || 
                    response?.error || 
                    response?.message?.toLowerCase().includes('error') ||
                    response?.message?.toLowerCase().includes('failed');

    if (hasError) {
      // Handle explicit error responses
      const errorMessage = response?.message || response?.error || 
        `Failed to ${isEdit ? 'update' : 'create'} equipment. Please try again.`;
      throw { message: errorMessage };
    }

    // If we reach here, consider it a success
    showNotification(
      `Equipment ${isEdit ? 'updated' : 'created'} successfully!`, 
      "success"
    );
    
    // Clear the form after successful operation (but not for edit mode)
    if (!isEdit) {
      setNewEquipment({
        name: "",
        category: "",
        description: "",
        application: "",
        image: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
    
    // Close dialog after a short delay to show the success message
    setTimeout(() => {
      handleClose();
    }, 1500);

  } catch (error) {
    console.error("Error submitting equipment:", error);
    const errMessage =
      error?.response?.data?.message ||
      error?.message ||
      `Error ${isEdit ? "updating" : "creating"} equipment. Please try again.`;
    
    showNotification(errMessage, "error");
    setError(errMessage);

    // Don't reset form on error in edit mode
    if (!isEdit) {
      // Reset form only on creation failure
      setNewEquipment({
        name: "",
        category: "",
        description: "",
        application: "",
        image: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    // Reset all states when closing
    setNewEquipment({
      name: "",
      category: "",
      description: "",
      application: "",
      image: "",
    });
    setImagePreview(null);
    setImageFile(null);
    setUploading(false);
    setError("");
    setIsSubmitting(false);
    setNotification({ open: false, message: "", severity: "success" });
    onClose();
  };

  const isFormValid = () => {
    return (
      newEquipment.name.trim() &&
      newEquipment.category &&
      newEquipment.description.replace(/<[^>]*>/g, "").trim() &&
      newEquipment.application.replace(/<[^>]*>/g, "").trim()
    );
  };

  const isLoading = isCreating || isUpdating || isSubmitting;

  return (
    <>
      <Dialog
        open={open}
        onClose={!isLoading ? handleClose : undefined}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "95vh",
            minHeight: "80vh",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "sticky",
            top: 0,
            zIndex: 1,
            borderRadius: "12px 12px 0 0",
          }}
        >
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, textAlign: "center" }}>
            {isEdit ? '✏️ Edit Equipment' : '➕ Add New Equipment'}
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: "center", opacity: 0.9, mt: 1 }}>
            {isEdit ? 'Update equipment information' : 'Fill in the details to add new equipment'}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 0, backgroundColor: "#f8fafc" }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ height: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ p: 4 }}>
              <Grid container spacing={4}>
                {/* Left Column - Equipment Details */}
                <Grid item xs={12} lg={8}>
                  <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden" }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ 
                          color: "primary.main", 
                          fontWeight: 700, 
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1
                        }}
                      >
                        📋 Equipment Details
                      </Typography>

                      <Grid container spacing={3}>
                        {/* Equipment Name */}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Equipment Name"
                            value={newEquipment.name || ""}
                            onChange={(e) => {
                              setNewEquipment({
                                ...newEquipment,
                                name: e.target.value,
                              });
                            }}
                            required
                            variant="outlined"
                            placeholder="Enter equipment name"
                            disabled={isLoading}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                backgroundColor: "white",
                                "&:hover": {
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                  },
                                },
                              },
                            }}
                          />
                        </Grid>

                        {/* Category */}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required variant="outlined">
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                              labelId="category-label"
                              value={newEquipment.category || ""}
                              label="Category"
                              onChange={(e) => {
                                setNewEquipment({
                                  ...newEquipment,
                                  category: e.target.value,
                                });
                              }}
                              disabled={categoriesLoading || isLoading}
                              sx={{ 
                                borderRadius: 2,
                                backgroundColor: "white",
                                "&:hover": {
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                  },
                                },
                              }}
                            >
                              {categoriesLoading ? (
                                <MenuItem disabled>Loading categories...</MenuItem>
                              ) : (
                                categories?.map((category) => (
                                  <MenuItem
                                    key={category._id || category.id}
                                    value={category._name || category.name}
                                  >
                                    {category.name}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ 
                                fontWeight: 600, 
                                color: "text.primary",
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                              }}
                            >
                              📝 Description *
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Describe the equipment features, specifications, and technical details
                            </Typography>
                          </Box>
                          <Paper
                            elevation={1}
                            sx={{
                              border: "2px solid #e2e8f0",
                              borderRadius: 3,
                              minHeight: 200,
                              backgroundColor: "white",
                              opacity: isLoading ? 0.6 : 1,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: isLoading ? "#e2e8f0" : "primary.main",
                                boxShadow: isLoading ? "none" : "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            <ReactQuill
                              theme="snow"
                              value={newEquipment.description || ""}
                              onChange={(content) => {
                                setNewEquipment({
                                  ...newEquipment,
                                  description: content || "",
                                });
                              }}
                              modules={quillModules}
                              formats={quillFormats}
                              readOnly={isLoading}
                              style={{
                                minHeight: 160,
                                borderRadius: 12,
                              }}
                              placeholder="Describe the equipment features and specifications..."
                            />
                          </Paper>
                        </Grid>

                        {/* Application */}
                        <Grid item xs={12}>
                          <Box sx={{ mb: 2 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{ 
                                fontWeight: 600, 
                                color: "text.primary",
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                              }}
                            >
                              🔧 Application *
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Explain how and where this equipment is used, including use cases and benefits
                            </Typography>
                          </Box>
                          <Paper
                            elevation={1}
                            sx={{
                              border: "2px solid #e2e8f0",
                              borderRadius: 3,
                              minHeight: 200,
                              backgroundColor: "white",
                              opacity: isLoading ? 0.6 : 1,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: isLoading ? "#e2e8f0" : "primary.main",
                                boxShadow: isLoading ? "none" : "0 4px 12px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            <ReactQuill
                              theme="snow"
                              value={newEquipment.application || ""}
                              onChange={(content) => {
                                setNewEquipment({
                                  ...newEquipment,
                                  application: content || "",
                                });
                              }}
                              modules={quillModules}
                              formats={quillFormats}
                              readOnly={isLoading}
                              style={{
                                minHeight: 160,
                                borderRadius: 12,
                              }}
                              placeholder="Explain how and where this equipment is used..."
                            />
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Right Column - Image Upload */}
                <Grid item xs={12} lg={4}>
                  <Card elevation={2} sx={{ borderRadius: 3, overflow: "hidden", height: "fit-content" }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ 
                          color: "primary.main", 
                          fontWeight: 700, 
                          mb: 3,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          textAlign: "center"
                        }}
                      >
                        🖼️ Equipment Image
                      </Typography>

                      <Box sx={{ textAlign: "center" }}>
                        {imagePreview ? (
                          <Box>
                            <Paper
                              elevation={3}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: "white",
                                mb: 3,
                                border: "3px solid #e2e8f0",
                              }}
                            >
                              <Box
                                component="img"
                                src={imagePreview}
                                alt="Preview"
                                sx={{
                                  width: "100%",
                                  maxHeight: 250,
                                  objectFit: "contain",
                                  borderRadius: 2,
                                }}
                              />
                            </Paper>
                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<CloudUpload />}
                              disabled={uploading || isLoading}
                              size="large"
                              sx={{ 
                                borderRadius: 3,
                                px: 3,
                                py: 1.5,
                                borderWidth: 2,
                                "&:hover": {
                                  borderWidth: 2,
                                },
                              }}
                            >
                              Change Image
                              <input
                                type="file"
                                hidden
                                onChange={handleImageChange}
                                accept="image/png,image/jpg,image/jpeg"
                              />
                            </Button>
                          </Box>
                        ) : (
                          <Box>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 6,
                                border: "3px dashed #cbd5e1",
                                borderRadius: 3,
                                backgroundColor: "white",
                                mb: 3,
                                cursor: uploading || isLoading ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                opacity: uploading || isLoading ? 0.6 : 1,
                                "&:hover": {
                                  borderColor: uploading || isLoading ? "#cbd5e1" : "primary.main",
                                  backgroundColor: uploading || isLoading ? "white" : "#f0f9ff",
                                  transform: uploading || isLoading ? "none" : "translateY(-2px)",
                                  boxShadow: uploading || isLoading ? "none" : "0 8px 25px rgba(0,0,0,0.1)",
                                },
                              }}
                              component="label"
                            >
                              <Box sx={{ textAlign: "center" }}>
                                <ImageIcon
                                  sx={{
                                    fontSize: 64,
                                    color: "text.secondary",
                                    mb: 2,
                                  }}
                                />
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 600, mb: 1 }}
                                >
                                  {uploading
                                    ? "Processing..."
                                    : "Click to upload image"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  PNG or JPG files only
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Maximum size: 5MB
                                </Typography>
                              </Box>
                              <input
                                type="file"
                                hidden
                                onChange={handleImageChange}
                                accept="image/png,image/jpg,image/jpeg"
                                disabled={uploading || isLoading}
                              />
                            </Paper>
                            {uploading && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  mt: 2,
                                  gap: 2,
                                }}
                              >
                                <CircularProgress size={24} />
                                <Typography variant="body2" color="text.secondary">
                                  Uploading...
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>

                      <Box sx={{ mt: 3, p: 2, backgroundColor: "#f1f5f9", borderRadius: 2 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center", fontStyle: "italic" }}
                        >
                          💡 Image is optional but recommended for better presentation
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, backgroundColor: "#f8fafc", gap: 2, borderTop: "1px solid #e2e8f0" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isLoading}
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid() || isLoading || uploading || categoriesLoading}
            size="large"
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              minWidth: 160,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEdit ? '✏️ Update Equipment' : '➕ Create Equipment'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          sx={{ width: '100%', borderRadius: 2 }}
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />,
            error: <Error fontSize="inherit" />,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddEquipmentForm;