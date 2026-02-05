import { useGetMenuItems } from '@/hooks/useQueries';
import { useCart } from '@/state/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import OffersPanel from '@/components/customer/OffersPanel';
import { Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import type { MenuItem } from '@/backend';

export default function MenuPage() {
  const { data: menuItems, isLoading } = useGetMenuItems();
  const { addItem } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const availableItems = menuItems?.filter((item) => item.available) || [];
  const unavailableItems = menuItems?.filter((item) => !item.available) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-2">
          Our Menu
        </h1>
        <p className="text-muted-foreground">
          Delicious waffles made fresh to order
        </p>
      </div>

      <OffersPanel />

      {availableItems.length === 0 && unavailableItems.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">
              No menu items available yet. Check back soon!
            </p>
          </CardContent>
        </Card>
      )}

      {availableItems.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-200">
            Available Now
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableItems.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-shadow border-2 hover:border-amber-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-xl">{item.name}</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      Available
                    </Badge>
                  </CardTitle>
                  {item.description && (
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    ${(Number(item.price) / 100).toFixed(2)}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {unavailableItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-muted-foreground">
            Currently Unavailable
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {unavailableItems.map((item) => (
              <Card key={item.id} className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-xl">{item.name}</span>
                    <Badge variant="secondary">Unavailable</Badge>
                  </CardTitle>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-muted-foreground">
                    ${(Number(item.price) / 100).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
