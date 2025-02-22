import { expect, test } from "@playwright/test";

test("placeholder test", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("main")).toBeVisible();
});
