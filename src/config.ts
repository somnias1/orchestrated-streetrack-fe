export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  auth0: {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    callbackUrl:
      import.meta.env.VITE_AUTH0_CALLBACK_URL ||
      `${window.location.origin}/callback`,
  },
  e2e: {
    userEmail: import.meta.env.VITE_E2E_USER_EMAIL,
    userPassword: import.meta.env.VITE_E2E_USER_PASSWORD,
  },
  appUrl: import.meta.env.VITE_APP_URL,
} as const;
