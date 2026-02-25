import Link from "next/link";

export default function Home() {
  return (
    <div className="lt-landing">
      {/* Navigation */}
      <nav className="lt-nav">
        <div className="lt-nav-logo">
          <Link href="/">ShareLinkGan</Link>
        </div>
        <div className="lt-nav-actions">
          <Link href="/login" className="lt-btn-login">
            Log in
          </Link>
          <Link href="/register" className="lt-btn-signup">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="lt-hero">
        <div className="lt-hero-content animate-fade-in-up">
          <h1 className="lt-hero-title">
            Everything you are. In one, simple link in bio.
          </h1>
          <p className="lt-hero-subtitle">
            Join 50M+ people using ShareLinkGan for their link in bio. One link to
            help you share everything you create, curate and sell from your
            Instagram, TikTok, Twitter, YouTube and other social media profiles.
          </p>

          <div className="lt-claim-group">
            <span className="lt-claim-prefix">linkgan.com/</span>
            <input
              type="text"
              className="lt-claim-input"
              placeholder="yourname"
            />
            <Link
              href="/register"
              className="lt-claim-btn"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              Claim your ShareLinkGan
            </Link>
          </div>
        </div>

        <div
          className="lt-hero-visual animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Phone Mockup replicating Linktree's showcase */}
          <div className="lt-phone-mockup">
            <div className="lt-phone-notch"></div>
            <div className="lt-phone-content">
              {/* Profile Skeleton */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#d1d5db",
                  marginBottom: "1rem",
                }}
              ></div>
              <div
                style={{
                  width: "120px",
                  height: "16px",
                  borderRadius: "8px",
                  background: "#9ca3af",
                  marginBottom: "0.5rem",
                }}
              ></div>
              <div
                style={{
                  width: "200px",
                  height: "12px",
                  borderRadius: "6px",
                  background: "#d1d5db",
                  marginBottom: "2rem",
                }}
              ></div>

              {/* Links Skeleton */}
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                  background: "#ffffff",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              ></div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                  background: "#ffffff",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              ></div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                  background: "#ffffff",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              ></div>
              <div
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                  background: "#ffffff",
                  marginBottom: "1rem",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      <footer
        className="landing-footer"
        style={{
          marginTop: "0",
          padding: "2rem 5%",
          background: "#254f1a",
          color: "#dfe6eb",
        }}
      >
        <p>© {new Date().getFullYear()} Share Link Gan. All rights reserved.</p>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          <Link
            href="/privacy"
            className="footer-link"
            style={{ color: "#dfe6eb" }}
          >
            Privacy Policy
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <Link
            href="/terms"
            className="footer-link"
            style={{ color: "#dfe6eb" }}
          >
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
