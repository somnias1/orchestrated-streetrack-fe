/**
 * Centralized route paths. Use these constants for navigation and <Link>;
 * no hardcoded path strings (TECHSPEC §2.3, §3.3).
 */
export const routes = {
  auth: {
    login: '/login',
    callback: '/callback',
  },
  home: '/',
  categories: '/categories',
  subcategories: '/subcategories',
  transactions: '/transactions',
  hangouts: '/hangouts',
} as const;
