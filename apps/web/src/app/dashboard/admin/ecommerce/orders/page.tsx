import { PageHeader } from "@/app/dashboard/_components/page-header"
import { Section } from "@/app/dashboard/_components/section"
import { OrdersTable } from "@/app/dashboard/admin/_components/orders-table"
import type React from "react"

export default function OrdersPage(): React.ReactElement {
  return (
    <Section>
      <PageHeader title="Orders" description="Recent orders from your store." />
      <OrdersTable />
    </Section>
  )
}
