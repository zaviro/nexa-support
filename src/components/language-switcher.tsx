"use client";

import { useLocale } from "~/i18n/locale-provider";
import { LocalizedText } from "~/i18n/localized-text";

export function LanguageSwitcher() {
  const { setLocale } = useLocale();

  return (
    <button
      className="language-switcher"
      onClick={() =>
        setLocale(
          document.documentElement.dataset.locale === "zh-CN" ? "en" : "zh-CN",
        )
      }
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
