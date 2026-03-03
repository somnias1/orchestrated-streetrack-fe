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
import type { HangoutRead } from '../../../services/hangouts/types';
import { themeTokens } from '../../../theme/tailwind';
import type { HangoutsTableProps } from './types';

const ROW_HEIGHT = 48;
const TABLE_MIN_HEIGHT = 400;
const COLUMN_SIZES = [200, 280, 120, 80] as const;
const GRID_TEMPLATE = COLUMN_SIZES.map((s) => `${s}px`).join(' ');

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? dateStr : d.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

const columns: ColumnDef<HangoutRead>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: COLUMN_SIZES[0],
    cell: (info) => {
      const value = info.getValue<string>();
      const truncated = value.length > 36 ? `${value.slice(0, 36)}…` : value;
      const cell = (
        <Typography
          variant="body2"
          sx={{
            color: themeTokens.textPrimary,
            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncated}
        </Typography>
      );
      return value.length > 36 ? (
        <Tooltip title={value} placement="top-start">
          {cell}
        </Tooltip>
      ) : (
        cell
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: COLUMN_SIZES[1],
    cell: (info) => {
      const value = info.getValue<string | null>();
      if (!value) {
        return (
          <Typography variant="body2" sx={{ color: themeTokens.textSecondary }}>
            —
          </Typography>
        );
      }
      const truncated = value.length > 50 ? `${value.slice(0, 50)}…` : value;
      const cell = (
        <Typography
          variant="body2"
          sx={{
            color: themeTokens.textPrimary,
            maxWidth: 260,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncated}
        </Typography>
      );
      return value.length > 50 ? (
        <Tooltip title={value} placement="top-start">
          {cell}
        </Tooltip>
      ) : (
        cell
      );
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    size: COLUMN_SIZES[2],
    cell: (info) => (
      <Typography variant="body2" sx={{ color: themeTokens.textSecondary }}>
        {formatDate(info.getValue<string>())}
      </Typography>
    ),
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

export function HangoutsTable({
  items,
  loading,
  error,
  onRetry,
}: HangoutsTableProps) {
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
        <Table stickyHeader sx={{ minWidth: 700 }}>
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
                  No hangouts found.
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
              minWidth: 700,
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
