import type { JSX } from "react"
import { productsDisabled } from "@/lib/safe-mode"

export default async function CategoriesPage(): Promise<JSX.Element> {
  if (productsDisabled) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p>Category listings are disabled in safe mode.</p>
      </div>
    )
  }
  const { default: CategoriesPageClient } = await import("./client")
  return <CategoriesPageClient />
}
