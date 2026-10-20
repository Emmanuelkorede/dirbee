# AGENTS.md — House of Bee V2

## Project Overview

House of Bee V2 is a full-stack creative portfolio and content-management system for director Bee.

The project includes:
- A public portfolio website.
- Video projects hosted on Wistia.
- Artist and client records.
- Related-project discovery based on shared artists.
- Photography shoots and images hosted on Cloudinary.
- Client reviews and testimonials.
- Contact and email functionality.
- Site settings.
- A protected admin dashboard.

The project is a fresh V2 implementation. Do not modify the live V1 website or its production branch as part of V2 work.

The developer may implement the UI separately. When assigned backend work, prioritize data modeling, server-side validation, queries, mutations, external integrations, security, and tests.

## 1. Mandatory Working Rules

Before making changes:

1. Inspect the relevant files and the current repository structure.
2. Read `package.json`, `tsconfig.json`, `drizzle.config.ts`, `db/index.ts`, `db/schema.ts`, and relevant feature modules when the task touches them.
3. Inspect installed package versions before relying on a library's API.
4. Check the current implementation before proposing a replacement.
5. Follow the agreed implementation roadmap.
6. Preserve existing work and avoid unrelated refactoring.
7. Explain meaningful architectural changes before making them.
8. Ask for approval before changing settled architecture or performing destructive operations.

Never:
- Modify the live V1 project intentionally.
- Reset branches or discard uncommitted changes without explicit approval.
- Delete production data or execute destructive database operations without approval.
- Invent API methods or claim unverified operations succeeded.
- Expose API secrets to client code.
- Bypass server-side validation because a frontend form already validates its inputs.
- Assume a file is implemented just because it exists.
- Replace the chosen stack without a justified reason.
- Repeatedly reopen settled decisions without new technical evidence.

## 2. Technology and Architecture

Use the existing project configuration and installed dependencies. The agreed direction is:

- Next.js App Router.
- TypeScript with strict checking.
- PostgreSQL.
- Drizzle ORM and Drizzle Kit.
- A server-side authentication provider confirmed from the repository.
- Wistia for video hosting.
- Cloudinary for photography.
- Resend for email.
- Turnstile and rate limiting where appropriate.

Use the existing structure:

- `app/`: routes, layouts, API handlers and route-level data loading.
- `components/`: reusable presentation components.
- `features/`: domain validation, queries, actions and feature-specific code.
- `db/`: database connection, schema and relations.
- `lib/`: integrations, security, environment validation and shared infrastructure.
- `types/`: inferred database types and application result types where appropriate.
- `scripts/`: seed, connectivity tests, CRUD smoke tests and maintenance.
- `drizzle/`: generated migrations and Drizzle migration metadata.
- `public/`: static assets.

Avoid duplicate implementations of the same integration. Wistia belongs in `lib/wistia/`; Cloudinary belongs in `lib/cloudinary/`.

## 3. Database Is the Source of Truth

`db/schema.ts` is the canonical database schema.

The database includes:

- `artists`
- `clients`
- `projects`
- `project_artists`
- `photo_shoots`
- `photos`
- `reviews`
- `site_settings`
- `admin_users`

It also defines the agreed enums, foreign keys, unique indexes, checks, and Drizzle relations.

Do not independently redefine these structures in feature modules.

### Artists and projects

A project can feature multiple artists. An artist can belong to multiple projects.

Use `project_artists` to represent this many-to-many relationship. Its composite primary key prevents duplicate artist associations for the same project.

Every project must have at least one artist. Enforce this through server-side validation and transaction logic.

Related projects must:
- Share at least one artist with the current project.
- Exclude the current project.
- Be published when returned to public visitors.
- Avoid duplicates when multiple artists overlap.
- Follow a consistent ordering and result limit.

### Clients

Each project has an optional client. The database uses `ON DELETE SET NULL` for the client relationship. Preserve this behavior unless an approved schema change is required.

### Wistia fields

Projects store the share URL separately from the actual Wistia media ID.

