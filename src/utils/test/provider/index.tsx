import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0MockProvider } from '../auth0MockContext';

export type ProviderWrapperProps = {
  children: React.ReactNode;
  queryClientConfig?: ConstructorParameters<typeof QueryClient>[0];
};

export default function ProviderWrapper({
  children,
  queryClientConfig,
}: ProviderWrapperProps) {
  const queryClient = new QueryClient(queryClientConfig);
  return (
    <QueryClientProvider client={queryClient}>
      <Auth0MockProvider>{children}</Auth0MockProvider>
    </QueryClientProvider>
  );
}
