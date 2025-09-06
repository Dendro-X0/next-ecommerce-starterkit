import { links } from "@/lib/links"
import { redirect } from "next/navigation"

/**
 * AdminEcommerceIndexPage
 * Redirects `/dashboard/admin/ecommerce` to the Products list.
 */
export default function AdminEcommerceIndexPage(): never {
  redirect(links.getDashboardAdminEcommerceProductsRoute())
}
