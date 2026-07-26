const localeScript = `try {
  var value = localStorage.getItem("nexa-language:v1");
  var locale = value === "zh-CN" ? "zh-CN" : "en";
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
} catch (_) {
  document.documentElement.lang = "en";
  document.documentElement.dataset.locale = "en";
}`;

const localeStyles = `
  .localized-text--zh-cn {
    display: none;
  }

  html[data-locale="zh-CN"] .localized-text--en {
    display: none;
  }

  html[data-locale="zh-CN"] .localized-text--zh-cn {
    display: inline;
  }
`;

export function LocaleScript() {
  return (
    <>
      <style>{localeStyles}</style>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: This static local script contains no user content. */}
      <script dangerouslySetInnerHTML={{ __html: localeScript }} />
    </>
  );
}
