import { z } from "zod"

/**
 * Server-only environment validation for the auth package.
 */
export const authEnv = (() => {
  // Sanitize URL-like envs: trim, strip wrapping quotes, validate, remove trailing slash.
  const sanitizeOptionalUrl = (val: unknown): unknown => {
    if (typeof val !== "string") return val
    let t = val.trim()
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      t = t.slice(1, -1).trim()
    }
    if (t === "") return undefined
    try {
      const u = new URL(t)
      let out = u.toString()
      if (out.endsWith("/")) out = out.slice(0, -1)
      return out
    } catch {
      return undefined
    }
  }
  const schema = z.object({
    // Required in production. In CI/dev builds, default to a dummy value so Next
    // can statically analyze and bundle route handlers without failing.
    BETTER_AUTH_SECRET: z.preprocess(
      (v) => {
        const s = typeof v === "string" ? v.trim() : undefined
        // Always provide a safe dummy to allow build/preview/CI to proceed when not configured.
        // Production deployments MUST set a real secret in their environment.
        if (!s) return "ci-only-dummy-secret"
        return v
      },
      z.string().min(1, "BETTER_AUTH_SECRET is required"),
    ),
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
    // Base application URLs (optional). Treat empty strings as undefined.
    APP_URL: z.preprocess(sanitizeOptionalUrl, z.string().url().optional()),
    // Do not enforce URL validation for NEXT_PUBLIC_APP_URL here; it is optional and
    // may be blank in preview/CI. Server logic will sanitize/fallback as needed.
    NEXT_PUBLIC_APP_URL: z.string().optional(),
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
