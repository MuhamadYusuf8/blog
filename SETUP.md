# Kak Rahma Blog — Developer Setup Guide

## Prerequisites

- Node.js ≥ 18.17
- A Supabase project (free tier is fine)
- A Vercel account (for deployment)
- An hCaptcha account (free tier)

---

## 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd kakrahma
npm install
```

---

## 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Never prefix with `NEXT_PUBLIC_`. Found in Supabase → Project Settings → API |
| `DRAFT_PREVIEW_SECRET` | Generate with: `openssl rand -hex 32` |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | From hCaptcha dashboard → Sites |
| `HCAPTCHA_SECRET_KEY` | From hCaptcha dashboard → Settings |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL, e.g. `https://kakrahma.com` (no trailing slash) |

---

## 3. Run SQL Migration

In your Supabase project, open the **SQL Editor** and run:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, triggers, RLS policies, Storage bucket, and the `increment_view_count` RPC.

**Alternatively**, if you have the Supabase CLI installed:

```bash
supabase db push
```

---

## 4. Supabase Storage Bucket Setup

The SQL migration creates the `posts-images` bucket automatically. Verify in your Supabase dashboard:

1. Go to **Storage** → confirm `posts-images` bucket exists
2. Confirm the bucket is set to **Public**
3. Confirm the Storage RLS policies were created (INSERT for authenticated, SELECT for all)

---

## 5. Supabase Auth Configuration (Dashboard Only)

These settings **cannot be set via code** — they must be configured in the Supabase Dashboard:

### 5a. Enable Email Auth
- Go to **Authentication → Providers → Email**
- Enable "Email" provider
- **Disable** "Confirm email" (the admin is a single known user)
- **Disable** "Enable sign-ups" — this prevents strangers from creating accounts

### 5b. Auth Rate Limiting
- Go to **Authentication → Rate Limits**
- Set **"Sign in attempts per hour"** to `10` or lower
- This is the third layer of the three-layer auth security stack

### 5c. hCaptcha Integration
- Go to **Authentication → Security → CAPTCHA protection**
- Enable CAPTCHA
- Select **hCaptcha**
- Enter your `HCAPTCHA_SECRET_KEY`

### 5d. Create Your Admin User
- Go to **Authentication → Users → Add User**
- Enter your admin email and a strong password
- You will use these credentials to log into `/admin/login`

---

## 6. Run Locally

```bash
npm run dev
```

Visit:
- Public blog: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

---

## 7. Draft Preview Mode

To preview a draft post as an admin:

1. In the PostsTable, click **👁 Preview** on any draft post
2. This constructs the URL: `/api/preview?secret=YOUR_DRAFT_PREVIEW_SECRET&slug=your-post-slug`
3. The page loads with a yellow **DRAFT PREVIEW** banner
4. Click **Exit Preview** to return to normal mode

The `DRAFT_PREVIEW_SECRET` must match the value in your `.env.local`.

---

## 8. Vercel Deployment

### 8a. Deploy

```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### 8b. Required Environment Variables on Vercel

In **Vercel → Project → Settings → Environment Variables**, add **all** variables from `.env.local.example`. Pay special attention to:

- `NEXT_PUBLIC_SITE_URL` — set to your actual production domain (e.g. `https://kakrahma.com`)
- `SUPABASE_SERVICE_ROLE_KEY` — mark as **Server-only** (not exposed to the browser)

### 8c. Enable Vercel Analytics

In **Vercel → Project → Analytics**, click **Enable**. The `<Analytics />` component in `app/layout.tsx` will start reporting automatically.

---

## 9. Post-Deployment Checklist

- [ ] Submit sitemap to Google Search Console: `https://yourdomain.com/sitemap.xml`
- [ ] Verify RSS feed in a feed reader: `https://yourdomain.com/feed.xml`
- [ ] Test draft preview flow end-to-end
- [ ] Test comment submission and moderation
- [ ] Confirm `/admin/login` rate limiting works (try 11 rapid requests — 11th should return 429)
- [ ] Confirm hCaptcha appears on login form
- [ ] Verify CSP headers with [securityheaders.com](https://securityheaders.com)
- [ ] Test mobile responsiveness at 375px width

---

## 10. Background Image

To set a background image via the admin:

1. Go to `/admin/settings`
2. Under **Site Background**, select the **Image** tab
3. Upload an image — it will be compressed to WebP automatically
4. Click **Apply Background**
5. The change reflects site-wide immediately (ISR revalidation)
