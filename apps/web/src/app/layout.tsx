import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./(shop)/globals.css"
import { AppWithQueryClient } from "@/hooks/use-session"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ModularShop",
  description: "An e-commerce boilerplate built with Next.js, TypeScript, and Tailwind CSS.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppWithQueryClient>{children}</AppWithQueryClient>
      </body>
    </html>
  )
}
