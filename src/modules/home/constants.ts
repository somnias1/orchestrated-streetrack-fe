/** Default year/month for dashboard month balance and due periodic expenses (current month). */
const now = new Date();
export const DEFAULT_DASHBOARD_YEAR = now.getFullYear();
export const DEFAULT_DASHBOARD_MONTH = now.getMonth() + 1;

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const DASHBOARD_YEAR_OPTIONS = [
  DEFAULT_DASHBOARD_YEAR - 2,
  DEFAULT_DASHBOARD_YEAR - 1,
  DEFAULT_DASHBOARD_YEAR,
  DEFAULT_DASHBOARD_YEAR + 1,
] as const;
