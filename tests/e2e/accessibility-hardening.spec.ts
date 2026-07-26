import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";

const viewports = [375, 768, 1440] as const;
const locales = [
  {
    storageValue: "en",
    faq: "How does Nexa answer questions?",
    launcher: "Open support chat",
    settings: "Open chat settings",
    email: "Email address",
    password: "Password",
    submit: "Continue to demo",
  },
  {
    storageValue: "zh-CN",
    faq: "Nexa 如何回答问题？",
    launcher: "打开客服聊天",
    settings: "打开聊天设置",
    email: "邮箱地址",
    password: "密码",
    submit: "继续体验演示",
  },
] as const;

async function setLocale(page: Page, locale: "en" | "zh-CN") {
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: "nexa-language:v1", value: locale },
  );
}

async function expectVisibleFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  const style = await locator.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      outlineStyle: computed.outlineStyle,
      outlineWidth: Number.parseFloat(computed.outlineWidth),
    };
  });
  expect(style.outlineStyle).not.toBe("none");
  expect(style.outlineWidth).toBeGreaterThanOrEqual(2);
}

async function expectAxeClean(page: Page) {
  const violations = (await new AxeBuilder({ page }).analyze()).violations.map(
    ({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map((node) => node.target),
    }),
  );
  expect(violations).toEqual([]);
}

async function expectInsideViewport(page: Page, locator: Locator) {
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds === null) {
    throw new Error("Expected a visible surface for viewport evidence.");
  }
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(
    await page.evaluate(() => window.innerWidth),
  );
}

test("exposes atomic status and dialog description semantics", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".support-dashboard__detail")).toHaveAttribute(
    "aria-atomic",
    "true",
  );
  await page.getByRole("button", { name: "Open support chat" }).click();
  const chat = page.getByRole("dialog", { name: "Nexa Support" });
  await expect(chat).toHaveAttribute(
    "aria-describedby",
    "chat-shell-description",
  );
  await expect(chat.locator("#chat-shell-description")).toHaveText(
    "Hi — choose a topic or type a question. This demo replies locally.",
  );
});

test("moves invalid login focus to the first field needing attention", async ({
  page,
}) => {
  await page.goto("/login");
  const email = page.getByRole("textbox", {
    name: "Email address",
    exact: true,
  });
  const password = page.getByLabel("Password", { exact: true });
  const submit = page.getByRole("button", {
    name: "Continue to demo",
    exact: true,
  });

  await submit.click();
  await expectVisibleFocus(email);
  await email.fill("person@example.com");
  await submit.click();
  await expectVisibleFocus(password);
  await expect(email).toHaveAttribute("aria-invalid", "false");
  await expect(password).toHaveAttribute(
    "aria-describedby",
    "login-password-error",
  );
});

test("does not mask horizontal overflow at the page boundary", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "clip");
});

