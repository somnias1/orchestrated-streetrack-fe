import { useQueryClient } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  useCreateHangoutMutation,
  useDeleteHangoutMutation,
  useHangoutsQuery,
  useUpdateHangoutMutation,
} from '../../services/hangouts';
import { hangoutsQueryKey } from '../../services/hangouts/constants';
import type { HangoutRead } from '../../services/hangouts/types';
import { DEFAULT_LIST_LIMIT } from '../../services/types';
import { DeleteHangoutDialog } from './deleteHangoutDialog';
import { HangoutFormDialog } from './hangoutFormDialog';
import { HangoutsTable } from './hangoutsTable';
import { useHangoutsStore } from './store';

export function Hangouts() {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_LIST_LIMIT,
  });

  const listParams = useMemo(
    () => ({
      skip: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
    }),
    [pagination],
  );

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useHangoutsQuery(listParams);

  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;
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
      toast.success('Hangout created');
    },
  });
  const updateMutation = useUpdateHangoutMutation({
    onSuccess: () => {
      handleInvalidateHangouts();
      toast.success('Hangout updated');
    },
  });
  const deleteMutation = useDeleteHangoutMutation({
    onSuccess: () => {
      handleInvalidateHangouts();
      toast.success('Hangout deleted');
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
    <div className="py-2 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          Hangouts{total > 0 ? ` (${total})` : ''}
        </h2>
        <Button onClick={openCreate} data-testid="hangouts-add-button">
          <Plus className="h-4 w-4 mr-1" />
          Create hangout
        </Button>
      </div>

      <HangoutsTable
        items={items}
        loading={isLoading}
        error={errorMessage}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={openDelete}
        total={total}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
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
    </div>
  );
}
