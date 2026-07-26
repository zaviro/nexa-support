import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { ChatShell } from "./chat-shell";

afterEach(() => vi.useRealTimers());

describe("ChatShell", () => {
  test("opens from the keyboard, focuses its title, and restores launcher focus on Escape", async () => {
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    const launcher = screen.getByRole("button", { name: "Open support chat" });
    launcher.focus();
    await user.keyboard("{Enter}");

    const dialog = within(screen.getByRole("dialog", { name: "Nexa Support" }));
    expect(launcher).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "false");
    expect(dialog.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(dialog.getByRole("status")).toHaveAttribute("aria-atomic", "true");
    expect(dialog.getByRole("heading", { name: "Nexa Support" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Nexa Support" })).toBeNull();
    expect(launcher).toHaveAttribute("aria-expanded", "false");
    expect(launcher).toHaveFocus();
  });

  test("announces a local pricing reply and prevents duplicate submission while typing", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    const dialog = within(screen.getByRole("dialog", { name: "Nexa Support" }));
    await user.click(dialog.getByRole("button", { name: "Pricing" }));

    expect(dialog.getByRole("status")).toHaveTextContent(
      "Nexa Support is typing",
    );
    expect(dialog.getByRole("button", { name: "Refunds" })).toBeDisabled();
    await act(async () => vi.advanceTimersByTime(600));

    expect(
      dialog.getByText(
        "Starter is ¥99/month and Pro is ¥299/month in this local demo.",
      ),
    ).toBeVisible();
  });

  test("keeps a completed message when the panel closes and opens again", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(screen.getByRole("button", { name: "Product features" }));
    await act(async () => vi.advanceTimersByTime(600));
    await user.click(
      screen.getByRole("button", { name: "Close support chat" }),
    );
    await user.click(screen.getByRole("button", { name: "Open support chat" }));

    expect(
      screen.getByText(
        "Nexa Support demonstrates AI answers, human handoff, and support analytics.",
      ),
    ).toBeVisible();
  });
});
