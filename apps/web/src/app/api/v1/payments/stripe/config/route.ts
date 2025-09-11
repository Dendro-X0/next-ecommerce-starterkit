import { Hono } from "hono"
import { handle } from "hono/vercel"
import { paymentsStripeRoute } from "@repo/api"

export const runtime = "nodejs"

const app = new Hono().route("/api/v1/payments/stripe", paymentsStripeRoute)
export const GET = handle(app)
