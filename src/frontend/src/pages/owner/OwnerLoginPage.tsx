import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useActor } from '@/hooks/useActor';
import { setOwnerAuth } from '@/state/ownerAuth';
import { Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { actor } = useActor();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passcode) {
      setError('Please enter the passcode');
      return;
    }

    if (!actor) {
      setError('System not ready. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      // First check if user is already an admin
      const isAdmin = await actor.isCallerAdmin();
      
      if (isAdmin) {
        // User is already authenticated as admin in the backend
        setOwnerAuth(true);
        toast.success('Welcome back, Shop Owner!');
        navigate({ to: '/owner/admin/orders' });
        return;
      }

      // Try to authenticate with passcode
      const isAuthenticated = await actor.authenticateAsOwner(passcode);

      if (isAuthenticated) {
        setOwnerAuth(true);
        toast.success('Welcome back, Shop Owner!');
        navigate({ to: '/owner/admin/orders' });
      } else {
        setError('Invalid passcode. Please try again.');
        setPasscode('');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // Handle the "Already authenticated as admin" error
      if (err?.message?.includes('Already authenticated as admin')) {
        setOwnerAuth(true);
        toast.success('Welcome back, Shop Owner!');
        navigate({ to: '/owner/admin/orders' });
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-950 dark:via-amber-950 dark:to-orange-900 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>

        <Card className="border-2">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl">Shop Owner Access</CardTitle>
            <CardDescription>
              Enter your passcode to access the admin area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Passcode</Label>
                <Input
                  id="passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  disabled={isLoading}
                  className="h-12"
                  autoFocus
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
                className="w-full h-12 bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
