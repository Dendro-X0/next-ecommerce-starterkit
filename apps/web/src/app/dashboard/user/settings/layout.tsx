"use client"

import { DashboardHeader } from "@/app/dashboard/user/_components/dashboard-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SettingsLayout({
  children,
}: { children: React.ReactNode }): React.ReactElement {
  const pathname = usePathname()

  const breadcrumbs = [{ label: "Dashboard", href: "/dashboard/user" }, { label: "Settings" }]

  const tabs = [
    { name: "Profile", href: "/dashboard/user/settings/profile" },
    { name: "Security", href: "/dashboard/user/settings/security" },
    { name: "Addresses", href: "/dashboard/user/settings/addresses" },
    { name: "Notifications", href: "/dashboard/user/settings/notifications" },
  ]

  const activeTab = tabs.find((tab) => pathname.includes(tab.href))?.name || "Profile"

  return (
    <SidebarInset>
      <DashboardHeader title="Settings" breadcrumbs={breadcrumbs} />
      <div className="container space-y-6 mx-auto p-6 max-w-5xl">
        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.name} value={tab.name} asChild>
                <Link href={tab.href}>{tab.name}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
          {children}
        </Tabs>
      </div>
    </SidebarInset>
  )
}
