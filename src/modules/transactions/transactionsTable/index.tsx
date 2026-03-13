import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
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
import type { TransactionRead } from '../../../services/transactions/types';
import { themeTokens } from '../../../theme/tailwind';
import { formatDate, formatValue } from '../../../utils';
import {
  COLUMN_SIZES,
  GRID_TEMPLATE_FR,
  ROW_HEIGHT,
  STATE_ROW_MIN_HEIGHT,
  TABLE_MIN_HEIGHT,
  TABLE_WIDTH,
} from './constants';
import type { TransactionsTableProps } from './types';

function createColumns(
  onEdit: (transaction: TransactionRead) => void,
  onDelete: (transaction: TransactionRead) => void,
): ColumnDef<TransactionRead>[] {
  return [
    {
      accessorKey: 'description',
      header: 'Description',
      size: COLUMN_SIZES[0],
      cell: (info) => {
        const value = info.getValue<string>();
        const truncated = value.length > 40 ? `${value.slice(0, 40)}…` : value;
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
        return value.length > 40 ? (
          <Tooltip title={value} placement="top-start">
            {cell}
          </Tooltip>
        ) : (
          cell
        );
      },
    },
    {
      accessorKey: 'value',
      header: 'Value',
      size: COLUMN_SIZES[1],
      cell: (info) => (
        <Typography
          variant="body2"
          sx={{
            color: themeTokens.textPrimary,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatValue(info.getValue<number>())}
        </Typography>
      ),
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
      accessorKey: 'subcategory_name',
      header: 'Subcategory',
      size: COLUMN_SIZES[3],
      cell: (info) => {
        const row = info.row.original;
        const display = row.subcategory_name?.trim() || '—';
        return (
          <Typography variant="body2" sx={{ color: themeTokens.textSecondary }}>
            {display}
          </Typography>
        );
      },
    },
    {
      accessorKey: 'hangout_name',
      header: 'Hangout',
      size: COLUMN_SIZES[4],
      cell: (info) => {
        const row = info.row.original;
        const display = row.hangout_name?.trim() || '—';
        return (
          <Typography variant="body2" sx={{ color: themeTokens.textSecondary }}>
            {display}
          </Typography>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: COLUMN_SIZES[5],
      cell: (info) => {
        const transaction = info.row.original;
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(transaction)}
                aria-label={`Edit transaction ${transaction.description}`}
                sx={{ color: themeTokens.primary }}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(transaction)}
                aria-label={`Delete transaction ${transaction.description}`}
                sx={{ color: themeTokens.error }}
              >
                <DeleteOutlineRounded fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
}: TransactionsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = createColumns(onEdit, onDelete);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnsLength = columns.length;

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
      {/* Header outside scroll area so it never scrolls away */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: GRID_TEMPLATE_FR,
          width: '100%',
          minWidth: TABLE_WIDTH,
          backgroundColor: themeTokens.surface,
          borderBottom: `1px solid ${themeTokens.border}`,
          boxSizing: 'border-box',
        }}
      >
        {table.getHeaderGroups().flatMap((group) =>
          group.headers.map((header) => (
            <Box
              key={header.id}
              component="div"
              role="columnheader"
              sx={{
                px: 2,
                py: 1.5,
                textAlign: 'left',
                backgroundColor: themeTokens.surface,
                color: themeTokens.textPrimary,
                fontWeight: 600,
                minWidth: 0,
                border: 0,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
            </Box>
          )),
        )}
      </Box>
      <Box
        ref={parentRef}
        sx={{
          overflow: 'auto',
          minHeight: TABLE_MIN_HEIGHT,
          maxHeight: '67vh',
        }}
      >
        <Table
          sx={{
            width: '100%',
            minWidth: TABLE_WIDTH,
            tableLayout: 'fixed',
          }}
        >
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columnsLength}
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 6,
                    textAlign: 'center',
                    minHeight: STATE_ROW_MIN_HEIGHT,
                    verticalAlign: 'middle',
                  }}
                >
                  <CircularProgress sx={{ color: themeTokens.primary }} />
                </TableCell>
              </TableRow>
            )}
            {!loading && error && (
              <TableRow>
                <TableCell
                  colSpan={columnsLength}
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 3,
                    textAlign: 'center',
                    minHeight: STATE_ROW_MIN_HEIGHT,
                    verticalAlign: 'middle',
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
                  colSpan={columnsLength}
                  align="center"
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 3,
                    color: themeTokens.textSecondary,
                    minHeight: STATE_ROW_MIN_HEIGHT,
                    verticalAlign: 'middle',
                  }}
                >
                  No transactions found.
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
              minWidth: TABLE_WIDTH,
              height: `${totalSize}px`,
            }}
          >
            {virtualItems.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const transaction = row.original;
              return (
                <Box
                  key={row.id}
                  component="div"
                  role="row"
                  aria-label={transaction.description}
                  data-testid={`transaction-row-${transaction.id}`}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    display: 'grid',
                    gridTemplateColumns: GRID_TEMPLATE_FR,
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
