import Link from "next/link";

export default function Home() {
  return (
    <div className="landing" data-theme="dark">
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <img src="/icon.svg" width={96} height={96} alt="Share Link Gan Logo" style={{ borderRadius: '24px', boxShadow: 'var(--shadow-glow)' }}/>
        </div>

        <h1 className="landing-logo animate-fade-in-up">
          Share Link Gan
        </h1>

        <p className="landing-tagline animate-fade-in-up" style={{ animationDelay: '0.1s', fontSize: '1.25rem', margin: '0 auto 2.5rem', maxWidth: '600px', lineHeight: '1.6' }}>
          One link to rule them all. Connect your audiences to all of your content with just one click. <br/> Highly personalizable, forever free.
        </p>

        {/* Call To Actions */}
        <div className="landing-actions animate-fade-in-up" style={{ animationDelay: '0.2s', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/register" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Claim your Link Now
          </Link>
          <Link href="/login" className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Login to Dashboard
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="container-wide animate-fade-in-up" style={{ animationDelay: '0.3s', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>

          <div className="card card-glass">
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎨</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Premium Themes</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Match your brand perfectly with stunning presets like Glassmorphism, Neon, and Minimal.</p>
          </div>

          <div className="card card-glass">
             <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔗</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Unlimited Links</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Add as many links as you want. Embed thumbnails, social icons, and reorder them flawlessly.</p>
          </div>

          <div className="card card-glass">
             <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Lightning Fast</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Built on Next.js 14 and edge infrastructure for instant load times globally.</p>
          </div>

        </div>

        {/* Footer */}
        <footer style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>© {new Date().getFullYear()} Share Link Gan. Inspired by Linktree.</p>
          <p style={{ marginTop: '0.5rem' }}>Deployed on <a href="https://vercel.com" style={{ color: 'white' }} target="_blank" rel="noreferrer">Vercel</a></p>
        </footer>
      </div>
    </div>
  );
}
