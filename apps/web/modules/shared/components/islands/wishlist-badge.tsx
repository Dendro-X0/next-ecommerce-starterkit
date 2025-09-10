"use client"

import { Heart } from "lucide-react"
import { AppLink } from "../app-link"
import { useEffect, useState, type JSX } from "react"
import { useQuery } from "@tanstack/react-query"
import { wishlistApi } from "@/lib/data/wishlist"
import { useSession } from "@/hooks/use-session"
import { WISHLIST_QK } from "@/lib/wishlist/query-keys"

export function WishlistBadge(): JSX.Element {
  const session = useSession()
  const user = session?.user ?? null
  const [enable, setEnable] = useState<boolean>(false)

  useEffect(() => {
    const w: Window & { requestIdleCallback?: any; cancelIdleCallback?: any } = window as any
    let t: number | undefined
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setEnable(true), { timeout: 1500 })
      return () => w.cancelIdleCallback?.(id)
    }
    t = window.setTimeout(() => setEnable(true), 1200)
    return () => {
      if (t) window.clearTimeout(t)
    }
  }, [])

  const { data: count = 0 } = useQuery<number>({
    queryKey: WISHLIST_QK,
    enabled: enable && !!user,
    queryFn: async () => {
      const wl = await wishlistApi.getWishlist()
      return wl?.items?.length ?? 0
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 0,
  })

  return (
    <AppLink
      href="/dashboard/user/wishlist"
      aria-label="Wishlist"
      className="relative inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      data-testid="header-wishlist-link"
    >
      <Heart className="h-5 w-5" />
      <span
        aria-hidden="true"
        data-testid="header-wishlist-badge"
        className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] leading-5 text-center"
        style={{ display: count > 0 ? "inline-block" : "none" }}
      >
        {count}
      </span>
    </AppLink>
  )
}
