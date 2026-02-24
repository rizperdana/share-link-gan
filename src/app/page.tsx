import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing">
      <h1 className="landing-logo animate-fade-in-up">Share Link Gan</h1>
      <p className="landing-tagline animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        Your personal link hub. Share all your important links in one beautiful page.
      </p>
      <div className="landing-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Link href="/register" className="btn btn-primary">
          Get Started — It&apos;s Free
        </Link>
        <Link href="/login" className="btn btn-secondary">
          Sign In
        </Link>
      </div>
    </div>
  );
}
