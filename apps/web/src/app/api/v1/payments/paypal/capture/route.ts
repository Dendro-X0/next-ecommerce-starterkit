import { Hono } from "hono"
import { handle } from "hono/vercel"
import { paymentsPaypalRoute } from "@repo/api"

export const runtime = "nodejs"

const app = new Hono().route("/api/v1/payments/paypal", paymentsPaypalRoute)
export const POST = handle(app)
