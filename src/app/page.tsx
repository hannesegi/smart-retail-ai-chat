import { Store } from 'lucide-react';
import { LoginButtons } from '@/components/auth/LoginButtons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-headline">
              HEART v.1
            </CardTitle>
            <CardDescription className="pt-2">
              by hanesAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginButtons />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
