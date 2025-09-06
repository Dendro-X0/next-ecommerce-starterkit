import { PageHeader } from "@/app/dashboard/_components/page-header"
import { Section } from "@/app/dashboard/_components/section"
import { DashboardReports } from "@/app/dashboard/admin/_components/dashboard-reports"
import type React from "react"

export default function ReportsPage(): React.ReactElement {
  return (
    <Section>
      <PageHeader title="Reports" description="Download and view operational reports." />
      <DashboardReports />
    </Section>
  )
}
