import { expect, test } from "@playwright/test";

/** Spanish version, language switch and remembered language. */

test.use({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });

const sectionTop = (page: import("@playwright/test").Page, id: string) =>
  page.evaluate((target) => Math.round(document.getElementById(target)!.getBoundingClientRect().top), id);

test("the Spanish home page is fully translated", async ({ page }) => {
  await page.goto("/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 2, name: "Diez años, cinco etapas." })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "Experiencia" })).toHaveAttribute("href", "/es/experiencia");
  const download = page.getByRole("link", { name: "Descargar CV (PDF)" }).first();
  await expect(download).toHaveAttribute("href", "/Jesus-Olivares-CV-ES.pdf");
  const body = page.locator("body");
  await expect(body).not.toContainText("TODO");
  for (const english of ["Download CV", "Years of experience", "Live products you can try", "View all certifications", "Back to top"]) {
    await expect(body).not.toContainText(english);
  }
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/$|:\d+$|\.[a-z]+$/);
});

test("the language switch keeps you on the same page and is remembered", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").getByRole("link", { name: "Skills" }).click();
  await expect(page).toHaveURL(/\/skills$/);

  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: /ES/ }).click();
  await expect(page).toHaveURL(/\/es\/habilidades$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect.poll(() => sectionTop(page, "skills")).toBeLessThan(80);
  expect(await page.evaluate(() => localStorage.getItem("lang"))).toBe("es");

  // Opening an English URL now lands on its Spanish version.
  await page.goto("/projects/zivave");
  await expect(page).toHaveURL(/\/es\/proyectos\/zivave$/);

  // Switching back to English is remembered too.
  await page.getByRole("navigation", { name: "Idioma" }).getByRole("link", { name: /EN/ }).click();
  await expect(page).toHaveURL(/\/projects\/zivave$/);
  await page.goto("/es");
  await expect(page).toHaveURL(/\/$/);
});

test("Spanish section URLs open at their section", async ({ page }) => {
  for (const [path, id] of [
    ["/es/sobre-mi", "about"],
    ["/es/experiencia", "experience"],
    ["/es/proyectos", "projects"],
    ["/es/certificaciones", "certifications"],
  ] as const) {
    await page.goto(path);
    await expect.poll(() => sectionTop(page, id)).toBeLessThan(80);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/es$/);
  }
});

test("Spanish project pages link to Spanish sections", async ({ page }) => {
  await page.goto("/es/proyectos/caribito");
  await expect(page.getByRole("heading", { level: 1, name: "Caribito" })).toBeVisible();
  await expect(page.getByText("Marketplace de turismo venezolano")).toBeVisible();
  await page.getByRole("link", { name: "Todos los proyectos" }).click();
  await expect(page).toHaveURL(/\/es\/proyectos$/);
  await expect.poll(() => sectionTop(page, "projects")).toBeLessThan(80);
});

test("the certifications modal is translated and deep-linkable", async ({ page }) => {
  await page.goto("/es?certs=data");
  const dialog = page.getByRole("dialog", { name: "Certificaciones" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /^Datos/ })).toHaveAttribute("aria-pressed", "true");
  await expect(dialog.getByRole("article")).toHaveCount(3);
  await dialog.getByRole("searchbox").fill("bases");
  await expect(dialog.getByRole("article")).toHaveCount(1);
  await expect(dialog.getByRole("heading", { name: "Fundamentos de bases de datos" })).toBeVisible();
});

test("the Spanish PDF is generated", async ({ request }) => {
  const res = await request.get("/Jesus-Olivares-CV-ES.pdf");
  expect(res.ok()).toBeTruthy();
  expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("the mobile menu has a language row", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/es");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const menu = page.getByRole("dialog", { name: "Menú" });
  await expect(menu.getByRole("navigation", { name: "Idioma" })).toBeVisible();
  await menu.getByRole("link", { name: /Habilidades/ }).click();
  await expect(page).toHaveURL(/\/es\/habilidades$/);
});

test("unknown URLs get the bilingual 404 page", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page.getByText("La página que buscas no existe")).toBeVisible();
});

test("sitemap lists both languages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("/es/proyectos/caribito");
  expect(xml).toContain('hreflang="es"');
});