test("keeps the complete keyboard path logical and visibly focused", async ({
  page,
}) => {
  const tabTo = async (locator: Locator) => {
    for (let index = 0; index < 80; index += 1) {
      await page.keyboard.press("Tab");
      if (
        await locator.evaluate((element) => element === document.activeElement)
      ) {
        return;
      }
    }
    throw new Error("Expected keyboard traversal to reach the target control.");
  };

  await page.goto("/login");
  const loginOrder = [
    page.getByRole("link", { name: "Skip to main content", exact: true }),
    page.getByRole("link", { name: "Nexa Support", exact: true }),
    page.getByRole("button", { name: "简体中文", exact: true }),
    page.getByRole("textbox", { name: "Email address", exact: true }),
    page.getByLabel("Password", { exact: true }),
    page.getByRole("checkbox", { name: "Remember me", exact: true }),
    page.getByRole("button", { name: "Continue to demo", exact: true }),
    page.getByRole("link", { name: "Back to homepage", exact: true }),
  ];

  for (const control of loginOrder) {
    await page.keyboard.press("Tab");
    await expectVisibleFocus(control);
  }

  await page.keyboard.press("Shift+Tab");
  const submit = page.getByRole("button", {
    name: "Continue to demo",
    exact: true,
  });
  await expectVisibleFocus(submit);
  await page.keyboard.press("Enter");
  const email = page.getByRole("textbox", {
    name: "Email address",
    exact: true,
  });
  const password = page.getByLabel("Password", { exact: true });
  await expectVisibleFocus(email);
  await expect(email).toHaveAttribute("aria-describedby", "login-email-error");
  await expect(password).toHaveAttribute(
    "aria-describedby",
    "login-password-error",
  );

  await page.goto("/");
  const headerOrder = [
    page.getByRole("link", { name: "Skip to main content", exact: true }),
    page
      .locator(".site-header")
      .getByRole("link", { name: "Nexa Support", exact: true }),
    page
      .locator(".site-header")
      .getByRole("link", { name: "Product", exact: true }),
    page
      .locator(".site-header")
      .getByRole("link", { name: "Pricing", exact: true }),
    page
      .locator(".site-header")
      .getByRole("button", { name: "简体中文", exact: true }),
    page
      .locator(".site-header")
      .getByRole("link", { name: "Log in", exact: true }),
    page
      .locator(".site-header")
      .getByRole("link", { name: "Start free", exact: true }),
  ];

  for (const control of headerOrder) {
    await page.keyboard.press("Tab");
    await expectVisibleFocus(control);
  }

  const dashboard = page.getByRole("region", {
    name: "Nexa Support dashboard",
    exact: true,
  });
  const allQueue = dashboard.getByRole("button", {
    name: "All conversations",
    exact: true,
  });
  const aiQueue = dashboard.getByRole("button", {
    name: "AI resolving",
    exact: true,
  });
  const humanQueue = dashboard.getByRole("button", {
    name: "Human handoff",
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
  const sofiaConversation = dashboard.getByRole("button", {
    name: "Open Sofia Ramirez conversation",
    exact: true,
  });

  await tabTo(allQueue);
  await expectVisibleFocus(allQueue);
  await page.keyboard.press("Enter");
  await tabTo(aiQueue);
  await expectVisibleFocus(aiQueue);
  await page.keyboard.press("Space");
  await tabTo(mayaConversation);
  await expectVisibleFocus(mayaConversation);
  await page.keyboard.press("Enter");
  await tabTo(liamConversation);
  await expectVisibleFocus(liamConversation);
  await page.keyboard.press("Space");
  await tabTo(humanQueue);
  await expectVisibleFocus(humanQueue);
  await page.keyboard.press("Enter");
  await tabTo(sofiaConversation);
  await expectVisibleFocus(sofiaConversation);
  await page.keyboard.press("Space");

  const firstFaq = page.getByRole("button", {
    name: "How does Nexa answer questions?",
    exact: true,
  });
  await tabTo(firstFaq);
  await expectVisibleFocus(firstFaq);
  await page.keyboard.press("Enter");
  await expect(firstFaq).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(firstFaq).toHaveAttribute("aria-expanded", "false");

  const launcher = page.getByRole("button", {
    name: "Open support chat",
    exact: true,
  });
  await tabTo(launcher);
  await expectVisibleFocus(launcher);
  await page.keyboard.press("Enter");

  const chat = page.getByRole("dialog", { name: "Nexa Support" });
  const chatTitle = chat.getByRole("heading", {
    name: "Nexa Support",
    exact: true,
  });
  await expectVisibleFocus(chatTitle);
  const settingsToggle = chat.locator(".chat-shell__settings-toggle");
  await page.keyboard.press("Tab");
  await expectVisibleFocus(settingsToggle);
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expectVisibleFocus(chat.locator("#chat-api-key"));
  for (const action of [
    "Pricing",
    "Refunds",
    "Product features",
    "Contact a human",
  ]) {
    await page.keyboard.press("Tab");
    await expectVisibleFocus(
      chat.getByRole("button", { name: action, exact: true }),
    );
  }
  await page.keyboard.press("Tab");
  await expectVisibleFocus(
    chat.getByRole("textbox", { name: "Your question", exact: true }),
  );
  await page.keyboard.press("Tab");
  await expectVisibleFocus(
    chat.getByRole("button", { name: "Send", exact: true }),
  );
  await page.keyboard.press("Escape");
  await expectVisibleFocus(
    page.getByRole("button", {
      name: "Open support chat",
      exact: true,
    }),
  );
});

test("has no automated WCAG violations across both localized journeys", async ({
  page,
}) => {
  for (const locale of locales) {
    await setLocale(page, locale.storageValue);
    await page.goto("/");
    await page.getByRole("button", { name: locale.faq }).click();
    await page.getByRole("button", { name: locale.launcher }).click();
    await page.getByRole("button", { name: locale.settings }).click();
    await expectAxeClean(page);

    await page.goto("/login");
    await page.getByRole("button", { name: locale.submit }).click();
    await expectAxeClean(page);
  }
});

test("disables non-essential motion when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const offenders = await page.locator("body *").evaluateAll((elements) =>
    elements.flatMap((element) => {
      const style = getComputedStyle(element);
      const durations = [
        ...style.animationDuration.split(","),
        ...style.transitionDuration.split(","),
      ].map((duration) => {
        const value = Number.parseFloat(duration);
        return duration.trim().endsWith("ms") ? value : value * 1000;
      });
      const tooLong = durations.some((duration) => duration > 0.01);
      const repeats = style.animationIterationCount
        .split(",")
        .some((count) => count === "infinite" || Number.parseFloat(count) > 1);
      return tooLong || repeats
        ? [
            {
              animationDuration: style.animationDuration,
              animationIterationCount: style.animationIterationCount,
              tag: element.tagName,
              transitionDuration: style.transitionDuration,
            },
          ]
        : [];
    }),
  );
  expect(offenders).toEqual([]);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

for (const width of viewports) {
  for (const locale of locales) {
    test(`keeps ${locale.storageValue} inside ${width}px and records evidence`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await setLocale(page, locale.storageValue);
      await page.goto("/");
      await page.getByRole("button", { name: locale.faq }).click();
      await page.getByRole("button", { name: locale.launcher }).click();
      await page.getByRole("button", { name: locale.settings }).click();

      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= window.innerWidth &&
            document.body.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      for (const surface of [
        page.locator("main"),
        page.locator(".support-dashboard"),
        page.locator(".feature-workflow"),
        page.locator(".pricing-section"),
        page.locator(".faq-section"),
        page.getByRole("dialog", { name: "Nexa Support" }),
      ]) {
        await expectInsideViewport(page, surface);
      }
      await testInfo.attach(
        `${testInfo.project.name}-${locale.storageValue}-${width}-home.png`,
        {
          body: await page.screenshot({ fullPage: true }),
          contentType: "image/png",
        },
      );

      await page.goto("/login");
      await page.getByRole("button", { name: locale.submit }).click();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= window.innerWidth &&
            document.body.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expectInsideViewport(page, page.locator(".login-card"));
      await expectInsideViewport(page, page.locator(".login-form"));
      await testInfo.attach(
        `${testInfo.project.name}-${locale.storageValue}-${width}-login.png`,
        {
          body: await page.screenshot({ fullPage: true }),
          contentType: "image/png",
        },
      );
    });
  }
}
