"use client";

import { useState, useEffect, useCallback } from "react";
import id from "@/locales/id.json";
import en from "@/locales/en.json";

type Locale = "id" | "en";
type Dictionary = typeof id;

const dictionaries: Record<Locale, Dictionary> = {
  id,
  en,
};

export function useTranslation() {
  const [locale, setLocale] = useState<Locale>("id");

  useEffect(() => {
    // Attempt to get saved locale from localStorage, or fallback to 'id'
    const savedLocale = localStorage.getItem("app_locale") as Locale;
    if (savedLocale && dictionaries[savedLocale]) {
      setLocale(savedLocale);
    } else {
      // Check browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "en") {
        setLocale("en");
      } else {
        setLocale("id");
      }
    }
  }, []);

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem("app_locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string) => {
      const keys = key.split(".");
      let value: any = dictionaries[locale];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Fallback to Indonesian if key missing in English
          let fallbackValue: any = dictionaries["id"];
          for (const fbKey of keys) {
            if (fallbackValue && typeof fallbackValue === "object" && fbKey in fallbackValue) {
              fallbackValue = fallbackValue[fbKey];
            } else {
              return key; // Return raw key string if totally missing
            }
          }
          return fallbackValue;
        }
      }

      return value as string;
    },
    [locale]
  );

  return { t, locale, changeLocale };
}
