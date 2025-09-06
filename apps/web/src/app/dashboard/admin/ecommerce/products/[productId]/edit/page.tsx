import { PageHeader } from "@/app/dashboard/_components/page-header"
import { Section } from "@/app/dashboard/_components/section"
import { ProductForm } from "@/app/dashboard/admin/_components/product-form"
import { Button } from "@/components/ui/button"
import { links } from "@/lib/links"
import Link from "next/link"
import type React from "react"

/**
 * Admin → E-commerce → Products → Edit page.
 */
export default function EditProductPage({
  params,
}: {
  readonly params: { productId: string }
}): React.ReactElement {
  return (
    <Section>
      <PageHeader
        title="Edit Product"
        description="Update product details."
        actions={
          <Link href={links.getDashboardAdminEcommerceProductsRoute()}>
            <Button variant="outline">Back to Products</Button>
          </Link>
        }
      />
      <ProductForm productId={params.productId} />
    </Section>
  )
}
