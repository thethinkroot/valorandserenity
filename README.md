# Valor & Serenity

Static marketing site for valorandserenity.com. Deployed via Cloudflare Pages.
Built by [ThinkRoot](https://thinkroot.io).

Pages: `index.html` (home), `about.html` (Our Story), `story-assist.html`,
`mike-mesarch.html` (the real flagship tribute example), and seven
branch-themed illustrative examples (`example-marine-corps.html`,
`example-navy.html`, `example-army.html`, `example-air-force.html`,
`example-coast-guard.html`, `example-space-force.html`,
`example-flag.html`). `SITE-BUILD-SPEC.md` is the authoritative reference
for the design system, writing standard, page inventory, asset rules, and
accessibility baseline; check new pages and edits against it.

The guided tribute builder (accounts, family invites, photo/letter uploads) is a
separate, later phase and a separate application. Family-submitted content must
never live in this repo — it's public — and belongs in access-controlled storage
(planned: Cloudflare R2), never mixed into `images/`, which is scoped to this
site's own brand photography only.

The one exception is `mike-mesarch.html`, the founder's own real tribute to his
stepfather, used as the site's flagship example. Even those personal photos and
keepsake documents are never committed to this repo — they're served from a
separate, intentionally public R2 bucket (`valorandserenity-public-media`, via
`media.valorandserenity.com`) referenced by URL. That bucket is distinct in both
name and purpose from the private bucket above: this one holds public marketing
media, the other will hold access-controlled customer content. Don't conflate them.

No analytics or ad scripts are wired up. Any analytics addition is a decision
for the project owner, not a default.

Content policy: real photo restoration (repair, de-blur, colorize) is in scope.
Generating synthetic images or video of a veteran is not, and never will be by
default. Same for audio — any future narration feature must never synthesize
or clone a veteran's actual voice. If that comes up, it needs an explicit
decision from the project owner, not a default build.
