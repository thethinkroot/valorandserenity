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
separate, later phase and a separate application. Family-submitted content from
that future app must never live in this repo, it's public, and belongs in
access-controlled storage instead.

The one exception is `mike-mesarch.html` and `about.html`, the founder's own real
tribute to his stepfather, used as the site's flagship example. Mike's personal
photos and keepsake documents (`mike-chad-boyhood.png`, `mike-and-joan.png`, and
the rest, see `SITE-BUILD-SPEC.md`'s asset inventory for the full list and usage
rules) are committed directly to `images/`, alongside the site's own generic
brand photography (`flag.png`, `letter.png`). An earlier version of this project
served Mike's photos from a separate Cloudflare R2 bucket and custom subdomain;
that subdomain was never provisioned and the approach was abandoned in favor of
committing the files directly. There is no `media.valorandserenity.com` and
nothing in this repo should reference it.

No analytics or ad scripts are wired up. Any analytics addition is a decision
for the project owner, not a default.

Content policy: real photo restoration (repair, de-blur, colorize) is in scope.
Generating synthetic images or video of a veteran is not, and never will be by
default. Same for audio: any future narration feature must never synthesize
or clone a veteran's actual voice. If that comes up, it needs an explicit
decision from the project owner, not a default build.
