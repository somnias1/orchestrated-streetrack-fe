import { renderHook } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { config } from '../../config';
import ProviderWrapper from '../../utils/test/provider';
import { transactionManagerPaths } from './constants';
import { downloadCsvBlob, useImportPreviewMutation } from './index';
import type {
  TransactionImportPreview,
  TransactionImportRequest,
} from './types';

const baseURL = config.apiUrl;

describe('Transaction manager services', () => {
  const server = setupServer();

  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  describe('useImportPreviewMutation', () => {
    it('calls POST import and returns preview', async () => {
      const requestBody: TransactionImportRequest = {
        rows: [
          {
            category_name: 'Food',
            subcategory_name: 'Groceries',
            value: 5000,
            description: 'Test',
            date: '2026-03-01',
          },
        ],
      };
      const preview: TransactionImportPreview = {
        transactions: [
          {
            subcategory_id: 'sub-1',
            value: 5000,
            description: 'Test',
            date: '2026-03-01',
            hangout_id: null,
          },
        ],
        invalid_rows: [],
      };
      server.use(
        http.post(
          `${baseURL}/${transactionManagerPaths.import}`,
          async ({ request }) => {
            const body = (await request.json()) as TransactionImportRequest;
            expect(body.rows).toHaveLength(1);
            expect(body.rows[0].category_name).toBe('Food');
            return HttpResponse.json(preview, { status: 200 });
          },
        ),
      );
      const { result } = renderHook(() => useImportPreviewMutation(), {
        wrapper: ProviderWrapper,
      });
      const data = await result.current.mutateAsync(requestBody);
      expect(data).toEqual(preview);
    });
  });

  describe('downloadCsvBlob', () => {
    it('creates anchor with download and triggers click', async () => {
      const blob = new Blob(['a,b\n1,2'], { type: 'text/csv' });
      let appended: HTMLAnchorElement | null = null;
      const appendChild = document.body.appendChild.bind(document.body);
      document.body.appendChild = (el: Node) => {
        appended = el as HTMLAnchorElement;
        return appendChild(el);
      };
      await downloadCsvBlob(() => Promise.resolve(blob), 'test.csv');
      expect(appended).not.toBeNull();
      expect((appended as HTMLAnchorElement).download).toMatch(/test\.csv$/);
      expect((appended as HTMLAnchorElement).href).toMatch(/^blob:/);
      document.body.appendChild = appendChild;
    });

    it('uses default filename when not provided', async () => {
      const blob = new Blob(['x'], { type: 'text/csv' });
      let appended: HTMLAnchorElement | null = null;
      const appendChild = document.body.appendChild.bind(document.body);
      document.body.appendChild = (el: Node) => {
        appended = el as HTMLAnchorElement;
        return appendChild(el);
      };
      await downloadCsvBlob(() => Promise.resolve(blob));
      expect(appended).not.toBeNull();
      expect((appended as HTMLAnchorElement).download).toMatch(
        /transactions-export-\d{4}-\d{2}-\d{2}\.csv/,
      );
      document.body.appendChild = appendChild;
    });
  });
});
