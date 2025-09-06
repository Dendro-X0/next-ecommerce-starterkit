"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StarRating } from "@/components/ui/star-rating"
import { productsApi } from "@/lib/data/products"
import { showToast } from "@/lib/utils/toast"
import type { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo } from "react"

export function FeaturedProducts() {
  const { data, isLoading, error } = useQuery<Readonly<{ items: readonly Product[] }>>({
    queryKey: ["products", "featured", 4],
    queryFn: () => productsApi.featured(4),
    staleTime: 60_000,
  })
  const items: readonly Product[] = data?.items ?? []

  useEffect(() => {
    if (error) {
      const message: string = error instanceof Error ? error.message : "Failed to load products"
      showToast(message, { type: "error" })
    }
  }, [error])

  // Stable keys for skeleton items
  const skeletonKeys = useMemo<readonly string[]>(
    () =>
      Array.from(
        { length: 4 },
        () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      ),
    [],
  )

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-12 text-black dark:text-white">NEW ARRIVALS</h2>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {skeletonKeys.map((k) => (
              <Card key={k} className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-8 text-red-600">Failed to load products.</div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {items.map((product) => (
              <Card key={product.id} className="group border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                      <div className="relative w-full h-full">
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <StarRating rating={product.rating} />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.rating}/5 ({product.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-black dark:text-white">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                              ${product.originalPrice}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Button
            variant="outline"
            asChild
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
          >
            <Link href="/shop">View All</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
