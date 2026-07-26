import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { SupportDashboard } from "./support-dashboard";

describe("SupportDashboard", () => {
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
});
