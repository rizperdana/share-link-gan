"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import LanguageSelector from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="lt-page">
      {/* Navigation */}
      <nav className="lt-nav">
        <div className="lt-nav-logo">
          <Link href="/">ShareLinkGan</Link>
        </div>
        <div className="lt-nav-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ThemeToggle />
          <LanguageSelector />
          <Link href="/login" className="lt-nav-login">
            {t("home.login")}
          </Link>
          <Link href="/register" className="lt-nav-signup">
            {t("home.cta_button")}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="lt-hero">
        <div className="lt-hero-content animate-fade-in-up">
          <h1 className="lt-hero-title">
            {t("home.hero_title")}
          </h1>
          <p className="lt-hero-subtitle">
            {t("home.hero_subtitle")}
          </p>
          <div className="lt-claim-bar">
            <span className="lt-claim-prefix">{t("home.claim_prefix")}</span>
            <input
              type="text"
              className="lt-claim-input"
              placeholder={t("home.claim_placeholder")}
            />
            <Link href="/register" className="lt-claim-btn">
              {t("home.claim_button")}
            </Link>
          </div>
        </div>

        <div
          className="lt-hero-visual animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="lt-phone">
            <div className="lt-phone-notch"></div>
            <div className="lt-phone-screen">
              <div className="lt-phone-avatar"></div>
              <div className="lt-phone-name"></div>
              <div className="lt-phone-bio"></div>
              <div className="lt-phone-link"></div>
              <div className="lt-phone-link"></div>
              <div className="lt-phone-link"></div>
              <div className="lt-phone-link"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="lt-features">
        <h2 style={{ textAlign: "center", marginBottom: "48px", fontSize: "2.5rem" }}>
          {t("features.title")}
        </h2>

        <div className="lt-feature-block">
          <div className="lt-feature-text">
            <h2>{t("features.f1_title")}</h2>
            <p>{t("features.f1_desc")}</p>
            <Link href="/register" className="btn btn-primary">
              {t("home.cta_button")}
            </Link>
          </div>
          <div className="lt-feature-visual">
            <div className="lt-feature-card green">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>
            </div>
          </div>
        </div>

        <div className="lt-feature-block">
          <div className="lt-feature-text">
            <h2>{t("features.f2_title")}</h2>
            <p>{t("features.f2_desc")}</p>
            <Link href="/register" className="btn btn-primary">
              {t("home.cta_button")}
            </Link>
          </div>
          <div className="lt-feature-visual">
            <div className="lt-feature-card purple">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            </div>
          </div>
        </div>

        <div className="lt-feature-block">
          <div className="lt-feature-text">
            <h2>{t("features.f3_title")}</h2>
            <p>{t("features.f3_desc")}</p>
            <Link href="/register" className="btn btn-primary">
              {t("home.cta_button")}
            </Link>
          </div>
          <div className="lt-feature-visual">
            <div className="lt-feature-card blue">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="lt-cta">
        <h2>{t("home.hero_title")}</h2>
        <Link href="/register" className="lt-cta-btn">
          {t("home.cta_button")}
        </Link>
        <p>
          {t("home.already_have_account")}{" "}
          <Link href="/login" style={{ textDecoration: "underline" }}>
            {t("home.login")}
          </Link>
        </p>
      </section>

      {/* Footer */}
      <footer className="lt-footer">
        <div className="lt-footer-grid">
          <div className="lt-footer-col">
            <div className="lt-footer-logo">ShareLinkGan</div>
            <p style={{ marginTop: 12, opacity: 0.7 }}>
              {t("home.hero_subtitle")}
            </p>
          </div>
          <div className="lt-footer-col">
            <h4>Menu</h4>
            <ul>
              <li>
                <Link href="/login">{t("home.login")}</Link>
              </li>
              <li>
                <Link href="/register">{t("home.cta_button")}</Link>
              </li>
            </ul>
          </div>
          <div className="lt-footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/terms">{t("footer.terms")}</Link>
              </li>
              <li>
                <Link href="/privacy">{t("footer.privacy")}</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="lt-footer-bottom">
          <p>{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
