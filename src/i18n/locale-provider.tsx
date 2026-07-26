"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { catalog, type Locale, type SiteCopy } from "./catalog";
import {
  DEFAULT_LOCALE,
  LANGUAGE_STORAGE_KEY,
  readStoredLocale,
  writeStoredLocale,
} from "./locale-storage";

const LANGUAGE_CHANGE_EVENT = "nexa-language-change";
const UNINITIALIZED_SNAPSHOT = Symbol("uninitialized locale snapshot");

let cachedRawLocale: string | null | typeof UNINITIALIZED_SNAPSHOT =
  UNINITIALIZED_SNAPSHOT;
let cachedLocale: Locale = DEFAULT_LOCALE;
let inMemoryLocale: Locale | null = null;

type LocaleContextValue = {
  locale: Locale;
  copy: SiteCopy;
  setLocale(locale: Locale): void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function getClientSnapshot(): Locale {
  let rawLocale: string | null;

  try {
    rawLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return inMemoryLocale ?? DEFAULT_LOCALE;
  }

  if (inMemoryLocale !== null) {
    if (rawLocale === inMemoryLocale) {
      inMemoryLocale = null;
    } else {
      return inMemoryLocale;
    }
  }

  if (rawLocale !== cachedRawLocale) {
    cachedRawLocale = rawLocale;
    cachedLocale = readStoredLocale({ getItem: () => rawLocale });
  }

  return cachedLocale;
}

function subscribeToLocale(onStoreChange: () => void): () => void {
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
}

function updateLocale(locale: Locale): void {
  inMemoryLocale = locale;
  cachedRawLocale = locale;
  cachedLocale = locale;

  writeStoredLocale(locale);
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getClientSnapshot,
    getServerSnapshot,
  );
  const setLocale = useCallback(updateLocale, []);
  const value = useMemo(
    () => ({ locale, copy: catalog[locale], setLocale }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (context === null) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
