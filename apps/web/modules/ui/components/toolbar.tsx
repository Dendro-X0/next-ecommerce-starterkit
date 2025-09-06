"use client"

import { cn } from "@/lib/utils"
import type * as React from "react"

/**
 * Toolbar: horizontal row for filters/actions.
 */
export type ToolbarProps = Readonly<{
  className?: string
  children: React.ReactNode
}>

export function Toolbar({ className, children }: ToolbarProps): React.ReactElement {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>
}
