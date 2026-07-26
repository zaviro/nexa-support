import type { ReactNode } from "react";

type LocalizedTextProps = {
  en: ReactNode;
  zhCN: ReactNode;
  enLang?: "en" | "zh-CN";
  zhCNLang?: "en" | "zh-CN";
};

export function LocalizedText({
  en,
  zhCN,
  enLang = "en",
  zhCNLang = "zh-CN",
}: LocalizedTextProps) {
  return (
    <>
      <span className="localized-text localized-text--en" lang={enLang}>
        {en}
      </span>
      <span className="localized-text localized-text--zh-cn" lang={zhCNLang}>
        {zhCN}
      </span>
    </>
  );
}
