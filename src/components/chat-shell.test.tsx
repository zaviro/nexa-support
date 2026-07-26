import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { ChatShell } from "./chat-shell";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

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

    await user.click(
      dialog.getByRole("button", { name: "Open chat settings" }),
    );
    await user.type(
      dialog.getByLabelText("OpenAI API key — demo only"),
      "sk-not-a-real-key",
    );
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Nexa Support" })).toBeNull();
    expect(launcher).toHaveAttribute("aria-expanded", "false");
    expect(launcher).toHaveFocus();

    await user.click(launcher);
    await user.click(
      screen.getByRole("button", { name: "Open chat settings" }),
    );
    expect(screen.getByLabelText("OpenAI API key — demo only")).toHaveValue("");
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

  test("shows a masked demo-only key field, never fetches, and clears it when chat closes", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const user = userEvent.setup();
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(
      screen.getByRole("button", { name: "Open chat settings" }),
    );
    const keyInput = screen.getByLabelText("OpenAI API key — demo only");

    expect(keyInput).toHaveAttribute("type", "password");
    expect(screen.getByText("Demo / not connected")).toBeVisible();
    expect(screen.getByText("Do not enter a real secret.")).toBeVisible();
    await user.type(keyInput, "sk-not-a-real-key");
    expect(keyInput).toHaveValue("sk-not-a-real-key");
    expect(fetchSpy).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: "Close support chat" }),
    );
    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(
      screen.getByRole("button", { name: "Open chat settings" }),
    );
    expect(screen.getByLabelText("OpenAI API key — demo only")).toHaveValue("");
  });

  test("announces a concrete fictional human queue without collecting contact details", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(
      <LocaleProvider>
        <ChatShell />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open support chat" }));
    await user.click(screen.getByRole("button", { name: "Contact a human" }));
    await act(async () => vi.advanceTimersByTime(600));

    const dialog = within(screen.getByRole("dialog", { name: "Nexa Support" }));
    expect(dialog.getByRole("status")).toHaveTextContent(
      "Demo handoff queue: position 3, expected response in about 2 minutes. No contact details are collected.",
    );
    expect(dialog.queryByLabelText(/email|phone|contact/i)).toBeNull();
  });
});
