import { expect, type Page, test } from "@playwright/test";

function relativeLuminance(hex: string) {
  const normalizedHex =
    /^#[0-9a-f]{3}$/i.test(hex) && hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const channels = normalizedHex.match(/[0-9a-f]{2}/gi);

  if (channels === null || channels.length !== 3) {
    throw new Error(
      `Expected a three- or six-digit hex color, received ${hex}`,
    );
  }

  const [red = 0, green = 0, blue = 0] = channels.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);

  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

async function expectEveryLinkToNavigate(
  page: Page,
  name: string,
  target: string | RegExp,
) {
  const links = page.getByRole("link", { name, exact: true });
  const count = await links.count();

  expect(count).toBeGreaterThan(0);

  for (let index = 0; index < count; index += 1) {
    await links.nth(index).click();
    await expect(page).toHaveURL(target);
    await page.goto("/");
  }
}

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
  await expect(
    page.getByText("An AI support assistant for growing SaaS teams.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: "Primary navigation",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: "Footer navigation",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "主导航", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "页脚导航", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText("70%")).toBeVisible();
  await expect(page.getByText("automated", { exact: true })).toBeVisible();
  await expect(page.getByText("24/7", { exact: true })).toBeVisible();
  await expect(page.getByText("online", { exact: true })).toBeVisible();
  await expect(page.getByText("30 seconds", { exact: true })).toBeVisible();
  await expect(page.getByText("to deploy", { exact: true })).toBeVisible();

  await expectEveryLinkToNavigate(page, "Product", /#features$/);
  await expectEveryLinkToNavigate(page, "Pricing", /#pricing$/);
  await expectEveryLinkToNavigate(page, "Nexa Support", /\/#top$/);
  await expectEveryLinkToNavigate(page, "Log in", "/login");
  await expectEveryLinkToNavigate(page, "Start free", "/login");

  await page
    .getByRole("link", { name: "Product", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Support that follows the question",
      level: 2,
    }),
  ).toBeVisible();

  await page.goto("/");
  await page
    .getByRole("link", { name: "Start free", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("/login");
  await expect(
    page.getByRole("heading", {
      name: "Welcome to the Nexa Support demo",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: "Demo navigation",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "演示导航", exact: true }),
  ).toHaveCount(0);
});

test("persists Simplified Chinese across routes and reloads", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "简体中文" }).click();
  await expect(
    page.getByRole("heading", { name: "立即解决客户问题", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText("面向成长型 SaaS 团队的 AI 客服助手。", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "主导航", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "页脚导航", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: "Primary navigation",
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("navigation", {
      name: "Footer navigation",
      exact: true,
    }),
  ).toHaveCount(0);
  const outcomes = page.getByRole("region", { name: "客服成效" });
  await expect(outcomes.getByText("70%", { exact: true })).toBeVisible();
  await expect(outcomes.getByText("自动解决", { exact: true })).toBeVisible();
  await expect(outcomes.getByText("24/7", { exact: true })).toBeVisible();
  await expect(outcomes.getByText("支持在线", { exact: true })).toBeVisible();
  await expect(outcomes.getByText("30 秒", { exact: true })).toBeVisible();
  await expect(outcomes.getByText("完成部署", { exact: true })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("nexa-language:v1")))
    .toBe("zh-CN");

  await expectEveryLinkToNavigate(page, "登录", "/login");
  await expectEveryLinkToNavigate(page, "免费试用", "/login");

  await page.getByRole("link", { name: "登录", exact: true }).first().click();
  await expect(
    page.getByRole("heading", {
      name: "欢迎体验 Nexa Support 演示",
      level: 1,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "演示导航", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      name: "Demo navigation",
      exact: true,
    }),
  ).toHaveCount(0);
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

test("keeps the signal color at normal-text AA contrast", async ({ page }) => {
  await page.goto("/");
  const colors = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);

    return {
      paper: styles.getPropertyValue("--paper").trim(),
      signal: styles.getPropertyValue("--signal").trim(),
      surface: styles.getPropertyValue("--surface").trim(),
    };
  });

  expect(contrastRatio(colors.signal, colors.paper)).toBeGreaterThanOrEqual(
    4.5,
  );
  expect(contrastRatio(colors.signal, colors.surface)).toBeGreaterThanOrEqual(
    4.5,
  );
});

for (const width of [375, 768, 1440]) {
  test(`keeps the marketing shell inside the viewport at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
