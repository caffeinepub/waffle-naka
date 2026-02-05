import { useState } from 'react';
import { useGetShopSettings, useUpdateShopSettings } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '@/backend';

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useGetShopSettings();
  const { mutate: updateSettings, isPending } = useUpdateShopSettings();
  const [shopName, setShopName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useState(() => {
    if (settings && !shopName) {
      setShopName(settings.shopName);
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file must be less than 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName.trim()) {
      toast.error('Shop name is required');
      return;
    }

    let logoBlob: ExternalBlob | null = null;

    if (logoFile) {
      try {
        const arrayBuffer = await logoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        logoBlob = ExternalBlob.fromBytes(uint8Array);
      } catch (error) {
        toast.error('Failed to process logo file');
        return;
      }
    }

    updateSettings(
      { name: shopName.trim(), logo: logoBlob },
      {
        onSuccess: () => {
          toast.success('Settings updated successfully');
          setLogoFile(null);
          setLogoPreview(null);
        },
        onError: () => toast.error('Failed to update settings'),
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentLogo = logoPreview || (settings?.logo ? settings.logo.getDirectURL() : '/assets/generated/waffle-naka-logo.dim_512x512.png');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
          Shop Settings
        </h2>
        <p className="text-muted-foreground">Manage your shop information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shop Information</CardTitle>
          <CardDescription>Update your shop name and logo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name *</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Shop Logo</Label>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={currentLogo}
                    alt="Shop Logo"
                    className="w-32 h-32 object-contain rounded-lg border-2 border-border bg-white dark:bg-gray-800"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={isPending}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a new logo (max 5MB, PNG or JPG recommended)
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isPending ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
