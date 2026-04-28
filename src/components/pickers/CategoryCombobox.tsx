import { useMemo, useState } from 'react';
import {
  useCategoriesQuery,
  useCategoryQuery,
} from '../../services/categories';
import type { CategoryRead } from '../../services/categories/types';
import { PICKER_LIST_PARAMS } from '../../services/types';
import { useDebouncedValue } from '../../utils/useDebouncedValue';
import { Combobox, type ComboboxOption } from './Combobox';
import { PICKER_SEARCH_DEBOUNCE_MS } from './constants';

function categoryToOption(c: CategoryRead): ComboboxOption {
  return {
    value: c.id,
    label: `${c.name} (${c.is_income ? 'Income' : 'Expense'})`,
  };
}

type CategoryComboboxProps = Readonly<{
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  queryEnabled?: boolean;
  'data-testid'?: string;
  className?: string;
}>;

export function CategoryCombobox({
  value,
  onChange,
  disabled,
  queryEnabled = true,
  'data-testid': dataTestId,
  className,
}: CategoryComboboxProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, PICKER_SEARCH_DEBOUNCE_MS);

  const { data, isFetching } = useCategoriesQuery(
    { ...PICKER_LIST_PARAMS, name: debouncedSearch.trim() || undefined },
    { enabled: queryEnabled },
  );

  const { data: detail } = useCategoryQuery(value || undefined, {
    enabled: queryEnabled && Boolean(value),
  });

  const options = useMemo<ComboboxOption[]>(() => {
    const list = (data?.items ?? []).map(categoryToOption);
    if (!value || !detail || list.some((o) => o.value === value)) return list;
    return [categoryToOption(detail), ...list];
  }, [data, value, detail]);

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select category…"
      searchPlaceholder="Search category…"
      emptyText="No categories found"
      disabled={disabled}
      loading={isFetching}
      onSearch={setSearch}
      className={className}
      data-testid={dataTestId}
    />
  );
}
