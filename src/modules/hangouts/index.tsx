import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { themeTokens } from '../../theme/tailwind';
import { HangoutsTable } from './hangoutsTable';
import { useHangoutsStore } from './store';

export function Hangouts() {
  const { items, loading, error, fetchHangouts } = useHangoutsStore();

  useEffect(() => {
    fetchHangouts();
  }, [fetchHangouts]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ color: themeTokens.textPrimary, mb: 2 }}>
        Hangouts
        {items.length > 0 ? ` (${items.length})` : ''}
      </Typography>
      <HangoutsTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchHangouts}
      />
    </Box>
  );
}
