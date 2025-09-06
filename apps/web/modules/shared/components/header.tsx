"use client"

import { CartDrawer } from "@/components/cart/cart-drawer"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSession } from "@/hooks/use-session"
import { authClient } from "@/lib/auth-client"
import { wishlistApi } from "@/lib/data/wishlist"
import { WISHLIST_QK } from "@/lib/wishlist/query-keys"
import { useQuery } from "@tanstack/react-query"
import { Heart, LayoutGrid, LogOut, Menu, Search, Settings, UserRound, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { JSX } from "react"
import { NavigationDropdown } from "./navigation-dropdown"
import { type Role, hasRole } from "@/lib/roles"
import { isAdminEmail } from "@/lib/admin-allowlist"

type NavItem = {
  readonly title: string
  readonly href: string
  readonly hasDropdown?: boolean
}

const navigationItems: ReadonlyArray<NavItem> = [
  { title: "Shop", href: "/shop" },
  { title: "Categories", href: "/categories", hasDropdown: true },
  { title: "Contact", href: "/contact" },
  { title: "Dashboard", href: "/dashboard/user" },
]

export function Header(): JSX.Element {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const session = useSession()
  const user = session?.user ?? null
  const { data: wl } = useQuery({
    queryKey: WISHLIST_QK,
    queryFn: () => wishlistApi.getWishlist(),
    staleTime: 60_000,
  })
  const wishlistCount: number = wl?.items?.length ?? 0
  const roles = user?.roles as readonly Role[] | undefined
  const isAdmin: boolean = hasRole(roles, ["admin"]) || isAdminEmail(user?.email ?? null)

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm relative">
        <span>Sign up and get 20% off to your first order. </span>
        <Link href="/auth/signup" className="underline hover:no-underline text-white">
          Sign Up Now
        </Link>
        <button className="absolute right-4 top-2 hover:opacity-70 transition-opacity">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-black text-black dark:text-white">SHOP</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.hasDropdown ? (
                    <NavigationDropdown title={item.title} href={item.href} />
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-all duration-200"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-full focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist Link + Cart Drawer (hidden on mobile, moved into menu) */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
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
                    style={{ display: wishlistCount > 0 ? "inline-block" : "none" }}
                  >
                    {wishlistCount}
                  </span>
                </Link>
                <CartDrawer />
              </div>

              {/* Auth */}
              {!user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="bg-black text-white dark:bg-white dark:text-black"
                  >
                    <Link href="/auth/signup">Register</Link>
                  </Button>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white">
                      <Avatar>
                        <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
                        <AvatarFallback>
                          {(user.name ?? "U").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-48">
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      Signed in as
                      <div className="text-foreground text-sm font-medium truncate">
                        {user.email ?? user.name}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/user" className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/admin" className="flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/user" className="flex items-center gap-2">
                        <UserRound className="h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/user/settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        await authClient.signOut()
                        window.location.assign("/")
                      }}
                      className="cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Open site navigation"
                    className="md:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                >
                  <SheetHeader>
                    <SheetTitle className="sr-only">Site navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    <nav className="flex flex-col space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-black dark:hover:text-white py-2 transition-colors"
                        >
                          {item.title}
                        </Link>
                      ))}
                      {!user ? (
                        <div className="mt-4 flex gap-2">
                          <Button asChild size="sm" variant="ghost" className="flex-1">
                            <Link href="/auth/login">Login</Link>
                          </Button>
                          <Button asChild size="sm" className="flex-1">
                            <Link href="/auth/signup">Register</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-4 space-y-2">
                          <Link
                            href="/dashboard/user"
                            className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                          >
                            Dashboard
                          </Link>
                          {isAdmin && (
                            <Link
                              href="/dashboard/admin"
                              className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                            >
                              Admin
                            </Link>
                          )}
                          <Link
                            href="/dashboard/user/settings"
                            className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
                          >
                            Settings
                          </Link>
                        </div>
                      )}
                    </nav>
                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="sr-only">Quick actions</h3>
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="outline" className="w-full justify-center">
                          <Link href="/dashboard/user/wishlist" aria-label="Open wishlist">
                            <Heart className="h-4 w-4 mr-2" /> Wishlist
                          </Link>
                        </Button>
                        <CartDrawer label="View Cart" fullWidth />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
