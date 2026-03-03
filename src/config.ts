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
} as const;
