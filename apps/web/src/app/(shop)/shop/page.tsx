"use client"

import { ProductFilters } from "@/components/product/product-filters"
import { ProductGrid } from "@/components/product/product-grid"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { isDigitalProduct } from "@/lib/cart/utils"
import { sortOptions } from "@/lib/data"
import { type ListProductsResponse, productsApi } from "@/lib/data/products"
import { mapSortToApi } from "@/lib/utils/product-sort"
import { showToast } from "@/lib/utils/toast"
import type { FilterOptions, Product } from "@/types"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Filter, SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

/**
 * Shop All page with server-driven pagination and sorting.
 */
export default function ShopPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getInt = (v: string | null, fallback: number): number => {
    const n = Number(v)
    return Number.isFinite(n) && n > 0 ? n : fallback
  }
  const initialSort: string = searchParams.get("sort") ?? "newest"
  const initialPage: number = getInt(searchParams.get("page"), 1)

  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 500],
    inStock: undefined,
  })
  const [sortBy, setSortBy] = useState<string>(initialSort)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const productsPerPage: number = 12

  // Stable keys for loading product skeletons
  const skeletonKeys: readonly string[] = useMemo(
    () =>
      Array.from(
        { length: productsPerPage },
        () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      ),
    [productsPerPage],
  )

  const updateUrl = (next: Readonly<{ page?: number; sort?: string }>): void => {
    const usp = new URLSearchParams(searchParams.toString())
    if (typeof next.page === "number") usp.set("page", String(next.page))
    if (typeof next.sort === "string") usp.set("sort", next.sort)
    // Reset page when sort changes
    if (typeof next.sort === "string" && !("page" in next)) usp.set("page", "1")
    router.replace(`${pathname}?${usp.toString()}`)
  }

  const serverCategory: string | undefined =
    filters.categories?.length === 1 ? filters.categories[0] : undefined

  const apiSort: string = mapSortToApi(sortBy)

  const { data, isLoading, error } = useQuery<ListProductsResponse, Error, ListProductsResponse>({
    queryKey: [
      "products",
      { page: currentPage, pageSize: productsPerPage, sort: apiSort, category: serverCategory },
    ],
    queryFn: () =>
      productsApi.list({
        page: currentPage,
        pageSize: productsPerPage,
        sort: apiSort,
        category: serverCategory,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
  const items = data?.items ?? []

  useEffect(() => {
    if (error) {
      const message: string = error instanceof Error ? error.message : "Failed to load products"
      showToast(message, { type: "error" })
    }
  }, [error])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = items.filter((product: Product) => {
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false
      }

      // Kind filter (Digital / Physical)
      if (filters.kind === "digital" && !isDigitalProduct(product)) {
        return false
      }
      if (filters.kind === "physical" && isDigitalProduct(product)) {
        return false
      }

      return true
    })

    // Client-only sorts (rating, popularity). Server-handled sorts are applied via API.
    if (sortBy === "rating") filtered.sort((a: Product, b: Product) => b.rating - a.rating)
    if (sortBy === "popularity")
      filtered.sort((a: Product, b: Product) => b.reviewCount - a.reviewCount)

    return filtered
  }, [filters, sortBy, items])

  // Server-driven pagination
  const totalItems: number = data?.total ?? 0
  const totalPages: number = Math.max(1, Math.ceil(totalItems / productsPerPage))
  const paginatedProducts = filteredAndSortedProducts

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
        {isLoading && <p className="text-muted-foreground">Loading products…</p>}
        {error && !isLoading && <p className="text-red-600">Failed to load products.</p>}
        {!isLoading && !error && (
          <p className="text-muted-foreground">
            Showing {paginatedProducts.length} results • Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 gap-2 sm:gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden bg-transparent w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-80">
                <div className="mt-6">
                  <ProductFilters filters={filters} onFiltersChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <SlidersHorizontal className="h-4 w-4" />
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v)
                  setCurrentPage(1)
                  updateUrl({ sort: v, page: 1 })
                }}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {!isLoading && !error ? (
            paginatedProducts.length > 0 ? (
              <ProductGrid products={paginatedProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="mb-4">No products found. Try adjusting filters or sorting.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ categories: [], priceRange: [0, 500], inStock: undefined })
                    setSortBy("newest")
                    setCurrentPage(1)
                    updateUrl({ sort: "newest", page: 1 })
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {skeletonKeys.map((k) => (
                <div key={k} className="space-y-3">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && !error && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = Math.max(1, currentPage - 1)
                  setCurrentPage(next)
                  updateUrl({ page: next })
                }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1 overflow-x-auto px-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="min-w-9"
                    onClick={() => {
                      setCurrentPage(page)
                      updateUrl({ page })
                    }}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const next = Math.min(totalPages, currentPage + 1)
                  setCurrentPage(next)
                  updateUrl({ page: next })
                }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
