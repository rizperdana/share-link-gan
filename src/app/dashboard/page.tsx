'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Profile, Link as LinkType } from '@/lib/types';
import MobilePreview from '@/components/MobilePreview';

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAppearanceModal, setShowAppearanceModal] = useState(false);
  const [showSocialsModal, setShowSocialsModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  // Form states
  const [linkForm, setLinkForm] = useState({ title: '', url: '', icon: '🔗', image_url: '' });
  const [profileForm, setProfileForm] = useState({ username: '', display_name: '', bio: '', avatar_url: '', theme: 'dark', social_links: {} as Record<string, string> });
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      console.log("fetchData started");
      const { data, error: authError } = await supabase.auth.getUser();
      console.log("getUser finished:", { data, authError });

      const user = data?.user;

      if (!user) {
        console.log("No user, redirecting to login");
        router.push('/login');
        return;
      }

      console.log("Getting profile for:", user?.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id || '')
        .single();

      console.log("Profile fetch result:", { profileData, profileError });

      if (profileData) {
        setProfile(profileData);
        setProfileForm({
          username: profileData.username || '',
          display_name: profileData.display_name || '',
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || '',
          theme: profileData.theme || 'dark',
          social_links: profileData.social_links || {},
        });
      } else {
        // Auto-provision if profile is missing
        console.log("Profile missing, auto-provisioning");
        const emailPrefix = user?.email?.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '') || 'user';
        const randomSuffix = Math.floor(Math.random() * 10000);
        const generatedUsername = `${emailPrefix}_${randomSuffix}`;

        const newProfile = {
          id: user?.id || '',
          username: generatedUsername,
          display_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || '',
        };

        const { error: insertError } = await supabase.from('profiles').insert(newProfile);

        if (insertError) {
          console.error('Failed to auto-provision profile:', insertError.message, insertError.code, insertError.details);
          setFatalError(`Failed to create your profile: ${insertError.message} (Code: ${insertError.code})`);
          setLoading(false);
          return;
        } else {
          setProfile({
            ...newProfile,
            bio: null,
            created_at: new Date().toISOString()
          });
          setProfileForm({
            username: newProfile.username,
            display_name: newProfile.display_name,
            bio: '',
            avatar_url: newProfile.avatar_url,
            theme: 'dark',
            social_links: {},
          });
        }
      }

      console.log("Getting links for:", user?.id);
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user?.id || '')
        .order('sort_order', { ascending: true });

      if (linksError) {
        console.error("Failed to fetch links:", linksError);
      }

      console.log("Links found:", linksData?.length);
      if (linksData) setLinks(linksData);
      setLoading(false);
    } catch (err: any) {
      console.error("CRASH IN FETCHDATA:", err);
      setFatalError(err.message || String(err));
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Link CRUD ---

  const openAddLink = () => {
    setEditingLink(null);
    setLinkForm({ title: '', url: '', icon: '🔗', image_url: '' });
    setShowLinkModal(true);
  };

  const openEditLink = (link: LinkType) => {
    setEditingLink(link);
    setLinkForm({ title: link.title, url: link.url, icon: link.icon, image_url: link.image_url || '' });
    setShowLinkModal(true);
  };

  const saveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let url = linkForm.url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (editingLink) {
      const { error } = await supabase
        .from('links')
        .update({ title: linkForm.title, url, icon: linkForm.icon, image_url: linkForm.image_url })
        .eq('id', editingLink?.id || '');

      if (error) {
        showMessage('error', error.message);
      } else {
        showMessage('success', 'Link updated!');
      }
    } else {
      const maxOrder = links.length > 0 ? Math.max(...links.map(l => l.sort_order)) + 1 : 0;
      const { error } = await supabase
        .from('links')
        .insert({
          user_id: profile?.id || '',
          title: linkForm.title,
          url,
          icon: linkForm.icon,
          image_url: linkForm.image_url,
          sort_order: maxOrder,
        });

      if (error) {
        showMessage('error', error.message);
      } else {
        showMessage('success', 'Link added!');
      }
    }

    setSaving(false);
    setShowLinkModal(false);
    fetchData();
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this link?')) return;

    const { error } = await supabase.from('links').delete().eq('id', id);
    if (error) {
      showMessage('error', error.message);
    } else {
      showMessage('success', 'Link deleted!');
      fetchData();
    }
  };

  const toggleLink = async (link: LinkType) => {
    const { error } = await supabase
      .from('links')
      .update({ is_active: !link.is_active })
      .eq('id', link?.id || '');

    if (error) {
      showMessage('error', error.message);
    } else {
      fetchData();
    }
  };

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    const newLinks = [...links];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newLinks.length) return;

    // Swap sort orders
    const tempOrder = newLinks[index].sort_order;
    newLinks[index].sort_order = newLinks[swapIndex].sort_order;
    newLinks[swapIndex].sort_order = tempOrder;

    await supabase
      .from('links')
      .update({ sort_order: newLinks[index].sort_order })
      .eq('id', newLinks[index]?.id || '');

    await supabase
      .from('links')
      .update({ sort_order: newLinks[swapIndex].sort_order })
      .eq('id', newLinks[swapIndex]?.id || '');

    fetchData();
  };

  // --- Profile ---

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        username: profileForm.username.toLowerCase(),
        display_name: profileForm.display_name,
        bio: profileForm.bio,
        avatar_url: profileForm.avatar_url,
        theme: profileForm.theme,
        social_links: profileForm.social_links,
      })
      .eq('id', profile?.id || '');

    if (error) {
      showMessage('error', error.message);
    } else {
      showMessage('success', 'Profile updated!');
    }

    setSaving(false);
    setShowProfileModal(false);
    setShowAppearanceModal(false);
    setShowSocialsModal(false);
    fetchData();
  };

  // --- Auth ---

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (fatalError) {
    return (
      <div className="auth-page">
        <div className="card" style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>Dashboard Error</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{fatalError}</p>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout & Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="auth-page">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-layout">
        <div className="dashboard-editor">
          <div className="container-wide">
            {/* Header */}
        <div className="dashboard-header animate-fade-in">
          <div>
            <h1>Dashboard</h1>
            {profile && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                Your page:{' '}
                <a
                  href={`/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-purple)' }}
                >
                  /{profile.username}
                </a>
              </p>
            )}
          </div>
          <div className="dashboard-nav">
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setProfileForm({
                username: profile?.username || '',
                display_name: profile?.display_name || '',
                bio: profile?.bio || '',
                avatar_url: profile?.avatar_url || '',
                theme: profile?.theme || 'dark',
                social_links: profile?.social_links || {},
              });
              setShowProfileModal(true);
            }}>
              ✏️ Profile
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setProfileForm({
                username: profile?.username || '',
                display_name: profile?.display_name || '',
                bio: profile?.bio || '',
                avatar_url: profile?.avatar_url || '',
                theme: profile?.theme || 'dark',
                social_links: profile?.social_links || {},
              });
              setShowAppearanceModal(true);
            }}>
              🎨 Appearance
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => {
              setProfileForm({
                username: profile?.username || '',
                display_name: profile?.display_name || '',
                bio: profile?.bio || '',
                avatar_url: profile?.avatar_url || '',
                theme: profile?.theme || 'dark',
                social_links: profile?.social_links || {},
              });
              setShowSocialsModal(true);
            }}>
              🔗 Socials
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {/* Links Section */}
        <div className="dashboard-section animate-fade-in-up">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h2 style={{ margin: 0 }}>Your Links</h2>
            <button className="btn btn-primary btn-sm" onClick={openAddLink}>
              + Add Link
            </button>
          </div>

          {links.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📎</p>
              <p>No links yet. Add your first link!</p>
            </div>
          ) : (
            <div className="link-list">
              {links.map((link, index) => (
                <div key={link?.id || index} className={`link-item ${!link?.is_active ? 'link-item-inactive' : ''}`}>
                  <span className="link-item-icon">{link?.icon}</span>
                  <div className="link-item-content">
                    <div className="link-item-title">{link?.title}</div>
                    <div className="link-item-url">{link?.url}</div>
                  </div>
                  <div className="link-item-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => moveLink(index, 'down')}
                      disabled={index === links.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <label className="toggle" title="Toggle active">
                      <input
                        type="checkbox"
                        checked={link?.is_active || false}
                        onChange={() => toggleLink(link)}
                      />
                      <span className="toggle-slider" />
                    </label>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEditLink(link)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteLink(link?.id || '')} title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </div>
        </div>

        <div className="dashboard-preview-container">
          <MobilePreview profileForm={profileForm} links={links} />
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      {showLinkModal && (
        <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingLink ? 'Edit Link' : 'Add New Link'}</h2>
            <form onSubmit={saveLink}>
              <div className="form-group">
                <label className="form-label" htmlFor="link-icon">Icon (emoji)</label>
                <input
                  id="link-icon"
                  type="text"
                  className="form-input"
                  placeholder="🔗"
                  value={linkForm.icon}
                  onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })}
                  maxLength={2}
                  style={{ width: '80px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="link-title">Title</label>
                <input
                  id="link-title"
                  type="text"
                  className="form-input"
                  placeholder="My Website"
                  value={linkForm.title}
                  onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="link-url">URL</label>
                <input
                  id="link-url"
                  type="text"
                  className="form-input"
                  placeholder="https://example.com"
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="link-image">Thumbnail Image URL (optional)</label>
                <input
                  id="link-image"
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                  value={linkForm.image_url}
                  onChange={(e) => setLinkForm({ ...linkForm, image_url: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLinkModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : editingLink ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-username">Username</label>
                <input
                  id="profile-username"
                  type="text"
                  className="form-input"
                  placeholder="yourname"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') })}
                  required
                  minLength={3}
                  maxLength={30}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-display-name">Display Name</label>
                <input
                  id="profile-display-name"
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={profileForm.display_name}
                  onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-bio">Bio</label>
                <textarea
                  id="profile-bio"
                  className="form-input"
                  placeholder="Tell something about yourself..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-avatar">Avatar URL</label>
                <input
                  id="profile-avatar"
                  type="text"
                  className="form-input"
                  placeholder="https://example.com/avatar.jpg"
                  value={profileForm.avatar_url}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar_url: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appearance Modal */}
      {showAppearanceModal && (
        <div className="modal-overlay" onClick={() => setShowAppearanceModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Theme & Appearance</h2>
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-theme">Theme Template</label>
                <select
                  id="profile-theme"
                  className="form-input"
                  value={profileForm.theme}
                  onChange={(e) => setProfileForm({ ...profileForm, theme: e.target.value })}
                >
                  <option value="dark">Dark (Default)</option>
                  <option value="light">Light</option>
                  <option value="neon">Neon Cipher</option>
                  <option value="glass">Glassmorphism</option>
                </select>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Note: You can see full previews of Themes adjusting in real-time in the Mobile Preview pane.</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAppearanceModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Save Appearance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Socials Modal */}
      {showSocialsModal && (
        <div className="modal-overlay" onClick={() => setShowSocialsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Social Links</h2>
            <form onSubmit={saveProfile}>
              <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Link your social media profiles to display custom icons below your avatar.</p>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-social-twitter">Twitter / X</label>
                <input
                  id="profile-social-twitter"
                  type="text"
                  className="form-input"
                  placeholder="https://twitter.com/yourname"
                  value={profileForm.social_links?.twitter || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, twitter: e.target.value } })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-social-instagram">Instagram</label>
                <input
                  id="profile-social-instagram"
                  type="text"
                  className="form-input"
                  placeholder="https://instagram.com/yourname"
                  value={profileForm.social_links?.instagram || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, instagram: e.target.value } })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-social-github">GitHub</label>
                <input
                  id="profile-social-github"
                  type="text"
                  className="form-input"
                  placeholder="https://github.com/yourname"
                  value={profileForm.social_links?.github || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, github: e.target.value } })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-social-linkedin">LinkedIn</label>
                <input
                  id="profile-social-linkedin"
                  type="text"
                  className="form-input"
                  placeholder="https://linkedin.com/in/yourname"
                  value={profileForm.social_links?.linkedin || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, linkedin: e.target.value } })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSocialsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Save Social Links'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
