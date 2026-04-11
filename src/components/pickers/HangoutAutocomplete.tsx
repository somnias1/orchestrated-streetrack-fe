import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useMemo, useState } from 'react';
import { useHangoutQuery, useHangoutsQuery } from '../../services/hangouts';
import type { HangoutRead } from '../../services/hangouts/types';
import { PICKER_LIST_PARAMS } from '../../services/types';
import {
  selectFormControlSx,
  selectMenuPaperSx,
  selectThemedSx,
  themeTokens,
} from '../../theme/tailwind';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { PICKER_SEARCH_DEBOUNCE_MS } from './constants';

type HangoutAutocompleteProps = Readonly<{
  label: string;
  value: string;
  onChange: (id: string) => void;
  /**
   * When set, list items come from the parent; client-side filter by debounced input.
   * Internal list query is skipped.
   */
  externalOptions?: HangoutRead[];
  allowEmpty?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  queryEnabled?: boolean;
  'data-testid'?: string;
}>;

export function HangoutAutocomplete({
  label,
  value,
  onChange,
  externalOptions,
  allowEmpty = false,
  disabled,
  error,
  helperText,
  required,
  queryEnabled = true,
  'data-testid': dataTestId,
}: HangoutAutocompleteProps) {
  const [search, setSearch] = useState('');
  const debouncedName = useDebouncedValue(search, PICKER_SEARCH_DEBOUNCE_MS);
  const useInternalList = externalOptions === undefined;
  const { data, isFetching } = useHangoutsQuery(
    {
      ...PICKER_LIST_PARAMS,
      name: debouncedName.trim() || undefined,
    },
    { enabled: queryEnabled && useInternalList },
  );
  const { data: detail, isFetching: fetchingDetail } = useHangoutQuery(
    value || undefined,
    {
      enabled: queryEnabled && Boolean(value),
    },
  );
  const fetchedItems = data?.items ?? [];
  const options = useMemo(() => {
    if (!useInternalList) {
      const q = debouncedName.trim().toLowerCase();
      if (!q) return externalOptions ?? [];
      return (externalOptions ?? []).filter((h) =>
        h.name.toLowerCase().includes(q),
      );
    }
    return fetchedItems;
  }, [useInternalList, externalOptions, fetchedItems, debouncedName]);
  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((o) => o.id === value) ?? detail ?? null;
  }, [value, options, detail]);

  const loading = isFetching || (Boolean(value) && !selected && fetchingDetail);

  return (
    <Autocomplete<HangoutRead, false, boolean, false>
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
      getOptionLabel={(h) => h.name}
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
