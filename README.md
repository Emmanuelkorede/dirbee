<div align="center">

# House of Bee

**Portfolio website for House of Bee, a creative production house for music visuals, artist content and cinematic storytelling.**

[**houseofbee.site**](https://www.houseofbee.site)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Postgres](https://img.shields.io/badge/Postgres-Neon-00E599?logo=postgresql&logoColor=white)

</div>

---

## About this project

|  |  |
|---|---|
| **Client** | House of Bee, led by Director Bee |
| **Built by** | Emmanuel Job |
| **Status** | Live |
| **Website** | https://www.houseofbee.site |

A custom portfolio site with a private admin area. The owner manages all content herself: projects and videos, talent and clients, photo galleries, reviews and footer links. No code changes are needed for day-to-day updates.

---

## What the site includes

### For visitors

- **Home**: hero, featured projects (the first is shown large), a short director introduction and featured reviews
- **Work**: every project, filterable by **All**, **Editorials / Fashion Film** and **Music Video**
- **Project pages**: video player (with an expanded full-screen view), a details table (clients, artists or starring, type, year, credits) and related projects
- **Photography**: galleries with a full-screen photo viewer
- **Reviews**: approved client reviews, plus a form to submit one
- **Contact**: project enquiry form delivered straight to the owner's inbox, plus social links
- **Director** and **About** pages
- Light and dark mode, designed mobile-first

### For the owner (admin area)

- **Projects**: create and edit, several clients per project, optional description, credits, publish and unpublish, choose and order up to 10 homepage features
- **Talent**: *Artists* (for music videos) and *Starring* (for editorials and fashion films)
- **Clients**: reusable across projects
- **Photography**: create shoots, upload many photos at once, add alt text and captions, reorder, publish
- **Reviews**: approve, reject, edit or delete submissions, add reviews directly, choose which appear on the homepage
- **Settings**: switch reviews on or off, and edit the footer email, Instagram and TikTok links

---

## Managing content (owner's guide)

**Publishing a new project**

1. **Talent**: add the artist (music videos) or the person starring (editorials / fashion film) if they are not in the list yet. Add any clients under **Clients**.
2. **Projects → New project**: fill in the title, type, year and people. The description, clients and credits are optional.
3. Paste the video's **Wistia share link**. Its sharing must be set to *Unlocked* in Wistia. The site checks the link when you save.
4. Check that the video shows as **Synced**, then press **Publish**.
5. To show it on the homepage, add it to **Homepage featured** (maximum 10) and save the order.

**Photo galleries**: *Photography → New shoot*, then upload photos on the next page (JPG, PNG or WebP) and write a short description for each. A shoot appears on the site once published.

**Reviews**: new submissions arrive as *Pending*. They only appear on the site after you approve them. Reviews appear publicly only while *reviews* is switched on in **Settings**.

**Good to know**

- **Names and URLs:** renaming a project, person or shoot also changes its web address.
- **People on projects:** someone who is on a project cannot be deleted until they're removed from it.
- **Deleting a client:** it removes the client from its projects. The projects stay.
- **Changes going live:** they appear on the site shortly after saving.

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS v4, framer-motion, next-themes |
| Database | PostgreSQL on Neon, accessed with Drizzle ORM |
| Authentication | Neon Auth, plus an allowlist table that controls who can use the admin |
| Video | Wistia |
| Photos | Cloudinary (signed uploads) |
| Email | Resend |
| Spam protection | Cloudflare Turnstile |
| Validation | Zod |

---

## How it's built

- **Content-managed.** Every public page is generated from the database. Saving in the admin refreshes the affected pages, with a daily safety-net refresh.
- **Locked-down admin.** Every admin action re-checks the signed-in user against the admin allowlist on the server. Creating an account alone never gives admin access.
- **Public and admin data are separate.** Public pages can only read published content. Drafts, pending reviews and reviewers' email addresses never reach visitors.
- **Safe media handling.**
  - **Wistia:** a draft can keep a link whose sync failed. A project can only be published once Wistia confirms the video.
  - **Cloudinary:** the server checks every upload with Cloudinary before saving it. A photo is removed from Cloudinary first and from the database second, so a failed delete never leaves a broken record.
- **Business rules live in the database too.** Examples are the 10-project homepage limit, publishing requiring a synced video, and reviews needing consent before approval.
- **Contact and review forms** are protected by Cloudflare Turnstile and validated on the server. Contact messages are emailed and not stored.

### Folder overview

```
app/            Pages and routes (public site, admin, auth, API)
components/     Shared UI kit, navigation, brand, admin parts
features/       One folder per area: projects, artists, clients,
                photography, reviews, contact, settings
                (actions, queries, validation, feature components)
lib/            Integrations: auth, Wistia, Cloudinary, email, Turnstile
db/ drizzle/    Database schema and SQL migrations
scripts/        Seed and diagnostic scripts
```

---

## For developers

### Environment variables

Configured on the hosting provider and in `.env.local` for local work. Values are never committed.

| Group | Variables |
|---|---|
| Database | `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (used for migrations) |
| Neon Auth | `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` (at least 32 characters) |
| Wistia | `WISTIA_API_TOKEN` (read access) |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Email | `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_EMAIL` |
| Turnstile | `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` |

### Commands

```bash
npm run dev           # local development
npm run build         # production build (needs database access)
npm run db:generate   # create a migration after changing db/schema.ts
npm run db:migrate    # apply migrations
npm run db:seed       # create the initial settings row (never overwrites)
```

Diagnostic scripts in `scripts/` (run with `npx tsx scripts/<file>`) check the database, Wistia links, email and Turnstile, and compare Cloudinary with the database.

### Changing the database

1. Edit `db/schema.ts` and run `db:generate`.
2. **Read the generated SQL** before applying it. Never use `db:push` on production.
3. Test it on a Neon branch first.
4. Run the migration on the live database, then deploy the code that needs it.

---

## Hosting notes

- **Canonical address:** `https://www.houseofbee.site`. The version without `www` should redirect to it.
- **Sign-in domains:** both `https://www.houseofbee.site` and `https://houseofbee.site` must be listed under *Neon Console → Auth → Configuration → Domains*. Otherwise sign-in fails with "Invalid origin".
- **Email:** the sending domain must stay verified in Resend.
- **Turnstile:** the widget must allow the site's domain.
- **Build access:** the build reads the database, so the database variable must be available at build time.

---

<div align="center">

Creative direction: **Bee** · Design and development: **Emmanuel Job**

© House of Bee. All rights reserved.

</div>
