import { Chip } from '@mui/material';
import { themeTokens, twColor } from '../../../theme/tailwind';

type CategoryTypeChipProps = Readonly<{ isIncome: boolean }>;

/**
 * Income/Expense status chip. Uses theme tokens; status not by color alone (text "Income"/"Expense" per §3.7).
 */
export function CategoryTypeChip({ isIncome }: CategoryTypeChipProps) {
  return (
    <Chip
      label={isIncome ? 'Income' : 'Expense'}
      size="small"
      sx={{
        backgroundColor: isIncome
          ? twColor('green', '700')
          : twColor('red', '700'),
        color: themeTokens.textPrimary,
        fontWeight: 500,
      }}
    />
  );
}
