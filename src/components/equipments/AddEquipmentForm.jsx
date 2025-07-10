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
} from "@mui/material";
import { CloudUpload, Image as ImageIcon } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCategories } from "../../hooks/useCategories";
import { useEquipmentActions } from "../../hooks/useEquipment";

const AddEquipmentForm = ({ open, onClose,equipmentData=null ,isEdit=false}) => {
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
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
      };
      reader.onerror = () => {
        setUploading(false);
        setError("Error reading file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      setError("Error processing image");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Validate required fields
  if (
    !newEquipment.name.trim() ||
    !newEquipment.category ||
    !newEquipment.description.replace(/<[^>]*>/g, "").trim() ||
    !newEquipment.application.replace(/<[^>]*>/g, "").trim()
  ) {
    setError("Please fill in all required fields");
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

    if (isEdit && equipmentData) {
      // Update existing equipment
      await update({
        id: equipmentData._id || equipmentData.id,
        ...payload,
      });
    } else {
      // Create new equipment
      await create(payload);
    }

    handleClose();
  } catch (error) {
    console.error("Error submitting equipment:", error);
    const errMessage =
      error?.response?.data?.message ||
      `Error ${isEdit ? "updating" : "creating"} equipment. Please try again.`;
    setError(errMessage);

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
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          minHeight: "70vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          backgroundColor: "primary.main",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
     <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
  {isEdit ? 'Edit Equipment' : 'Add New Equipment'}
</Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ height: "100%" }}>
          {error && (
            <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={0} sx={{ height: "100%" }}>
            {/* Left Panel - Basic Information */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{ borderRight: { md: "1px solid #e0e0e0" } }}
            >
              <Box sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
                >
                  Basic Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Equipment Name"
                      value={newEquipment.name || ""}
                      onChange={(e) => {
                        console.log("Name changed:", e.target.value);
                        setNewEquipment({
                          ...newEquipment,
                          name: e.target.value,
                        });
                      }}
                      required
                      variant="outlined"
                      placeholder="Enter equipment name"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required variant="outlined">
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        value={newEquipment.category || ""}
                        label="Category"
                        onChange={(e) => {
                          console.log("Category changed:", e.target.value);
                          setNewEquipment({
                            ...newEquipment,
                            category: e.target.value,
                          });
                        }}
                        disabled={categoriesLoading}
                        sx={{ borderRadius: 2 }}
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

                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      Description *
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        minHeight: 150,
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={newEquipment.description || ""}
                        onChange={(content) => {
                          console.log(
                            "Description changed:",
                            content ? content.substring(0, 50) + "..." : "Empty"
                          );
                          setNewEquipment({
                            ...newEquipment,
                            description: content || "",
                          });
                        }}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{
                          minHeight: 120,
                          borderRadius: 8,
                        }}
                        placeholder="Describe the equipment features and specifications..."
                      />
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      Application *
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        minHeight: 150,
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <ReactQuill
                        theme="snow"
                        value={newEquipment.application || ""}
                        onChange={(content) => {
                          console.log(
                            "Application changed:",
                            content ? content.substring(0, 50) + "..." : "Empty"
                          );
                          setNewEquipment({
                            ...newEquipment,
                            application: content || "",
                          });
                        }}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{
                          minHeight: 120,
                          borderRadius: 8,
                        }}
                        placeholder="Explain how and where this equipment is used..."
                      />
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Panel - Image Upload */}
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 3, height: "100%", backgroundColor: "#fafafa" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}
                >
                  Equipment Image
                </Typography>

                <Box sx={{ textAlign: "center" }}>
                  {imagePreview ? (
                    <Box>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: "white",
                          mb: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={imagePreview}
                          alt="Preview"
                          sx={{
                            width: "100%",
                            maxHeight: 200,
                            objectFit: "contain",
                            borderRadius: 1,
                          }}
                        />
                      </Paper>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        disabled={uploading}
                        sx={{ borderRadius: 2 }}
                      >
                        Change Image
                        <input
                          type="file"
                          hidden
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          border: "2px dashed #e0e0e0",
                          borderRadius: 2,
                          backgroundColor: "white",
                          mb: 2,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "primary.main",
                            backgroundColor: "primary.main",
                            color: "white",
                            "& .MuiSvgIcon-root": {
                              color: "white",
                            },
                          },
                        }}
                        component="label"
                      >
                        <Box sx={{ textAlign: "center" }}>
                          <ImageIcon
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 1,
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, mb: 1 }}
                          >
                            {uploading
                              ? "Processing..."
                              : "Click to upload image"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            JPG, PNG up to 5MB
                          </Typography>
                        </Box>
                        <input
                          type="file"
                          hidden
                          onChange={handleImageChange}
                          accept="image/*"
                          disabled={uploading}
                        />
                      </Paper>
                      {uploading && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                          }}
                        >
                          <CircularProgress size={24} />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  * Image is optional but recommended for better presentation
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: "#f5f5f5", gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Cancel
        </Button>
      <Button
  onClick={handleSubmit}
  variant="contained"
  disabled={
    isCreating ||
    isUpdating ||
    uploading ||
    categoriesLoading ||
    !newEquipment.name.trim() ||
    !newEquipment.category ||
    !newEquipment.description.replace(/<[^>]*>/g, "").trim() ||
    !newEquipment.application.replace(/<[^>]*>/g, "").trim()
  }
  sx={{
    borderRadius: 2,
    px: 3,
    py: 1,
    minWidth: 120,
  }}
>
  {isCreating || isUpdating ? (
    <>
      <CircularProgress size={20} sx={{ mr: 1 }} />
      {isEdit ? 'Updating...' : 'Creating...'}
    </>
  ) : (
    isEdit ? 'Update Equipment' : 'Create Equipment'
  )}
</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentForm;
