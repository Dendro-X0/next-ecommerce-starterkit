"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/ui/star-rating"
import { isDigitalProduct } from "@/lib/cart/utils"
import { wishlistApi } from "@/lib/data/wishlist"
import { useCartStore } from "@/lib/stores/cart"
import { WISHLIST_HAS_QK, WISHLIST_QK } from "@/lib/wishlist/query-keys"
import type { Product } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const kindLabel = isDigitalProduct(product) ? "Download" : "Shipping"
  const queryClient = useQueryClient()
  const productId: string = product.id
  const discountPercent: number =
    typeof product.originalPrice === "number" && product.originalPrice > 0
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const { data: isWishlisted = false, isLoading: wlLoading } = useQuery<boolean>({
    queryKey: WISHLIST_HAS_QK(productId),
    queryFn: () => wishlistApi.has(productId),
    enabled: Boolean(productId),
    staleTime: 60_000,
  })

  const toggleWishlist = useMutation<boolean, Error, void, { prev?: boolean }>({
    mutationFn: () => wishlistApi.toggle(productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_HAS_QK(productId) })
      const prev = queryClient.getQueryData<boolean>(WISHLIST_HAS_QK(productId))
      queryClient.setQueryData<boolean>(WISHLIST_HAS_QK(productId), !(prev ?? false))
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) queryClient.setQueryData(WISHLIST_HAS_QK(productId), ctx.prev)
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: WISHLIST_QK }),
        queryClient.invalidateQueries({ queryKey: WISHLIST_HAS_QK(productId) }),
      ])
    },
  })

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div
      className="group relative bg-card rounded-lg border p-4 transition-all hover:shadow-lg"
      data-testid="product-card"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-all group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant={isDigitalProduct(product) ? "default" : "secondary"}>{kindLabel}</Badge>
          {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
          {hasDiscount && <Badge variant="destructive">{discountPercent}% OFF</Badge>}
        </div>

        {/* Quick Actions */}
        <div
          className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          data-testid="plp-wishlist-toggle"
          data-ready={wlLoading ? "false" : "true"}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist.mutate()
            }}
            disabled={toggleWishlist.isPending || wlLoading}
            aria-pressed={isWishlisted}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            data-testid="plp-wishlist-toggle-button"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "text-red-500 fill-current" : ""}`} />
          </Button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <StarRating rating={product.rating} size="sm" />
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">${product.price}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>

        {/* Mobile Add to Cart */}
        <div className="sm:hidden">
          <Button
            size="sm"
            className="w-full"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
