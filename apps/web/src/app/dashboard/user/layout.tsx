import { DashboardShell } from "@/app/dashboard/_components/shell"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { getServerSession } from "modules/shared/lib/auth/get-server-session"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type React from "react"
import { UserSidebar } from "./_components/user-sidebar"

/**
 * DashboardLayout: protects the user dashboard server-side and renders the shell.
 */
export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }): Promise<React.ReactElement> {
  const h = await headers()
  const session = await getServerSession({ headers: h })
  if (!session?.user) redirect("/auth/login")
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <DashboardShell sidebar={<UserSidebar />}>{children}</DashboardShell>
    </ThemeProvider>
  )
}
