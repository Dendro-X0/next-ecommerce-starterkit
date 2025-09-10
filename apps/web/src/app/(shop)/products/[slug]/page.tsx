import type { JSX } from "react"
import { productsDisabled } from "@/lib/safe-mode"

export default async function ProductPage({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  if (productsDisabled) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Products Disabled</h1>
        <p className="text-muted-foreground mt-2">PDP is turned off in safe mode.</p>
      </div>
    )
  }
  const { default: ProductPageClient } = await import("./client")
  return <ProductPageClient />
}
