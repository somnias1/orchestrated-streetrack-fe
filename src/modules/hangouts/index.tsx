import AddRounded from '@mui/icons-material/AddRounded';
import { Box, Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import type { HangoutRead } from '../../services/hangouts/types';
import { themeTokens } from '../../theme/tailwind';
import { DeleteHangoutDialog } from './deleteHangoutDialog';
import { HangoutFormDialog } from './hangoutFormDialog';
import { HangoutsTable } from './hangoutsTable';
import { useHangoutsStore } from './store';

export function Hangouts() {
  const {
    items,
    loading,
    error,
    fetchHangouts,
    createHangout,
    updateHangout,
    deleteHangout,
  } = useHangoutsStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editingHangoutId, setEditingHangoutId] = useState<string | null>(null);
  const [formInitial, setFormInitial] = useState<{
    name: string;
    date: string;
    description: string | null;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [hangoutToDelete, setHangoutToDelete] = useState<HangoutRead | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchHangouts();
  }, [fetchHangouts]);

  const openCreate = useCallback(() => {
    setEditingHangoutId(null);
    setFormInitial(null);
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((hangout: HangoutRead) => {
    setEditingHangoutId(hangout.id);
    setFormInitial({
      name: hangout.name,
      date: hangout.date.slice(0, 10),
      description: hangout.description,
    });
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((hangout: HangoutRead) => {
    setHangoutToDelete(hangout);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: {
      name: string;
      date: string;
      description: string | null;
    }) => {
      setSubmitError(null);
      try {
        if (editingHangoutId === null) {
          await createHangout(data);
        } else {
          await updateHangout(editingHangoutId, data);
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingHangoutId, createHangout, updateHangout],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteHangout(id);
      setDeleteOpen(false);
      setHangoutToDelete(null);
    },
    [deleteHangout],
  );

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: themeTokens.textPrimary }}>
          Hangouts
          {items.length > 0 ? ` (${items.length})` : ''}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={openCreate}
          sx={{ backgroundColor: themeTokens.primary }}
        >
          Create hangout
        </Button>
      </Box>
      <HangoutsTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchHangouts}
        onEdit={openEdit}
        onDelete={openDelete}
      />
      <HangoutFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialValues={formInitial}
        onSubmit={handleFormSubmit}
        submitError={submitError}
      />
      <DeleteHangoutDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setHangoutToDelete(null);
        }}
        hangout={hangoutToDelete}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
