import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { viewports } from "./viewports";

/**
 * Responsive audit: for every viewport, screenshots of the home page, a project
 * page, the certifications modal and (on phones) the menu, saved to /screenshots.
 * Fails if anything causes horizontal scrolling or sticks out of the viewport.
 */

const dir = "screenshots";
mkdirSync(dir, { recursive: true });

test.use({ reducedMotion: "reduce" });

/** Elements whose box ends past the right edge, ignoring intentional scrollers (carousels, chips). */
async function overflowReport(page: Page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders: string[] = [];
    const clipped = (el: Element) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden" || o === "clip") return p !== document.body && p.id !== "top";
      }
      return false;
    };
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const style = getComputedStyle(el);
      if (style.position === "fixed" && style.visibility === "hidden") continue;
      if ((r.right > vw + 1 || r.left < -1) && !clipped(el) && !el.closest("[aria-hidden='true']")) {
        const name = `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).split(" ").slice(0, 3).join(".")}`;
        offenders.push(`${name} [${Math.round(r.left)}→${Math.round(r.right)}]`);
      }
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: vw,
      offenders: offenders.slice(0, 10),
    };
  });
}

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Load lazy images so full-page shots are complete.
  await page.evaluate(async () => {
    for (const img of Array.from(document.images)) img.loading = "eager";
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? null
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
              setTimeout(resolve, 3000);
            }),
      ),
    );
  });
}

const languages = [
  { code: "en", home: "/", project: "/projects/caribito", certs: "/?certs=development", certsDialog: "Certifications", menuOpen: "Open menu", menu: "Menu", suffix: "" },
  { code: "es", home: "/es", project: "/es/proyectos/caribito", certs: "/es?certs=development", certsDialog: "Certificaciones", menuOpen: "Abrir menú", menu: "Menú", suffix: "-es" },
];

for (const vp of viewports) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height }, hasTouch: !!vp.mobile, isMobile: false });

    for (const lang of languages) {
      test(`home ${lang.code}`, async ({ page }) => {
        await page.goto(lang.home);
        await settle(page);
        const report = await overflowReport(page);
        await page.screenshot({ path: `${dir}/home${lang.suffix}-${vp.name}.png`, fullPage: true });
        expect(report.scrollWidth, `horizontal scroll: ${report.offenders.join(", ")}`).toBeLessThanOrEqual(report.clientWidth);
        expect(report.offenders, "elements outside the viewport").toEqual([]);
      });

      test(`project detail ${lang.code}`, async ({ page }) => {
        await page.goto(lang.project);
        await settle(page);
        const report = await overflowReport(page);
        await page.screenshot({ path: `${dir}/project${lang.suffix}-${vp.name}.png`, fullPage: true });
        expect(report.scrollWidth).toBeLessThanOrEqual(report.clientWidth);
        expect(report.offenders).toEqual([]);
      });

      test(`certifications modal ${lang.code}`, async ({ page }) => {
        await page.goto(lang.certs);
        const dialog = page.getByRole("dialog", { name: lang.certsDialog });
        await expect(dialog).toBeVisible();
        await settle(page);
        await page.screenshot({ path: `${dir}/certs${lang.suffix}-${vp.name}.png` });
        const box = await dialog.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 1);
        expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 1);
      });

      if (vp.width < 1024) {
        test(`mobile menu ${lang.code}`, async ({ page }) => {
          await page.goto(lang.home);
          await page.getByRole("button", { name: lang.menuOpen }).click();
          await expect(page.getByRole("dialog", { name: lang.menu })).toBeVisible();
          await page.screenshot({ path: `${dir}/menu${lang.suffix}-${vp.name}.png` });
        });
      }
    }
  });
}

test.describe("dark theme", () => {
  for (const vp of viewports.filter((v) => ["iphone-393x852", "laptop-1440x900"].includes(v.name))) {
    test(`home dark ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.addInitScript(() => localStorage.setItem("theme", "dark"));
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await settle(page);
      await page.screenshot({ path: `${dir}/home-dark-${vp.name}.png`, fullPage: true });
      await page.goto("/?certs=all");
      await settle(page);
      await page.screenshot({ path: `${dir}/certs-dark-${vp.name}.png` });
    });
  }
});
