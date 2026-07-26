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
    remember: "Remember me",
    submit: "Continue to demo",
  },
  {
    storageValue: "zh-CN",
    faq: "Nexa 如何回答问题？",
    launcher: "打开客服聊天",
    settings: "打开聊天设置",
    email: "邮箱地址",
    password: "密码",
    remember: "记住我",
    submit: "继续体验演示",
  },
] as const;

async function openWithLocale(
  page: Page,
  path: "/" | "/login",
  locale: "en" | "zh-CN",
) {
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => {
      localStorage.clear();
      localStorage.setItem(key, value);
    },
    { key: "nexa-language:v1", value: locale },
  );
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-locale", locale);
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

async function expectMinimumTargetSize(locator: Locator) {
  const bounds = await locator.boundingBox();
  expect(bounds).not.toBeNull();
  if (bounds === null) {
    throw new Error("Expected a visible control for target-size evidence.");
  }
  expect(bounds.width).toBeGreaterThanOrEqual(44);
  expect(bounds.height).toBeGreaterThanOrEqual(44);
}

async function expectTabSequence(page: Page, controls: readonly Locator[]) {
  for (const control of controls) {
    await page.keyboard.press("Tab");
    await expectVisibleFocus(control);
  }
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

function getEnglishHomeControls(page: Page) {
  const header = page.locator(".site-header");
  const hero = page.locator(".hero-section");
  const dashboard = page.getByRole("region", {
    name: "Nexa Support dashboard",
    exact: true,
  });
  const pricing = page.locator(".pricing-section");
  const faq = page.locator(".faq-section");
  const footer = page.locator(".site-footer");

  return {
    beforeDashboard: [
      page.getByRole("link", {
        name: "Skip to main content",
        exact: true,
      }),
      header.getByRole("link", { name: "Nexa Support", exact: true }),
      header.getByRole("link", { name: "Product", exact: true }),
      header.getByRole("link", { name: "Pricing", exact: true }),
      header.getByRole("button", { name: "简体中文", exact: true }),
      header.getByRole("link", { name: "Log in", exact: true }),
      header.getByRole("link", { name: "Start free", exact: true }),
      hero.getByRole("link", { name: "Start free", exact: true }),
      hero.getByRole("link", { name: "Explore product", exact: true }),
    ],
    allQueue: dashboard.getByRole("button", {
      name: "All conversations",
      exact: true,
    }),
    aiQueue: dashboard.getByRole("button", {
      name: "AI resolving",
      exact: true,
    }),
    humanQueue: dashboard.getByRole("button", {
      name: "Human handoff",
      exact: true,
    }),
    mayaConversation: dashboard.getByRole("button", {
      name: "Open Maya Chen conversation",
      exact: true,
    }),
    liamConversation: dashboard.getByRole("button", {
      name: "Open Liam Foster conversation",
      exact: true,
    }),
    sofiaConversation: dashboard.getByRole("button", {
      name: "Open Sofia Ramirez conversation",
      exact: true,
    }),
    pricingLinks: [
      pricing.getByRole("link", { name: "Start free", exact: true }).nth(0),
      pricing.getByRole("link", { name: "Start free", exact: true }).nth(1),
    ],
    faqButtons: [
      faq.getByRole("button", {
        name: "How does Nexa answer questions?",
        exact: true,
      }),
      faq.getByRole("button", {
        name: "How does human takeover work?",
        exact: true,
      }),
      faq.getByRole("button", {
        name: "How is Nexa deployed?",
        exact: true,
      }),
      faq.getByRole("button", {
        name: "What is the refund policy?",
        exact: true,
      }),
      faq.getByRole("button", {
        name: "What happens to customer data?",
        exact: true,
      }),
    ],
    footerControls: [
      footer.getByRole("link", { name: "Nexa Support", exact: true }),
      footer.getByRole("link", { name: "Product", exact: true }),
      footer.getByRole("link", { name: "Pricing", exact: true }),
      footer.getByRole("link", { name: "Log in", exact: true }),
    ],
    launcher: page.getByRole("button", {
      name: "Open support chat",
      exact: true,
    }),
  };
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

test("activates a visible skip link on the homepage and login route", async ({
  page,
}) => {
  for (const path of ["/", "/login"] as const) {
    await page.goto(path);
    const skipLink = page.getByRole("link", {
      name: "Skip to main content",
      exact: true,
    });
    await page.keyboard.press("Tab");
    await expectVisibleFocus(skipLink);
    await expect(skipLink).toBeInViewport();
    await expectMinimumTargetSize(skipLink);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(
      path === "/" ? /\/#main-content$/ : /\/login#main-content$/,
    );
    await expect(page.locator("#main-content")).toBeFocused();
  }
});

test("keeps the login keyboard sequence exact and focuses invalid fields", async ({
  page,
}) => {
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

  await expectTabSequence(page, loginOrder);

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
});

test("activates every dashboard control from an exact keyboard position", async ({
  page,
}) => {
  await page.goto("/");
  let controls = getEnglishHomeControls(page);
  await expectTabSequence(page, [
    ...controls.beforeDashboard,
    controls.allQueue,
  ]);
  await page.keyboard.press("Enter");
  await expect(controls.allQueue).toHaveAttribute("aria-pressed", "true");
  await expectTabSequence(page, [controls.aiQueue]);
  await page.keyboard.press("Space");
  await expect(controls.aiQueue).toHaveAttribute("aria-pressed", "true");
  await expectTabSequence(page, [
    controls.humanQueue,
    controls.mayaConversation,
  ]);
  await page.keyboard.press("Enter");
  await expect(controls.mayaConversation).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expectTabSequence(page, [controls.liamConversation]);
  await page.keyboard.press("Space");
  await expect(controls.liamConversation).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.goto("/");
  controls = getEnglishHomeControls(page);
  await expectTabSequence(page, [
    ...controls.beforeDashboard,
    controls.allQueue,
    controls.aiQueue,
    controls.humanQueue,
  ]);
  await page.keyboard.press("Enter");
  await expect(controls.humanQueue).toHaveAttribute("aria-pressed", "true");
  await expectTabSequence(page, [controls.sofiaConversation]);
  await page.keyboard.press("Space");
  await expect(controls.sofiaConversation).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

test("keeps navigation, FAQ, and chat in one exact keyboard sequence", async ({
  page,
}) => {
  await page.goto("/");
  const controls = getEnglishHomeControls(page);
  const [firstFaq, ...remainingFaqs] = controls.faqButtons;
  if (firstFaq === undefined) {
    throw new Error("The exact keyboard sequence requires the first FAQ.");
  }
  await expectTabSequence(page, [
    ...controls.beforeDashboard,
    controls.allQueue,
    controls.aiQueue,
    controls.humanQueue,
    controls.mayaConversation,
    controls.liamConversation,
    controls.sofiaConversation,
    ...controls.pricingLinks,
    firstFaq,
  ]);
  await page.keyboard.press("Enter");
  await expect(firstFaq).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(firstFaq).toHaveAttribute("aria-expanded", "false");

  await expectTabSequence(page, [
    ...remainingFaqs,
    ...controls.footerControls,
    controls.launcher,
  ]);
  await page.keyboard.press("Enter");

  const chat = page.getByRole("dialog", { name: "Nexa Support" });
  const chatTitle = chat.getByRole("heading", {
    name: "Nexa Support",
    exact: true,
  });
  await expectVisibleFocus(chatTitle);
  const settingsToggle = chat.locator(".chat-shell__settings-toggle");
  await expectTabSequence(page, [settingsToggle]);
  await page.keyboard.press("Enter");
  await expectTabSequence(page, [
    chat.locator("#chat-api-key"),
    ...["Pricing", "Refunds", "Product features", "Contact a human"].map(
      (action) => chat.getByRole("button", { name: action, exact: true }),
    ),
    chat.getByRole("textbox", { name: "Your question", exact: true }),
    chat.getByRole("button", { name: "Send", exact: true }),
  ]);
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
    await openWithLocale(page, "/", locale.storageValue);
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
      await openWithLocale(page, "/", locale.storageValue);
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
      const email = page.getByRole("textbox", {
        name: locale.email,
        exact: true,
      });
      const password = page.getByLabel(locale.password, { exact: true });
      const remember = page.getByRole("checkbox", {
        name: locale.remember,
        exact: true,
      });
      const submit = page.getByRole("button", {
        name: locale.submit,
        exact: true,
      });
      await submit.click();
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth <= window.innerWidth &&
            document.body.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expectInsideViewport(page, page.locator(".login-card"));
      await expectInsideViewport(page, page.locator(".login-form"));
      for (const control of [email, password, remember, submit]) {
        await expectMinimumTargetSize(control);
      }
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
