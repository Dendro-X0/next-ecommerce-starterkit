"use client"

import {
  PageHeader as UIPageHeader,
  type PageHeaderProps as UIPageHeaderProps,
} from "@/components/ui/page-header"
import type React from "react"

/**
 * PageHeader: dashboard-level wrapper over UI PageHeader.
 */
export type PageHeaderProps = UIPageHeaderProps

export function PageHeader(props: PageHeaderProps): React.ReactElement {
  return <UIPageHeader {...props} />
}
