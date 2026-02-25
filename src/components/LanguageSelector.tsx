"use client";

import { useTranslation } from "@/lib/i18n";

export default function LanguageSelector() {
  const { locale, changeLocale } = useTranslation();

  return (
    <div className="language-selector" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button
        onClick={() => changeLocale("en")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: locale === "en" ? "bold" : "normal",
          opacity: locale === "en" ? 1 : 0.6,
          color: "currentColor"
        }}
      >
        EN
      </button>
      <span style={{ opacity: 0.3 }}>|</span>
      <button
        onClick={() => changeLocale("id")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: locale === "id" ? "bold" : "normal",
          opacity: locale === "id" ? 1 : 0.6,
          color: "currentColor"
        }}
      >
        ID
      </button>
    </div>
  );
}
