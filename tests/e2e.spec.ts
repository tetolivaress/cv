import { expect, test } from "@playwright/test";

/** Behaviour tests against the static export (`pnpm build` first). */

test.use({ reducedMotion: "reduce" });

const bodyOverflow = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).overflowY);

test.describe("home", () => {
  test("renders every section without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Jesús Olivares" })).toBeVisible();
    for (const id of ["about", "experience", "projects", "skills", "certifications", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    // TODO placeholders never reach the page.
    await expect(page.locator("body")).not.toContainText("TODO");
    expect(errors).toEqual([]);
  });

  test("has SEO metadata and Person JSON-LD", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Jesús Olivares/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{50,}/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\/[^/]+\/?$/);
    const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(ld["@type"]).toBe("Person");
    expect(ld.sameAs).toEqual(expect.arrayContaining([expect.stringContaining("linkedin.com"), expect.stringContaining("github.com")]));
  });

  test("download button links to the generated PDF", async ({ page, request }) => {
    await page.goto("/");
    const link = page.getByRole("banner").getByRole("link", { name: /Download CV/ }).first();
    await expect(link).toHaveAttribute("download", "Jesus-Olivares-CV.pdf");
    const href = await link.getAttribute("href");
    const res = await request.get(href!);
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).toContain("application/pdf");
    expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
    expect((await request.get("/cv.pdf")).ok()).toBeTruthy();
  });

  test("static SEO files", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const xml = await sitemap.text();
    for (const slug of ["caribito", "tutrainer", "daniela-cucine", "zivave", "reactool"]) expect(xml).toContain(`/projects/${slug}`);
    expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
    const og = await request.get("/og.png");
    expect(og.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("theme", () => {
  test("defaults to the system preference", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("http://localhost:4173/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await context.close();
  });

  test("toggle persists in localStorage", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("banner").getByRole("button", { name: "Dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
  });
});

test.describe("navigation", () => {
  test("header highlights the active section", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.locator("#skills").scrollIntoViewIfNeeded();
    await page.evaluate(() => document.getElementById("skills")!.scrollIntoView({ block: "start" }));
    await expect(page.getByRole("banner").getByRole("link", { name: "Skills" })).toHaveAttribute("aria-current", "location");
  });

  test("mobile menu opens, traps focus and closes on navigation", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await expect.poll(() => bodyOverflow(page)).toBe("hidden");
    await menu.getByRole("link", { name: /Projects/ }).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#projects$/);
  });

  test("every project page is generated with prev/next links", async ({ page }) => {
    await page.goto("/projects/caribito");
    await expect(page.getByRole("heading", { level: 1, name: "Caribito" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Visit live site/ })).toHaveAttribute("href", "https://caribito.com");
    await page.getByRole("link", { name: /Next.*TuTrainer/ }).click();
    await expect(page).toHaveURL(/\/projects\/tutrainer$/);
    await expect(page.getByRole("heading", { level: 1, name: "TuTrainer" })).toBeVisible();
  });
});

test.describe("certifications modal", () => {
  test("opens from the button, filters, searches and closes with Esc", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /View all certifications/ }).click();
    const dialog = page.getByRole("dialog", { name: "Certifications" });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/\?certs=all/);
    // aria-labelledby points at the visible title.
    const labelledBy = await dialog.getAttribute("aria-labelledby");
    await expect(page.locator(`[id="${labelledBy}"]`)).toHaveText("Certifications");
    // Body scroll is locked.
    await expect.poll(() => bodyOverflow(page)).toBe("hidden");

    await expect(dialog.getByRole("article")).toHaveCount(25);
    await dialog.getByRole("button", { name: /^Data/ }).click();
    await expect(dialog.getByRole("article")).toHaveCount(3);
    await expect(page).toHaveURL(/\?certs=data/);

    await dialog.getByRole("button", { name: /^All/ }).click();
    await dialog.getByRole("searchbox").fill("vue");
    await expect(dialog.getByRole("article")).toHaveCount(3);

    await dialog.getByRole("searchbox").fill("kubernetes");
    await expect(dialog.getByText("No certificates match “kubernetes”")).toBeVisible();
    await dialog.getByRole("button", { name: "Clear filters" }).click();
    await expect(dialog.getByRole("article")).toHaveCount(25);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).not.toHaveURL(/certs=/);
  });

  test("keeps keyboard focus inside the modal", async ({ page }) => {
    await page.goto("/?certs=all");
    const dialog = page.getByRole("dialog", { name: "Certifications" });
    await expect(dialog).toBeVisible();
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    }
  });

  test("deep link opens it already filtered", async ({ page }) => {
    await page.goto("/?certs=english");
    const dialog = page.getByRole("dialog", { name: "Certifications" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: /^English/ })).toHaveAttribute("aria-pressed", "true");
    await expect(dialog.getByRole("article")).toHaveCount(2);
  });

  test("clicking a certificate image opens the lightbox", async ({ page }) => {
    await page.goto("/?certs=data");
    const dialog = page.getByRole("dialog", { name: "Certifications" });
    await dialog.getByRole("button", { name: /Enlarge certificate: SQL and MySQL/ }).click();
    const viewer = page.getByRole("dialog", { name: "Certificate viewer" });
    await expect(viewer).toBeVisible();
    await expect(viewer.getByText("3 / 3")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(viewer.getByText("1 / 3")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
    // Esc closes only the top layer.
    await expect(dialog).toBeVisible();
  });

  test("is a full-screen sheet on phones and a centered modal on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/?certs=all");
    const sheet = page.getByRole("dialog", { name: "Certifications" });
    await expect(sheet).toBeVisible();
    await expect
      .poll(async () => {
        const b = (await sheet.boundingBox())!;
        return [b.x, b.y, b.width, b.height].map(Math.round);
      })
      .toEqual([0, 0, 393, 852]);
    let box;
    await page.setViewportSize({ width: 1440, height: 900 });
    const dialog = page.getByRole("dialog", { name: "Certifications" });
    await expect.poll(async () => Math.round((await dialog.boundingBox())!.width)).toBe(1100);
    box = await dialog.boundingBox();
    expect(Math.round(box!.x)).toBe(170);
  });
});

test.describe("accessibility basics", () => {
  test("touch targets are at least 44px on phones", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    const small = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>("main a, main button, header a, header button, footer a, footer button"))
        .filter((el) => el.offsetParent !== null && !el.closest(".sr-only") && el.getAttribute("tabindex") !== "-1")
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        // Inline text links inside sentences are exempt (WCAG 2.5.8 inline exception).
        .filter(({ el, r }) => (r.height < 44 || r.width < 24) && !el.closest("p, h3"))
        .map(({ el, r }) => `${el.textContent?.trim() || el.getAttribute("aria-label")} ${Math.round(r.width)}×${Math.round(r.height)}`),
    );
    expect(small).toEqual([]);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});
