import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCart } from '@/state/cart';
import { isOwnerAuthenticated, clearOwnerAuth } from '@/state/ownerAuth';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import ShopLogo from '@/components/brand/ShopLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, LogOut, Menu as MenuIcon, Package, Tag, Settings, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { items, total } = useCart();
  const isOwner = isOwnerAuthenticated();
  const { newOrderCount } = useOrderNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = routerState.location.pathname;
  const isCustomerArea = currentPath.startsWith('/menu') || currentPath.startsWith('/cart') || currentPath.startsWith('/checkout');
  const isOwnerArea = currentPath.startsWith('/owner/admin');
  const isLoginPage = currentPath === '/' || currentPath === '/owner/login';

  const handleOwnerLogout = () => {
    clearOwnerAuth();
    navigate({ to: '/' });
  };

  const getActiveTab = () => {
    if (currentPath.includes('/admin/menu')) return 'menu';
    if (currentPath.includes('/admin/offers')) return 'offers';
    if (currentPath.includes('/admin/orders')) return 'orders';
    if (currentPath.includes('/admin/settings')) return 'settings';
    return 'orders';
  };

  const handleTabChange = (value: string) => {
    navigate({ to: `/owner/admin/${value}` });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900">
      {/* Header */}
      {!isLoginPage && (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-amber-200 dark:border-amber-800 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate({ to: isOwner ? '/owner/admin/orders' : '/menu' })}
              >
                <ShopLogo size="small" />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                {isOwnerArea && (
                  <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
                    <TabsList className="bg-amber-100 dark:bg-amber-900">
                      <TabsTrigger value="orders" className="relative">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Orders
                        {newOrderCount > 0 && (
                          <Badge className="ml-2 bg-red-500 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {newOrderCount}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="menu">
                        <MenuIcon className="w-4 h-4 mr-2" />
                        Menu
                      </TabsTrigger>
                      <TabsTrigger value="offers">
                        <Tag className="w-4 h-4 mr-2" />
                        Offers
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                )}

                {isCustomerArea && items.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: '/cart' })}
                    className="relative border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-900"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    <Badge className="ml-2 bg-amber-600 text-white">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                    <span className="ml-2 font-semibold">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </Button>
                )}

                {isOwner && (
                  <Button
                    variant="outline"
                    onClick={handleOwnerLogout}
                    className="border-orange-300 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-900"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MenuIcon className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col gap-4 mt-8">
                      {isOwnerArea && (
                        <>
                          <Button
                            variant={getActiveTab() === 'orders' ? 'default' : 'outline'}
                            onClick={() => handleTabChange('orders')}
                            className="w-full justify-start"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Orders
                            {newOrderCount > 0 && (
                              <Badge className="ml-auto bg-red-500 text-white">
                                {newOrderCount}
                              </Badge>
                            )}
                          </Button>
                          <Button
                            variant={getActiveTab() === 'menu' ? 'default' : 'outline'}
                            onClick={() => handleTabChange('menu')}
                            className="w-full justify-start"
                          >
                            <MenuIcon className="w-4 h-4 mr-2" />
                            Menu
                          </Button>
                          <Button
                            variant={getActiveTab() === 'offers' ? 'default' : 'outline'}
                            onClick={() => handleTabChange('offers')}
                            className="w-full justify-start"
                          >
                            <Tag className="w-4 h-4 mr-2" />
                            Offers
                          </Button>
                          <Button
                            variant={getActiveTab() === 'settings' ? 'default' : 'outline'}
                            onClick={() => handleTabChange('settings')}
                            className="w-full justify-start"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </>
                      )}

                      {isCustomerArea && items.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            navigate({ to: '/cart' });
                            setMobileMenuOpen(false);
                          }}
                          className="w-full justify-start"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
                        </Button>
                      )}

                      {isOwner && (
                        <Button
                          variant="outline"
                          onClick={handleOwnerLogout}
                          className="w-full justify-start"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <div className={isLoginPage ? '' : 'container mx-auto px-4 py-8'}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {!isLoginPage && (
        <footer className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-amber-200 dark:border-amber-800 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with ❤️ using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
