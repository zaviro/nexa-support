"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
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

type LocaleContextValue = {
  locale: Locale;
  copy: SiteCopy;
  setLocale(locale: Locale): void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function applyDocumentLocale(locale: Locale): void {
  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
}

function createLocaleStore() {
  let cachedRawLocale: string | null | typeof UNINITIALIZED_SNAPSHOT =
    UNINITIALIZED_SNAPSHOT;
  let cachedLocale: Locale = DEFAULT_LOCALE;
  let inMemoryLocale: Locale | null = null;

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

  function subscribe(onStoreChange: () => void): () => void {
    const onLanguageChange = () => {
      onStoreChange();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== LANGUAGE_STORAGE_KEY) {
        return;
      }

      inMemoryLocale = null;
      cachedRawLocale = UNINITIALIZED_SNAPSHOT;
      applyDocumentLocale(readStoredLocale());
      onStoreChange();
    };

    window.addEventListener(LANGUAGE_CHANGE_EVENT, onLanguageChange);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, onLanguageChange);
      window.removeEventListener("storage", onStorage);
    };
  }

  function setLocale(locale: Locale): void {
    inMemoryLocale = locale;
    cachedRawLocale = locale;
    cachedLocale = locale;

    writeStoredLocale(locale);
    applyDocumentLocale(locale);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }

  return { getClientSnapshot, setLocale, subscribe };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createLocaleStore> | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createLocaleStore();
  }

  const store = storeRef.current;
  const locale = useSyncExternalStore(
    store.subscribe,
    store.getClientSnapshot,
    getServerSnapshot,
  );
  const value = useMemo(
    () => ({ locale, copy: catalog[locale], setLocale: store.setLocale }),
    [locale, store],
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
