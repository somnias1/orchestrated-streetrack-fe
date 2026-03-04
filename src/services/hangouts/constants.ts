/**
 * API path constants for hangouts (no leading slash; base URL from callbackApi).
 */
export const hangoutsPaths = {
  list: "hangouts/",
  get: (id: string) => `hangouts/${id}/`,
  update: (id: string) => `hangouts/${id}/`,
  delete: (id: string) => `hangouts/${id}/`,
} as const;
