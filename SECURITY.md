# Security Audit — Kak Rahma Blog

## Architectural Rules Verification

This document confirms all 8 non-negotiable architectural rules from the SRS v1.2.0 are satisfied.

---

## RULE 1 — Glassmorphism on Every UI Surface ✅

All content-bearing containers use the Glassmorphism design system:

| Surface | Variant Used |
|---|---|
| Public pages (cards, sidebar, post page) | `.glass-panel` |
| Admin dashboard | `.glass-panel-dark` |
| Comment form, editor accent areas | `.glass-panel-accent` |
| `error.tsx` | `.glass-panel-error` |
| `not-found.tsx` | `.glass-panel` |

All four variants are registered as custom Tailwind utilities in `tailwind.config.ts`.

---

## RULE 2 — Soft Delete is the Only Delete Mechanism ✅

**Verification:** The string `supabase.from('posts').delete()` appears **ZERO times** in the codebase.
**Verification:** The string `supabase.from('comments').delete()` appears **ZERO times** in the codebase.

Soft-delete implementation:
- `softDeletePost()` in `app/admin/posts/actions.ts` → `UPDATE posts SET deleted_at = now()`
- `softDeleteComment()` in `app/admin/comments/actions.ts` → `UPDATE comments SET deleted_at = now()`
- All public queries include `.is('deleted_at', null)`
- RLS policies enforce this at the database level as a secondary safety net
- Admin UI labels the action "Move to Trash", not "Delete"
- Trash tab + Restore action present in both PostsTable and CommentModerationTable

---

## RULE 3 — DOMPurify Sanitization ✅

**Verification:** Every `dangerouslySetInnerHTML` call is preceded by `sanitizeHtml()`.

Location: `app/(public)/posts/[slug]/page.tsx`

```tsx
// Both the public path and Draft Mode path run through sanitization:
const sanitizedHtml = sanitizeHtml(post.content_html ?? '')
// ...
<article dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

Configuration in `lib/utils/sanitize.ts`:
- `FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form']`
- `FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']`
- Sanitization is at **render time**, not storage time (architecturally correct per §3.2.3)

---

## RULE 4 — Draft Mode Security Architecture ✅

**Service role client usage audit:**

| File | Uses service client? | Justified? |
|---|---|---|
| `app/(public)/posts/[slug]/page.tsx` | Yes — draft mode path only | ✅ Correct |
| `app/admin/posts/[id]/edit/page.tsx` | Yes — must fetch drafts | ✅ Correct |
| Any file in `components/` | No | ✅ Correct |
| Any `'use client'` file | No | ✅ Correct |

`SUPABASE_SERVICE_ROLE_KEY`:
- Never prefixed with `NEXT_PUBLIC_`
- Only referenced in server-side files
- JSDoc warning comment present in `lib/supabase/service.ts`

Draft Mode flow:
1. Admin clicks "👁 Preview" → URL: `/api/preview?secret=...&slug=...`
2. `/api/preview/route.ts` validates secret → `draftMode().enable()` → redirect to `/posts/[slug]`
3. `page.tsx` checks `draftMode().isEnabled` → uses service client → fetches draft post
4. Post is still filtered by `.is('deleted_at', null)`
5. `DOMPurify` sanitization applied before render
6. `DraftModeBanner` rendered (amber strip with "Exit Preview" link)
7. `ViewCounter` skipped in draft mode (`isDraft={true}` prop)
8. "Exit Preview" → `/api/exit-preview` → `draftMode().disable()` → redirect to `/`

---

## RULE 5 — Three-Layer Auth Security ✅

### Layer 1 — Middleware Rate Limiting
- File: `middleware.ts` (root)
- Max 10 requests to `/admin/login` per IP per 15 minutes
- Returns HTTP 429 with `Retry-After: 900` header on breach
- Uses in-memory `Map<string, { count: number; firstRequest: number }>`

### Layer 2 — hCaptcha on Login Form
- File: `app/admin/login/page.tsx`
- `@hcaptcha/react-hcaptcha` with `theme="dark"`
- `captchaToken` state required before form can submit
- Token passed to `supabase.auth.signInWithPassword({ options: { captchaToken } })`

### Layer 3 — Supabase Auth Rate Limiting
- Configured in Supabase Dashboard (not code)
- Documented in `SETUP.md` § 5b
- Settings: Authentication → Rate Limits → reduce sign-in attempts per hour

### Content-Security-Policy
- Configured in `next.config.js`
- Includes directives for: `default-src`, `script-src`, `style-src`, `img-src`, `connect-src`, `frame-src` (hCaptcha), `font-src`

---

## RULE 6 — Background System is Server-Side Only ✅

- Background fetched in `app/layout.tsx` as an `async` Server Component
- Applied as inline `style` prop on `<body>` element
- No `useEffect`, no client-side fetch, no child component fetch
- Prevents CLS (Cumulative Layout Shift) and hydration mismatches

---

## RULE 7 — Sitemap and RSS are Live Database Queries ✅

| File | Revalidation | Filter |
|---|---|---|
| `app/sitemap.ts` | `export const revalidate = 3600` | `.eq('status', 'published').is('deleted_at', null)` |
| `app/feed.xml/route.ts` | `export const revalidate = 3600` | `.eq('status', 'published').is('deleted_at', null)` |

RSS auto-discovery tag present in `app/layout.tsx`:
```html
<link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Kak Rahma RSS Feed" />
```

---

## RULE 8 — Error and Not-Found Pages are First-Class UI ✅

| File | Variant | role="alert" | Reset button | Notes |
|---|---|---|---|---|
| `app/error.tsx` | `.glass-panel-error` | ✅ | ✅ | `'use client'`, generic error message |
| `app/not-found.tsx` | `.glass-panel` | ✅ | N/A | Server Component, back-navigation link |

---

## Checklist Summary

- [x] No `DELETE` SQL in application code
- [x] `sanitizeHtml()` called before every `dangerouslySetInnerHTML`
- [x] Service role key is server-only, never in `NEXT_PUBLIC_` vars
- [x] `lib/supabase/service.ts` imported only in appropriate server files
- [x] Background fetched server-side in root layout
- [x] All 4 glass panel variants registered in Tailwind config
- [x] hCaptcha integrated on login form
- [x] Rate limiting in middleware for `/admin/login`
- [x] Sitemap and RSS use ISR + live DB queries
- [x] All `deleted_at IS NULL` filters present on public queries
