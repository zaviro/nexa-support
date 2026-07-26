import AxeBuilder from "@axe-core/playwright";
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

test("exposes stored Chinese in the first frame and remains hydration-safe", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  let releaseHydration: () => void = () => undefined;
  const hydrationGate = new Promise<void>((resolve) => {
    releaseHydration = resolve;
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route(/\/_next\/static\/chunks\/.*\.js/, async (route) => {
    await hydrationGate;
    await route.continue();
  });
  await page.addInitScript(() =>
    localStorage.setItem("nexa-language:v1", "zh-CN"),
  );

  await page.goto("/", { waitUntil: "commit" });
  await page.locator("body").waitFor({ state: "attached" });

  await expect(
    page.getByRole("navigation", { exact: true, name: "主导航" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      exact: true,
      level: 1,
      name: "立即解决客户问题",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", {
      exact: true,
      name: "Primary navigation",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      exact: true,
      level: 1,
      name: "Resolve customer questions instantly",
    }),
  ).toHaveCount(0);
  await expect(page.locator(".language-switcher")).toHaveCount(1);
  await expect(
    page.getByRole("button", { exact: true, name: "English" }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("button", { exact: true, name: "简体中文" }),
  ).toHaveCount(0);

  releaseHydration();
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { exact: true, name: "English" }).click();
  await expect(
    page.getByRole("heading", {
      exact: true,
      level: 1,
      name: "Resolve customer questions instantly",
    }),
  ).toBeVisible();
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
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

test("has no automated WCAG violations in either locale", async ({ page }) => {
  await page.goto("/");

  for (const languageButtonName of ["简体中文", "English"]) {
    const violations = (
      await new AxeBuilder({ page }).analyze()
    ).violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    }));
    expect(violations).toEqual([]);

    await page
      .getByRole("button", { exact: true, name: languageButtonName })
      .click();
  }
});

test("offers a visible keyboard skip link on every surface", async ({
  page,
}) => {
  for (const path of ["/", "/login"]) {
    await page.goto(path);
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", {
      exact: true,
      name: "Skip to main content",
    });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
    await skipLink.click();
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator("#main-content")).toBeFocused();
  }
});

test("uses manipulation touch behavior for every product control", async ({
  page,
}) => {
  for (const path of ["/", "/login"]) {
    await page.goto(path);
    const touchActions = await page
      .locator("a, button.language-switcher")
      .evaluateAll((controls) =>
        controls.map((control) => getComputedStyle(control).touchAction),
      );

    expect(touchActions.length).toBeGreaterThan(0);
    expect(new Set(touchActions)).toEqual(new Set(["manipulation"]));
  }
});

test("keeps visible Chinese controls at least 44px in both dimensions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.addInitScript(() =>
    localStorage.setItem("nexa-language:v1", "zh-CN"),
  );

  for (const path of ["/", "/login"]) {
    await page.goto(path);
    const undersizedControls = await page
      .locator("a:not(.skip-link), button.language-switcher")
      .evaluateAll((controls) =>
        controls.flatMap((control) => {
          const rect = control.getBoundingClientRect();
          const styles = getComputedStyle(control);
          const isVisible =
            styles.display !== "none" &&
            styles.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0;

          if (!isVisible || (rect.width >= 44 && rect.height >= 44)) {
            return [];
          }

          return [
            {
              height: Math.round(rect.height),
              text: control.textContent?.replace(/\s+/g, " ").trim() ?? "",
              width: Math.round(rect.width),
            },
          ];
        }),
      );

    expect(undersizedControls).toEqual([]);
  }
});

test("keeps the tablet chat preview clear of the support route", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");

  const overlapsRouteCard = await page.evaluate(() => {
    const chat = document.querySelector(".chat-shell");
    const routeCards = [...document.querySelectorAll(".route-card")];

    if (!(chat instanceof HTMLElement)) {
      throw new Error("Expected the chat preview");
    }

    const chatRect = chat.getBoundingClientRect();
    return routeCards.some((routeCard) => {
      const routeRect = routeCard.getBoundingClientRect();
      return !(
        chatRect.right <= routeRect.left ||
        chatRect.left >= routeRect.right ||
        chatRect.bottom <= routeRect.top ||
        chatRect.top >= routeRect.bottom
      );
    });
  });

  expect(overlapsRouteCard).toBe(false);
});

test("protects Nexa brand names from automatic translation", async ({
  page,
}) => {
  await page.goto("/");

  for (const selector of [
    ".site-header__brand",
    ".site-footer__brand > a",
    ".chat-shell h2",
    ".route-card--route .route-card__source",
  ]) {
    await expect(page.locator(selector)).toHaveAttribute("translate", "no");
  }

  await page.goto("/login");
  await expect(page.locator(".login-page__brand")).toHaveAttribute(
    "translate",
    "no",
  );
  await expect(
    page.locator('#login-title [translate="no"]:visible', {
      hasText: "Nexa Support",
    }),
  ).toHaveCount(1);
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
