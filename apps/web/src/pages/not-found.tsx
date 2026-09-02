import { Link } from 'react-router';
import { Button } from '@/shared/components/ui/button';

export const NotFoundPage = () => {
  return (
    <main className="grid min-h-svh place-items-center px-6 py-12">
      <div className="text-center">
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-sm font-medium text-primary">404</p>
        <p className="mt-3 text-muted-foreground">The page you requested does not exist.</p>

        <Button asChild className="mt-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
};
