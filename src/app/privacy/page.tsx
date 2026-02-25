import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="landing" data-theme="dark" style={{ display: 'block', textAlign: 'left', padding: 'var(--space-2xl) var(--space-md)' }}>
      <div className="container" style={{ marginTop: '5vh' }}>
        <Link href="/" className="btn btn-ghost" style={{ marginBottom: 'var(--space-lg)', display: 'inline-flex' }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>Privacy Policy</h1>

        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: 'var(--space-lg)' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' }}>1. Information We Collect</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            When you register for Share Link Gan, we collect basic profile information through Google OAuth, including your name, email address, and profile picture. We also store the links and social media handles you choose to add to your public profile.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            We use your information solely to provide and improve the Share Link Gan service. Your public profile data is visible to anyone who visits your unique link. We do not sell your personal data to third parties.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>3. Analytics & Tracking</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            We use standard analytics tools (like Vercel Analytics) to understand how our website is used and to improve performance. This may involve the collection of anonymized usage data and IP addresses for localization purposes.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>4. Data Security</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            Your data is stored securely using Supabase. We implement standard security measures to protect against unauthorized access, alteration, or destruction of your personal information.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>5. Contact Us</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            If you have any questions about this Privacy Policy, please contact us at privacy@sharelinkgan.example.com.
          </p>
        </div>
      </div>
    </div>
  );
}
