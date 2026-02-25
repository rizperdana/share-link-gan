import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="container-sm">
        <Link href="/" className="legal-back">
          ← Back to Home
        </Link>
        <h1>Privacy Policy</h1>

        <p>Last updated: February 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          When you register for ShareLinkGan, we collect basic profile
          information through Google OAuth, including your name, email address,
          and profile picture. We also store the links and social media handles
          you choose to add to your public profile.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information solely to provide and improve the ShareLinkGan
          service. Your public profile data is visible to anyone who visits your
          unique link. We do not sell your personal data to third parties.
        </p>

        <h2>3. Analytics & Tracking</h2>
        <p>
          We use standard analytics tools to understand how our website is used
          and to improve performance. This may involve the collection of
          anonymized usage data and IP addresses for localization purposes.
        </p>

        <h2>4. Data Security</h2>
        <p>
          Your data is stored securely using Supabase. We implement standard
          security measures to protect against unauthorized access, alteration,
          or destruction of your personal information.
        </p>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          through our website.
        </p>
      </div>
    </div>
  );
}
