import type { JSX } from "react"
import { redirect } from "next/navigation"
import { AppLink } from "../../modules/shared/components/app-link"

/**
 * Minimal landing page rendered outside of the (shop) group.
 * This page avoids all heavy providers/components to guarantee a stable boot
 * when running in safe mode.
 */
export default function LandingPage(): JSX.Element {
  const safeHome: string | undefined = process.env.NEXT_PUBLIC_SAFE_HOME
  const isSafeMode: boolean = safeHome === "true" || safeHome === "1"
  if (!isSafeMode) {
    // Do not import another route's page component. Redirect to the shop route instead.
    redirect("/shop")
  }
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-black mb-4">App Safe Mode</h1>
        <p className="text-muted-foreground mb-8">
          The app is running a minimal landing page to ensure stability. Use the links below to
          navigate to feature pages.
        </p>
        <div className="flex gap-4 justify-center">
          <AppLink href="/shop" className="rounded-md border px-4 py-2">Open Shop</AppLink>
          <AppLink href="/categories" className="rounded-md border px-4 py-2">Categories</AppLink>
          <AppLink href="/dashboard/user" className="rounded-md border px-4 py-2">Dashboard</AppLink>
        </div>
      </div>
    </main>
  )
}
