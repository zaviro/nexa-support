import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { LanguageSwitcher } from "~/components/language-switcher";
import { LocaleProvider } from "~/i18n/locale-provider";
import { LocaleScript } from "~/i18n/locale-script";
import { LoginForm } from "./login-form";

function renderForm() {
  return render(
    <>
      <LocaleScript />
      <LocaleProvider>
        <LanguageSwitcher />
        <LoginForm />
      </LocaleProvider>
    </>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => window.localStorage.clear());

  test("associates localized missing and malformed errors without a request", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(window, "fetch");
    renderForm();

    await user.click(screen.getByRole("button", { name: "Continue to demo" }));
    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toHaveAttribute("aria-invalid", "true");
    expect(
      screen.getByText("Enter your email address.", { exact: true }),
    ).toHaveAttribute("id", "login-email-error");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "aria-describedby",
      "login-password-error",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "nexa@invalid",
    );
    await user.type(screen.getByLabelText("Password"), "local-only");
    await user.click(screen.getByRole("button", { name: "Continue to demo" }));
    expect(
      screen.getByText("Enter a valid email address.", { exact: true }),
    ).toBeVisible();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("reports the localized no-authentication outcome and does not persist the form", async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "person@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "local-only");
    await user.click(screen.getByRole("checkbox", { name: "Remember me" }));
    await user.click(screen.getByRole("button", { name: "Continue to demo" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Demo only—authentication is not connected.",
    );
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeChecked();
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  test("switches the complete form to Simplified Chinese without exposing English copy", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "简体中文" }));
    expect(screen.getByRole("textbox", { name: "邮箱地址" })).toBeVisible();
    expect(screen.getByRole("button", { name: "继续体验演示" })).toBeVisible();
    expect(
      screen.queryByRole("textbox", { name: "Email address" }),
    ).not.toBeInTheDocument();
  });
});
