import type { JSX } from "react"
import { BrowseCategories } from "./BrowseCategories"
import { CustomerTestimonials } from "./CustomerTestimonials"
import { FeaturedProducts } from "./FeaturedProducts"
import { HeroSection } from "./HeroSection"
import { NewsletterSignup } from "./NewsletterSignup"
import { TopSelling } from "./TopSelling"

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
