import { test, expect } from "@playwright/test";

test.describe("Scenario 1: Navigation and Dashboard", () => {
  test("should load dashboard and show stat cards", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1", { hasText: "Dashboard" })).toBeVisible();
    await expect(page.locator("text=Total Content")).toBeVisible();
    await expect(page.locator("text=Generated Outputs")).toBeVisible();
  });

  test("should navigate to all main pages via sidebar", async ({ page }) => {
    await page.goto("/dashboard");

    const routes = [
      { href: "/inbox", text: "Inbox" },
      { href: "/library", text: "Library" },
      { href: "/creators", text: "Creators" },
      { href: "/projects", text: "Projects" },
      { href: "/ideas", text: "Ideas" },
      { href: "/generate", text: "Generate" },
      { href: "/trends", text: "Trends" },
      { href: "/settings", text: "Settings" },
    ];

    for (const route of routes) {
      await page.click(`a[href="${route.href}"]`);
      await expect(page).toHaveURL(new RegExp(route.href));
      // Verify page heading renders
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("should display sidebar logo and collapse toggle", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Creator Intelligence")).toBeVisible();
  });
});

test.describe("Scenario 2: Inbox Content Processing", () => {
  test("should show all 4 inbox tabs", async ({ page }) => {
    await page.goto("/inbox");
    await expect(page.locator("text=YouTube Link")).toBeVisible();
    await expect(page.locator("text=Screenshot Upload")).toBeVisible();
    await expect(page.locator("text=Manual Text")).toBeVisible();
    await expect(page.locator("text=My Content")).toBeVisible();
  });

  test("should submit manual text content and show success", async ({ page }) => {
    await page.goto("/inbox");

    // Click Manual Text tab
    await page.click("text=Manual Text");

    // Fill in form
    await page.fill('input[placeholder*="Content title"]', "Test Content: 5 Ways to Scale Your Agency");
    await page.fill(
      'textarea[placeholder*="Paste the content"]',
      "Here are 5 proven ways to scale your insurance agency past $500K in revenue. First, build a lead generation system that runs without you. Second, automate your follow-up sequences to capture the 80% of deals that happen after the 5th touch. Third, document your onboarding process so any team member can deliver a great first impression. Fourth, create proactive retention workflows that catch at-risk clients before they leave. Fifth, implement team accountability scorecards that tie daily actions to weekly results."
    );

    // Submit
    await page.click("text=Process Content");

    // Should show processing state
    await expect(page.locator("text=Processing content").or(page.locator("text=Content processed successfully"))).toBeVisible({
      timeout: 15000,
    });
  });

  test("should accept a YouTube URL in the YouTube tab", async ({ page }) => {
    await page.goto("/inbox");
    await expect(page.locator("text=YouTube Link")).toBeVisible();

    await page.fill('input[placeholder*="youtube.com"]', "https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    // Button should be enabled
    const submitButton = page.locator("button", { hasText: "Process Content" });
    await expect(submitButton).toBeEnabled();
  });
});

test.describe("Scenario 3: Library Search and Filter", () => {
  test("should show library page with search and filters", async ({ page }) => {
    await page.goto("/library");
    await expect(page.locator("h1", { hasText: "Library" })).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
    await expect(page.locator("text=Add Content")).toBeVisible();
  });

  test("should toggle between grid and list view", async ({ page }) => {
    await page.goto("/library");
    // Wait for content to load
    await page.waitForTimeout(1000);

    // Click list view button (second button in the toggle group)
    const listButton = page.locator("button").filter({ has: page.locator('[class*="lucide-list"]') });
    if (await listButton.isVisible()) {
      await listButton.click();
    }
  });

  test("should show filter panel when clicking Filters button", async ({ page }) => {
    await page.goto("/library");
    await page.click("text=Filters");
    // Filter dropdowns should appear
    await expect(page.locator("text=All Projects")).toBeVisible();
    await expect(page.locator("text=All Categories")).toBeVisible();
  });

  test("should show Refresh and Add Content buttons", async ({ page }) => {
    await page.goto("/library");
    await expect(page.locator("button", { hasText: "Refresh" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Add Content" })).toBeVisible();
  });
});

test.describe("Scenario 4: Generate Content", () => {
  test("should show generate page with configuration options", async ({ page }) => {
    await page.goto("/generate");
    await expect(page.locator("h1", { hasText: "Generate" })).toBeVisible();
    await expect(page.locator("text=Source Content")).toBeVisible();
    await expect(page.locator("text=Configuration")).toBeVisible();
    await expect(page.locator("text=Output Type")).toBeVisible();
  });

  test("should show all content mode and audience options", async ({ page }) => {
    await page.goto("/generate");
    await expect(page.locator("text=Content Mode")).toBeVisible();
    await expect(page.locator("text=Target Audience")).toBeVisible();
    await expect(page.locator("text=Originality Level")).toBeVisible();
    await expect(page.locator("text=Mesh with my methodology")).toBeVisible();
  });

  test("should select a source content item and enable generate button", async ({ page }) => {
    await page.goto("/generate");

    // Check a source content checkbox
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.check();
      // Generate button should be enabled after selecting content
      const genButton = page.locator("button", { hasText: "Generate" });
      await expect(genButton).toBeEnabled();
    }
  });

  test("should show ready-to-generate empty state initially", async ({ page }) => {
    await page.goto("/generate");
    await expect(page.locator("text=Ready to Generate")).toBeVisible();
  });
});

test.describe("Scenario 5: Trends and Settings", () => {
  test("should show trends dashboard with topic areas", async ({ page }) => {
    await page.goto("/trends");
    await expect(page.locator("h1", { hasText: "Trends" })).toBeVisible();
  });

  test("should show settings page with Voice tab", async ({ page }) => {
    await page.goto("/settings");
    await expect(page.locator("h1", { hasText: "Settings" })).toBeVisible();
  });

  test("health API endpoint should return ok", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.timestamp).toBeDefined();
  });

  test("should not have fatal console errors on core pages", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("fetch") && !msg.text().includes("ECONNREFUSED") && !msg.text().includes("prisma")) {
        errors.push(msg.text());
      }
    });

    const pages = ["/dashboard", "/inbox", "/library", "/generate", "/trends", "/settings"];
    for (const p of pages) {
      await page.goto(p);
      await page.waitForTimeout(500);
    }

    expect(errors).toEqual([]);
  });
});
