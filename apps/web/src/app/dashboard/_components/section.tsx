"use client"

import { Section as UISection, type SectionProps as UISectionProps } from "@/components/ui/section"
import type React from "react"

/**
 * Section: dashboard-level wrapper over UI Section.
 */
export type SectionProps = UISectionProps

export function Section(props: SectionProps): React.ReactElement {
  return <UISection {...props} />
}
