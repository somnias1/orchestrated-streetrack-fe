import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { themeTokens } from '../../theme/tailwind';
import { CategoriesTable } from './categoriesTable';
import { useCategoriesStore } from './store';

export function Categories() {
  const { items, loading, error, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ color: themeTokens.textPrimary, mb: 2 }}>
        Categories
        {items.length > 0 ? ` (${items.length})` : ''}
      </Typography>
      <CategoriesTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchCategories}
      />
    </Box>
  );
}
