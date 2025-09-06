import { z } from "zod"

/**
 * Server-only environment validation for the auth package.
 */
export const authEnv = (() => {
  const schema = z.object({
    BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
    ENABLE_CROSS_SITE_COOKIES: z
      .string()
      .optional()
      .transform((v) => (v ? v.toLowerCase() === "true" : false)),
    ENABLE_CROSS_SUBDOMAIN_COOKIES: z
      .string()
      .optional()
      .transform((v) => (v ? v.toLowerCase() === "true" : false)),

    // Email configuration (optional; used for verification/reset/magic links)
    MAIL_PROVIDER: z.enum(["SMTP", "RESEND"]).optional(),
    EMAIL_FROM: z.string().optional(),

    // SMTP settings (for local testing with MailHog/Mailpit)
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z
      .string()
      .optional()
      .transform((v) => (v ? Number.parseInt(v, 10) : undefined)),
    SMTP_SECURE: z
      .string()
      .optional()
      .transform((v) => (v ? v.toLowerCase() === "true" : false)),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),

    // Resend (production) – currently optional/unutilized
    RESEND_API_KEY: z.string().optional(),
    // Base application URLs (optional)
    APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    // OAuth providers (optional)
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
  })
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    const message = parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
    throw new Error(`Invalid auth environment variables: ${message}`)
  }
  return parsed.data
})()
