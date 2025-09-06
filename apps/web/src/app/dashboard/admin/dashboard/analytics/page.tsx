import { PageHeader } from "@/app/dashboard/_components/page-header"
import { Section } from "@/app/dashboard/_components/section"
import { DashboardAnalytics } from "@/app/dashboard/admin/_components/dashboard-analytics"
import type React from "react"

export default function AnalyticsPage(): React.ReactElement {
  return (
    <Section>
      <PageHeader title="Analytics" description="Traffic and performance insights." />
      <DashboardAnalytics />
    </Section>
  )
}
