import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { LANGUAGE_STORAGE_KEY } from "~/i18n/locale-storage";
import { SupportDashboard } from "./support-dashboard";

describe("SupportDashboard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("updates visible details when a conversation is selected", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <SupportDashboard />
      </LocaleProvider>,
    );

    await user.click(
      screen.getByRole("button", { name: "Open Sofia Ramirez conversation" }),
    );

    expect(
      screen.getByRole("heading", { name: "Refund request", level: 3 }),
    ).toBeVisible();
    expect(screen.getByText("Waiting for human support")).toBeVisible();
  });

  test("updates the activity visualization for a different AI conversation", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LocaleProvider>
        <SupportDashboard />
      </LocaleProvider>,
    );

    const initialActivityPath = container
      .querySelector(".support-dashboard__activity path")
      ?.getAttribute("d");
    const initialFirstMarkerY = container
      .querySelector(".support-dashboard__activity circle")
      ?.getAttribute("cy");

    await user.click(
      screen.getByRole("button", { name: "Open Liam Foster conversation" }),
    );

    expect(
      container
        .querySelector(".support-dashboard__activity path")
        ?.getAttribute("d"),
    ).not.toBe(initialActivityPath);
    expect(
      container
        .querySelector(".support-dashboard__activity circle")
        ?.getAttribute("cy"),
    ).not.toBe(initialFirstMarkerY);
  });

  test("renders every localized conversation detail in Simplified Chinese", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");

    render(
      <LocaleProvider>
        <SupportDashboard />
      </LocaleProvider>,
    );
    const detail = within(screen.getByRole("article", { name: "会话详情" }));

    expect(
      detail.getByRole("heading", { name: "账单", level: 3 }),
    ).toBeVisible();
    expect(screen.getAllByText("2 分钟")).toHaveLength(2);
    expect(
      screen.getByText("我可以更新下一次续费使用的信用卡吗？"),
    ).toBeVisible();
    expect(detail.getByText("咨询如何在续费前更新付款方式。")).toBeVisible();
    expect(detail.getByText("AI 正在处理", { exact: true })).toBeVisible();
  });

  test("queue buttons filter conversations and reset to the first selection", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <SupportDashboard />
      </LocaleProvider>,
    );

    const liamConversation = screen.getByRole("button", {
      name: "Open Liam Foster conversation",
    });
    await user.click(liamConversation);
    expect(liamConversation).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Human handoff" }));
    expect(
      screen.queryByRole("button", {
        name: "Open Liam Foster conversation",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Open Sofia Ramirez conversation",
      }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "All conversations" }));
    expect(
      screen.getByRole("button", { name: "Open Maya Chen conversation" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("heading", { name: "Billing", level: 3 }),
    ).toBeVisible();
  });
});
