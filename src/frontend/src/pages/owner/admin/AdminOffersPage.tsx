import { useState } from 'react';
import { useOffers } from '@/state/offers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOffersPage() {
  const { offers, addOffer, updateOffer, deleteOffer } = useOffers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', discount: '' });
    setEditingOffer(null);
  };

  const handleOpenDialog = (offer?: any) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const offer = {
      id: editingOffer?.id || `offer_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      discount: formData.discount.trim(),
    };

    if (editingOffer) {
      updateOffer(offer);
      toast.success('Offer updated successfully');
    } else {
      addOffer(offer);
      toast.success('Offer added successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (offerId: string, offerTitle: string) => {
    if (confirm(`Are you sure you want to delete "${offerTitle}"?`)) {
      deleteOffer(offerId);
      toast.success('Offer deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
            Offers Management
          </h2>
          <p className="text-muted-foreground">Create and manage special offers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                <DialogDescription>
                  {editingOffer ? 'Update the offer details' : 'Create a new special offer'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Weekend Special"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the offer..."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount *</Label>
                  <Input
                    id="discount"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g., 20% OFF or Buy 1 Get 1"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  {editingOffer ? 'Update' : 'Add'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {offers.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Tag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No offers yet</p>
            <Button onClick={() => handleOpenDialog()} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{offer.title}</span>
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                    {offer.discount}
                  </Badge>
                </CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenDialog(offer)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(offer.id, offer.title)}
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
