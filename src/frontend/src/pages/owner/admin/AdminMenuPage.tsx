import { useState } from 'react';
import { useGetMenuItems, useAddMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MenuItem } from '@/backend';

export default function AdminMenuPage() {
  const { data: menuItems, isLoading } = useGetMenuItems();
  const { mutate: addMenuItem, isPending: isAdding } = useAddMenuItem();
  const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateMenuItem();
  const { mutate: deleteMenuItem, isPending: isDeleting } = useDeleteMenuItem();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', available: true });
    setEditingItem(null);
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: (Number(item.price) / 100).toString(),
        available: item.available,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceInCents = Math.round(parseFloat(formData.price) * 100);
    if (isNaN(priceInCents) || priceInCents <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const menuItem: MenuItem = {
      id: editingItem?.id || `item_${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: BigInt(priceInCents),
      available: formData.available,
    };

    if (editingItem) {
      updateMenuItem(menuItem, {
        onSuccess: () => {
          toast.success('Menu item updated successfully');
          setIsDialogOpen(false);
          resetForm();
        },
        onError: () => toast.error('Failed to update menu item'),
      });
    } else {
      addMenuItem(menuItem, {
        onSuccess: () => {
          toast.success('Menu item added successfully');
          setIsDialogOpen(false);
          resetForm();
        },
        onError: () => toast.error('Failed to add menu item'),
      });
    }
  };

  const handleDelete = (itemId: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete "${itemName}"?`)) {
      deleteMenuItem(itemId, {
        onSuccess: () => toast.success('Menu item deleted'),
        onError: () => toast.error('Failed to delete menu item'),
      });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
            Menu Management
          </h2>
          <p className="text-muted-foreground">Add, edit, or remove menu items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
                <DialogDescription>
                  {editingItem ? 'Update the menu item details' : 'Create a new menu item'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Classic Belgian Waffle"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your delicious waffle..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="available">Available for order</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding || isUpdating} className="bg-amber-600 hover:bg-amber-700">
                  {isAdding || isUpdating ? 'Saving...' : editingItem ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {menuItems && menuItems.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No menu items yet</p>
            <Button onClick={() => handleOpenDialog()} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {menuItems?.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{item.name}</span>
                  <Badge variant={item.available ? 'default' : 'secondary'} className={item.available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </Badge>
                </CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  ${(Number(item.price) / 100).toFixed(2)}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenDialog(item)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(item.id, item.name)}
                  disabled={isDeleting}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
