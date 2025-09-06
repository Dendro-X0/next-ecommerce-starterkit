import { PageHeader } from "@/app/dashboard/_components/page-header"
import { Section } from "@/app/dashboard/_components/section"
import { DashboardOverview } from "@/app/dashboard/admin/_components/dashboard-overview"
import type React from "react"

export default function OverviewPage(): React.ReactElement {
  return (
    <Section>
      <PageHeader title="Dashboard" description="Key metrics and recent orders." />
      <DashboardOverview />
    </Section>
  )
}
