import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { AppRouter } from 'backend';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});


const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ 
      url: 'http://localhost:3000/api',
      fetch(url, options) {
        return fetch(url, {
          ...(options as RequestInit),
          credentials: "include"
        })
      }
    })
  ],
});



export const trpc: ReturnType<typeof createTRPCOptionsProxy<AppRouter>> = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});