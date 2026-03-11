import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { config } from '../../config';
import useCallbackApi from '../../utils/callbackApi';
import { transactionManagerPaths } from './constants';
import type {
  TransactionImportPreview,
  TransactionImportRequest,
} from './types';

const baseURL = config.apiUrl;

export { transactionManagerPaths };

export function useImportPreviewMutation(
  options?: Partial<
    UseMutationOptions<
      TransactionImportPreview,
      Error,
      TransactionImportRequest
    >
  >,
) {
  const { callbackApi } = useCallbackApi();
  return useMutation<TransactionImportPreview, Error, TransactionImportRequest>(
    {
      mutationFn: (body: TransactionImportRequest) =>
        callbackApi<TransactionImportPreview>(transactionManagerPaths.import, {
          data: body,
          method: 'POST',
          baseURL,
        }),
      ...options,
    },
  );
}

/**
 * Triggers CSV download from a blob (e.g. from GET /transaction-manager/export with responseType: 'blob').
 */
export async function downloadCsvBlob(
  getBlob: () => Promise<Blob>,
  filename?: string,
): Promise<void> {
  const blob = await getBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download =
    filename ??
    `transactions-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
