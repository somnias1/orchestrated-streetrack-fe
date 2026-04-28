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
import type { HangoutRead } from '../../../services/hangouts/types';
import { formatDate } from '../../../utils';
import { GRID_TEMPLATE_FR, ROW_HEIGHT, TABLE_MIN_HEIGHT } from './constants';
import type { HangoutsTableProps } from './types';

const SKELETON_ROWS = 5;

function createColumns(
  onEdit: (h: HangoutRead) => void,
  onDelete: (h: HangoutRead) => void,
): ColumnDef<HangoutRead>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => {
        const value = info.getValue<string>();
        const truncated = value.length > 36 ? `${value.slice(0, 36)}…` : value;
        return (
          <span
            className="text-sm text-foreground truncate block"
            title={value.length > 36 ? value : undefined}
          >
            {truncated}
          </span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => {
        const value = info.getValue<string | null>();
        if (!value) {
          return <span className="text-sm text-muted-foreground">—</span>;
        }
        const truncated = value.length > 50 ? `${value.slice(0, 50)}…` : value;
        return (
          <span
            className="text-sm text-muted-foreground truncate block"
            title={value.length > 50 ? value : undefined}
          >
            {truncated}
          </span>
        );
      },
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
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const hangout = info.row.original;
        return (
          <TooltipProvider delayDuration={0}>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary"
                    onClick={() => onEdit(hangout)}
                    aria-label={`Edit ${hangout.name}`}
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
                    onClick={() => onDelete(hangout)}
                    aria-label={`Delete ${hangout.name}`}
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

export function HangoutsTable({
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
}: HangoutsTableProps) {
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
            <progress aria-label="Loading hangouts" className="sr-only" />
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
            <p className="text-sm text-muted-foreground">No hangouts found.</p>
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
              const hangout = row.original;
              return (
                <div
                  key={row.id}
                  data-testid={`hangout-row-${hangout.id}`}
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
