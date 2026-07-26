import type { Locale } from "./catalog";

export const DEFAULT_LOCALE = "en" as const;
export const LANGUAGE_STORAGE_KEY = "nexa-language:v1";

export function parseLocale(value: unknown): Locale {
  return value === "zh-CN" || value === "en" ? value : DEFAULT_LOCALE;
}

export function readStoredLocale(storage?: Pick<Storage, "getItem">): Locale {
  try {
    return parseLocale(
      (storage ?? window.localStorage).getItem(LANGUAGE_STORAGE_KEY),
    );
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeStoredLocale(
  locale: Locale,
  storage?: Pick<Storage, "setItem">,
): void {
  try {
    (storage ?? window.localStorage).setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // The preference remains in component memory when storage is unavailable.
  }
}
