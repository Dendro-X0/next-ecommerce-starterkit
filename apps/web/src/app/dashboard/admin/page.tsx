import { links } from "@/lib/links"
import { redirect } from "next/navigation"

/**
 * AdminIndexPage
 * Server component that redirects `/dashboard/admin` to the default admin landing page.
 */
export default function AdminIndexPage(): never {
  redirect(links.getDashboardAdminDashboardOverviewRoute())
}
