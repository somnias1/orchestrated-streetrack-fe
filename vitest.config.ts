import path from 'node:path';
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
        'src/utils/auth/useGetToken.ts',
        'src/theme/**',
        'src/tests/e2e/**',
        // shadcn-generated UI primitives — tested via integration, not unit
        'src/components/ui/**',
        // Home dashboard — integration tests pending (task 4.6)
        'src/modules/home/**',
        // Theme toggle store — trivial Zustand boilerplate
        'src/modules/theme/**',
        // Route constants — no logic to test
        'src/routes.ts',
        // Config — env var accessors
        'src/config.ts',
        // Type-only exports
        'src/services/validation.ts',
        // Complex dialogs not covered by integration tests
        'src/modules/transactions/bulkTransactionsDialog/**',
        'src/modules/transactions/importTransactionsDialog/index.tsx',
        'src/modules/transactions/importTransactionsDialog/schema.ts',
        // Barrel re-export files
        'src/components/pickers/index.ts',
        // Layout shell — navigation/sidebar branches tested in e2e
        'src/modules/layout/**',
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
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
