"use client"

import type { ReactNode, ReactElement } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "@/hooks/use-session"

let client: QueryClient | undefined
function getQueryClient(): QueryClient {
  if (!client) {
    client = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
          retry: 0,
          staleTime: 5 * 60_000,
          gcTime: 10 * 60_000,
        },
      },
    })
  }
  return client
}

export function FullClientProviders({ children }: { children: ReactNode }): ReactElement {
  const qc = getQueryClient()
  return (
    <QueryClientProvider client={qc}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  )
}
