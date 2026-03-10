import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { AuthCallback, LoginRedirect, ProtectedRoute } from './modules/auth0';
import { Categories } from './modules/categories';
import { Hangouts } from './modules/hangouts';
import { Home } from './modules/home';
import { Layout } from './modules/layout';
import { Subcategories } from './modules/subcategories';
import { Transactions } from './modules/transactions';
import { routes } from './routes';

function ProtectedShell() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.auth.callback} element={<AuthCallback />} />
        <Route path={routes.auth.login} element={<LoginRedirect />} />
        <Route element={<ProtectedShell />}>
          <Route path={routes.home} element={<Home />} />
          <Route path={routes.categories} element={<Categories />} />
          <Route path={routes.subcategories} element={<Subcategories />} />
          <Route path={routes.transactions} element={<Transactions />} />
          <Route path={routes.hangouts} element={<Hangouts />} />
        </Route>
        <Route path="*" element={<Navigate to={routes.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
