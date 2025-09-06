import { PageHeader } from "@/app/dashboard/_components/page-header"
import { Section } from "@/app/dashboard/_components/section"
import { ProductsTable } from "@/app/dashboard/admin/_components/products-table"
import { Button } from "@/components/ui/button"
import { links } from "@/lib/links"
import Link from "next/link"
import type React from "react"

/**
 * Admin → E-commerce → Products list page.
 */
export default function ProductsPage(): React.ReactElement {
  return (
    <Section>
      <PageHeader
        title="Products"
        description="Manage your catalog. Create, edit, and organize products."
        actions={
          <Link href={links.getDashboardAdminEcommerceProductCreateRoute()}>
            <Button>Create Product</Button>
          </Link>
        }
      />
      <ProductsTable />
    </Section>
  )
}
