import { zodResolver } from '@hookform/resolvers/zod';
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
import { memo, useCallback, useEffect, useMemo } from 'react';
import {
  type Control,
  Controller,
  type UseFieldArrayRemove,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import {
  HangoutAutocomplete,
  SubcategoryAutocomplete,
} from '../../../components/pickers';
import { useHangoutsQuery } from '../../../services/hangouts';
import type { HangoutRead } from '../../../services/hangouts/types';
import { useSubcategoriesQuery } from '../../../services/subcategories';
import type { SubcategoryRead } from '../../../services/subcategories/types';
import { PICKER_LIST_PARAMS } from '../../../services/types';
import { themeTokens } from '../../../theme/tailwind';
import {
  type BulkTransactionsFormValues,
  bulkTransactionsFormSchema,
} from './schema';
import type { BulkTransactionsDialogProps } from './types';

function getDefaultDate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function makeEmptyRow() {
  return {
    date: getDefaultDate(),
    subcategory_id: '',
    hangout_id: '',
    value: '',
    description: '',
  };
}

type BulkTransactionRowProps = Readonly<{
  index: number;
  subcategoryOptions: SubcategoryRead[];
  hangoutOptions: HangoutRead[];
  queryEnabled: boolean;
  canRemove: boolean;
  submitting: boolean;
  remove: UseFieldArrayRemove;
  control: Control<BulkTransactionsFormValues>;
}>;

const BulkTransactionRow = memo(function BulkTransactionRow({
  index,
  subcategoryOptions,
  hangoutOptions,
  queryEnabled,
  canRemove,
  submitting,
  remove,
  control,
}: BulkTransactionRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(140px,1fr) minmax(200px,1.3fr) minmax(160px,1fr) 100px minmax(120px,1.2fr) auto',
        gap: 1,
        alignItems: 'start',
      }}
    >
      <Controller
        name={`rows.${index}.date`}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Date"
            type="date"
            size="small"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-input': { color: themeTokens.textPrimary },
              '& .MuiInputLabel-root': {
                color: themeTokens.textSecondary,
              },
            }}
          />
        )}
      />
      <Controller
        name={`rows.${index}.subcategory_id`}
        control={control}
        render={({ field, fieldState }) => (
          <SubcategoryAutocomplete
            label="Subcategory"
            value={field.value}
            onChange={field.onChange}
            required
            queryEnabled={queryEnabled}
            externalOptions={subcategoryOptions}
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name={`rows.${index}.hangout_id`}
        control={control}
        render={({ field }) => (
          <HangoutAutocomplete
            label="Hangout"
            value={field.value}
            onChange={field.onChange}
            allowEmpty
            queryEnabled={queryEnabled}
            externalOptions={hangoutOptions}
          />
        )}
      />
      <Controller
        name={`rows.${index}.value`}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Value"
            type="number"
            size="small"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            inputProps={{ step: 1 }}
            sx={{
              '& .MuiInputBase-input': { color: themeTokens.textPrimary },
              '& .MuiInputLabel-root': {
                color: themeTokens.textSecondary,
              },
            }}
          />
        )}
      />
      <Controller
        name={`rows.${index}.description`}
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Description"
            size="small"
            error={Boolean(fieldState.error)}
            helperText={fieldState.error?.message}
            sx={{
              '& .MuiInputBase-input': { color: themeTokens.textPrimary },
              '& .MuiInputLabel-root': {
                color: themeTokens.textSecondary,
              },
            }}
          />
        )}
      />
      <IconButton
        type="button"
        onClick={() => remove(index)}
        disabled={!canRemove || submitting}
        aria-label={`Remove row ${index + 1}`}
        sx={{ color: themeTokens.textSecondary }}
      >
        <DeleteOutlined />
      </IconButton>
    </Box>
  );
});

export function BulkTransactionsDialog({
  open,
  onClose,
  onSubmit,
  submitError,
  submitting,
}: BulkTransactionsDialogProps) {
  const { data: subcategoriesPage } = useSubcategoriesQuery(
    PICKER_LIST_PARAMS,
    {
      enabled: open,
    },
  );
  const { data: hangoutsPage } = useHangoutsQuery(PICKER_LIST_PARAMS, {
    enabled: open,
  });

  const subcategoryOptions = useMemo(
    () => subcategoriesPage?.items ?? [],
    [subcategoriesPage?.items],
  );
  const hangoutOptions = useMemo(
    () => hangoutsPage?.items ?? [],
    [hangoutsPage?.items],
  );

  const form = useForm<BulkTransactionsFormValues>({
    resolver: zodResolver(bulkTransactionsFormSchema),
    defaultValues: { rows: [makeEmptyRow()] },
  });

  const { control, handleSubmit, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows',
  });

  useEffect(() => {
    if (open) {
      reset({ rows: [makeEmptyRow()] });
    }
  }, [open, reset]);

  const onValid = useCallback(
    async (data: BulkTransactionsFormValues) => {
      const transactions = data.rows.map((row) => ({
        subcategory_id: row.subcategory_id.trim(),
        value: Number(row.value.trim()),
        description: row.description.trim(),
        date: row.date.trim(),
        hangout_id: row.hangout_id.trim() === '' ? null : row.hangout_id.trim(),
      }));
      try {
        await onSubmit({ transactions });
        onClose();
      } catch {
        // Parent sets submitError; dialog stays open for retry
      }
    },
    [onSubmit, onClose],
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
      <form onSubmit={handleSubmit(onValid)}>
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
            {fields.map((field, index) => (
              <BulkTransactionRow
                key={field.id}
                index={index}
                control={control}
                subcategoryOptions={subcategoryOptions}
                hangoutOptions={hangoutOptions}
                queryEnabled={open}
                canRemove={fields.length > 1}
                submitting={submitting}
                remove={remove}
              />
            ))}
          </Box>
          <Button
            type="button"
            variant="outlined"
            onClick={() => append(makeEmptyRow())}
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
            disabled={submitting || fields.length === 0}
            sx={{ backgroundColor: themeTokens.primary }}
          >
            {submitting ? 'Creating…' : 'Create all'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
