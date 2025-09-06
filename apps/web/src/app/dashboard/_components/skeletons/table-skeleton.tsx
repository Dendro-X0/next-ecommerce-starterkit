"use client"

import { SkeletonTable, type SkeletonTableProps } from "@/components/ui/skeleton-table"
import type React from "react"

/**
 * TableSkeleton: dashboard-level wrapper for table loading state.
 */
export type TableSkeletonProps = SkeletonTableProps

export function TableSkeleton(props: TableSkeletonProps): React.ReactElement {
  return <SkeletonTable {...props} />
}
