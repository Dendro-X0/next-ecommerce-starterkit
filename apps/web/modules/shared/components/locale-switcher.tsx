"use client"

import { usePathname, useRouter } from "next/navigation"
import type { JSX, ChangeEvent } from "react"

/**
 * LocaleSwitcher
 * Minimal locale selector for i18n scaffold. Navigates to locale-prefixed path.
 */
export function LocaleSwitcher(): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const locales = ["en", "es"] as const

  const currentLocale: "en" | "es" = getCurrentLocale(pathname)

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const nextLocale = e.target.value as "en" | "es"
    const nextPath = buildPathWithLocale(pathname, nextLocale)
    router.push(nextPath)
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm" aria-label="Select language">
      <span className="sr-only">Language</span>
      <select
        className="border rounded-md px-2 py-1 bg-white dark:bg-gray-900"
        value={currentLocale}
        onChange={handleChange}
        aria-describedby="locale-switcher"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc === "en" ? "English" : "Español"}
          </option>
        ))}
      </select>
      <span id="locale-switcher" className="sr-only">
        Current language is {currentLocale === "en" ? "English" : "Español"}
      </span>
    </label>
  )
}

function getCurrentLocale(path: string): "en" | "es" {
  if (path.startsWith("/es")) return "es"
  return "en"
}

function buildPathWithLocale(path: string, locale: "en" | "es"): string {
  // Normalize root or existing locale prefix
  if (locale === "en") {
    // Remove leading "/es" if present
    return path.startsWith("/es") ? path.replace(/^\/es(\/|$)/, "/") : path || "/"
  }
  // Ensure "/es" prefix exists exactly once
  if (path.startsWith("/es/")) return path
  if (path === "/es") return path
  return path === "/" ? "/es" : `/es${path}`
}
