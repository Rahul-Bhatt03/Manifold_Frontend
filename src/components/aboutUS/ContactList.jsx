// ContactList.jsx (MUI version)
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
} from '@mui/material';
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" py={5}>
        <Typography color="error">Error loading contacts: {error.message}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  const contacts = data?.data?.contacts || [];
  const pagination = data?.data?.pagination || {};

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Contact Submissions
      </Typography>

      {contacts.length === 0 ? (
        <Typography textAlign="center" color="textSecondary">
          No contact submissions found.
        </Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>{new Date(contact.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDelete(contact.id)}
                        disabled={deleteContactMutation.isPending}
                      >
                        {deleteContactMutation.isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Stack spacing={2} mt={4} alignItems="center">
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
};

export default ContactList;
