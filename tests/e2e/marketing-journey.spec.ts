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

test("shows truthful localized decision information and an observable FAQ accordion", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("Demo testimonial", { exact: true })).toHaveCount(
    2,
  );
  await expect(page.getByText("¥99", { exact: true })).toBeVisible();
  await expect(page.getByText("¥299", { exact: true })).toBeVisible();
  await expect(page.getByText("/ month", { exact: true })).toHaveCount(2);
  const pricing = page.locator("#pricing");
  const pricingLinks = pricing.getByRole("link", {
    name: "Start free",
    exact: true,
  });
  await expect(pricingLinks).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(pricingLinks.nth(index)).toHaveAttribute("href", "/login");
  }

  const aiAnswer = page.getByRole("button", {
    name: "How does Nexa answer questions?",
    exact: true,
  });
  await expect(aiAnswer).toHaveAttribute("aria-expanded", "false");
  await aiAnswer.focus();
  await page.keyboard.press("Enter");
  await expect(aiAnswer).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#faq-answer-ai-answers")).toBeVisible();
  await expect(aiAnswer).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(aiAnswer).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#faq-answer-ai-answers")).toHaveCount(0);

  await page.getByRole("button", { name: "简体中文", exact: true }).click();
  await expect(page.getByText("演示评价", { exact: true })).toHaveCount(2);
  await expect(
    page.getByRole("heading", { name: "常见问题", level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Nexa 如何回答问题？" }),
  ).toBeVisible();

  const chinesePricingLinks = page.locator("#pricing").getByRole("link", {
    name: "免费试用",
    exact: true,
  });
  await expect(chinesePricingLinks).toHaveCount(2);
  for (let index = 0; index < 2; index += 1) {
    await expect(chinesePricingLinks.nth(index)).toHaveAttribute(
      "href",
      "/login",
    );
  }
});

