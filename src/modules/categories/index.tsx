import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { themeTokens } from '../../theme/tailwind';
import { useCategoriesStore } from './store';

export function Categories() {
  const { items, loading, error, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <CircularProgress sx={{ color: themeTokens.primary }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography sx={{ color: themeTokens.error, mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => fetchCategories()}
          sx={{ backgroundColor: themeTokens.primary }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography sx={{ color: themeTokens.textSecondary }}>
          No categories found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h6" sx={{ color: themeTokens.textPrimary, mb: 2 }}>
        Categories ({items.length})
      </Typography>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {items.map((cat) => (
          <Box
            component="li"
            key={cat.id}
            sx={{
              py: 1,
              borderBottom: `1px solid ${themeTokens.border}`,
              color: themeTokens.textPrimary,
            }}
          >
            {cat.name}
            {cat.description ? ` — ${cat.description}` : ''}
            {' · '}
            <Typography
              component="span"
              sx={{
                color: cat.is_income ? themeTokens.success : themeTokens.error,
                fontSize: '0.875rem',
              }}
            >
              {cat.is_income ? 'Income' : 'Expense'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
