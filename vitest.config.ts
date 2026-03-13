import { defineConfig } from 'vitest/config';

/**
 * Vitest config for Phase 05 (§6.1, §6.2).
 * Unit + integration tests; coverage gate 80%.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/setupTests.ts',
        'src/env.d.ts',
        'src/**/types.ts',
        'src/index.tsx',
        'src/App.tsx',
        'src/modules/auth0/AuthCallback.tsx',
        'src/modules/auth0/LoginRedirect.tsx',
        'src/modules/auth0/index.tsx',
        'src/modules/home/**',
        'src/services/validation.ts',
        'src/utils/auth/useGetToken.ts',
        'src/theme/**',
        'src/modules/categories/categoriesTable/CategoryTypeChip.tsx',
        'src/modules/categories/categoriesTable/index.tsx',
        'src/modules/subcategories/subcategoriesTable/index.tsx',
        'src/modules/transactions/transactionsTable/index.tsx',
        'src/modules/hangouts/hangoutsTable/index.tsx',
        'src/tests/e2e/**',
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 70,
        functions: 70,
      },
    },
  },
  resolve: {
    alias: {
      // Match Rsbuild resolve if needed
    },
  },
});
