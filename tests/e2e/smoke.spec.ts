import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("should load the dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Dashboard")).toBeVisible();
  });

  test("should navigate to all main pages", async ({ page }) => {
    const pages = [
      { path: "/dashboard", text: "Dashboard" },
      { path: "/inbox", text: "Inbox" },
      { path: "/library", text: "Library" },
      { path: "/creators", text: "Creators" },
      { path: "/projects", text: "Projects" },
      { path: "/ideas", text: "Ideas" },
      { path: "/generate", text: "Generate" },
      { path: "/trends", text: "Trends" },
      { path: "/settings", text: "Settings" },
    ];

    for (const p of pages) {
      await page.goto(p.path);
      await expect(page.locator(`text=${p.text}`).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test("should show stat cards on dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Total Content")).toBeVisible();
  });

  test("should show inbox tabs", async ({ page }) => {
    await page.goto("/inbox");
    await expect(page.locator("text=YouTube")).toBeVisible();
    await expect(page.locator("text=Manual Text").first()).toBeVisible();
  });

  test("should show generate page with output type selector", async ({ page }) => {
    await page.goto("/generate");
    await expect(page.locator("text=Output Type").first()).toBeVisible();
  });

  test("should show trends page", async ({ page }) => {
    await page.goto("/trends");
    await expect(page.locator("text=Trends")).toBeVisible();
  });

  test("should navigate via sidebar", async ({ page }) => {
    await page.goto("/dashboard");
    await page.click('a[href="/library"]');
    await expect(page).toHaveURL(/\/library/);
    await expect(page.locator("text=Library")).toBeVisible();
  });

  test("health API should return ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("ok");
  });

  test("should not have console errors on core pages", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/dashboard");
    await page.waitForTimeout(1000);
    await page.goto("/inbox");
    await page.waitForTimeout(1000);
    await page.goto("/library");
    await page.waitForTimeout(1000);

    // Filter out known non-critical errors (like failed API calls to DB)
    const criticalErrors = errors.filter(
      (e) => !e.includes("fetch") && !e.includes("prisma") && !e.includes("ECONNREFUSED")
    );
    expect(criticalErrors.length).toBe(0);
  });
});
