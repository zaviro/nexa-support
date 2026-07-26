"use client";

import { useLocale } from "~/i18n/locale-provider";
import { LocalizedText } from "~/i18n/localized-text";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      className="language-switcher"
      onClick={() => setLocale(locale === "en" ? "zh-CN" : "en")}
      type="button"
    >
      <LocalizedText
        en="简体中文"
        enLang="zh-CN"
        zhCN="English"
        zhCNLang="en"
      />
    </button>
  );
}
