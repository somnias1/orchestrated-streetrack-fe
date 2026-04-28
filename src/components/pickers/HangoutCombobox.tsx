import { useMemo, useState } from 'react';
import { useHangoutQuery, useHangoutsQuery } from '../../services/hangouts';
import type { HangoutRead } from '../../services/hangouts/types';
import { PICKER_LIST_PARAMS } from '../../services/types';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { Combobox, type ComboboxOption } from './Combobox';
import { PICKER_SEARCH_DEBOUNCE_MS } from './constants';

function hangoutToOption(h: HangoutRead): ComboboxOption {
  return { value: h.id, label: h.name };
}

type HangoutComboboxProps = Readonly<{
  value: string;
  onChange: (id: string) => void;
  externalOptions?: HangoutRead[];
  disabled?: boolean;
  queryEnabled?: boolean;
  'data-testid'?: string;
  'aria-label'?: string;
  className?: string;
}>;

export function HangoutCombobox({
  value,
  onChange,
  externalOptions,
  disabled,
  queryEnabled = true,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  className,
}: HangoutComboboxProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, PICKER_SEARCH_DEBOUNCE_MS);
  const useInternalList = externalOptions === undefined;

  const { data, isFetching } = useHangoutsQuery(
    { ...PICKER_LIST_PARAMS, name: debouncedSearch.trim() || undefined },
    { enabled: queryEnabled && useInternalList },
  );

  const { data: detail } = useHangoutQuery(value || undefined, {
    enabled: queryEnabled && Boolean(value),
  });

  const options = useMemo<ComboboxOption[]>(() => {
    if (!useInternalList) {
      return (externalOptions ?? []).map(hangoutToOption);
    }
    const list = (data?.items ?? []).map(hangoutToOption);
    if (!value || !detail || list.some((o) => o.value === value)) return list;
    return [hangoutToOption(detail), ...list];
  }, [useInternalList, externalOptions, data, value, detail]);

  const externalComboboxOptions = useInternalList ? undefined : options;
  const internalComboboxOptions = useInternalList ? options : undefined;

  return (
    <Combobox
      options={internalComboboxOptions}
      externalOptions={externalComboboxOptions}
      value={value}
      onChange={onChange}
      placeholder="Select hangout…"
      searchPlaceholder="Search hangout…"
      emptyText="No hangouts found"
      disabled={disabled}
      loading={isFetching && useInternalList}
      onSearch={useInternalList ? setSearch : undefined}
      className={className}
      data-testid={dataTestId}
      aria-label={ariaLabel}
    />
  );
}
