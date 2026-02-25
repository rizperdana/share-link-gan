-- ============================================
-- Share Link Gan — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'light',
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT DEFAULT '🔗',
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can modify
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Links: anyone can read active links, only owner can modify
CREATE POLICY "Active links are viewable by everyone"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own links"
  ON links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own links"
  ON links FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_links_sort_order ON links(user_id, sort_order);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE links ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================
-- Phase 1: Link Enhancements
-- ============================================
ALTER TABLE links ADD COLUMN IF NOT EXISTS scheduled_start TIMESTAMPTZ;
ALTER TABLE links ADD COLUMN IF NOT EXISTS scheduled_end TIMESTAMPTZ;
ALTER TABLE links ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;
ALTER TABLE links ADD COLUMN IF NOT EXISTS private_pin TEXT;

-- ============================================
-- Phase 2: Profile Settings
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS hide_branding BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_footer_text TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_footer_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_sensitive BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enable_subscribers BOOLEAN DEFAULT false;

-- ============================================
-- Phase 3: Analytics
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  device TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_profile ON analytics_events(profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_link ON analytics_events(link_id, created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics_events FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Anyone can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Phase 4: Subscribers
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, email)
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscribers"
  ON subscribers FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT WITH CHECK (true);

-- ============================================
-- Phase 5: Posts
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts viewable by everyone"
  ON posts FOR SELECT USING (is_published = true OR auth.uid() = profile_id);

CREATE POLICY "Users can manage own posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = profile_id);

