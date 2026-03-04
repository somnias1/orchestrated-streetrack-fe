import { useAuth0 } from '@auth0/auth0-react';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../routes';
import { themeTokens } from '../../theme/tailwind';
import { useThemeStore } from '../theme/store';

type Props = Readonly<{
  children: ReactNode;
}>;

const navLinkBase = {
  color: themeTokens.textPrimary,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  px: 1.5,
  py: 1,
  borderRadius: 1,
  '&:hover': {
    backgroundColor: themeTokens.surface,
    color: themeTokens.textPrimary,
  },
};

const navLinkActive = {
  backgroundColor: themeTokens.surface,
  color: themeTokens.primary,
};

export function Layout({ children }: Props) {
  const { logout } = useAuth0();
  const { mode, toggle } = useThemeStore();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: themeTokens.background,
        color: themeTokens.textPrimary,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: themeTokens.surface,
          borderBottom: `1px solid ${themeTokens.border}`,
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 600, mr: 2, color: themeTokens.textPrimary }}
          >
            Streetrack
          </Typography>
          <NavLink to={routes.home} end style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                component="span"
                startIcon={<HomeRoundedIcon />}
                sx={{ ...navLinkBase, ...(isActive ? navLinkActive : {}) }}
              >
                Home
              </Button>
            )}
          </NavLink>
          <NavLink to={routes.categories} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                component="span"
                startIcon={<ListRoundedIcon />}
                sx={{ ...navLinkBase, ...(isActive ? navLinkActive : {}) }}
              >
                Categories
              </Button>
            )}
          </NavLink>
          <NavLink to={routes.subcategories} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                component="span"
                startIcon={<AccountTreeRoundedIcon />}
                sx={{ ...navLinkBase, ...(isActive ? navLinkActive : {}) }}
              >
                Subcategories
              </Button>
            )}
          </NavLink>
          <NavLink to={routes.transactions} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                component="span"
                startIcon={<ReceiptLongRoundedIcon />}
                sx={{ ...navLinkBase, ...(isActive ? navLinkActive : {}) }}
              >
                Transactions
              </Button>
            )}
          </NavLink>
          <NavLink to={routes.hangouts} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                component="span"
                startIcon={<EventRoundedIcon />}
                sx={{ ...navLinkBase, ...(isActive ? navLinkActive : {}) }}
              >
                Hangouts
              </Button>
            )}
          </NavLink>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip
            title={
              mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            <IconButton
              onClick={toggle}
              aria-label={
                mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
              sx={{ color: themeTokens.textSecondary }}
            >
              {mode === 'dark' ? (
                <LightModeRoundedIcon />
              ) : (
                <DarkModeRoundedIcon />
              )}
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<LogoutRoundedIcon />}
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin + routes.auth.login,
                },
              })
            }
            sx={{
              color: themeTokens.textSecondary,
              '&:hover': {
                backgroundColor: themeTokens.surface,
                color: themeTokens.textPrimary,
              },
            }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
