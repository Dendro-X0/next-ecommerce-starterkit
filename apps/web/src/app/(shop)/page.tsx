"use client"

import { BrowseCategories } from "@/components/home/BrowseCategories"
import { CustomerTestimonials } from "@/components/home/CustomerTestimonials"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { HeroSection } from "@/components/home/HeroSection"
import { NewsletterSignup } from "@/components/home/NewsletterSignup"
import { TopSelling } from "@/components/home/TopSelling"
import { ClientProbe } from "@/components/home/ClientProbe"

export default function HomePage() {
  return (
    <main>
      {/* Ensure a client reference manifest exists on Vercel by including a tiny client component. */}
      <ClientProbe />
      <HeroSection />
      <FeaturedProducts />
      <TopSelling />
      <BrowseCategories />
      <CustomerTestimonials />
      <NewsletterSignup />
    </main>
  )
}