test("changes the visible dashboard conversation", async ({ page }) => {
  await page.goto("/");
  const dashboard = page.getByRole("region", {
    name: "Nexa Support dashboard",
  });
  const sofiaConversation = dashboard.getByRole("button", {
    name: "Open Sofia Ramirez conversation",
  });
  const mayaConversation = dashboard.getByRole("button", {
    name: "Open Maya Chen conversation",
  });
  const liamConversation = dashboard.getByRole("button", {
    name: "Open Liam Foster conversation",
  });
  const detail = dashboard.locator('[aria-live="polite"]');

  await expect(detail).toHaveAttribute("aria-live", "polite");
  await expect(mayaConversation).toHaveAttribute("aria-pressed", "true");
  await expect(sofiaConversation).toHaveAttribute("aria-pressed", "false");
  await expect(
    detail.getByRole("heading", { name: "Billing", level: 3 }),
  ).toBeVisible();
  await expect(detail.getByText("2 min", { exact: true })).toBeVisible();
  await expect(
    dashboard.getByText("Can I update the card for our next renewal?", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    detail.getByText("Asked how to update the payment method before renewal.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(detail.getByText("AI resolving", { exact: true })).toBeVisible();

  await sofiaConversation.click();
  await expect(sofiaConversation).toHaveAttribute("aria-pressed", "true");
  await expect(
    detail.getByRole("heading", { name: "Refund request", level: 3 }),
  ).toBeVisible();
  await expect(
    detail.getByText("Waiting for human support", { exact: true }),
  ).toBeVisible();

  await liamConversation.click();
  await expect(liamConversation).toHaveAttribute("aria-pressed", "true");
  await dashboard
    .getByRole("button", { name: "Human handoff", exact: true })
    .click();
  await expect(liamConversation).toHaveCount(0);
  await expect(
    dashboard.locator(".support-dashboard__conversation"),
  ).toHaveCount(1);
  await expect(sofiaConversation).toHaveAttribute("aria-pressed", "true");

  await dashboard
    .getByRole("button", { name: "All conversations", exact: true })
    .click();
  await expect(mayaConversation).toHaveAttribute("aria-pressed", "true");
  await expect(
    detail.getByRole("heading", { name: "Billing", level: 3 }),
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
  await expect(
    page.getByText("面向成长型 SaaS 团队的 AI 客服助手。", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "主导航", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "页脚导航", exact: true }),
  ).toBeVisible();
  const dashboard = page.getByRole("region", {
    name: "Nexa Support 客服看板",
    exact: true,
  });
  await expect(dashboard).toBeVisible();
  await expect(
    dashboard.getByRole("button", {
      name: "打开 Sofia Ramirez 的会话",
      exact: true,
    }),
  ).toBeVisible();
  const chineseDetail = dashboard.locator('[aria-live="polite"]');
  await expect(
    chineseDetail.getByRole("heading", { name: "账单", level: 3 }),
  ).toBeVisible();
  await expect(
    chineseDetail.getByText("2 分钟", { exact: true }),
  ).toBeVisible();
  await expect(
    dashboard.getByText("我可以更新下一次续费使用的信用卡吗？", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    chineseDetail.getByText("咨询如何在续费前更新付款方式。", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    chineseDetail.getByText("AI 正在处理", { exact: true }),
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
  await expect(
    page.getByRole("button", { name: "打开客服聊天", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open support chat", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "打开客服聊天", exact: true }).click();
  const chat = page.getByRole("dialog", { name: "Nexa Support" });
  await chat
    .getByRole("textbox", { name: "您的问题" })
    .fill("导出端点在哪里？");
  await chat.getByRole("button", { name: "发送", exact: true }).click();
  await expect(
    chat.getByText("本演示可以帮助您了解价格、退款、产品功能或人工接管。", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    chat.getByText(
      "I can help with pricing, refunds, product features, or a human handoff in this demo.",
      { exact: true },
    ),
  ).toHaveCount(0);

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
    page.getByRole("heading", {
      exact: true,
      level: 2,
      name: "常见问题",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      exact: true,
      name: "Nexa 如何回答问题？",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      exact: true,
      name: "How does Nexa answer questions?",
    }),
  ).toHaveCount(0);
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

test("falls back to English without runtime errors for an invalid saved locale", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
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
  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
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

  for (const locale of [
    {
      launcherClose: "Close support chat",
      launcherOpen: "Open support chat",
      languageButton: "简体中文",
    },
    {
      launcherClose: "关闭客服聊天",
      launcherOpen: "打开客服聊天",
      languageButton: "English",
    },
  ]) {
    await page
      .getByRole("button", { exact: true, name: locale.launcherOpen })
      .click();
    await expect(
      page.getByRole("dialog", { exact: true, name: "Nexa Support" }),
    ).toBeVisible();
    const violations = (
      await new AxeBuilder({ page }).analyze()
    ).violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    }));
    expect(violations).toEqual([]);

    await page
      .getByRole("button", { exact: true, name: locale.launcherClose })
      .click();
    await page
      .getByRole("button", { exact: true, name: locale.languageButton })
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
    const focusedSize = await skipLink.boundingBox();
    expect(focusedSize).not.toBeNull();
    expect(focusedSize?.width).toBeGreaterThanOrEqual(44);
    expect(focusedSize?.height).toBeGreaterThanOrEqual(44);
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

  await page.goto("/");
  await expect(page.locator(".faq-item button")).toHaveCount(5);

  const undersizedFaqControls = await page
    .locator(".faq-item button")
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

  expect(undersizedFaqControls).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("keeps dashboard controls at least 44px in both locales", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");

  for (const languageButtonName of ["简体中文", "English"]) {
    const undersizedControls = await page
      .locator(".support-dashboard button")
      .evaluateAll((controls) =>
        controls.flatMap((control) => {
          const rect = control.getBoundingClientRect();

          if (rect.width >= 44 && rect.height >= 44) {
            return [];
          }

          return [
            {
              height: Math.round(rect.height),
              name: control.getAttribute("aria-label") ?? control.textContent,
              width: Math.round(rect.width),
            },
          ];
        }),
      );

    expect(undersizedControls).toEqual([]);
    await page
      .getByRole("button", { exact: true, name: languageButtonName })
      .click();
  }
});

test("gives dashboard controls hover feedback without weakening selected, focus, or reduced-motion states", async ({
  page,
}) => {
  await page.goto("/");
  const dashboard = page.getByRole("region", {
    name: "Nexa Support dashboard",
    exact: true,
  });
  const aiFilter = dashboard.getByRole("button", {
    name: "AI resolving",
    exact: true,
  });
  const mayaConversation = dashboard.getByRole("button", {
    name: "Open Maya Chen conversation",
    exact: true,
  });
  const liamConversation = dashboard.getByRole("button", {
    name: "Open Liam Foster conversation",
    exact: true,
  });
  const initialFilterBackground = await aiFilter.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const initialConversationBackground = await liamConversation.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );

  await aiFilter.hover();
  await expect
    .poll(() =>
      aiFilter.evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .not.toBe(initialFilterBackground);

  await liamConversation.hover();
  await expect
    .poll(() =>
      liamConversation.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .not.toBe(initialConversationBackground);

  const selectedBackground = await mayaConversation.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  const selectedBoxShadow = await mayaConversation.evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  await mayaConversation.hover();
  await expect
    .poll(() =>
      mayaConversation.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .toBe(selectedBackground);

  await mayaConversation.focus();
  await expect
    .poll(() =>
      mayaConversation.evaluate((element) => ({
        background: getComputedStyle(element).backgroundColor,
        boxShadow: getComputedStyle(element).boxShadow,
        outlineStyle: getComputedStyle(element).outlineStyle,
        outlineWidth: getComputedStyle(element).outlineWidth,
      })),
    )
    .toEqual({
      background: selectedBackground,
      boxShadow: expect.stringContaining(selectedBoxShadow),
      outlineStyle: "solid",
      outlineWidth: "3px",
    });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      aiFilter.evaluate((element) =>
        getComputedStyle(element)
          .transitionDuration.split(",")
          .every((duration) => {
            const value = Number.parseFloat(duration);
            return duration.trim().endsWith("ms")
              ? value <= 0.01
              : value * 1000 <= 0.01;
          }),
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      liamConversation.evaluate((element) =>
        getComputedStyle(element)
          .transitionDuration.split(",")
          .every((duration) => {
            const value = Number.parseFloat(duration);
            return duration.trim().endsWith("ms")
              ? value <= 0.01
              : value * 1000 <= 0.01;
          }),
      ),
    )
    .toBe(true);
});

test("completes local recognized and fallback chat journeys without persistence", async ({
  page,
}) => {
  await page.goto("/");
  const storageBefore = await page.evaluate(() => ({ ...localStorage }));
  await page.getByRole("button", { name: "Open support chat" }).click();
  const chat = page.getByRole("dialog", { name: "Nexa Support" });

  await chat.getByRole("button", { name: "Pricing" }).click();
  await expect(chat.getByRole("status")).toHaveText(/typing/i);
  await expect(
    chat.getByText(
      "Starter is ¥99/month and Pro is ¥299/month in this local demo.",
    ),
  ).toBeVisible();

  await chat
    .getByRole("textbox", { name: "Your question" })
    .fill("Where is the export endpoint?");
  await chat.getByRole("button", { name: "Send" }).click();
  await expect(
    chat.getByText(
      "I can help with pricing, refunds, product features, or a human handoff in this demo.",
    ),
  ).toBeVisible();
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(
    storageBefore,
  );

  await page.reload();
  await page.getByRole("button", { name: "Open support chat" }).click();
  await expect(chat.getByText("Where is the export endpoint?")).toHaveCount(0);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(
    storageBefore,
  );
});

test("keeps the mobile chat inside the viewport through pending handoff", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/");

  const launcher = page.locator(".chat-shell__launcher");
  await page.getByRole("button", { name: "Open support chat" }).click();
  const chat = page.getByRole("dialog", { name: "Nexa Support" });
  const [launcherBounds, chatBounds] = await Promise.all([
    launcher.boundingBox(),
    chat.boundingBox(),
  ]);

  expect(launcherBounds).not.toBeNull();
  expect(chatBounds).not.toBeNull();
  for (const bounds of [launcherBounds, chatBounds]) {
    if (bounds === null) {
      throw new Error(
        "Chat controls must be visible to verify viewport bounds.",
      );
    }

    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(900);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  await chat.getByRole("button", { name: "Contact a human" }).click();
  await expect(chat.getByRole("status")).toHaveText(
    "Demo human handoff pending. No contact details are collected.",
  );
});

test("protects Nexa brand names from automatic translation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open support chat" }).click();

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
  for (const locale of [
    { regionName: "Nexa Support dashboard", storageValue: "en" },
    { regionName: "Nexa Support 客服看板", storageValue: "zh-CN" },
  ] as const) {
    test(`keeps the ${locale.storageValue} marketing shell inside the viewport at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        ({ storageKey, storageValue }) => {
          localStorage.setItem(storageKey, storageValue);
        },
        {
          storageKey: "nexa-language:v1",
          storageValue: locale.storageValue,
        },
      );
      await page.goto("/");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      const dashboard = page.getByRole("region", {
        name: locale.regionName,
        exact: true,
      });
      const bounds = await dashboard.boundingBox();

      expect(bounds).not.toBeNull();

      if (bounds === null) {
        throw new Error(
          "Dashboard must be visible to verify its viewport bounds.",
        );
      }

      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(
        await dashboard.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
    });
  }
}
