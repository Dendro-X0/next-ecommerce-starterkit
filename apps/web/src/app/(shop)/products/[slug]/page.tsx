"use client"

import { MobilePdpBar } from "@/components/product/mobile-pdp-bar"
import { ProductFAQ } from "@/components/product/product-faq"
import { RelatedProducts } from "@/components/product/related-products"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StarRating } from "@/components/ui/star-rating"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isDigitalProduct } from "@/lib/cart/utils"
import { productsApi } from "@/lib/data/products"
import { reviewsApi } from "@/lib/data/reviews"
import { wishlistApi } from "@/lib/data/wishlist"
import { PRODUCT_REVIEWS_QK } from "@/lib/reviews/query-keys"
import { useCartStore } from "@/lib/stores/cart"
import { showToast } from "@/lib/utils/toast"
import { WISHLIST_HAS_QK, WISHLIST_QK } from "@/lib/wishlist/query-keys"
import type { Product } from "@/types"
import type { UserReview } from "@/types/review"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart, Minus, Plus, Share2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { type ReactElement, useEffect, useMemo, useState } from "react"

/**
 * Product detail page (PDP).
 * Receives dynamic route params synchronously and renders product details.
 */
export default function ProductPage(): ReactElement {
  // Stable keys for loading thumbnail skeletons
  const skeletonThumbKeys = useMemo<readonly string[]>(
    () =>
      Array.from(
        { length: 4 },
        () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
      ),
    [],
  )
  const params = useParams<{ slug?: string | string[] }>()
  const slugParam = params?.slug
  const slug: string =
    typeof slugParam === "string" ? slugParam : Array.isArray(slugParam) ? slugParam[0] : ""
  const isSlugReady: boolean = slug.trim().length > 0

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => productsApi.bySlug(slug),
    enabled: isSlugReady,
    retry: 0,
  })

  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const { addItem } = useCartStore()
  const queryClient = useQueryClient()

  // Compute productId early (may be empty until product loads)
  const productId: string = product?.id ?? ""

  const { data: productReviews = [] } = useQuery<readonly UserReview[]>({
    queryKey: PRODUCT_REVIEWS_QK(productId),
    queryFn: () => reviewsApi.getProductReviews(productId),
    enabled: productId.length > 0,
    staleTime: 60_000,
  })

  // Derived stats from published reviews
  const publishedReviews: readonly UserReview[] = productReviews.filter(
    (r) => r.status === "Published",
  )
  const reviewCount: number = publishedReviews.length
  const avgRating: number =
    reviewCount > 0
      ? Number((publishedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : 0

  // Important: declare all hooks before any conditional returns to keep hook order stable
  const { data: isWishlisted = false } = useQuery<boolean>({
    queryKey: WISHLIST_HAS_QK(productId),
    queryFn: () => wishlistApi.has(productId),
    enabled: productId.length > 0,
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
    onError: (err, _vars, ctx) => {
      if (ctx?.prev !== undefined) queryClient.setQueryData(WISHLIST_HAS_QK(productId), ctx.prev)
      const message: string = err instanceof Error ? err.message : "Failed to update wishlist"
      showToast(message, { type: "error" })
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: WISHLIST_QK }),
        queryClient.invalidateQueries({ queryKey: WISHLIST_HAS_QK(productId) }),
      ])
    },
  })

  useEffect(() => {
    if (error) {
      const message: string = error instanceof Error ? error.message : "Failed to load product"
      showToast(message, { type: "error" })
    }
  }, [error])

  // Tabs: deep-linking via hash (must be before any conditional return)
  const [tab, setTab] = useState<string>("description")
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setTab(window.location.hash.slice(1))
    }
  }, [])
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = `#${tab}`
      if (window.location.hash !== hash) {
        history.replaceState(null, "", hash)
      }
    }
  }, [tab])

  if (isLoading || !isSlugReady) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex gap-2">
              {skeletonThumbKeys.map((k) => (
                <Skeleton key={k} className="aspect-square w-16 sm:w-20 rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-40" />
              {/* SSR-safe wishlist toggle placeholder: present and disabled */}
              <div data-testid="pdp-wishlist-toggle" data-ready="false">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-12 h-12 p-0 sm:w-auto"
                  disabled
                  aria-pressed={false}
                  aria-label="Add to wishlist"
                >
                  <Heart className="h-4 w-4 opacity-50 animate-pulse" />
                </Button>
              </div>
              <Skeleton className="h-10 w-12" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product || error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="text-muted-foreground mt-2">
          The requested product does not exist or failed to load.
        </p>
        <div
          className="mt-6 flex justify-center"
          data-testid="pdp-wishlist-toggle"
          data-ready="false"
        >
          <Button
            size="lg"
            variant="outline"
            className="w-12 h-12 p-0"
            disabled
            aria-pressed={false}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4 opacity-50" />
          </Button>
        </div>
      </div>
    )
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const isDigital = isDigitalProduct(product)
  const hasReviews: boolean = publishedReviews.length > 0

  // Utilities
  const formatPrice = (value: number): string =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

  const handleShare = async (): Promise<void> => {
    const url: string = typeof window !== "undefined" ? window.location.href : ""
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
        showToast("Share dialog opened", { type: "success" })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        showToast("Link copied to clipboard", { type: "success" })
      } else {
        showToast("Sharing not supported", { type: "error" })
      }
    } catch (err) {
      const message: string = err instanceof Error ? err.message : "Failed to share"
      showToast(message, { type: "error" })
    }
  }


  return (
    <div className="container mx-auto px-4 pt-8 pb-28 lg:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
            {hasDiscount && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                {Math.round(
                  ((product.originalPrice! - product.price) / product.originalPrice!) * 100,
                )}
                % OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory">
              {product.images.map((image, index) => (
                <button
                  key={image || String(index)}
                  type="button"
                  aria-current={selectedImage === index}
                  aria-label={`${product.name} image ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square w-16 sm:w-20 overflow-hidden rounded-md border-2 transition-all snap-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:underline">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/shop" className="hover:underline">Shop</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">{product.name}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant={isDigital ? "default" : "secondary"}>
                {isDigital ? "Download" : "Shipping"}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={avgRating} showValue={hasReviews} />
              <span className="text-sm text-muted-foreground">
                {hasReviews ? `(${reviewCount} reviews)` : "No reviews yet"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className={product.inStock ? "text-green-600" : "text-red-600"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg h-11">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-11 w-11"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 min-w-12 text-center" role="status" aria-live="polite">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="h-11 w-11"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                className="h-11 rounded-lg px-6 w-full lg:w-auto"
                disabled={!product.inStock}
                onClick={() => addItem(product, quantity)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <div data-testid="pdp-wishlist-toggle" data-ready="true">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className={`h-11 rounded-lg px-4 w-auto ${isWishlisted ? "text-red-500" : ""}`}
                  onClick={() => toggleWishlist.mutate()}
                  disabled={toggleWishlist.isPending}
                  aria-pressed={isWishlisted}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  data-testid="pdp-wishlist-toggle-button"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                  <span className="ml-2">Wishlist</span>
                </Button>
              </div>
              <Button
                type="button"
                size="lg"
                variant="outline"
                aria-label="Share product"
                className="h-11 rounded-lg px-4 w-auto"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="ml-2">Share</span>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-11 rounded-lg sm:w-auto">
                <Link
                  href={`/dashboard/user/reviews?create=1&productId=${encodeURIComponent(product.id)}&productName=${encodeURIComponent(product.name)}&rating=${Math.max(1, Math.min(5, Math.round(avgRating)))}`}
                >
                  Write Review
                </Link>
              </Button>
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <span className="font-medium mb-2 block">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="my-12" />

      {/* Product Details Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 rounded-lg bg-muted/30 mb-4 sm:mb-5">
          <TabsTrigger
            value="description"
            className="rounded-md h-9 sm:h-10 px-3 data-[state=active]:bg-muted data-[state=active]:text-foreground focus-visible:ring-2"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-md h-9 sm:h-10 px-3 data-[state=active]:bg-muted data-[state=active]:text-foreground focus-visible:ring-2"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-md h-9 sm:h-10 px-3 data-[state=active]:bg-muted data-[state=active]:text-foreground focus-visible:ring-2"
          >
            Reviews ({publishedReviews.length})
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="rounded-md h-9 sm:h-10 px-3 data-[state=active]:bg-muted data-[state=active]:text-foreground focus-visible:ring-2"
          >
            FAQ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between py-3 border-b">
                <span className="font-medium">Category</span>
                <span className="text-muted-foreground">{product.category}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="font-medium">SKU</span>
                <span className="text-muted-foreground">{product.id}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="font-medium">Availability</span>
                {isDigital ? (
                  <span className="text-muted-foreground">
                    Digital item — Instant access/download after purchase.
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {product.inStock ? "In Stock. Ships in 1-2 business days." : "Out of Stock"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <div className="space-y-5 sm:space-y-6 rounded-lg border bg-card p-4 sm:p-6">
            {publishedReviews.length > 0 ? (
              publishedReviews.map((review) => (
                <div key={review.id} className="border-b pb-5 sm:pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      {review.title && <span className="font-medium">{review.title}</span>}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  {review.content && <p className="text-muted-foreground">{review.content}</p>}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-8">
          <div className="rounded-lg border bg-card p-3 sm:p-5 space-y-3">
            <ProductFAQ />
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-12" />

      {/* JSON-LD: Product and Breadcrumbs */}
      {(() => {
        const urlPath = `/products/${encodeURIComponent(product.id)}`
        const availability = product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
        const productJsonLd = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          sku: product.id,
          image: product.images?.length ? product.images : ["/placeholder.svg"],
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability,
            url: urlPath,
          },
          ...(hasReviews
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: Number(avgRating.toFixed(1)),
                  reviewCount: publishedReviews.length,
                },
              }
            : {}),
        }
        const breadcrumbJsonLd = {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Shop",
              item: "/shop",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: urlPath,
            },
          ],
        }
        return (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
          </>
        )
      })()}

      {/* Related Products */}
      <RelatedProducts currentProductId={product.id} category={product.category} limit={4} />

      {/* Mobile sticky PDP bar */}
      <MobilePdpBar product={product} quantity={quantity} disabled={!product.inStock} />
    </div>
  )
}
