import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { config } from './config';

const queryClient = new QueryClient();

const rootEl = document.getElementById('root');
if (rootEl) {
  const { domain, clientId, callbackUrl, audience } = config.auth0;
  const root = ReactDOM.createRoot(rootEl);
  if (!domain || !clientId) {
    root.render(
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1>Auth0 not configured</h1>
        <p>
          Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your environment.
        </p>
      </div>,
    );
  } else {
    root.render(
      <React.StrictMode>
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: callbackUrl,
            audience: audience,
            scope: 'openid profile email offline_access',
          }}
          cacheLocation="localstorage"
        >
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </Auth0Provider>
      </React.StrictMode>,
    );
  }
}
