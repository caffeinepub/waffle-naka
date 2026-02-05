import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from './state/cart';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OwnerLoginPage from './pages/owner/OwnerLoginPage';
import AdminMenuPage from './pages/owner/admin/AdminMenuPage';
import AdminOffersPage from './pages/owner/admin/AdminOffersPage';
import AdminOrdersPage from './pages/owner/admin/AdminOrdersPage';
import AdminSettingsPage from './pages/owner/admin/AdminSettingsPage';
import AppLayout from './components/layout/AppLayout';
import OwnerGuard from './components/guards/OwnerGuard';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const customerMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/menu',
  component: MenuPage,
});

const customerCartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const customerCheckoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const ownerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/login',
  component: OwnerLoginPage,
});

const adminMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/admin/menu',
  component: () => (
    <OwnerGuard>
      <AdminMenuPage />
    </OwnerGuard>
  ),
});

const adminOffersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/admin/offers',
  component: () => (
    <OwnerGuard>
      <AdminOffersPage />
    </OwnerGuard>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/admin/orders',
  component: () => (
    <OwnerGuard>
      <AdminOrdersPage />
    </OwnerGuard>
  ),
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/admin/settings',
  component: () => (
    <OwnerGuard>
      <AdminSettingsPage />
    </OwnerGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  customerMenuRoute,
  customerCartRoute,
  customerCheckoutRoute,
  ownerLoginRoute,
  adminMenuRoute,
  adminOffersRoute,
  adminOrdersRoute,
  adminSettingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}
