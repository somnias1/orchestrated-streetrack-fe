import { useQueryClient } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { ChevronDown, Download, FilterX, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { HangoutCombobox } from '../../components/pickers/HangoutCombobox';
import { SubcategoryCombobox } from '../../components/pickers/SubcategoryCombobox';
import { config } from '../../config';
import { dashboardQueryKey } from '../../services/dashboard/constants';
import {
  downloadCsvBlob,
  transactionManagerPaths,
  useImportPreviewMutation,
} from '../../services/transactionManager';
import {
  useBulkCreateTransactionsMutation,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useTransactionsQuery,
  useUpdateTransactionMutation,
} from '../../services/transactions';
import { transactionsQueryKey } from '../../services/transactions/constants';
import type {
  TransactionBulkCreate,
  TransactionRead,
  TransactionsListParams,
} from '../../services/transactions/types';
import { DEFAULT_LIST_LIMIT } from '../../services/types';
import useCallbackApi from '../../utils/callbackApi';
import { BulkTransactionsDialog } from './bulkTransactionsDialog';
import {
  DAY_OPTIONS,
  getDefaultMonth,
  getDefaultYear,
  MONTHS,
  YEAR_OPTIONS,
} from './constants';
import { DeleteTransactionDialog } from './deleteTransactionDialog';
import { ImportTransactionsDialog } from './importTransactionsDialog';
import { useTransactionsStore } from './store';
import { TransactionFormDialog } from './transactionFormDialog';
import { TransactionsTable } from './transactionsTable';

export function Transactions() {
  const queryClient = useQueryClient();
  const [year, setYear] = useState(getDefaultYear);
  const [month, setMonth] = useState(getDefaultMonth);
  const [day, setDay] = useState<string>('all');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [hangoutId, setHangoutId] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_LIST_LIMIT,
  });

  const listParams = useMemo<TransactionsListParams>(() => {
    const params: TransactionsListParams = {
      skip: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
    };
    if (year !== 'all') params.year = Number(year);
    if (month !== 'all') params.month = Number(month);
    if (day !== 'all') params.day = Number(day);
    if (subcategoryId) params.subcategory_id = subcategoryId;
    if (hangoutId) params.hangout_id = hangoutId;
    return params;
  }, [year, month, day, subcategoryId, hangoutId, pagination]);

  const clearFilters = useCallback(() => {
    setYear('all');
    setMonth('all');
    setDay('all');
    setSubcategoryId('');
    setHangoutId('');
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, []);

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactionsQuery(listParams);
  const items = listData?.items ?? [];
  const total = listData?.total ?? 0;

  const setTransactionsFromQuery = useTransactionsStore((s) => s.setFromQuery);

  useEffect(() => {
    const err =
      isError && error instanceof Error
        ? error.message
        : isError
          ? 'Failed to load transactions'
          : null;
    setTransactionsFromQuery(items, isLoading, err);
  }, [items, isLoading, isError, error, setTransactionsFromQuery]);

  const handleInvalidateTransactions = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [transactionsQueryKey] });
    queryClient.invalidateQueries({ queryKey: [dashboardQueryKey] });
  }, [queryClient]);

  const createMutation = useCreateTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      toast.success('Transaction created');
    },
  });
  const updateMutation = useUpdateTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      toast.success('Transaction updated');
    },
  });
  const deleteMutation = useDeleteTransactionMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      toast.success('Transaction deleted');
    },
  });
  const bulkCreateMutation = useBulkCreateTransactionsMutation({
    onSuccess: () => {
      handleInvalidateTransactions();
      toast.success('Transactions bulk created');
    },
  });

  const { callbackApi } = useCallbackApi();
  const importPreviewMutation = useImportPreviewMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [formInitial, setFormInitial] = useState<{
    subcategory_id: string;
    value: number;
    description: string;
    date: string;
    hangout_id: string | null;
  } | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionRead | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSubmitError, setBulkSubmitError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importPreviewError, setImportPreviewError] = useState<string | null>(
    null,
  );
  const [importSubmitError, setImportSubmitError] = useState<string | null>(
    null,
  );
  const [exporting, setExporting] = useState(false);

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
        ? 'Failed to load transactions'
        : null;

  const openCreate = useCallback(() => {
    setEditingTransactionId(null);
    setFormInitial(null);
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openBulk = useCallback(() => {
    setBulkSubmitError(null);
    setBulkOpen(true);
  }, []);

  const openImport = useCallback(() => {
    setImportPreviewError(null);
    setImportSubmitError(null);
    setImportOpen(true);
  }, []);

  const handleImportPreview = useCallback(
    async (
      rows: import('../../services/transactionManager/types').TransactionImportRow[],
    ) => {
      setImportPreviewError(null);
      try {
        return await importPreviewMutation.mutateAsync({ rows });
      } catch (err) {
        setImportPreviewError(
          err instanceof Error ? err.message : 'Preview failed',
        );
        throw err;
      }
    },
    [importPreviewMutation],
  );

  const handleImportSubmit = useCallback(
    async (body: TransactionBulkCreate) => {
      setImportSubmitError(null);
      try {
        await bulkCreateMutation.mutateAsync(body);
        setImportOpen(false);
      } catch (err) {
        setImportSubmitError(
          err instanceof Error ? err.message : 'Import create failed',
        );
        throw err;
      }
    },
    [bulkCreateMutation],
  );

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const exportParams = {
        ...(listParams.year !== undefined && { year: listParams.year }),
        ...(listParams.month !== undefined && { month: listParams.month }),
        ...(listParams.day !== undefined && { day: listParams.day }),
        ...(listParams.subcategory_id && {
          subcategory_id: listParams.subcategory_id,
        }),
        ...(listParams.hangout_id && { hangout_id: listParams.hangout_id }),
      };
      await downloadCsvBlob(() =>
        callbackApi<Blob>(transactionManagerPaths.export, {
          params: exportParams,
          baseURL: config.apiUrl,
          responseType: 'blob',
        }),
      );
    } finally {
      setExporting(false);
    }
  }, [callbackApi, listParams]);

  const handleBulkSubmit = useCallback(
    async (body: TransactionBulkCreate) => {
      setBulkSubmitError(null);
      try {
        await bulkCreateMutation.mutateAsync(body);
        setBulkOpen(false);
      } catch (err) {
        setBulkSubmitError(
          err instanceof Error ? err.message : 'Bulk create failed',
        );
        throw err;
      }
    },
    [bulkCreateMutation],
  );

  const openEdit = useCallback((transaction: TransactionRead) => {
    setEditingTransactionId(transaction.id);
    setFormInitial({
      subcategory_id: transaction.subcategory_id,
      value: transaction.value,
      description: transaction.description,
      date: transaction.date.slice(0, 10),
      hangout_id: transaction.hangout_id,
    });
    setSubmitError(null);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((transaction: TransactionRead) => {
    setTransactionToDelete(transaction);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: {
      subcategory_id: string;
      value: number;
      description: string;
      date: string;
      hangout_id: string | null;
    }) => {
      setSubmitError(null);
      try {
        if (editingTransactionId === null) {
          await createMutation.mutateAsync(data);
        } else {
          await updateMutation.mutateAsync({
            id: editingTransactionId,
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
    [editingTransactionId, createMutation, updateMutation],
  );

  const handleDeleteConfirm = useCallback(
    async (id: string) => {
      await deleteMutation.mutateAsync(id);
      setDeleteOpen(false);
      setTransactionToDelete(null);
    },
    [deleteMutation],
  );

  const filtersActive =
    year !== 'all' ||
    month !== 'all' ||
    day !== 'all' ||
    !!subcategoryId ||
    !!hangoutId;

  return (
    <div className="py-2 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-semibold text-foreground">
          Transactions{total > 0 ? ` (${total})` : ''}
        </h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-testid="transactions-add-button">
                <Plus className="h-4 w-4 mr-1" />
                Add
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={openCreate}>
                Transaction
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={openBulk}>Bulk</DropdownMenuItem>
              <DropdownMenuItem onSelect={openImport}>Import</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            data-testid="transactions-export-csv-button"
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={year}
          onValueChange={(v) => {
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            setYear(v);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {YEAR_OPTIONS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={month}
          onValueChange={(v) => {
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            setMonth(v);
          }}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {MONTHS.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={day}
          onValueChange={(v) => {
            setPagination((p) => ({ ...p, pageIndex: 0 }));
            setDay(v);
          }}
        >
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectItem value="all">All</SelectItem>
            {DAY_OPTIONS.map((d) => (
              <SelectItem key={d} value={String(d)}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-8" />

        <div className="w-52">
          <SubcategoryCombobox
            aria-label="Subcategory"
            value={subcategoryId}
            onChange={(id) => {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
              setSubcategoryId(id);
            }}
          />
        </div>

        <div className="w-44">
          <HangoutCombobox
            value={hangoutId}
            onChange={(id) => {
              setPagination((p) => ({ ...p, pageIndex: 0 }));
              setHangoutId(id);
            }}
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          disabled={!filtersActive}
          aria-label="Clear filters"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>

      <TransactionsTable
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

      <TransactionFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initialValues={formInitial}
        onSubmit={handleFormSubmit}
        submitError={submitError}
      />

      <DeleteTransactionDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setTransactionToDelete(null);
        }}
        transaction={transactionToDelete}
        onConfirm={handleDeleteConfirm}
      />

      <BulkTransactionsDialog
        open={bulkOpen}
        onClose={() => {
          setBulkOpen(false);
          setBulkSubmitError(null);
        }}
        onSubmit={handleBulkSubmit}
        submitError={bulkSubmitError}
        submitting={bulkCreateMutation.isPending}
      />

      <ImportTransactionsDialog
        open={importOpen}
        onClose={() => {
          setImportOpen(false);
          setImportPreviewError(null);
          setImportSubmitError(null);
        }}
        onPreview={handleImportPreview}
        onSubmit={handleImportSubmit}
        previewError={importPreviewError}
        submitError={importSubmitError}
        previewing={importPreviewMutation.isPending}
        submitting={bulkCreateMutation.isPending}
      />
    </div>
  );
}
