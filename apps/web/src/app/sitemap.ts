import type { MetadataRoute } from "next"

const BASE: string = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

const routes: readonly string[] = ["/", "/shop", "/categories", "/contact"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const items: MetadataRoute.Sitemap = []
  for (const route of routes) {
    const urlEn = new URL(route, BASE).toString()
    const urlEs = new URL(route === "/" ? "/es" : `/es${route}`, BASE).toString()
    items.push({
      url: urlEn,
      lastModified: now,
      changeFrequency: "weekly",
      alternates: {
        languages: {
          en: urlEn,
          es: urlEs,
        },
      },
    })
  }
  return items
}
