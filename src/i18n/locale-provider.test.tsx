import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider, useLocale } from "./locale-provider";
import { LANGUAGE_STORAGE_KEY } from "./locale-storage";

function LocaleProbe() {
  const { copy, locale, setLocale } = useLocale();

  return (
    <>
      <output aria-label="Current locale">{locale}</output>
      <span>{copy.navigation.product}</span>
      <button onClick={() => setLocale("zh-CN")} type="button">
        Set Chinese
      </button>
    </>
  );
}

function renderProbe() {
  return render(
    <LocaleProvider>
      <LocaleProbe />
    </LocaleProvider>,
  );
}

function dispatchStorage(key: string | null, newValue: string | null) {
  act(() => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key,
        newValue,
        storageArea: window.localStorage,
      }),
    );
  });
}

describe("LocaleProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "en";
    document.documentElement.dataset.locale = "en";
  });

  it("reads a persisted Chinese locale", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");

    renderProbe();

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("zh-CN");
    expect(screen.getByText("产品")).toBeVisible();
  });

  it("falls back for malformed stored locales", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "fr");

    renderProbe();

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("en");
    expect(screen.getByText("Product")).toBeVisible();
  });

  it("falls back when storage is inaccessible", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("blocked");
    });

    renderProbe();

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("en");
  });

  it("keeps a same-tab selection in memory when persistence fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    renderProbe();

    await user.click(screen.getByRole("button", { name: "Set Chinese" }));

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("zh-CN");
    expect(document.documentElement).toHaveAttribute("lang", "zh-CN");
    expect(document.documentElement).toHaveAttribute("data-locale", "zh-CN");
  });

  it("persists and publishes same-tab selections", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "Set Chinese" }));

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("zh-CN");
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("zh-CN");
    expect(document.documentElement).toHaveAttribute("lang", "zh-CN");
    expect(document.documentElement).toHaveAttribute("data-locale", "zh-CN");
  });

  it("applies native storage updates and document attributes", () => {
    renderProbe();
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");

    dispatchStorage(LANGUAGE_STORAGE_KEY, "zh-CN");

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("zh-CN");
    expect(document.documentElement).toHaveAttribute("lang", "zh-CN");
    expect(document.documentElement).toHaveAttribute("data-locale", "zh-CN");
  });

  it("falls back when a native storage update is malformed", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");
    renderProbe();
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "fr");

    dispatchStorage(LANGUAGE_STORAGE_KEY, "fr");

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("en");
    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("data-locale", "en");
  });

  it("falls back when native storage is cleared", () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");
    renderProbe();
    window.localStorage.clear();

    dispatchStorage(null, null);

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("en");
    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("data-locale", "en");
  });

  it("ignores native storage updates for unrelated keys", () => {
    renderProbe();
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");

    dispatchStorage("unrelated", "updated");

    expect(screen.getByLabelText("Current locale")).toHaveTextContent("en");
    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("data-locale", "en");
  });

  it("removes the native storage listener on cleanup", () => {
    const view = renderProbe();
    view.unmount();
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, "zh-CN");

    dispatchStorage(LANGUAGE_STORAGE_KEY, "zh-CN");

    expect(document.documentElement).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("data-locale", "en");
  });
});
