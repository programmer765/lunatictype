import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { AppRouter } from 'backend';

const apiUrl = import.meta.env.VITE_API_URL as string || 'http://localhost:3000';
// console.log(apiUrl)
console.log(import.meta.env)


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
      url: `${apiUrl}/api`,
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