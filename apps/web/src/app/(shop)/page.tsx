import { BrowseCategories } from "@/components/home/BrowseCategories"
import { CustomerTestimonials } from "@/components/home/CustomerTestimonials"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { HeroSection } from "@/components/home/HeroSection"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"
import { TopSelling } from "@/components/home/TopSelling"

export default function HomePage() {
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
