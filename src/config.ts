export const config = {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:8000',
  auth0: {
    domain: process.env.VITE_AUTH0_DOMAIN,
    clientId: process.env.VITE_AUTH0_CLIENT_ID,
    audience: process.env.VITE_AUTH0_AUDIENCE,
    callbackUrl:
      process.env.VITE_AUTH0_CALLBACK_URL ||
      `${window.location.origin}/callback`,
  },
  e2e: {
    userEmail: process.env.VITE_E2E_USER_EMAIL,
    userPassword: process.env.VITE_E2E_USER_PASSWORD,
  },
  appUrl: process.env.VITE_APP_URL,
} as const;
