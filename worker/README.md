# Tribute Link Security

The first real backend piece of the Valor and Serenity application: secure
tribute-link generation and visibility enforcement, per the
"Visibility, Chosen at Publish" section of `APP-EXPERIENCE-SPEC.md`.

Scoped narrowly, on purpose. This does not build the 8-step tribute creation
flow, Story Assist, or payments. It builds the mechanism a token, a
visibility tier, and the optional privacy word need to be trustworthy
before any of that is layered on top.

## Platform

A standalone Cloudflare Worker, not folded into the marketing site's
Cloudflare Pages Functions. Same platform, same account, so there is only
one place this ever runs, but a separate deployable service (its own
`wrangler.toml`), since tribute storage and serving is a different concern
from the static marketing pages and shouldn't share a deploy pipeline with
them.

## Storage: D1, not KV

D1 (SQLite) was specified over KV, and the numbers back that up.

**Free-tier limits, confirmed directly against Cloudflare's own docs, not
assumed** (Workers Free plan, resets daily at 00:00 UTC):

| | KV | D1 |
|---|---|---|
| Writes | 1,000 / day | 100,000 / day |
| Reads | 100,000 / day | 5,000,000 / day |
| Storage | 1 GB | 5 GB |

Source: [developers.cloudflare.com/workers/platform/pricing](https://developers.cloudflare.com/workers/platform/pricing/)
and [developers.cloudflare.com/d1/platform/limits](https://developers.cloudflare.com/d1/platform/limits/),
checked while building this.

**What this slice actually does per operation, verified by the tests in
`test/tributes.test.js` (the "D1 read/write volume" block spies on
`env.DB.prepare` rather than trusting the code by inspection):**

- Creating a tribute (`POST /tribute`): exactly one `INSERT`, one row
  written.
- Viewing a tribute (`GET /tribute/:token`): exactly one `SELECT` by primary
  key, one row read. The privacy-word check happens against that same row,
  never a second query.
- Sitemap eligibility listing (`listSitemapEligibleTributes`): one query,
  rows read equals the number of Community-tier tributes that exist, not
  the total tribute count. This would run on a schedule (once a day, to
  regenerate `sitemap.xml`), not per visitor.

**Does this fit inside the free tier at this product's realistic early
scale?** Comfortably, with a lot of headroom:

- 100,000 writes/day means up to 100,000 new tributes could be created in a
  single day before hitting the write ceiling. A new memorial platform is
  nowhere near that in year one.
- 5,000,000 reads/day means, for example, 50,000 published tributes each
  viewed 100 times in a single day (5,000,000 page views) before hitting
  the read ceiling. Even a genuine viral spike, thousands of tributes each
  seen a few hundred times in a day, lands well under this.
- 5 GB of storage, at a few hundred bytes per row (token, tier, title, hash,
  timestamp), holds many millions of tributes before storage is the
  constraint rather than the row quotas above.

The honest limiting factor at any realistic early scale is not KV's or D1's
free-tier ceiling, it's simply that the product doesn't have that many
tributes yet. D1 was chosen because its schema fits this data shape better
(see below), and its free tier happens to be far more generous besides.

**Why D1 fits the data shape, independent of the quota numbers.** This
slice's data is a single flat lookup: given a token, return one record
(visibility tier, privacy-word hash, title, created-at). There are no
relationships to query yet, no "all tributes by owner," no joins, no
contributor lists. D1 fits that today via a plain `tributes` table (see
`migrations/0001_init.sql`), and it's also where this naturally grows:
owners, contributors, invites, and edit history (all coming in later
pieces of the real application) are relational by nature, and D1 is the
right foundation to build that on incrementally, rather than switching
storage engines again once those tables exist.

## Naming: never "passphrase," "password," or "security"

The product spec is explicit that this word must never be described to a
family as a passphrase, a password, or a security setting anywhere in the
interface. `src/privacy-word.js` and the screens in `src/index.js` are
worded to match: internal code identifiers say "privacy word," and every
rendered string uses only the plain language from the spec ("Want one more
layer of privacy?", "Your word", "Skip this"). Tests in
`test/tributes.test.js` assert those three banned words never appear in
any rendered HTML, on either the setup screen or the gate page a visitor
sees.

## What's here

- `src/tokens.js`: cryptographically random token generation
  (`crypto.getRandomValues`, never `Math.random`).
- `src/privacy-word.js`: SHA-256 hashing and constant-time comparison for
  the optional Private-tier word. The plaintext is never stored or logged.
- `src/tributes.js`: D1-backed create/read, visibility rules (which tiers
  are `noindex`, which tier can even show the privacy-word gate), and the
  single choke point (`listSitemapEligibleTributes`) any future sitemap
  generator or listing feature must call through, so Private and Family and
  Friends tributes cannot structurally leak into anything crawlable.
- `src/index.js`: the Worker `fetch` handler. `POST /tribute` creates a
  tribute and returns its token. `GET /tribute/:token` serves it, applying
  the `noindex` header and meta tag for Private and Family and Friends, and
  the privacy-word gate for Private tributes that have one set.
  `GET /screens/privacy-word` renders the actual setup screen using the
  spec's exact required language. The tribute HTML itself is a placeholder;
  the real tribute page template is Step 7/8 of the creation flow, out of
  scope here.
- `migrations/0001_init.sql`: the `tributes` table.

## Running the tests

```
cd worker
npm install
npm test
```

Tests run against the real Workers runtime via
`@cloudflare/vitest-pool-workers` (Miniflare under the hood), including a
real, ephemeral D1 database (migrations applied automatically from
`migrations/`) and the real `crypto.getRandomValues`. No mocked storage, no
mocked crypto.

## Before deploying for real

`wrangler.toml`'s `database_id` is a placeholder. Run:

```
wrangler d1 create valor-and-serenity-tributes
```

put the returned ID into `wrangler.toml`, then apply the migration:

```
wrangler d1 migrations apply valor-and-serenity-tributes --remote
```

before running `wrangler deploy`.
