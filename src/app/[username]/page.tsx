import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio')
    .eq('username', username)
    .single();

  if (!profile) {
    return { title: 'User Not Found' };
  }

  return {
    title: `${profile.display_name || username} — Share Link Gan`,
    description: profile.bio || `Check out ${profile.display_name || username}'s links`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (!profile) {
    notFound();
  }

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  const initials = (profile.display_name || profile.username)
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Avatar */}
        <div className="profile-avatar animate-fade-in-up">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.display_name || profile.username} />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div className="profile-info animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="profile-name">{profile.display_name || profile.username}</h1>
          <p className="profile-username">@{profile.username}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>

        {/* Links */}
        <div className="profile-links">
          {links && links.length > 0 ? (
            links.map((link, index) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link-card"
                style={{ animationDelay: `${0.15 + index * 0.08}s` }}
              >
                <span className="profile-link-icon">{link.icon}</span>
                <span className="profile-link-title">{link.title}</span>
                <span className="profile-link-arrow">→</span>
              </a>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-2xl)' }}>
              <p>No links yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="profile-footer animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p>
            Powered by <a href="/">Share Link Gan</a>
          </p>
        </div>
      </div>
    </div>
  );
}
