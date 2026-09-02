import { Card } from '@/shared/components/ui/card';

import type { ReactNode } from 'react';

interface BoardContainerProps {
  children: ReactNode;
}

export const BoardContainer = ({ children }: BoardContainerProps) => (
  <main className="h-svh overflow-hidden p-3 sm:p-5">
    <section className="h-full min-h-0 min-w-0">
      <Card className="h-full min-h-0 gap-0 py-0">{children}</Card>
    </section>
  </main>
);
