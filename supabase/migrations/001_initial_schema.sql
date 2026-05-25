-- =============================================================================
-- Kak Rahma Blog — Initial Schema Migration
-- SRS v1.2.0 §4.1–4.5
-- Run this file in the Supabase SQL Editor or via the Supabase CLI.
-- All statements use CREATE IF NOT EXISTS / CREATE OR REPLACE for idempotency.
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- supports GIN full-text search

-- =============================================================================
-- SHARED TRIGGER FUNCTION — handle_updated_at
-- Automatically stamps updated_at on any table that has this trigger.
-- =============================================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- TABLE: posts — SRS §4.1
-- =============================================================================
CREATE TABLE IF NOT EXISTS posts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  slug             TEXT        NOT NULL UNIQUE,
  excerpt          TEXT,
  content_html     TEXT,
  cover_image_url  TEXT,
  category         TEXT,
  tags             TEXT[]      NOT NULL DEFAULT '{}',
  status           TEXT        NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft', 'published')),
  view_count       INTEGER     NOT NULL DEFAULT 0,
  published_at     TIMESTAMPTZ,
  deleted_at       TIMESTAMPTZ,            -- soft-delete sentinel (SRS RULE 2)
  meta_title       TEXT,
  meta_description TEXT,
  author_id        UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Full-text search vector (GIN-indexed computed column updated by trigger)
  fts              TSVECTOR
);

-- Indexes on posts — SRS §4.1
CREATE INDEX IF NOT EXISTS idx_posts_slug         ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_posts_status        ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at  ON posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category      ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at    ON posts (deleted_at);
CREATE INDEX IF NOT EXISTS idx_posts_fts           ON posts USING GIN (fts);

-- updated_at trigger on posts
DROP TRIGGER IF EXISTS set_posts_updated_at ON posts;
CREATE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- FTS trigger: keeps the fts column in sync with title + excerpt + content
CREATE OR REPLACE FUNCTION update_posts_fts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('indonesian', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('indonesian', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('indonesian', coalesce(NEW.content_html, '')), 'C');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_fts_update ON posts;
CREATE TRIGGER posts_fts_update
  BEFORE INSERT OR UPDATE OF title, excerpt, content_html ON posts
  FOR EACH ROW EXECUTE FUNCTION update_posts_fts();

-- Enable Row Level Security on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: anonymous/public may only read published, non-soft-deleted posts
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND deleted_at IS NULL
  );

-- RLS Policy: authenticated admin can do everything (service role bypasses RLS)
DROP POLICY IF EXISTS "Authenticated users have full access to posts" ON posts;
CREATE POLICY "Authenticated users have full access to posts"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- TABLE: site_settings — SRS §4.2
-- Singleton row (id = 1). Stores background, bio, avatar, and site title.
-- =============================================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id               INTEGER     PRIMARY KEY DEFAULT 1,
  site_title       TEXT        NOT NULL DEFAULT 'Kak Rahma Blog',
  bio              TEXT,
  avatar_url       TEXT,
  background_type  TEXT        NOT NULL DEFAULT 'color'
                               CHECK (background_type IN ('image', 'color')),
  background_value TEXT        NOT NULL DEFAULT '#0f0c29',
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- updated_at trigger on site_settings
DROP TRIGGER IF EXISTS set_site_settings_updated_at ON site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Seed the singleton row if not already present
INSERT INTO site_settings (id, site_title, bio, background_type, background_value)
VALUES (1, 'Kak Rahma Blog', 'Selamat datang di blog Kak Rahma.', 'color', '#0f0c29')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site_settings (needed for navbar logo, sidebar bio, background)
DROP POLICY IF EXISTS "Public can read site_settings" ON site_settings;
CREATE POLICY "Public can read site_settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated admin can modify site_settings
DROP POLICY IF EXISTS "Authenticated users can update site_settings" ON site_settings;
CREATE POLICY "Authenticated users can update site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- TABLE: comments — SRS §4.3
-- =============================================================================
CREATE TABLE IF NOT EXISTS comments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id           UUID        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  commenter_name    TEXT        NOT NULL CHECK (length(commenter_name) BETWEEN 2 AND 80),
  body              TEXT        NOT NULL CHECK (length(body) BETWEEN 5 AND 2000),
  is_approved       BOOLEAN     NOT NULL DEFAULT false,
  ip_address        TEXT,
  honeypot_triggered BOOLEAN   NOT NULL DEFAULT false,
  deleted_at        TIMESTAMPTZ,           -- soft-delete sentinel (SRS RULE 2)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes on comments — SRS §4.3
CREATE INDEX IF NOT EXISTS idx_comments_post_id    ON comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments (is_approved);
CREATE INDEX IF NOT EXISTS idx_comments_deleted     ON comments (deleted_at);  -- SRS §4.3 requires this

-- Enable RLS on comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can read approved, non-soft-deleted comments
DROP POLICY IF EXISTS "Public can read approved comments" ON comments;
CREATE POLICY "Public can read approved comments"
  ON comments FOR SELECT
  TO anon, authenticated
  USING (
    is_approved = true
    AND deleted_at IS NULL
  );

-- Anonymous users can insert new comments (moderated — inserts with is_approved = false)
DROP POLICY IF EXISTS "Anon can insert comments" ON comments;
CREATE POLICY "Anon can insert comments"
  ON comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated admin can do everything on comments
DROP POLICY IF EXISTS "Authenticated users have full access to comments" ON comments;
CREATE POLICY "Authenticated users have full access to comments"
  ON comments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- RPC: increment_view_count — SRS §4.4
-- Called client-side (anon role). Guards: status = 'published' AND deleted_at IS NULL.
-- SECURITY DEFINER: runs as the function owner (elevated), but inputs are validated.
-- =============================================================================
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Guard: only increment if the post is published and not soft-deleted.
  -- This prevents view inflation on drafts or trashed posts.
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id
    AND status = 'published'
    AND deleted_at IS NULL;
END;
$$;

-- Grant anon role permission to call the RPC from the browser client
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon;

-- =============================================================================
-- STORAGE — SRS §4.5
-- Create the posts-images bucket (public read, authenticated write).
-- Note: Supabase Storage bucket creation via SQL requires the storage schema.
-- Run these in the Supabase Dashboard → SQL Editor if the storage extension
-- is not yet available in migrations, OR use the Dashboard UI to create the bucket
-- and apply only the RLS policies below.
-- =============================================================================

-- Create bucket if it does not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts-images',
  'posts-images',
  true,           -- public bucket: all objects are publicly readable
  5242880,        -- 5 MB hard cap at storage layer (application also enforces 1 MB after compression)
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: authenticated users can upload (INSERT) to posts-images
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'posts-images');

-- Storage RLS: authenticated users can update (replace) their uploads
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'posts-images');

-- Storage RLS: authenticated users can delete images
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'posts-images');

-- Storage RLS: public (anon) can read/download all images in the bucket
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
CREATE POLICY "Public can read images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'posts-images');
