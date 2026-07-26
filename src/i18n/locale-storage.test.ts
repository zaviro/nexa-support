import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_LOCALE,
  LANGUAGE_STORAGE_KEY,
  parseLocale,
  readStoredLocale,
  writeStoredLocale,
} from "./locale-storage";

describe("locale storage", () => {
  it.each([
    ["en", "en"],
    ["zh-CN", "zh-CN"],
    [null, DEFAULT_LOCALE],
    ["fr", DEFAULT_LOCALE],
    ['{"locale":"zh-CN"}', DEFAULT_LOCALE],
  ] as const)("parses %s as %s", (stored, expected) => {
    expect(parseLocale(stored)).toBe(expected);
  });

  it("falls back to English when storage cannot be read", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
    };
    expect(readStoredLocale(storage)).toBe("en");
  });

  it("falls back to English when the default storage cannot be accessed", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readStoredLocale()).toBe("en");
  });

  it("stores only the selected locale under the versioned key", () => {
    const storage = { setItem: vi.fn() };
    writeStoredLocale("zh-CN", storage);
    expect(storage.setItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, "zh-CN");
  });

  it("does not throw when storage cannot be written", () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new Error("quota");
      }),
    };
    expect(() => writeStoredLocale("en", storage)).not.toThrow();
  });

  it("does not throw when the default storage cannot be accessed", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(() => writeStoredLocale("en")).not.toThrow();
  });
});
