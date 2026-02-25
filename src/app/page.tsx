import Link from "next/link";

export default function Home() {
  return (
    <div className="lt-page">
      {/* Navigation */}
      <nav className="lt-nav">
        <div className="lt-nav-logo">
          <Link href="/">ShareLinkGan</Link>
        </div>
        <div className="lt-nav-actions">
          <Link href="/login" className="lt-nav-login">
            Log in
          </Link>
          <Link href="/register" className="lt-nav-signup">
            Sign up free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="lt-hero">
        <div className="lt-hero-content animate-fade-in-up">
          <h1 className="lt-hero-title">
            Everything you are. In one, simple link in bio.
          </h1>
          <p className="lt-hero-subtitle">
            Join 50M+ people using ShareLinkGan for their link in bio. One link
            to help you share everything you create, curate and sell from your
            Instagram, TikTok, Twitter, YouTube and other social media profiles.
          </p>
          <div className="lt-claim-bar">
            <span className="lt-claim-prefix">share-link-gan.vercel.com/</span>
            <input
              type="text"
              className="lt-claim-input"
              placeholder="yourname"
            />
            <Link href="/register" className="lt-claim-btn">
              Claim your LinkGan
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
        <div className="lt-feature-block">
          <div className="lt-feature-text">
            <h2>Create and customize your ShareLinkGan in minutes</h2>
            <p>
              Connect your TikTok, Instagram, Twitter, website, store, videos,
              music, podcast, events and more. It all comes together in a link
              in bio landing page designed to convert.
            </p>
            <Link href="/register" className="btn btn-primary">
              Get started for free
            </Link>
          </div>
          <div className="lt-feature-visual">
            <div className="lt-feature-card green">🎨</div>
          </div>
        </div>

        <div className="lt-feature-block">
          <div className="lt-feature-text">
            <h2>
              Share your ShareLinkGan from your Instagram, TikTok, Twitter and
              other bios
            </h2>
            <p>
              Add your unique ShareLinkGan URL to all the platforms and places
              you find your audience. Then use your QR code to drive your
              offline traffic online.
            </p>
            <Link href="/register" className="btn btn-primary">
              Get started for free
            </Link>
          </div>
          <div className="lt-feature-visual">
            <div className="lt-feature-card purple">📱</div>
          </div>
        </div>

        <div className="lt-feature-block">
          <div className="lt-feature-text">
            <h2>Analyze your audience and keep them engaged</h2>
            <p>
              Track your engagement over time, monitor revenue and learn
              what&apos;s converting your audience. Make informed updates on the
              fly to keep them coming back.
            </p>
            <Link href="/register" className="btn btn-primary">
              Get started for free
            </Link>
          </div>
          <div className="lt-feature-visual">
            <div className="lt-feature-card blue">📊</div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="lt-social-proof">
        <h2>The only link in bio trusted by 50M+</h2>
        <div className="lt-proof-grid">
          <div className="lt-proof-card">
            <div className="lt-proof-number">50M+</div>
            <div className="lt-proof-label">Active users</div>
          </div>
          <div className="lt-proof-card">
            <div className="lt-proof-number">1B+</div>
            <div className="lt-proof-label">Monthly visitors</div>
          </div>
          <div className="lt-proof-card">
            <div className="lt-proof-number">∞</div>
            <div className="lt-proof-label">Links shared</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lt-faq">
        <h2>Questions? Answered</h2>
        <div className="lt-faq-item">
          <div className="lt-faq-q">What is ShareLinkGan?</div>
          <div className="lt-faq-a">
            ShareLinkGan is a link-in-bio tool that lets you share everything
            you create, curate and sell online — all from one simple link in
            your social media bio.
          </div>
        </div>
        <div className="lt-faq-item">
          <div className="lt-faq-q">Is ShareLinkGan free?</div>
          <div className="lt-faq-a">
            Yes! ShareLinkGan offers a free plan with unlimited links. Create
            your page, customize it, and start sharing in minutes.
          </div>
        </div>
        <div className="lt-faq-item">
          <div className="lt-faq-q">How many links can I add?</div>
          <div className="lt-faq-a">
            You can add unlimited links to your ShareLinkGan page. There&apos;s
            no cap — add as many as you need to share your world.
          </div>
        </div>
        <div className="lt-faq-item">
          <div className="lt-faq-q">Can I customize the look of my page?</div>
          <div className="lt-faq-a">
            Absolutely! Choose from multiple themes (Dark, Light, Neon, Glass),
            customize your avatar, bio, social links, and more from your
            dashboard.
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="lt-cta">
        <h2>Jumpstart your corner of the internet today</h2>
        <p>With ShareLinkGan, it&apos;s free and takes less than a minute.</p>
        <Link href="/register" className="btn">
          Get started for free
        </Link>
      </section>

      {/* Footer */}
      <footer className="lt-footer">
        <div className="lt-footer-grid">
          <div className="lt-footer-brand">
            <h3>ShareLinkGan</h3>
            <p>
              A link-in-bio tool built for creators. Share everything you are in
              one simple link.
            </p>
          </div>
          <div className="lt-footer-col">
            <h4>Product</h4>
            <ul>
              <li>
                <Link href="/register">Getting Started</Link>
              </li>
              <li>
                <Link href="/login">Log In</Link>
              </li>
              <li>
                <Link href="/register">Sign Up</Link>
              </li>
            </ul>
          </div>
          <div className="lt-footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <Link href="/">About</Link>
              </li>
              <li>
                <Link href="/">Blog</Link>
              </li>
              <li>
                <Link href="/">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="lt-footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link href="/">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="lt-footer-bottom">
          <p>© {new Date().getFullYear()} ShareLinkGan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
