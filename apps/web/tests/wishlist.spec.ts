import { expect, test } from "@playwright/test"

/**
 * Wishlist toggle E2E:
 * - Navigate to first product PDP from home
 * - Toggle heart button; expect aria-pressed state to flip optimistically
 * - Toggle back to restore original state
 */
test("wishlist toggle from PDP", async ({ page }): Promise<void> => {
  // Navigate deterministically to seeded product (from DB seed script)
  await page.goto("/products/classic-t-shirt")
  await expect(page).toHaveURL(/\/products\/classic-t-shirt$/)
  // Wait for initial placeholder toggle to ensure page rendered
  await expect(page.getByTestId("pdp-wishlist-toggle").first()).toBeVisible({ timeout: 15000 })

  // Observe the product detail API response for diagnostics
  const productResp = await page.waitForResponse(
    (resp) => {
      try {
        const url = new URL(resp.url())
        return url.pathname.endsWith("/api/v1/products/classic-t-shirt")
      } catch {
        return false
      }
    },
    { timeout: 60000 },
  )
  const status = productResp.status()
  if (status !== 200) {
    const bodyText = await productResp.text().catch(() => "<no-body>")
    throw new Error(`PDP API status ${status}. Body: ${bodyText}`)
  }
  // Wait for hydrated toggle (avoid skeleton placeholder with data-ready="false")
  const container = page.locator('[data-testid="pdp-wishlist-toggle"][data-ready="true"]').first()
  await expect(container).toBeVisible({ timeout: 60000 })
  const heartBtn = container
    .getByTestId("pdp-wishlist-toggle-button")
    .or(container.getByRole("button").first())
  await heartBtn.scrollIntoViewIfNeeded()
  await expect(heartBtn).toBeVisible({ timeout: 60000 })
  await expect(heartBtn).toBeEnabled({ timeout: 60000 })

  const before = await heartBtn.getAttribute("aria-pressed")
  await heartBtn.click()
  const expectedAfter = before === "true" ? "false" : "true"
  await expect(heartBtn).toHaveAttribute("aria-pressed", expectedAfter, { timeout: 5000 })
  // Restore to original state
  await heartBtn.click()
  await expect(heartBtn).toHaveAttribute("aria-pressed", String(before ?? "false"), {
    timeout: 5000,
  })
  // Toggle again and expect opposite of original
  await heartBtn.click()
  await expect
    .poll(async () => (await heartBtn.getAttribute("aria-pressed")) ?? "false")
    .toBe(expectedAfter)
})
