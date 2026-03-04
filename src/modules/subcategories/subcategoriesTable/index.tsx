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
import type { SubcategoryRead } from '../../../services/subcategories/types';
import { themeTokens } from '../../../theme/tailwind';
import { CategoryTypeChip } from '../../categories/categoriesTable/CategoryTypeChip';
import type { SubcategoriesTableProps } from './types';

const ROW_HEIGHT = 48;
const TABLE_MIN_HEIGHT = 400;
/** Min height for loading/error/empty state row so body area is consistent (§5.1) */
const STATE_ROW_MIN_HEIGHT = TABLE_MIN_HEIGHT - ROW_HEIGHT;
const COLUMN_SIZES = [160, 240, 120, 140, 80] as const;
const GRID_TEMPLATE = COLUMN_SIZES.map((s) => `${s}px`).join(' ');

function truncateUuid(uuid: string): string {
  if (uuid.length <= 12) return uuid;
  return `${uuid.slice(0, 8)}…`;
}

function createColumns(
  onEdit: (subcategory: SubcategoryRead) => void,
  onDelete: (subcategory: SubcategoryRead) => void,
): ColumnDef<SubcategoryRead>[] {
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
        const truncated = text.length > 50 ? `${text.slice(0, 50)}…` : text;
        const cell = (
          <Typography
            variant="body2"
            sx={{
              color: themeTokens.textSecondary,
              maxWidth: 220,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {truncated}
          </Typography>
        );
        return text.length > 50 ? (
          <Tooltip title={text} placement="top-start">
            {cell}
          </Tooltip>
        ) : (
          cell
        );
      },
    },
    {
      accessorKey: 'belongs_to_income',
      header: 'Type',
      size: COLUMN_SIZES[2],
      cell: (info) => <CategoryTypeChip isIncome={info.getValue<boolean>()} />,
    },
    {
      accessorKey: 'category_id',
      header: 'Category ID',
      size: COLUMN_SIZES[3],
      cell: (info) => (
        <Typography
          variant="body2"
          sx={{
            color: themeTokens.textSecondary,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
          }}
        >
          {truncateUuid(info.getValue<string>())}
        </Typography>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: COLUMN_SIZES[4],
      cell: (info) => {
        const subcategory = info.row.original;
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(subcategory)}
                aria-label={`Edit ${subcategory.name}`}
                sx={{ color: themeTokens.primary }}
              >
                <EditRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete(subcategory)}
                aria-label={`Delete ${subcategory.name}`}
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

export function SubcategoriesTable({
  items,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
}: SubcategoriesTableProps) {
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
      <Box
        ref={parentRef}
        sx={{
          overflow: 'auto',
          minHeight: TABLE_MIN_HEIGHT,
          maxHeight: '60vh',
        }}
      >
        <Table stickyHeader sx={{ minWidth: 760 }}>
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
                  sx={{
                    borderBottom: `1px solid ${themeTokens.border}`,
                    py: 3,
                    color: themeTokens.textSecondary,
                    minHeight: STATE_ROW_MIN_HEIGHT,
                    verticalAlign: 'middle',
                  }}
                >
                  No subcategories found.
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
              minWidth: 760,
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
