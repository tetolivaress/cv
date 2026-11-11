import { expect, test } from "@playwright/test";

/** The 2D | 3D switch and the scroll-rotated 3D view (`pnpm build` first). */

test.use({
  reducedMotion: "reduce",
  // WebGL through the software rasterizer, so the canvas mounts in headless runs without a GPU.
  launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
});

const sections = ["evolution", "about", "experience", "projects", "skills", "certifications", "english", "contact"];
const viewGroup = (page: import("@playwright/test").Page) => page.getByRole("banner").getByRole("group", { name: "View" });

test("the plain site is the default and the switch turns the 3D view on, remembered across reloads", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(viewGroup(page).getByRole("button", { name: "Plain site" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#experience-title")).toBeVisible();

  await viewGroup(page).getByRole("button", { name: "3D site" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-view", "3d");
  await expect(page.locator("main canvas")).toBeVisible();
  // Every section keeps its id (one step of the scroll track each); the plain sections are gone.
  for (const id of sections) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator("#experience-title")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("view"))).toBe("3d");

  await page.reload();
  await expect(page.locator("main canvas")).toBeVisible();
  await expect(viewGroup(page).getByRole("button", { name: "3D site" })).toHaveAttribute("aria-pressed", "true");

  await viewGroup(page).getByRole("button", { name: "Plain site" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#experience-title")).toBeVisible();
  expect(errors).toEqual([]);
});

test("in 3D, header links turn the ring to the section and the section opens in a dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem("view", "3d"));
  await page.goto("/");
  await expect(page.locator("main canvas")).toBeVisible();
  const stage = page.getByRole("region", { name: "CV sections in 3D" });

  await page.getByRole("banner").getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(stage.getByRole("heading", { level: 2, name: "Live products you can try." })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("aria-current", "location");
  await expect(stage.getByRole("button", { name: "Go to Projects" })).toHaveAttribute("aria-current", "location");

  await stage.getByRole("button", { name: "Open Projects" }).click();
  const dialog = page.getByRole("dialog", { name: "Projects" });
  await expect(dialog.getByRole("heading", { level: 2, name: "Live products you can try." })).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Visit site/ }).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  // The dots move one section at a time; the caption follows.
  await stage.getByRole("button", { name: "Go to Skills" }).click();
  await expect(stage.getByRole("heading", { level: 2, name: "Tools I reach for." })).toBeVisible();
  await expect(page).toHaveURL(/\/skills$/);
});

test("in 3D the whole page is in the ring: hero, stack evolution and contact too, turned by vertical and sideways input", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem("view", "3d"));
  await page.goto("/");
  const stage = page.getByRole("region", { name: "CV sections in 3D" });
  await expect(page.locator("main canvas")).toBeVisible();
  // Nothing of the plain page is left on screen: its hero and its contact footer are hidden.
  await expect(page.locator("#hero-name")).toBeHidden();
  await expect(page.locator("[data-site-footer]")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(stage.getByRole("button", { name: /^Go to / })).toHaveCount(9);
  await expect(stage.getByRole("heading", { level: 2, name: "Jesús Olivares" })).toBeVisible();

  // Sideways wheel (trackpad swipe, shift + wheel) turns the ring like vertical scrolling does.
  await page.mouse.move(900, 500);
  await page.mouse.wheel(720, 0);
  await expect(stage.getByRole("button", { name: "Go to Stack evolution" })).toHaveAttribute("aria-current", "location");
  await page.mouse.wheel(0, 720);
  await expect(stage.getByRole("button", { name: "Go to About" })).toHaveAttribute("aria-current", "location");
  // Arrow keys step one card at a time.
  await page.keyboard.press("ArrowRight");
  await expect(stage.getByRole("button", { name: "Go to Experience" })).toHaveAttribute("aria-current", "location");
  await page.keyboard.press("ArrowLeft");
  await expect(stage.getByRole("button", { name: "Go to About" })).toHaveAttribute("aria-current", "location");

  // Contact is the last card and opens like any other section.
  await page.getByRole("banner").getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await stage.getByRole("button", { name: "Open Contact" }).click();
  await expect(page.getByRole("dialog", { name: "Contact" }).getByRole("link", { name: /@/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await stage.getByRole("button", { name: "Go to Intro" }).click();
  await stage.getByRole("button", { name: "Open Intro" }).click();
  await expect(page.getByRole("dialog", { name: "Intro" }).getByRole("heading", { level: 2, name: "Jesús Olivares" })).toBeVisible();
});

test("a clean section URL opens the 3D view at that section, and switching views keeps the section", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => localStorage.setItem("view", "3d"));
  await page.goto("/es/habilidades");
  const stage = page.getByRole("region", { name: "Secciones del CV en 3D" });
  await expect(stage.getByRole("button", { name: "Abrir Habilidades" })).toBeVisible();

  // A real pointer click: locator.click() first scrolls the page (its scroll-into-view step moves the pinned stage),
  // which would change the section being read before the switch is pressed.
  const plain = await page.getByRole("banner").getByRole("group", { name: "Vista" }).getByRole("button", { name: "Sitio plano" }).boundingBox();
  await page.mouse.click(plain!.x + plain!.width / 2, plain!.y + plain!.height / 2);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("#skills-title")).toBeInViewport();
});

test("phones get the switch in the menu", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.getByRole("group", { name: "View" }).getByRole("button", { name: "3D site" }).click();
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(page.locator("main canvas")).toBeVisible();
  await expect(page.getByRole("region", { name: "CV sections in 3D" }).getByRole("button", { name: /^Open / })).toBeVisible();
});

test("project pages have no view switch", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/caribito");
  await expect(page.getByRole("banner").getByRole("group", { name: "View" })).toHaveCount(0);
});
