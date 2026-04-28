import { useMemo, useState } from 'react';
import {
  useSubcategoriesQuery,
  useSubcategoryQuery,
} from '../../services/subcategories';
import type { SubcategoryRead } from '../../services/subcategories/types';
import { PICKER_LIST_PARAMS } from '../../services/types';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { Combobox, type ComboboxOption } from './Combobox';
import { PICKER_SEARCH_DEBOUNCE_MS } from './constants';

export function subcategoryToOption(s: SubcategoryRead): ComboboxOption {
  return {
    value: s.id,
    label: `${s.name} (${s.belongs_to_income ? 'Income' : 'Expense'})`,
  };
}

type SubcategoryComboboxProps = Readonly<{
  value: string;
  onChange: (id: string) => void;
  externalOptions?: SubcategoryRead[];
  disabled?: boolean;
  queryEnabled?: boolean;
  'data-testid'?: string;
  'aria-label'?: string;
  className?: string;
}>;

export function SubcategoryCombobox({
  value,
  onChange,
  externalOptions,
  disabled,
  queryEnabled = true,
  'data-testid': dataTestId,
  'aria-label': ariaLabel,
  className,
}: SubcategoryComboboxProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, PICKER_SEARCH_DEBOUNCE_MS);
  const useInternalList = externalOptions === undefined;

  const { data, isFetching } = useSubcategoriesQuery(
    { ...PICKER_LIST_PARAMS, name: debouncedSearch.trim() || undefined },
    { enabled: queryEnabled && useInternalList },
  );

  const { data: detail } = useSubcategoryQuery(value || undefined, {
    enabled: queryEnabled && Boolean(value),
  });

  const options = useMemo<ComboboxOption[]>(() => {
    if (!useInternalList) {
      return (externalOptions ?? []).map(subcategoryToOption);
    }
    const list = (data?.items ?? []).map(subcategoryToOption);
    if (!value || !detail || list.some((o) => o.value === value)) return list;
    return [subcategoryToOption(detail), ...list];
  }, [useInternalList, externalOptions, data, value, detail]);

  const externalComboboxOptions = useInternalList ? undefined : options;
  const internalComboboxOptions = useInternalList ? options : undefined;

  return (
    <Combobox
      options={internalComboboxOptions}
      externalOptions={externalComboboxOptions}
      value={value}
      onChange={onChange}
      placeholder="Select subcategory…"
      searchPlaceholder="Search subcategory…"
      emptyText="No subcategories found"
      disabled={disabled}
      loading={isFetching && useInternalList}
      onSearch={useInternalList ? setSearch : undefined}
      className={className}
      data-testid={dataTestId}
      aria-label={ariaLabel}
    />
  );
}
