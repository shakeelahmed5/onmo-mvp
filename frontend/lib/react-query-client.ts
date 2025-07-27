import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      // Disable refetching on window focus for static sites
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
  },
})
