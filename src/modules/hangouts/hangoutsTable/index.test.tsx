import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { HangoutRead } from '../../../services/hangouts/types';
import { HangoutsTable } from './index';

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: (opts: { count: number }) => ({
    getVirtualItems: () =>
      Array.from({ length: opts.count }, (_, i) => ({
        index: i,
        start: i * 48,
        size: 48,
        end: (i + 1) * 48,
      })),
    getTotalSize: () => opts.count * 48,
  }),
}));

const items: HangoutRead[] = [
  {
    id: '1',
    name: 'Brunch',
    description: 'Weekend brunch',
    date: '2026-03-01',
    user_id: 'u1',
  },
  {
    id: '2',
    name: 'Movie night',
    description: null,
    date: '2026-03-02',
    user_id: 'u1',
  },
];

describe('HangoutsTable', () => {
  it('renders Edit and Delete buttons for each row', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <HangoutsTable
        items={items}
        loading={false}
        error={null}
        onRetry={() => {}}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(
      screen.getByRole('button', { name: /edit brunch/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete brunch/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /edit movie night/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /delete movie night/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /edit brunch/i }));
    expect(onEdit).toHaveBeenCalledWith(items[0]);

    await userEvent.click(
      screen.getByRole('button', { name: /delete movie night/i }),
    );
    expect(onDelete).toHaveBeenCalledWith(items[1]);
  });
});
