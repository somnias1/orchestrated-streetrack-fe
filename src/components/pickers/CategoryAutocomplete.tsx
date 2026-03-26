import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useMemo, useState } from 'react';
import {
  useCategoriesQuery,
  useCategoryQuery,
} from '../../services/categories';
import type { CategoryRead } from '../../services/categories/types';
import { PICKER_LIST_PARAMS } from '../../services/types';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../theme/tailwind';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { PICKER_SEARCH_DEBOUNCE_MS } from './constants';

export function categoryOptionLabel(c: CategoryRead): string {
  return `${c.name} (${c.is_income ? 'Income' : 'Expense'})`;
}

type CategoryAutocompleteProps = Readonly<{
  label: string;
  value: string;
  onChange: (id: string) => void;
  allowEmpty?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  /** When false, list + detail queries do not run (e.g. parent dialog closed). */
  queryEnabled?: boolean;
  'data-testid'?: string;
}>;

export function CategoryAutocomplete({
  label,
  value,
  onChange,
  allowEmpty = false,
  disabled,
  error,
  helperText,
  required,
  queryEnabled = true,
  'data-testid': dataTestId,
}: CategoryAutocompleteProps) {
  const [search, setSearch] = useState('');
  const debouncedName = useDebouncedValue(search, PICKER_SEARCH_DEBOUNCE_MS);
  const { data, isFetching } = useCategoriesQuery(
    {
      ...PICKER_LIST_PARAMS,
      name: debouncedName.trim() || undefined,
    },
    { enabled: queryEnabled },
  );
  const { data: detail, isFetching: fetchingDetail } = useCategoryQuery(
    value || undefined,
    {
      enabled: queryEnabled && Boolean(value),
    },
  );
  const options = data?.items ?? [];
  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((o) => o.id === value) ?? detail ?? null;
  }, [value, options, detail]);

  const loading = isFetching || (Boolean(value) && !selected && fetchingDetail);

  return (
    <Autocomplete<CategoryRead, false, boolean, false>
      fullWidth
      size="small"
      disabled={disabled}
      loading={loading}
      slotProps={{
        paper: {
          sx: selectMenuPaperSx,
        },
      }}
      options={options}
      filterOptions={(x) => x}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={categoryOptionLabel}
      value={selected}
      disableClearable={!allowEmpty}
      onChange={(_, newValue) => {
        onChange(newValue?.id ?? '');
        setSearch('');
      }}
      onInputChange={(_, v, reason) => {
        if (reason === 'input' || reason === 'clear') setSearch(v);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          inputProps={{
            ...params.inputProps,
            ...(dataTestId ? { 'data-testid': dataTestId } : {}),
          }}
          sx={{
            ...selectFormControlSx,
            '& .MuiOutlinedInput-root': {
              ...selectThemedSx,
              '& .MuiAutocomplete-input': {
                color: themeTokens.textPrimary,
              },
            },
          }}
        />
      )}
    />
  );
}
