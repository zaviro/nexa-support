"use client";

import { useLocale } from "~/i18n/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <fieldset aria-label="Language" className="language-switcher">
      <button
        aria-pressed={locale === "en"}
        lang="en"
        onClick={() => setLocale("en")}
        type="button"
      >
        English
      </button>
      <button
        aria-pressed={locale === "zh-CN"}
        lang="zh-CN"
        onClick={() => setLocale("zh-CN")}
        type="button"
      >
        简体中文
      </button>
    </fieldset>
  );
}
