import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

/**
 * Middleware: capture ?ref=CODE and set AFF_REF cookie for 30 days.
 * One export per file: default function.
 */
export function middleware(req: NextRequest): NextResponse {
  const url: URL = req.nextUrl.clone()
  const ref: string | null = url.searchParams.get("ref")
  const res: NextResponse = NextResponse.next()
  if (ref && ref.length >= 4) {
    res.cookies.set({
      name: "AFF_REF",
      value: ref,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    })
  }
  return res
}
