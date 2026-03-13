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
  TableContainer,
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
import {
  COLUMN_SIZES,
  GRID_TEMPLATE_FR,
  ROW_HEIGHT,
  STATE_ROW_MIN_HEIGHT,
  TABLE_MIN_HEIGHT,
  TABLE_WIDTH,
} from './constants';
import type { CategoriesTableProps } from './types';

function createColumns(
  onEdit: (category: CategoryRead) => void,
  onDelete: (category: CategoryRead) => void,
): ColumnDef<CategoryRead>[] {
  return [
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
      cell: (info) => {
        const category = info.row.original;
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(category)}
                data-testid="edit-button"
                aria-label={`Edit ${category.name}`}
                sx={{ color: themeTokens.primary }}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(category)}
                data-testid="delete-button"
                aria-label={`Delete ${category.name}`}
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

export function CategoriesTable({
  items,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const columns = createColumns(onEdit, onDelete);

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
        <TableContainer
          sx={{
            width: '100%',
            minWidth: TABLE_WIDTH,
            tableLayout: 'fixed',
          }}
        >
          <Table aria-label="categories table">
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
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
                    colSpan={columns.length}
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
                      data-testid="retry-button"
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
                    align="center"
                    sx={{
                      borderBottom: `1px solid ${themeTokens.border}`,
                      py: 3,
                      color: themeTokens.textSecondary,
                      minHeight: STATE_ROW_MIN_HEIGHT,
                      verticalAlign: 'middle',
                    }}
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
              const category = row.original;
              return (
                <Box
                  key={row.id}
                  component="div"
                  role="row"
                  aria-label={category.name}
                  data-testid={`category-row-${category.id}`}
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
