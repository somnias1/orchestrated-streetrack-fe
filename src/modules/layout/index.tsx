import type { ReactNode } from 'react';

type Props = Readonly<{
  children: ReactNode;
}>;

/**
 * Layout shell placeholder. Phase 02 will add nav (Home, Categories) and structure.
 */
export function Layout({ children }: Props) {
  return <main>{children}</main>;
}
