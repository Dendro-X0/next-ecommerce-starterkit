import type { JSX } from "react"
import { productsDisabled } from "@/lib/safe-mode"

export default async function CategoryPage({ params }: { params: { slug: string } }): Promise<JSX.Element> {
  if (productsDisabled) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        <h1 className="text-3xl font-bold mb-2">Products Disabled</h1>
        <p>Category product listing is turned off in safe mode.</p>
      </div>
    )
  }
  const { default: CategoryPageClient } = await import("./client")
  return <CategoryPageClient params={params} />
}
