/**
 * lib/supabase/types.ts
 * Manual TypeScript type definitions for the Supabase database schema.
 * Based on SRS v1.2.0 §4.1–4.3.
 *
 * Shaped to match supabase-js v2 GenericTable/GenericSchema requirements:
 * - Each Table entry must include `Relationships: []`
 * - Functions must include `Args` and `Returns`
 */

export type PostStatus = 'draft' | 'published'
export type BackgroundType = 'image' | 'color'

// ---------------------------------------------------------------------------
// Row types — represent a full row as returned from a SELECT *
// ---------------------------------------------------------------------------

export type PostRow = {
  id: string                  // UUID
  title: string
  slug: string
  excerpt: string | null
  content_html: string | null
  cover_image_url: string | null
  category: string | null
  tags: string[]
  status: PostStatus
  view_count: number
  published_at: string | null // TIMESTAMPTZ serialised as ISO string
  deleted_at: string | null   // TIMESTAMPTZ — null means not soft-deleted
  meta_title: string | null
  meta_description: string | null
  author_id: string | null    // UUID referencing auth.users
  created_at: string          // TIMESTAMPTZ
  updated_at: string          // TIMESTAMPTZ
  fts: unknown | null         // TSVECTOR — opaque from the client side
}

export type SiteSettingsRow = {
  id: number                   // Always 1 (singleton row)
  site_title: string
  bio: string | null
  avatar_url: string | null
  background_type: BackgroundType
  background_value: string     // CSS colour string or Supabase Storage URL
  updated_at: string           // TIMESTAMPTZ
  music_url: string | null     // Public URL of the audio file
  music_title: string | null   // Display name for the song / artist
  music_enabled: boolean       // Whether the floating player is shown
}

export type CommentRow = {
  id: string                   // UUID
  post_id: string              // UUID → posts.id
  commenter_name: string
  body: string
  is_approved: boolean | null
  ip_address: string | null
  honeypot_triggered: boolean
  deleted_at: string | null    // TIMESTAMPTZ — null means not soft-deleted
  created_at: string           // TIMESTAMPTZ
}

// ---------------------------------------------------------------------------
// Insert types — omit server-generated fields when creating rows
// ---------------------------------------------------------------------------

export type PostInsert = {
  title: string
  slug: string
  excerpt?: string | null
  content_html?: string | null
  cover_image_url?: string | null
  category?: string | null
  tags?: string[]
  status?: PostStatus
  view_count?: number
  published_at?: string | null
  deleted_at?: string | null
  meta_title?: string | null
  meta_description?: string | null
  author_id?: string | null
  id?: string
}

export type PostUpdate = {
  title?: string
  slug?: string
  excerpt?: string | null
  content_html?: string | null
  cover_image_url?: string | null
  category?: string | null
  tags?: string[]
  status?: PostStatus
  view_count?: number
  published_at?: string | null
  deleted_at?: string | null
  meta_title?: string | null
  meta_description?: string | null
  author_id?: string | null
}

export type CommentInsert = {
  post_id: string
  commenter_name: string
  body: string
  is_approved?: boolean | null
  ip_address?: string | null
  honeypot_triggered?: boolean
  deleted_at?: string | null
  id?: string
}

export type CommentUpdate = {
  post_id?: string
  commenter_name?: string
  body?: string
  is_approved?: boolean | null
  ip_address?: string | null
  honeypot_triggered?: boolean
  deleted_at?: string | null
}

export type SiteSettingsUpdate = {
  site_title?: string
  bio?: string | null
  avatar_url?: string | null
  background_type?: BackgroundType
  background_value?: string
  music_url?: string | null
  music_title?: string | null
  music_enabled?: boolean
}

// ---------------------------------------------------------------------------
// Database — the root type passed to createBrowserClient / createServerClient
// Shaped to match supabase-js v2 GenericSchema / GenericTable requirements.
// Each table MUST include `Relationships: []` for supabase-js v2.39+.
// ---------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: PostRow
        Insert: PostInsert
        Update: PostUpdate
        Relationships: []
      }
      site_settings: {
        Row: SiteSettingsRow
        Insert: {
          id?: number
          site_title?: string
          bio?: string | null
          avatar_url?: string | null
          background_type?: BackgroundType
          background_value?: string
          updated_at?: string
          music_url?: string | null
          music_title?: string | null
          music_enabled?: boolean
        }
        Update: SiteSettingsUpdate
        Relationships: []
      }
      comments: {
        Row: CommentRow
        Insert: CommentInsert
        Update: CommentUpdate
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ---------------------------------------------------------------------------
// Convenience aliases used throughout the codebase
// ---------------------------------------------------------------------------

/** A published, non-deleted post — as returned by public queries */
export type Post = PostRow
export type SiteSettings = SiteSettingsRow
export type Comment = CommentRow

/** Data required to create or update a post from the admin editor */
export type PostFormData = {
  title: string
  slug: string
  excerpt: string
  content_html: string
  cover_image_url: string
  category: string
  tags: string[]
  status: PostStatus
  meta_title: string
  meta_description: string
}
