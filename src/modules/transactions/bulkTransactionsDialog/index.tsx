import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  TextField,
} from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HangoutAutocomplete,
  SubcategoryAutocomplete,
} from '../../../components/pickers';
import { themeTokens } from '../../../theme/tailwind';
import { type BulkRowParsed, bulkRowSchema } from './schema';
import type { BulkRowFormValues, BulkTransactionsDialogProps } from './types';

function getDefaultDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

type BulkRowWithId = BulkRowFormValues & { id: string };

function makeDefaultRow(id: string): BulkRowWithId {
  return {
    id,
    date: getDefaultDate(),
    subcategory_id: '',
    hangout_id: '',
    value: '',
    description: '',
  };
}

export function BulkTransactionsDialog({
  open,
  onClose,
  onSubmit,
  submitError,
  submitting,
}: BulkTransactionsDialogProps) {
  const nextIdRef = useRef(0);
  const [rows, setRows] = useState<BulkRowWithId[]>(() => [
    makeDefaultRow(`bulk-${nextIdRef.current++}`),
  ]);
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      nextIdRef.current = 0;
      setRows([makeDefaultRow(`bulk-${nextIdRef.current++}`)]);
      setRowErrors({});
    }
  }, [open]);

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, makeDefaultRow(`bulk-${nextIdRef.current++}`)]);
  }, []);

  const removeRow = useCallback((index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setRowErrors((prev) => {
      const next: Record<string, string> = {};
      for (const [key, msg] of Object.entries(prev)) {
        const parts = key.split('_');
        const i = Number(parts[1]);
        const field = parts.slice(2).join('_');
        if (i === index) continue;
        if (i > index) next[`row_${i - 1}_${field}`] = msg;
        else next[key] = msg;
      }
      return next;
    });
  }, []);

  const updateRow = useCallback(
    (index: number, field: keyof BulkRowFormValues, value: string) => {
      setRows((prev) =>
        prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
      );
      const key = `row_${index}_${field}`;
      setRowErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (rows.length === 0) return;
      const errors: Record<string, string> = {};
      const parsedRows: BulkRowParsed[] = [];
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const raw = {
          subcategory_id: r.subcategory_id.trim(),
          value: r.value.trim() === '' ? NaN : Number(r.value),
          description: r.description.trim(),
          date: r.date.trim(),
          hangout_id: r.hangout_id.trim() === '' ? null : r.hangout_id.trim(),
        };
        const parsed = bulkRowSchema.safeParse(raw);
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            const path = issue.path[0]?.toString() ?? 'form';
            errors[`row_${i}_${path}`] = issue.message;
          }
          continue;
        }
        parsedRows.push(parsed.data);
      }
      if (Object.keys(errors).length > 0) {
        setRowErrors(errors);
        return;
      }
      setRowErrors({});
      const transactions = parsedRows.map((p) => ({
        subcategory_id: p.subcategory_id,
        value: p.value,
        description: p.description,
        date: p.date,
        hangout_id: p.hangout_id,
      }));
      try {
        await onSubmit({ transactions });
        onClose();
      } catch {
        // Parent sets submitError; dialog stays open for retry
      }
    },
    [rows, onSubmit, onClose],
  );

  const handleClose = useCallback(() => {
    if (!submitting) onClose();
  }, [onClose, submitting]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: themeTokens.surface,
          border: `1px solid ${themeTokens.border}`,
          color: themeTokens.textPrimary,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ color: themeTokens.textPrimary }}>
          Bulk create transactions
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              maxHeight: '45vh',
              overflow: 'auto',
            }}
          >
            {rows.map((row, index) => (
              <Box
                key={row.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns:
                    'minmax(140px,1fr) minmax(200px,1.3fr) minmax(160px,1fr) 100px minmax(120px,1.2fr) auto',
                  gap: 1,
                  alignItems: 'start',
                }}
              >
                <TextField
                  label="Date"
                  type="date"
                  size="small"
                  value={row.date}
                  onChange={(e) => updateRow(index, 'date', e.target.value)}
                  error={Boolean(rowErrors[`row_${index}_date`])}
                  helperText={rowErrors[`row_${index}_date`]}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                    '& .MuiInputLabel-root': {
                      color: themeTokens.textSecondary,
                    },
                  }}
                />
                <SubcategoryAutocomplete
                  label="Subcategory"
                  value={row.subcategory_id}
                  onChange={(id) => updateRow(index, 'subcategory_id', id)}
                  required
                  queryEnabled={open}
                  error={Boolean(rowErrors[`row_${index}_subcategory_id`])}
                  helperText={rowErrors[`row_${index}_subcategory_id`]}
                />
                <HangoutAutocomplete
                  label="Hangout"
                  value={row.hangout_id}
                  onChange={(id) => updateRow(index, 'hangout_id', id)}
                  allowEmpty
                  queryEnabled={open}
                />
                <TextField
                  label="Value"
                  type="number"
                  size="small"
                  value={row.value}
                  onChange={(e) => updateRow(index, 'value', e.target.value)}
                  error={Boolean(rowErrors[`row_${index}_value`])}
                  helperText={rowErrors[`row_${index}_value`]}
                  inputProps={{ step: 1 }}
                  sx={{
                    '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                    '& .MuiInputLabel-root': {
                      color: themeTokens.textSecondary,
                    },
                  }}
                />
                <TextField
                  label="Description"
                  size="small"
                  value={row.description}
                  onChange={(e) =>
                    updateRow(index, 'description', e.target.value)
                  }
                  error={Boolean(rowErrors[`row_${index}_description`])}
                  helperText={rowErrors[`row_${index}_description`]}
                  sx={{
                    '& .MuiInputBase-input': { color: themeTokens.textPrimary },
                    '& .MuiInputLabel-root': {
                      color: themeTokens.textSecondary,
                    },
                  }}
                />
                <IconButton
                  type="button"
                  onClick={() => removeRow(index)}
                  disabled={rows.length <= 1}
                  aria-label={`Remove row ${index + 1}`}
                  sx={{ color: themeTokens.textSecondary }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Button
            type="button"
            variant="outlined"
            onClick={addRow}
            sx={{ alignSelf: 'flex-start', borderColor: themeTokens.border }}
          >
            Add row
          </Button>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            sx={{ color: themeTokens.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || rows.length === 0}
            sx={{ backgroundColor: themeTokens.primary }}
          >
            {submitting ? 'Creating…' : 'Create all'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
