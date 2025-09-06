"use client"

import { authClient } from "@/lib/auth-client"
import { queryClient } from "@/lib/query-client"
import { QueryClientProvider, useQuery } from "@tanstack/react-query"
import * as React from "react"
import type { JSX } from "react"

export interface Session {
  readonly user: {
    readonly id?: string
    readonly email?: string
    readonly name?: string | null
    readonly image?: string | null
    readonly roles?: readonly string[]
    readonly emailVerified?: boolean
  } | null
}

// Query client is provided by shared singleton in `@/lib/query-client`.

const SessionContext = React.createContext<{ readonly session: Session | undefined } | undefined>(
  undefined,
)

export function SessionProvider({ children }: { readonly children: React.ReactNode }): JSX.Element {
  const { data: session } = useQuery<Session>({
    queryKey: ["session"],
    queryFn: async (): Promise<Session> => {
      const frontendOnlyEnv: string = (
        process.env.NEXT_PUBLIC_FRONTEND_ONLY ?? "false"
      ).toLowerCase()
      const frontendOnly: boolean = frontendOnlyEnv === "true"
      if (frontendOnly) {
        // Frontend-only mode: skip backend and treat as signed-out
        return { user: null }
      }
      const { data, error } = await authClient.getSession()
      if (error) {
        return { user: null }
      }
      const u = data?.user as
        | {
            readonly id?: string
            readonly email?: string
            readonly name?: unknown
            readonly image?: unknown
            readonly roles?: unknown
            readonly emailVerified?: unknown
          }
        | undefined
      if (!u) return { user: null }
      const user = {
        id: u.id,
        email: u.email,
        name: typeof u.name === "string" ? (u.name as string) : null,
        image: typeof u.image === "string" ? (u.image as string) : null,
        roles:
          Array.isArray(u.roles) && (u.roles as unknown[]).every((x) => typeof x === "string")
            ? (u.roles as readonly string[])
            : undefined,
        emailVerified:
          typeof u.emailVerified === "boolean" ? (u.emailVerified as boolean) : undefined,
      }
      return { user }
    },
    staleTime: 5 * 60_000,
    retry: 1,
    placeholderData: (previous): Session | undefined => previous as Session | undefined,
  })

  return <SessionContext.Provider value={{ session }}>{children}</SessionContext.Provider>
}

export function AppWithQueryClient({
  children,
}: { readonly children: React.ReactNode }): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  )
}

export function useSession(): Session | undefined {
  const context = React.useContext(SessionContext)
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context.session
}
