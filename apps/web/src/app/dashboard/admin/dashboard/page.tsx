import { links } from "@/lib/links"
import { redirect } from "next/navigation"

/**
 * AdminDashboardIndexPage
 * Redirects `/dashboard/admin/dashboard` to the Overview page.
 */
export default function AdminDashboardIndexPage(): never {
  redirect(links.getDashboardAdminDashboardOverviewRoute())
}
