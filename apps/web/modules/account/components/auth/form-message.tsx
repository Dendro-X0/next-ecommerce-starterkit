"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

type ActionState = {
  success?: boolean
  message?: string
  error?: {
    message?: string
    [key: string]: unknown
  }
} | null

interface FormMessageProps {
  state: ActionState
}

export function FormMessage({ state }: FormMessageProps) {
  const message = state?.message || state?.error?.message
  const isError = !!state?.error

  if (!message) {
    return null
  }

  return (
    <Alert variant={isError ? "destructive" : "default"}>
      {isError ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
      <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
