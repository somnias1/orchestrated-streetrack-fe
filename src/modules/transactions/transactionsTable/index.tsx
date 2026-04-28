import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Pencil, Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { TablePagination } from '@/components/TablePagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { TransactionRead } from '../../../services/transactions/types';
import { formatDate, formatValue } from '../../../utils';
import { GRID_TEMPLATE_FR, ROW_HEIGHT, TABLE_MIN_HEIGHT } from './constants';
import type { TransactionsTableProps } from './types';

const SKELETON_ROWS = 5;

function createColumns(
  onEdit: (t: TransactionRead) => void,
  onDelete: (t: TransactionRead) => void,
): ColumnDef<TransactionRead>[] {
  return [
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => {
        const value = info.getValue<string>();
        const truncated = value.length > 40 ? `${value.slice(0, 40)}…` : value;
        return (
          <span
            className="text-sm text-foreground truncate block"
            title={value.length > 40 ? value : undefined}
          >
            {truncated}
          </span>
        );
      },
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: (info) => (
        <span className="text-sm text-foreground tabular-nums">
          {formatValue(info.getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: (info) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(info.getValue<string>())}
        </span>
      ),
    },
    {
      accessorKey: 'subcategory_name',
      header: 'Subcategory',
      cell: (info) => {
        const row = info.row.original;
        return (
          <span className="text-sm text-muted-foreground truncate">
            {row.subcategory_name?.trim() || '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'hangout_name',
      header: 'Hangout',
      cell: (info) => {
        const row = info.row.original;
        return (
          <span className="text-sm text-muted-foreground truncate">
            {row.hangout_name?.trim() || '—'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <TooltipProvider delayDuration={0}>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary"
                    onClick={() => onEdit(transaction)}
                    aria-label={`Edit transaction ${transaction.description}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDelete(transaction)}
                    aria-label={`Delete transaction ${transaction.description}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];
}

export function TransactionsTable({
  items,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  total,
  pageIndex,
  pageSize,
  onPaginationChange,
}: TransactionsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = createColumns(onEdit, onDelete);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: total,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange,
  });

  const { rows } = table.getRowModel();
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const showVirtualBody = !loading && !error && items.length > 0;

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="grid border-b border-border bg-card"
        style={{ gridTemplateColumns: GRID_TEMPLATE_FR }}
      >
        {table.getHeaderGroups().flatMap((group) =>
          group.headers.map((header) => (
            <div
              key={header.id}
              className="px-3 py-2.5 text-sm font-semibold text-foreground"
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </div>
          )),
        )}
      </div>

      {/* Body */}
      <div
        ref={parentRef}
        className="overflow-auto flex-1"
        style={{ minHeight: TABLE_MIN_HEIGHT, maxHeight: '60vh' }}
      >
        {loading && (
          <>
            <progress aria-label="Loading transactions" className="sr-only" />
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: SKELETON_ROWS }, (_, n) => n).map((n) => (
                <Skeleton key={n} className="h-10 w-full" />
              ))}
            </div>
          </>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              data-testid="retry-button"
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              No transactions found.
            </p>
          </div>
        )}

        {showVirtualBody && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: `${totalSize}px`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const transaction = row.original;
              return (
                <div
                  key={row.id}
                  data-testid={`transaction-row-${transaction.id}`}
                  className={cn(
                    'absolute left-0 right-0 grid items-center border-b border-border bg-card hover:bg-accent/30',
                  )}
                  style={{
                    top: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    gridTemplateColumns: GRID_TEMPLATE_FR,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="px-3 py-2 min-w-0 overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TablePagination table={table} />
    </div>
  );
}
