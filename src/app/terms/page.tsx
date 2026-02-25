import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="landing" data-theme="dark" style={{ display: 'block', textAlign: 'left', padding: 'var(--space-2xl) var(--space-md)' }}>
      <div className="container" style={{ marginTop: '5vh' }}>
        <Link href="/" className="btn btn-ghost" style={{ marginBottom: 'var(--space-lg)', display: 'inline-flex' }}>
          ← Back to Home
        </Link>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>Terms of Service</h1>

        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
          <p style={{ marginBottom: 'var(--space-lg)' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-2xl)', marginBottom: 'var(--space-md)' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            By accessing and using Share Link Gan, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>2. Description of Service</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            Share Link Gan provides a platform for users to create a single, customizable bio-link page to host multiple links. The service is provided "as is" and we reserve the right to modify, suspend, or discontinue the service at any time.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>3. User Conduct</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            You are entirely responsible for the content of, and any harm resulting from, your links. You agree not to use the service to host malicious content, spam, or materials that violate any applicable laws or intellectual property rights. We reserve the right to terminate accounts that violate these guidelines.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>4. Account Security</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            Authentication is handled via Google OAuth. You are responsible for maintaining the security of your Google account to ensure the safety of your Share Link Gan profile.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>5. Changes to Terms</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>
            We reserve the right to modify these terms from time to time at our sole discretion. Your continued use of the service following any changes indicates your acceptance of the new terms.
          </p>
        </div>
      </div>
    </div>
  );
}
