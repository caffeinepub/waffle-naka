import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ShopLogo from '@/components/brand/ShopLogo';
import { ShoppingBag, UserCog } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleCustomerLogin = () => {
    navigate({ to: '/menu' });
  };

  const handleOwnerLogin = () => {
    navigate({ to: '/owner/login' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <ShopLogo size="large" />
          </div>
          <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl mb-8">
            <img
              src="/assets/generated/waffle-naka-hero.dim_1600x600.png"
              alt="WAFFLE NAKA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                Welcome to WAFFLE NAKA
              </h1>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border-2 hover:border-amber-400 transition-all hover:shadow-xl cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle className="text-2xl">Customer Login</CardTitle>
              <CardDescription className="text-base">
                Browse our delicious menu and place your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleCustomerLogin}
                className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-orange-400 transition-all hover:shadow-xl cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCog className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-2xl">Shop Owner</CardTitle>
              <CardDescription className="text-base">
                Manage menu, orders, and shop settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleOwnerLogin}
                className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                Owner Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground">
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
        </footer>
      </div>
    </div>
  );
}
