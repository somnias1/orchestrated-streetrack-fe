import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { themeTokens } from "../../../theme/tailwind";
import { type TransactionFormValues, transactionFormSchema } from "./schema";
import type {
  TransactionFormDialogProps,
  TransactionFormPayload,
} from "./types";

function toPayload(values: TransactionFormValues): TransactionFormPayload {
  return {
    subcategory_id: values.subcategory_id,
    value: values.value,
    description: values.description.trim(),
    date: values.date,
    hangout_id: values.hangout_id === "" ? null : values.hangout_id,
  };
}

export function TransactionFormDialog({
  open,
  onClose,
  initialValues,
  onSubmit,
  submitError,
  subcategoryOptions,
  hangoutOptions,
}: TransactionFormDialogProps) {
  const isEdit = initialValues !== null;
  const [subcategory_id, setSubcategoryId] = useState(
    initialValues?.subcategory_id ?? "",
  );
  const [value, setValue] = useState(
    initialValues?.value !== undefined ? String(initialValues.value) : "",
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [date, setDate] = useState(initialValues?.date ?? "");
  const [hangout_id, setHangoutId] = useState(initialValues?.hangout_id ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSubcategoryId(initialValues?.subcategory_id ?? "");
      setValue(
        initialValues?.value !== undefined ? String(initialValues.value) : "",
      );
      setDescription(initialValues?.description ?? "");
      setDate(initialValues?.date ?? "");
      setHangoutId(initialValues?.hangout_id ?? "");
      setFieldErrors({});
    }
  }, [open, initialValues]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const raw = {
        subcategory_id: subcategory_id.trim(),
        value: value.trim() === "" ? NaN : Number(value),
        description: description.trim(),
        date: date.trim(),
        hangout_id: hangout_id.trim() === "" ? null : hangout_id.trim(),
      };
      const parsed = transactionFormSchema.safeParse({
        subcategory_id: raw.subcategory_id,
        value: raw.value,
        description: raw.description,
        date: raw.date,
        hangout_id: raw.hangout_id,
      });
      if (!parsed.success) {
        const errors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const path = issue.path[0]?.toString() ?? "form";
          if (!errors[path]) errors[path] = issue.message;
        }
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setSubmitting(true);
      try {
        await onSubmit(toPayload(parsed.data));
        onClose();
      } catch {
        // Store sets error; parent can pass submitError
      } finally {
        setSubmitting(false);
      }
    },
    [subcategory_id, value, description, date, hangout_id, onSubmit, onClose],
  );

  const handleClose = useCallback(() => {
    if (!submitting) onClose();
  }, [onClose, submitting]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          {isEdit ? "Edit transaction" : "Create transaction"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {submitError && <FormHelperText error>{submitError}</FormHelperText>}
          <FormControl fullWidth error={Boolean(fieldErrors.subcategory_id)}>
            <InputLabel
              id="transaction-subcategory-label"
              sx={{ color: themeTokens.textSecondary }}
            >
              Subcategory
            </InputLabel>
            <Select
              labelId="transaction-subcategory-label"
              value={subcategory_id}
              label="Subcategory"
              onChange={(e) => setSubcategoryId(e.target.value)}
              sx={{
                color: themeTokens.textPrimary,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: themeTokens.border,
                },
              }}
            >
              {subcategoryOptions.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.name} ({sub.belongs_to_income ? "Income" : "Expense"})
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.subcategory_id && (
              <FormHelperText>{fieldErrors.subcategory_id}</FormHelperText>
            )}
          </FormControl>
          <TextField
            label="Value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            fullWidth
            error={Boolean(fieldErrors.value)}
            helperText={fieldErrors.value}
            inputProps={{ "aria-label": "Transaction value", step: 1 }}
            sx={{
              "& .MuiInputBase-input": { color: themeTokens.textPrimary },
              "& .MuiInputLabel-root": { color: themeTokens.textSecondary },
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            error={Boolean(fieldErrors.description)}
            helperText={fieldErrors.description}
            inputProps={{ "aria-label": "Transaction description" }}
            sx={{
              "& .MuiInputBase-input": { color: themeTokens.textPrimary },
              "& .MuiInputLabel-root": { color: themeTokens.textSecondary },
            }}
          />
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
            error={Boolean(fieldErrors.date)}
            helperText={fieldErrors.date}
            InputLabelProps={{ shrink: true }}
            inputProps={{ "aria-label": "Transaction date" }}
            sx={{
              "& .MuiInputBase-input": { color: themeTokens.textPrimary },
              "& .MuiInputLabel-root": { color: themeTokens.textSecondary },
            }}
          />
          <FormControl fullWidth error={Boolean(fieldErrors.hangout_id)}>
            <InputLabel
              id="transaction-hangout-label"
              sx={{ color: themeTokens.textSecondary }}
            >
              Hangout
            </InputLabel>
            <Select
              labelId="transaction-hangout-label"
              value={hangout_id}
              label="Hangout"
              onChange={(e) => setHangoutId(e.target.value)}
              sx={{
                color: themeTokens.textPrimary,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: themeTokens.border,
                },
              }}
            >
              <MenuItem value="">None</MenuItem>
              {hangoutOptions.map((h) => (
                <MenuItem key={h.id} value={h.id}>
                  {h.name}
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.hangout_id && (
              <FormHelperText>{fieldErrors.hangout_id}</FormHelperText>
            )}
          </FormControl>
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
            disabled={submitting}
            sx={{ backgroundColor: themeTokens.primary }}
          >
            {submitting ? "Saving…" : isEdit ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
