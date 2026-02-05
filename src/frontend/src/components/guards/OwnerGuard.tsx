import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { isOwnerAuthenticated } from '@/state/ownerAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';

interface OwnerGuardProps {
  children: ReactNode;
}

export default function OwnerGuard({ children }: OwnerGuardProps) {
  const navigate = useNavigate();
  const isAuthenticated = isOwnerAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/owner/login' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-2 border-destructive">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You need to be authenticated as shop owner to access this area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate({ to: '/owner/login' })}
              className="w-full"
            >
              Go to Owner Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
