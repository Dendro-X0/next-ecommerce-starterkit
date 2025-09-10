"use client"

import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { AppLink } from "@/modules/shared/components/app-link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactElement } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator"
import { showToast } from "@/lib/utils/toast"
import { SocialLogin } from "./social-login"

const SignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    agreeToTerms: z.boolean().refine((v) => v === true, { message: "You must agree to the terms" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof SignupSchema>

/**
 * Submit button with loading state.
 */
function SubmitButton(props: { readonly loading: boolean }): ReactElement {
  return (
    <Button type="submit" className="w-full" loading={props.loading} disabled={props.loading}>
      Create account
    </Button>
  )
}

/**
 * Sign up form using Better Auth client.
 */
export function SignUpForm() {
  const router = useRouter()
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  useEffect(() => {
    // No side-effects on mount
  }, [])

  async function onSubmit(values: SignupFormValues): Promise<void> {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    })
    if (error) {
      form.setError("email", { type: "server", message: error.message })
      return
    }
    showToast("Account created successfully. Please verify your email.", { type: "success" })
    router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <PasswordStrengthIndicator password={field.value} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the{" "}
                      <AppLink href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </AppLink>{" "}
                      and{" "}
                      <AppLink href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </AppLink>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <SubmitButton loading={form.formState.isSubmitting} />
          </form>
        </Form>

        <SocialLogin />
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          Already have an account?{" "}
          <AppLink href="/auth/login" className="text-primary hover:underline">
            Sign in
          </AppLink>
        </p>
      </CardFooter>
    </Card>
  )
}
