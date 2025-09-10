"use client"

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import type { JSX, KeyboardEvent } from "react"
import { useRef } from "react"
import { Search } from "lucide-react"

/**
 * HeaderSearch: lightweight search input that navigates
 * to /categories?query=... on Enter. No typeahead to
 * keep hydration cost minimal.
 */
export function HeaderSearch(): JSX.Element {
  const router = useRouter()
  const ref = useRef<HTMLInputElement | null>(null)

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== "Enter") return
    const value: string = ref.current?.value?.trim() ?? ""
    if (value.length === 0) return
    router.push(`/categories?query=${encodeURIComponent(value)}`)
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
      <Input
        ref={ref}
        type="search"
        placeholder="Search for products..."
        onKeyDown={onKeyDown}
        className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-full focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
        aria-label="Search products"
      />
    </div>
  )
}
