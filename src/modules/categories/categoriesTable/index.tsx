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
import type { CategoryRead } from '../../../services/categories/types';
import { TablePagination } from '@/components/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { CategoriesTableProps } from './types';

const GRID_COLS = 'grid-cols-[2fr_3fr_1.2fr_1.2fr]';
const ROW_HEIGHT = 48;
const TABLE_MIN_HEIGHT = 400;

function createColumns(
  onEdit: (c: CategoryRead) => void,
  onDelete: (c: CategoryRead) => void,
): ColumnDef<CategoryRead>[] {
  return [
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => {
        const v = info.getValue<string | null>() ?? '—';
        const truncated = v.length > 60 ? `${v.slice(0, 60)}…` : v;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block truncate text-muted-foreground text-sm max-w-[260px]">
                  {truncated}
                </span>
              </TooltipTrigger>
              {v.length > 60 && <TooltipContent>{v}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: 'is_income',
      header: 'Type',
      cell: (info) => (
        <Badge variant={info.getValue<boolean>() ? 'income' : 'expense'}>
          {info.getValue<boolean>() ? 'Income' : 'Expense'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const category = info.row.original;
        return (
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-primary"
                    onClick={() => onEdit(category)}
                    data-testid="edit-button"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDelete(category)}
                    data-testid="delete-button"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
}

export function CategoriesTable({
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
}: CategoriesTableProps) {
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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className={`grid ${GRID_COLS} border-b border-border bg-card`}>
        {table.getHeaderGroups().flatMap((group) =>
          group.headers.map((header) => (
            <div key={header.id} className="px-4 py-3 text-sm font-semibold text-foreground">
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          )),
        )}
      </div>

      {/* Body */}
      <div ref={parentRef} className="overflow-auto" style={{ minHeight: TABLE_MIN_HEIGHT, maxHeight: '67vh' }}>
        {loading && (
          <div role="progressbar" aria-label="Loading categories" className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={onRetry} data-testid="retry-button">Retry</Button>
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No categories found.</p>
          </div>
        )}
        {showVirtualBody && (
          <div className="relative w-full" style={{ height: `${totalSize}px` }}>
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const category = row.original;
              return (
                <div
                  key={row.id}
                  role="row"
                  aria-label={category.name}
                  data-testid={`category-row-${category.id}`}
                  className={`absolute inset-x-0 grid ${GRID_COLS} items-center border-b border-border bg-card hover:bg-accent/30 transition-colors`}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="px-4 py-2 min-w-0 overflow-hidden text-sm text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
