"use client"

import type { JSX } from "react"
import { HeroCarousel } from "./HeroCarousel"

/**
 * HeroSection renders the full-width hero carousel for the home page.
 * It wraps the existing HeroCarousel to preserve imports while updating the design.
 */
export function HeroSection(): JSX.Element {
  return <HeroCarousel />
}
