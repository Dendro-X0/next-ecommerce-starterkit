/**
 * Admin email allowlist (client-side fallback only)
 * Reads NEXT_PUBLIC_ADMIN_EMAILS and checks if a given email is allowlisted.
 * Keep server-side checks authoritative for access control.
 */

export function isAdminEmail(email: string | null | undefined): boolean {
  const raw: string | undefined = process.env.NEXT_PUBLIC_ADMIN_EMAILS
  if (!raw || !email) return false
  const target: string = String(email).trim().toLowerCase()
  const set: ReadonlySet<string> = new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0),
  )
  return set.has(target)
}
