import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo } from 'react';
import { useGetToken } from '../auth/useGetToken';
import callbackApi from './callback';
import type { CallbackProps } from './types';

function useCallbackApi() {
  const getToken = useGetToken();
  const { user } = useAuth0();
  const handler = useCallback(
    <T,>(...props: CallbackProps<T>) => {
      const [url, customConfig] = props;
      return callbackApi<T>(getToken, url ?? '', {
        ...customConfig,
        sessionId: user?.sub,
      });
    },
    [getToken, user?.sub],
  );
  return useMemo(() => ({ callbackApi: handler }), [handler]);
}

export default useCallbackApi;
