import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <div className="container-sm">
        <Link href="/" className="legal-back">
          ← Back to Home
        </Link>
        <h1>Terms of Service</h1>

        <p>Last updated: February 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using ShareLinkGan, you accept and agree to be bound
          by the terms and provisions of this agreement.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          ShareLinkGan provides a platform for users to create a single,
          customizable bio-link page to host multiple links. The service is
          provided &quot;as is&quot; and we reserve the right to modify,
          suspend, or discontinue the service at any time.
        </p>

        <h2>3. User Conduct</h2>
        <p>
          You are responsible for all content you publish through ShareLinkGan.
          You agree not to use the service to host malicious content, spam, or
          materials that violate any applicable laws or intellectual property
          rights.
        </p>

        <h2>4. Account Security</h2>
        <p>
          Authentication is handled via Google OAuth. You are responsible for
          maintaining the security of your Google account to ensure the safety
          of your ShareLinkGan profile.
        </p>

        <h2>5. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms from time to time. Your
          continued use of the service following any changes indicates your
          acceptance of the new terms.
        </p>
      </div>
    </div>
  );
}
