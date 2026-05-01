# Hoffman Tenants Advocacy Group

Full-stack Next.js 14 platform for HTAG: public marketing site, news/blog, resource library, member-only forum, and a complete newsletter system.

## Stack

- **Next.js 14** (App Router, server components)
- **TypeScript**
- **Tailwind CSS** with custom design tokens (sage / coral / cream / gold)
- **PostgreSQL** + **Prisma** ORM
- **NextAuth** (credentials + JWT sessions)
- **Resend** for newsletter delivery
- **bcryptjs** for password hashing
- **Zod** for input validation

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, NEXTAUTH_SECRET, RESEND_API_KEY

# 3. Set up database
npm run db:push          # creates tables
npm run db:seed          # creates default categories + admin user

# 4. Run
npm run dev
```

Visit http://localhost:3000.

**Default admin login:** `admin@hoffmantag.org` / `changeme123`
**Change this immediately** after first login (for now: directly in `prisma studio`).

## Environment variables

| Variable | What it's for |
|----------|---------------|
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Site URL (e.g. `https://hoffmantag.org`) |
| `RESEND_API_KEY` | From [resend.com](https://resend.com), domain-verified |
| `NEWSLETTER_FROM_EMAIL` | e.g. `newsletter@hoffmantag.org` |
| `NEWSLETTER_FROM_NAME` | Display name on emails |
| `NEXT_PUBLIC_SITE_URL` | Used in unsub/verify links — set to public URL |

## Project structure

```
src/
├── app/
│   ├── page.tsx                      # Homepage
│   ├── about/                        # Static about page
│   ├── news/                         # Public news list + detail
│   ├── resources/                    # Resources hub
│   ├── contact/                      # Contact form
│   ├── newsletter/                   # Public archive + signup
│   ├── community/                    # Forum (some routes auth-gated)
│   │   ├── page.tsx                  # Categories list
│   │   ├── [category]/               # Threads in category
│   │   ├── thread/[id]/              # Single thread + replies
│   │   └── new/                      # Compose new thread
│   ├── auth/                         # Sign in / sign up
│   ├── admin/                        # Admin dashboard (ADMIN/MOD only)
│   │   ├── posts/                    # News post management
│   │   ├── newsletter/               # Compose & send issues
│   │   └── moderation/               # Forum moderation
│   └── api/                          # All API routes
│       ├── auth/[...nextauth]/       # NextAuth handler
│       ├── auth/signup/              # Account creation
│       ├── posts/                    # News post CRUD
│       ├── forum/threads/            # Forum thread CRUD
│       ├── forum/replies/            # Forum reply CRUD
│       └── newsletter/               # Subscribe, verify, unsubscribe, send
├── components/
│   ├── nav.tsx                       # Top nav with mobile menu
│   ├── footer.tsx
│   └── newsletter-signup.tsx         # Reusable subscribe block
├── lib/
│   ├── db.ts                         # Prisma client singleton
│   ├── auth.ts                       # NextAuth config
│   └── email.ts                      # Resend wrapper
└── types/
    └── next-auth.d.ts                # Session type extensions

prisma/
├── schema.prisma                     # Full data model
└── seed.ts                           # Seed categories + admin
```

## Data model overview

- **User** — has a `Role` (TENANT, ADVOCATE, MODERATOR, ADMIN). Advocates get a verified ✓ badge in forum.
- **Post** — news/blog posts (homepage news cards pull from here).
- **Category / Thread / Reply** — forum hierarchy. Replies support nesting via `parentId`.
- **Resource** — library entries grouped by category and type (LEGAL/TEMPLATE/GUIDE/etc).
- **Subscriber** — newsletter list with double opt-in (`PENDING` → `ACTIVE`) and unsubscribe tokens.
- **NewsletterIssue** — drafts → SENT, with recipient counts.

## How the newsletter works

1. Visitor enters email on any `<NewsletterSignup>` form.
2. `POST /api/newsletter/subscribe` creates a `PENDING` subscriber and emails a verify link.
3. Subscriber clicks the link → `GET /api/newsletter/verify?token=...` flips them to `ACTIVE`.
4. Admin composes an issue at `/admin/newsletter`, hits "Save & send".
5. `POST /api/newsletter/send` loops all `ACTIVE` subscribers and sends via Resend.
6. Each email includes a `List-Unsubscribe` header and footer link → `/api/newsletter/unsubscribe`.

For larger lists (1000+) consider moving the send loop to a background job (Inngest, BullMQ, or a Resend batch send).

## Forum behavior

- All public reads are unauthenticated.
- Creating threads/replies requires an account.
- Locked threads block new replies.
- Pinned threads sort to the top of category pages.
- `ADVOCATE` role gets a visible badge to distinguish trusted answers in legal Q&A.

## Admin access

- Sign in as a user with `role: ADMIN` or `role: MODERATOR`.
- Visit `/admin`. Non-admins are redirected.
- Promote users to admin via Prisma Studio (`npm run db:studio`) until you build a UI for it.

## Deployment

Recommended: **Railway** or **Fly.io** (both support Postgres + long-running Node processes for newsletter sends).

### Railway (easiest)

1. Push this repo to GitHub.
2. Create a new Railway project from the repo.
3. Add a Postgres plugin — `DATABASE_URL` is auto-injected.
4. Set the other env vars in the Railway dashboard.
5. Set build command: `npm run build`
6. Set start command: `npm run start`
7. After first deploy, run migrations: `railway run npm run db:push && railway run npm run db:seed`

### Vercel + external Postgres (alternative)

Works fine for the public site and most API routes. The newsletter send endpoint will hit serverless timeout limits with large lists — for that case, deploy a separate worker (or use Resend's batch API).

## Roadmap / what to build next

These are not implemented yet but the schema and routes are scaffolded for them:

- [ ] Rich-text editor for news posts (currently plain text). Try [Tiptap](https://tiptap.dev) or [Lexical](https://lexical.dev).
- [ ] User profile pages (`/community/profile/[user]`).
- [ ] Reply nesting UI (the schema supports it; render isn't recursive yet).
- [ ] Reports/flagging system on threads & replies.
- [ ] Image upload (S3/R2) for post covers and forum attachments.
- [ ] Email verification on signup (separate from newsletter verify).
- [ ] Password reset flow.
- [ ] Resource file uploads (PDFs, etc.).
- [ ] Admin user management UI (currently use Prisma Studio).
- [ ] Background job for newsletter sends at scale.
- [ ] Search across news + forum + resources.
- [ ] Donation page (`/donate` is linked but not built — point to Zeffy or build a Stripe checkout).

## Useful commands

```bash
npm run dev          # Start dev server on :3000
npm run build        # Production build
npm run db:studio    # Open Prisma Studio (visual DB editor)
npm run db:migrate   # Create + run a new migration
npm run db:push      # Push schema without migration files (dev only)
npm run db:seed      # Run seed script
```

## Design system

Custom Tailwind palette (in `tailwind.config.ts`):

| Token | Hex | Use |
|-------|-----|-----|
| `sage-900` | `#2c4a3e` | Primary headings, footer |
| `sage-700` | `#4d7969` | Primary buttons, resources section |
| `cream-50` | `#fefaf2` | Light text on dark, soft backgrounds |
| `cream-100` | `#fdf4e6` | Page backgrounds |
| `coral-500` | `#ee9480` | Brand accent, badges |
| `coral-600` | `#e07a5f` | Action buttons, links |
| `gold-500` | `#e8b04d` | Tertiary highlights |
| `ink` | `#2d2a26` | Body text |

Typography: **Fraunces** (display serif, soft variable axis) + **Public Sans** (body).

## License

Build and use freely for HTAG. No external license attached.