Draft projects may have no resolved media ID. Published projects must have a resolved media ID and a publication timestamp.

The media ID's validation format must match the confirmed Wistia API identifier format. Never infer the actual media ID from the share-link slug.

### Featured projects

There can be at most ten featured projects. Featured positions are unique and must fall between 1 and 10. The featured flag and order must agree.

Featured ordering mutations must handle unique-index collisions safely.

### Photography

Photo records reference shoots, and shoots must not be deleted while their photo records remain.

The application must remove or confirm the absence of remote Cloudinary assets before deleting their database records.

### Reviews

Public review submissions begin pending. Approval requires publication consent and an approval timestamp. Featured reviews must be approved.

Public queries must respect both review status and site settings.

### Site settings

`site_settings` is a singleton table whose valid ID is 1.

The seed script creates the initial row with both review settings disabled. It must be safe to run repeatedly and must not overwrite existing settings.

### Admin users

`admin_users` maps an authentication-provider identity to admin authorization. It is not a substitute for authentication.

The owner manages the initial admin record. Never create an assumed owner identity automatically.

## 4. Database and Migration Safety

Before applying a migration:

1. Inspect the actual schema and database configuration.
2. Generate SQL with the repository's configured Drizzle command.
3. Review the generated SQL, including enums, tables, constraints, indexes and foreign keys.
4. Confirm the target database and whether it already contains data.
5. Apply only the reviewed migration to the intended database.
6. Verify connectivity and required tables.
7. Run the seed script.
8. Verify the singleton settings row.

Do not use `db:push` as an unexplained replacement for the agreed migration workflow.

Inspect the actual Neon and Drizzle setup before adding connection cleanup. Do not call `.end()` on a Neon query function that does not expose that method.

## 5. Server-Side Security

Every privileged server action and API handler must verify authorization independently.

Protect:
- Admin CRUD mutations.
- Project publishing and featured ordering.
- Artist and client mutations.
- Photo and shoot mutations.
- Cloudinary upload-signing endpoints.
- Review moderation.
- Site settings changes.
- Other administrative operations.

Do not rely solely on `app/admin/layout.tsx` to secure mutations.

Validate untrusted input on the server. Validate UUIDs, slugs, enum values, strings, numeric ranges, foreign keys, uploaded metadata and relationship assignments as appropriate.

Use environment variables for secrets. Never expose server-only credentials through client bundles or `NEXT_PUBLIC_*` variables.

Disable public sign-up or enforce the intended invitation/allowlist policy. Do not accidentally turn the admin application into an open-registration system.

## 6. Wistia Integration Rules

Keep Wistia logic in `lib/wistia/`.

The backend must:
1. Validate the supplied URL and allow only the intended Wistia host and supported URL structure.
2. Extract the share-link identifier.
3. Resolve the share link through the supported Wistia API.
4. Obtain the actual media ID.
5. Retrieve supported media metadata.
6. Persist the share URL, resolved media ID, thumbnail, dimensions and successful-sync timestamp as appropriate.

The Wistia token must remain server-side.

Never:
- Treat a share-link identifier as a media ID.
- Guess or fabricate a media ID.
- Claim a sync succeeded when it failed.
- Set `wistiaSyncedAt` on a failed sync.
- Publish a project without a valid resolved media ID.
- Fetch arbitrary user-supplied URLs.

A failed sync may leave a project as a draft. Report failures clearly and allow retrying when appropriate.

Confirm API endpoints, permissions and response shapes against current official documentation and the installed implementation before coding.

## 7. Cloudinary Integration Rules

Keep Cloudinary integration in `lib/cloudinary/`.

Upload signatures must only be issued to appropriately authorized users. Validate uploaded asset metadata before persisting photo records.

For photo deletion:
1. Verify authorization.
2. Retrieve the asset's Cloudinary public ID.
3. Delete the remote asset or confirm it is already absent.
4. Delete the database row only after remote cleanup succeeds.

