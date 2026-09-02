import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/api/error';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 90_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }

        return failureCount < 1;
      },
    },
  },
});
