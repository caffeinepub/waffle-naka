import { useGetOrders, useUpdateOrderStatus } from '@/hooks/useQueries';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { OrderStatus } from '@/backend';

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useGetOrders();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const { newOrderCount } = useOrderNotifications();

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateStatus(
      { orderId, status },
      {
        onSuccess: () => toast.success('Order status updated'),
        onError: () => toast.error('Failed to update status'),
      }
    );
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.new_:
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">New</Badge>;
      case OrderStatus.accepted:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Preparing</Badge>;
      case OrderStatus.completed:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.new_:
        return 'new';
      case OrderStatus.accepted:
        return 'accepted';
      case OrderStatus.completed:
        return 'completed';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const sortedOrders = [...(orders || [])].sort((a, b) => {
    const aNum = parseInt(a.id.split('_')[1] || '0');
    const bNum = parseInt(b.id.split('_')[1] || '0');
    return bNum - aNum;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 flex items-center gap-3">
            Orders Dashboard
            {newOrderCount > 0 && (
              <Badge className="bg-red-500 text-white animate-pulse">
                {newOrderCount} New
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Manage incoming orders</p>
        </div>
      </div>

      {sortedOrders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const isNew = order.status === OrderStatus.new_;
            return (
              <Card
                key={order.id}
                className={`hover:shadow-lg transition-all ${
                  isNew ? 'border-2 border-blue-400 dark:border-blue-600 shadow-lg' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3">
                        <span>Order #{order.id.split('_')[1]}</span>
                        {getStatusBadge(order.status)}
                        {isNew && (
                          <Badge className="bg-red-500 text-white animate-pulse">
                            NEW
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Customer:</span>
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Table:</span>
                          <span>{Number(order.tableNumber)}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Select
                        value={getStatusLabel(order.status)}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value as OrderStatus)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="accepted">Preparing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {item.menuItem.name} x {Number(item.quantity)}
                            </span>
                            <span className="font-semibold">
                              ${((Number(item.menuItem.price) * Number(item.quantity)) / 100).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-amber-700 dark:text-amber-400">
                      <span>Total</span>
                      <span>${(Number(order.total) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
