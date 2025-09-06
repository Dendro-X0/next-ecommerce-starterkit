import { categoriesRepo } from "@repo/db"
/**
 * Categories routes for the Shop API.
 */
import { Hono } from "hono"
import type { Context } from "hono"

const categoriesRoute = new Hono()
  /**
   * GET /api/v1/categories
   */
  .get("/", async (c: Context) => {
    try {
      const items = await categoriesRepo.list()
      return c.json({ items }, 200)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to list categories"
      return c.json({ error: message }, 500)
    }
  })

export default categoriesRoute