For shoot deletion:
1. Retrieve all associated photo records.
2. Attempt remote cleanup for every asset.
3. Preserve records required for retry if any asset deletion fails.
4. Delete the photo rows only when remote cleanup is confirmed.
5. Delete the shoot after all its photo rows are gone.

Do not assume PostgreSQL transactions can roll back Cloudinary operations. Design safe retries and partial-failure reporting.

## 8. Feature Module Responsibilities

Use the following separation unless the existing repository has a justified convention that should be preserved.

### `validation.ts`

- Define schemas for untrusted inputs.
- Validate and normalize fields.
- Return typed validated data.
- Never rely exclusively on frontend validation.

### `queries.ts`

- Implement database reads.
- Use explicit selection and filters.
- Ensure public queries exclude drafts and unpublished content.
- Return stable, typed results.

### `actions.ts`

- Enforce authorization.
- Validate inputs.
- Execute mutations.
- Use transactions for related database changes.
- Handle expected database errors.
- Invalidate relevant cached data where necessary.

### `types.ts`

- Define feature-specific input and result types.
- Reuse inferred database types instead of manually duplicating row definitions.

### `lib/`

- Contain external integrations, infrastructure helpers, security utilities and shared configuration.
- Keep secrets and privileged API calls on the server.

### `scripts/`

- Contain seeding, database checks, smoke tests and maintenance utilities.
- Do not use scripts as the production application's primary CRUD layer.

## 9. Required Implementation Order

Follow this sequence unless repository inspection reveals a concrete blocker:

1. Database connection, environment validation, inferred types, migration, seed, connectivity and CRUD smoke tests.
2. Authentication, admin authorization and protected mutations.
3. Artist CRUD and client CRUD.
4. Project validation, queries, transactions and CRUD.
5. Wistia resolution, metadata synchronization, publishing and featured ordering.
6. Related-project queries across multiple artists.
7. Cloudinary configuration, upload signing, photo and shoot CRUD, ordering and safe deletion.
8. Reviews, moderation, contact, email, rate limiting, Turnstile and settings.
9. Public data-query integration.
10. Integration tests, security checks and production verification.

Do not skip the database and authorization foundations to build dependent features first.

## 10. Testing and Verification

Run the relevant checks after changes:

- TypeScript type checking.
- Linting.
- Targeted unit tests.
- Database connectivity tests.
- CRUD smoke tests.
- Integration tests.
- Production build checks when appropriate.

Test both successful and failed paths.

Important cases include:
- Duplicate slugs.
- Invalid UUIDs and foreign keys.
- Multiple artists on one project.
- Related-project deduplication.
- Failed Wistia resolution.
- Failed metadata synchronization.
- Publishing without a media ID.
- Featured-project position conflicts.
- Failed Cloudinary deletion.
- Review approval without consent.
- Unauthorized admin mutations.
- Missing environment variables.
- Repeated execution of the seed script.

Never report a test as passing unless it was actually run and passed.

## 11. Required Response Format for Development Tasks

For each meaningful task, explain:

1. The task and its purpose.
2. The files involved.
3. The code to add or change.
4. How the functions connect.
5. The command to run.
6. The expected outcome.
7. The checks performed and their results.
8. Any outstanding issue.
9. The next step in the implementation roadmap.

Keep explanations practical and specific to the actual repository. Avoid generic advice when a concrete implementation is possible.

Do not generate unrelated UI code when the assigned work is backend-only.

## 12. Current Project Continuation

The schema design and initial migration SQL have been discussed. Before assuming the migration has been applied, inspect the repository and confirm its actual status.

The seed script should load `.env.local` before importing the database module, use dynamic imports where required by the existing setup, insert `site_settings` with ID 1, and do nothing if the row already exists.

Initial settings:
- `reviewsEnabled: false`
- `showReviewsOnHomepage: false`

Do not call `.end()` on the Neon query function unless the actual connection object supports that method.

Start by inspecting the current files, identifying the first incomplete step, and continuing from there. Preserve settled decisions and report any genuine conflict between the implementation and this document before making architectural changes.