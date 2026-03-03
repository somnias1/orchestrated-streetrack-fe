/**
 * App config from environment (Rsbuild uses import.meta.env, Vite-style).
 */
const getEnv = (key: string): string => {
  const v = import.meta.env[key];
  return typeof v === 'string' ? v : '';
};

export const config = {
  apiUrl: getEnv('VITE_API_URL') || 'http://localhost:8000',
  auth0: {
    domain: getEnv('VITE_AUTH0_DOMAIN'),
    clientId: getEnv('VITE_AUTH0_CLIENT_ID'),
    callbackUrl:
      getEnv('VITE_AUTH0_CALLBACK_URL') || `${window.location.origin}/callback`,
  },
} as const;
