import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocaleProvider } from "~/i18n/locale-provider";
import { LocaleScript } from "~/i18n/locale-script";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "en";
    document.documentElement.dataset.locale = "en";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("exposes only the saved Chinese copy before hydration", () => {
    const serverMarkup = renderToString(
      <>
        <LocaleScript />
        <LocaleProvider>
          <SiteHeader />
        </LocaleProvider>
      </>,
    );
    document.documentElement.lang = "zh-CN";
    document.documentElement.dataset.locale = "zh-CN";
    document.body.innerHTML = serverMarkup;

    expect(screen.getByRole("link", { name: "产品" })).toBeVisible();
    expect(
      screen.queryByRole("link", { name: "Product" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "English" })).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "简体中文" }),
    ).not.toBeInTheDocument();
  });

  it("offers exactly one language action at a time", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LocaleScript />
        <LocaleProvider>
          <SiteHeader />
        </LocaleProvider>
      </>,
    );

    expect(screen.getAllByRole("button")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "简体中文" }));
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: "English" })).toBeVisible();
  });

  it("uses exact same-page feature and pricing anchors", () => {
    render(
      <>
        <LocaleScript />
        <LocaleProvider>
          <SiteHeader />
        </LocaleProvider>
      </>,
    );

    expect(screen.getByRole("link", { name: "Product" })).toHaveAttribute(
      "href",
      "#features",
    );
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "#pricing",
    );
  });
});
