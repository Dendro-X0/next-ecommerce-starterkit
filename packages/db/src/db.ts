import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { dbEnv } from "./env"

/**
 * Drizzle ORM instance using Neon HTTP driver.
 * - Works on serverless/edge runtimes
 * - Single export per file, per project conventions
 */
export const db = (() => {
  const sql = neon(dbEnv.DATABASE_URL)
  return drizzle(sql)
})()
