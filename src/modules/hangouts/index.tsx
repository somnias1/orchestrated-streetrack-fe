import AddRounded from '@mui/icons-material/AddRounded';
import { Box, Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import {
  useCreateHangoutMutation,
  useDeleteHangoutMutation,
  useHangoutsQuery,
  useUpdateHangoutMutation,
} from '../../services/hangouts';
import { hangoutsQueryKey } from '../../services/hangouts/constants';
import type { HangoutRead } from '../../services/hangouts/types';
import { themeTokens } from '../../theme/tailwind';
import { DeleteHangoutDialog } from './deleteHangoutDialog';
import { HangoutFormDialog } from './hangoutFormDialog';
import { HangoutsTable } from './hangoutsTable';
import { useHangoutsStore } from './store';

export function Hangouts() {
  const queryClient = useQueryClient();
  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useHangoutsQuery();
  const setFromQuery = useHangoutsStore((s) => s.setFromQuery);

  useEffect(() => {
    const err =
      isError && error instanceof Error
        ? error.message
        : isError
          ? 'Failed to load hangouts'
          : null;
    setFromQuery(items, isLoading, err);
  }, [items, isLoading, isError, error, setFromQuery]);

  const handleInvalidateHangouts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [hangoutsQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateHangoutMutation({
    onSuccess: () => {
      handleInvalidateHangouts();
    },
  });
  const updateMutation = useUpdateHangoutMutation({
    onSuccess: () => {
      handleInvalidateHangouts();
    },
  });
  const deleteMutation = useDeleteHangoutMutation({
    onSuccess: () => {
      handleInvalidateHangouts();
    },
  });

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

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
        ? 'Failed to load hangouts'
        : null;

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
          await createMutation.mutateAsync(data);
        } else {
          await updateMutation.mutateAsync({
            id: editingHangoutId,
            body: data,
          });
        }
        setFormOpen(false);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Something went wrong',
        );
        throw err;
      }
    },
    [editingHangoutId, createMutation, updateMutation],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
      setDeleteOpen(false);
      setHangoutToDelete(null);
    },
    [deleteMutation],
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
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
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
