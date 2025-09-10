import type { JSX } from "react"
import { BrowseCategories } from "@/components/home/BrowseCategories"
import { CustomerTestimonials } from "@/components/home/CustomerTestimonials"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { HeroSection } from "@/components/home/HeroSection"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"
import { TopSelling } from "@/components/home/TopSelling"

/**
 * ShopHome renders the main storefront sections used on the shop landing page.
 * Extracted to avoid cross-route imports between `app/page.tsx` and `app/(shop)/page.tsx`.
 */
export function ShopHome(): JSX.Element {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <TopSelling />
      <BrowseCategories />
      <CustomerTestimonials />
      <NewsletterSignup />
    </main>
  )
}
