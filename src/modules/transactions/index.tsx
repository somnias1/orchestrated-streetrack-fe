import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';
import { themeTokens } from '../../theme/tailwind';
import { useTransactionsStore } from './store';
import { TransactionsTable } from './transactionsTable';

export function Transactions() {
  const { items, loading, error, fetchTransactions } = useTransactionsStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" sx={{ color: themeTokens.textPrimary, mb: 2 }}>
        Transactions
        {items.length > 0 ? ` (${items.length})` : ''}
      </Typography>
      <TransactionsTable
        items={items}
        loading={loading}
        error={error}
        onRetry={fetchTransactions}
      />
    </Box>
  );
}
