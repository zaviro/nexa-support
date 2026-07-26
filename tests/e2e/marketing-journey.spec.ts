import { expect, test } from "@playwright/test";

test("navigates the English marketing journey and login placeholder", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Resolve customer questions instantly",
      level: 1,
    }),
  ).toBeVisible();
  await expect(page.getByText("70%")).toBeVisible();

  await page.getByRole("link", { name: "Product" }).click();
  await expect(page).toHaveURL(/#features$/);
  await expect(
    page.getByRole("heading", {
      name: "Support that follows the question",
      level: 2,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Start free" }).first().click();
  await expect(page).toHaveURL("/login");
  await expect(
    page.getByRole("heading", {
      name: "Welcome to the Nexa Support demo",
      level: 1,
    }),
  ).toBeVisible();
});

test("persists Simplified Chinese across routes and reloads", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "简体中文" }).click();
  await expect(
    page.getByRole("heading", { name: "立即解决客户问题", level: 1 }),
  ).toBeVisible();
  await expect(page.getByText("支持在线")).toBeVisible();
  await page.getByRole("link", { name: "登录" }).click();
  await expect(
    page.getByRole("heading", {
      name: "欢迎体验 Nexa Support 演示",
      level: 1,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "欢迎体验 Nexa Support 演示",
      level: 1,
    }),
  ).toBeVisible();
});

test("falls back to English without hydration errors for an invalid saved locale", async ({
  page,
}) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page.addInitScript(() =>
    localStorage.setItem("nexa-language:v1", "fr"),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Resolve customer questions instantly",
      level: 1,
    }),
  ).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("keeps the marketing shell inside the viewport", async ({ page }) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
