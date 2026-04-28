import { useAuth0 } from '@auth0/auth0-react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  LogOut,
  Menu,
  Moon,
  ReceiptText,
  Sun,
  Tag,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { routes } from '../../routes';
import { useThemeStore } from '../theme/store';

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: routes.home, icon: <Home className="h-5 w-5" /> },
  {
    label: 'Categories',
    href: routes.categories,
    icon: <Tag className="h-5 w-5" />,
  },
  {
    label: 'Subcategories',
    href: routes.subcategories,
    icon: <Layers className="h-5 w-5" />,
  },
  {
    label: 'Transactions',
    href: routes.transactions,
    icon: <ReceiptText className="h-5 w-5" />,
  },
  {
    label: 'Hangouts',
    href: routes.hangouts,
    icon: <CalendarDays className="h-5 w-5" />,
  },
];

type Props = Readonly<{ children: ReactNode }>;

function NavItems({ collapsed }: Readonly<{ collapsed: boolean }>) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {NAV_ITEMS.map(({ label, href, icon }) => (
        <NavLink key={href} to={href} end={href === routes.home}>
          {({ isActive }) =>
            collapsed ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      role="img"
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-md transition-colors',
                        isActive
                          ? 'bg-accent text-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      )}
                      aria-label={label}
                    >
                      {icon}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span
                className={cn(
                  'flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                {icon}
                {label}
              </span>
            )
          }
        </NavLink>
      ))}
    </nav>
  );
}

export function Layout({ children }: Props) {
  const { logout } = useAuth0();
  const { mode, toggle } = useThemeStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () =>
    logout({
      logoutParams: { returnTo: window.location.origin + routes.auth.login },
    });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200',
          collapsed ? 'w-16' : 'w-56',
        )}
      >
        <div
          className={cn(
            'flex h-14 items-center border-b border-sidebar-border px-3',
            collapsed ? 'justify-center' : 'justify-between',
          )}
        >
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground tracking-wide">
              Streetrack
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <NavItems collapsed={collapsed} />
        </div>

        <Separator className="bg-sidebar-border" />

        <div
          className={cn('flex flex-col gap-1 p-2', collapsed && 'items-center')}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? 'icon' : 'sm'}
                  onClick={toggle}
                  className={cn(
                    'text-sidebar-foreground hover:bg-sidebar-accent',
                    !collapsed && 'w-full justify-start gap-3',
                  )}
                  aria-label={
                    mode === 'dark'
                      ? 'Switch to light mode'
                      : 'Switch to dark mode'
                  }
                >
                  {mode === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  {!collapsed && (mode === 'dark' ? 'Light mode' : 'Dark mode')}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {mode === 'dark' ? 'Light mode' : 'Dark mode'}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? 'icon' : 'sm'}
                  onClick={handleLogout}
                  className={cn(
                    'text-sidebar-foreground hover:bg-sidebar-accent',
                    !collapsed && 'w-full justify-start gap-3',
                  )}
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && 'Log out'}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">Log out</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      {/* Mobile top bar + Sheet */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center border-b border-border bg-sidebar px-4 gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="text-sidebar-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-semibold text-sidebar-foreground">
          Streetrack
        </span>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-56 bg-sidebar border-r border-sidebar-border p-0"
        >
          <div className="flex h-14 items-center border-b border-sidebar-border px-4">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Streetrack
            </span>
          </div>
          <div className="py-3">
            <NavItems collapsed={false} />
          </div>
          <Separator className="bg-sidebar-border" />
          <div className="flex flex-col gap-1 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="w-full justify-start gap-3 text-sidebar-foreground"
            >
              {mode === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {mode === 'dark' ? 'Light mode' : 'Dark mode'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:p-6 p-4 pt-[72px] lg:pt-6">
        {children}
      </main>
    </div>
  );
}
