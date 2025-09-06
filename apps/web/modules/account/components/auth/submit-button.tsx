"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  className,
  variant,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "disabled">) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" variant={variant} className={className} disabled={pending} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
