import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0MockProvider } from '../auth0MockContext';

/**
 * Wraps the tree with QueryClient and a mocked Auth0 user context.
 * Use this in tests that need useAuth0 / useGetToken / useCallbackApi to see
 * a logged-in user (e.g. hooks that call the API).
 *
 * To override the default mock user (e.g. unauthenticated), wrap with
 * <Auth0MockProvider value={{ isAuthenticated: false }}> inside this wrapper.
 */
export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Auth0MockProvider>{children}</Auth0MockProvider>
    </QueryClientProvider>
  );
}
