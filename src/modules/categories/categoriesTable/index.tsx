import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import type { CategoryRead } from '../../../services/categories/types';
import { themeTokens } from '../../../theme/tailwind';
import { CategoryTypeChip } from './CategoryTypeChip';
import type { CategoriesTableProps } from './types';

const ROW_HEIGHT = 48;
const TABLE_MIN_HEIGHT = 400;
const COLUMN_SIZES = [180, 280, 120, 100] as const;
const GRID_TEMPLATE = COLUMN_SIZES.map((s) => `${s}px`).join(' ');

const columns: ColumnDef<CategoryRead>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: COLUMN_SIZES[0],
    cell: (info) => (
      <Typography variant="body2" sx={{ color: themeTokens.textPrimary }}>
        {info.getValue<string>()}
      </Typography>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: COLUMN_SIZES[1],
    cell: (info) => {
      const value = info.getValue<string | null>();
      const text = value ?? '—';
      const truncated = text.length > 60 ? `${text.slice(0, 60)}…` : text;
      const cell = (
        <Typography
          variant="body2"
          sx={{
            color: themeTokens.textSecondary,
            maxWidth: 260,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncated}
        </Typography>
      );
      return text.length > 60 ? (
        <Tooltip title={text} placement="top-start">
          {cell}
        </Tooltip>
      ) : (
        cell
      );
    },
  },
  {
    accessorKey: 'is_income',
    header: 'Type',
    size: COLUMN_SIZES[2],
    cell: (info) => <CategoryTypeChip isIncome={info.getValue<boolean>()} />,
  },
  {
    id: 'actions',
    header: 'Actions',
    size: COLUMN_SIZES[3],
    cell: () => (
      <Typography variant="body2" sx={{ color: themeTokens.textSecondary }}>
        —
      </Typography>
    ),
  },
];

export function CategoriesTable({
  items,
  loading,
  error,
  onRetry,
}: CategoriesTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    <Box
      sx={{
        backgroundColor: themeTokens.surface,
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <Box
        ref={parentRef}
        sx={{
          overflow: 'auto',
          minHeight: TABLE_MIN_HEIGHT,
          maxHeight: '60vh',
        }}
      >
        <Table stickyHeader sx={{ minWidth: 560 }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    variant="head"
                    sx={{
                      backgroundColor: themeTokens.surface,
                      color: themeTokens.textPrimary,
                      borderBottom: `1px solid ${themeTokens.border}`,
                      fontWeight: 600,
                      width: header.getSize(),
                      minWidth: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 6,
                    textAlign: 'center',
                  }}
                >
                  <CircularProgress sx={{ color: themeTokens.primary }} />
                </TableCell>
              </TableRow>
            )}
            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 3,
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ color: themeTokens.error, mb: 2 }}>
                    {error}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={onRetry}
                    sx={{ backgroundColor: themeTokens.primary }}
                  >
                    Retry
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 3,
                    color: themeTokens.textSecondary,
                  }}
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {showVirtualBody && (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: `${totalSize}px`,
              minWidth: 560,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <Box
                  key={row.id}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'grid',
                    gridTemplateColumns: GRID_TEMPLATE,
                    alignItems: 'center',
                    borderBottom: `1px solid ${themeTokens.border}`,
                    backgroundColor: themeTokens.surface,
                    '&:hover': {
                      backgroundColor: themeTokens.background,
                    },
                    boxSizing: 'border-box',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Box
                      key={cell.id}
                      sx={{
                        px: 2,
                        py: 1.5,
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
