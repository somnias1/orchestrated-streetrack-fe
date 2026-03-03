import { useAuth0 } from '@auth0/auth0-react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { routes } from '../../routes';
import { themeTokens } from '../../theme/tailwind';

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
          <Box sx={{ flexGrow: 1 }} />
          <Button
            startIcon={<LogoutRoundedIcon />}
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
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
