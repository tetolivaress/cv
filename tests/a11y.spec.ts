import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** axe-core WCAG 2.1 AA scan of every page state, in both themes, on phone and desktop. */

const states: { name: string; path: string; open?: (page: Page) => Promise<void> }[] = [
  { name: "home", path: "/" },
  { name: "project", path: "/projects/caribito" },
  { name: "certifications modal", path: "/?certs=all" },
  {
    name: "certificate lightbox",
    path: "/?certs=data",
    open: async (page) => {
      await page.getByRole("button", { name: /Enlarge certificate: SQL and MySQL/ }).click();
      await expect(page.getByRole("dialog", { name: "Certificate viewer" })).toBeVisible();
    },
  },
];

test.use({ reducedMotion: "reduce" });

for (const theme of ["light", "dark"] as const) {
  for (const viewport of [
    { width: 393, height: 852 },
    { width: 1440, height: 900 },
  ]) {
    for (const state of states) {
      test(`${state.name} · ${theme} · ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(state.path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await state.open?.(page);
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const summary = results.violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => `${n.target.join(" ")} — ${n.failureSummary?.split("\n")[1]?.trim()}`).join(" | ")}`,
        );
        expect(summary).toEqual([]);
      });
    }
  }
}

test("mobile menu · dark", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
