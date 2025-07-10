import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useCreateCategory } from "../../hooks/useCategories";

const CategoryForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const createCategory = useCreateCategory();

  // Reset form on open
  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  const resetForm = () => {
    setFormData({ name: "", description: "", image: null });
    setPreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image,
    };

    // 🔍 Debug logs
    console.log("Submitting category with data:", payload);

    createCategory.mutate(payload, {
      onSuccess: () => {
        setSnackbar({ open: true, message: "Category created!", severity: "success" });
        resetForm();
        onClose();
      },
      onError: (error) => {
        console.error("Category creation error:", error);
        setSnackbar({
          open: true,
          message:
            error?.response?.data?.message ||
            error?.message ||
            "Error while creating category",
          severity: "error",
        });
      },
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Category</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCamera />}
              sx={{ mt: 2 }}
            >
              Upload Image
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>

            {preview && (
              <Box mt={2} textAlign="center">
                <img src={preview} alt="Preview" style={{ maxHeight: 180, borderRadius: 8 }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" disabled={createCategory.isLoading}>
              {createCategory.isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryForm;
