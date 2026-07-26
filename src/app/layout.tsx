import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { LocaleProvider } from "~/i18n/locale-provider";
import { LocaleScript } from "~/i18n/locale-script";
import { LocalizedText } from "~/i18n/localized-text";

export const metadata: Metadata = {
  title: "Nexa Support",
  description: "An AI support assistant for growing SaaS teams.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${geist.variable}`}
      data-locale="en"
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <LocaleScript />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          <LocalizedText en="Skip to main content" zhCN="跳至主要内容" />
        </a>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
