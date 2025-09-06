"use client"

import { Toolbar as UIToolbar, type ToolbarProps as UIToolbarProps } from "@/components/ui/toolbar"
import type React from "react"

/**
 * Toolbar: dashboard-level wrapper over UI Toolbar.
 */
export type ToolbarProps = UIToolbarProps

export function Toolbar(props: ToolbarProps): React.ReactElement {
  return <UIToolbar {...props} />
}
