import { useOffers } from '@/state/offers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

export default function OffersPanel() {
  const { offers } = useOffers();

  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-orange-800 dark:text-orange-200 flex items-center gap-2">
        <Tag className="w-6 h-6" />
        Special Offers
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <Card
            key={offer.id}
            className="border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950"
          >
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span className="text-lg">{offer.title}</span>
                <Badge className="bg-orange-600 text-white">
                  {offer.discount}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-foreground/80">
                {offer.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
