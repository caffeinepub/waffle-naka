import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '@/state/cart';
import { usePlaceOrder } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { items, total, clearCart } = useCart();
  const { mutate: placeOrder, isPending } = usePlaceOrder();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    const tableNum = parseInt(tableNumber);
    if (!tableNumber || isNaN(tableNum) || tableNum <= 0) {
      setError('Please enter a valid table number');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    const orderItems = items.map((item) => ({
      menuItem: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: BigInt(item.price),
        available: item.available,
      },
      quantity: BigInt(item.quantity),
    }));

    placeOrder(
      {
        customerName: customerName.trim(),
        tableNumber: BigInt(tableNum),
        items: orderItems,
      },
      {
        onSuccess: () => {
          setOrderPlaced(true);
          clearCart();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to place order');
        },
      }
    );
  };

  if (items.length === 0 && !orderPlaced) {
    navigate({ to: '/menu' });
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-3xl text-green-700 dark:text-green-400">
              Order Placed Successfully!
            </CardTitle>
            <CardDescription className="text-lg">
              Your delicious waffles are being prepared
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you, <strong>{customerName}</strong>! Your order will be delivered to{' '}
              <strong>Table {tableNumber}</strong>.
            </p>
            <Separator />
            <div className="text-left space-y-2">
              <h3 className="font-semibold text-lg">Order Summary:</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${((Number(item.price) * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-bold text-amber-700 dark:text-amber-400">
                <span>Total</span>
                <span>${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate({ to: '/menu' })}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Back to Menu
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-8">
        Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Please provide your details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  disabled={isPending}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number *</Label>
                <Input
                  id="tableNumber"
                  type="number"
                  min="1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Enter table number"
                  disabled={isPending}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isPending}
              >
                {isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950 border-2 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${((Number(item.price) * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold text-amber-700 dark:text-amber-400">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
