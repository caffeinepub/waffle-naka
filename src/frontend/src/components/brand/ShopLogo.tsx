import { useGetShopSettings } from '@/hooks/useQueries';

interface ShopLogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function ShopLogo({ size = 'medium' }: ShopLogoProps) {
  const { data: settings } = useGetShopSettings();

  const sizeClasses = {
    small: 'h-10',
    medium: 'h-16',
    large: 'h-32',
  };

  const logoUrl = settings?.logo
    ? settings.logo.getDirectURL()
    : '/assets/generated/waffle-naka-logo.dim_512x512.png';

  const shopName = settings?.shopName || 'WAFFLE NAKA';

  return (
    <div className="flex items-center gap-3">
      <img
        src={logoUrl}
        alt={shopName}
        className={`${sizeClasses[size]} object-contain`}
      />
      {size !== 'small' && (
        <span className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100">
          {shopName}
        </span>
      )}
    </div>
  );
}
