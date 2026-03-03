import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { themeTokens } from '../../theme/tailwind';
import { useSubcategoriesStore } from './store';
import { SubcategoriesTable } from './subcategoriesTable';

export function Subcategories() {
  const { items, loading, error, fetchSubcategories } = useSubcategoriesStore();

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ color: themeTokens.textPrimary, mb: 2 }}>
        Subcategories
        {items.length > 0 ? ` (${items.length})` : ''}
      </Typography>
      <SubcategoriesTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchSubcategories}
      />
    </Box>
  );
}
