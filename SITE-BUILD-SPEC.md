# Site Build Spec: Valor & Serenity Marketing Website

The authoritative reference for building and extending the static marketing site (valorandserenity.com). Every new page or edit is checked against this document before being considered complete. This is separate from APP-EXPERIENCE-SPEC.md, which governs the future guided tribute-builder application, not this site.

---

## Design System, Verified Source

All tokens below are extracted directly from Mike's real, verified page, not reconstructed from memory or spec text. Any new page reuses this exact `<style>` block as its foundation.

**Core tokens:**
```
--bone: #FAF8F3
--bone-warm: #F0E9DC
--bone-deep: #E1D5C0
--ink: #1D1C1B
--aubergine: #69545F
--aubergine-deep: #29212B
--copper: #B66F4A
--copper-deep: #8B4E30
--copper-text: #9C5C3A
--tan-muted: #9C8A6E
--font-display: 'Cinzel', serif
--font-body: 'Lato', sans-serif
```

**Theme system**: eight themes exist as `body[data-theme="X"]` overrides of the core tokens: `default`, `marine-corps`, `navy`, `army`, `air-force`, `coast-guard`, `space-force`, `flag`. Each defines its own `--copper`, `--aubergine-deep`, `--rule-h`, `--rule-w`, `--section-pad`, `--radius-base`, `--reveal-dist`, `--reveal-dur`, `--reveal-ease`, and a `.cover-motif` background image, a single bespoke SVG shape appearing exactly once per page, in the Cover plaque, never repeated as a decorative divider. The plain `.rule` divider (a bare bar, no icon) is used everywhere else on every theme.

**American Flag theme specifics** (the one theme built from two contrasting hues, requiring special handling): `--copper: #B31942`, `--aubergine-deep: #0A3161`. Never blend these two colors in a gradient, doing so produces a muddy purple at the midpoint, this is a color-theory fact, not a style preference. Keep them as visually separate solid fields wherever both appear together (see the homepage's `.flag-thumb` treatment for the correct pattern).

---

## Writing Standard

No em dashes anywhere, in any page, including titles, meta descriptions, and alt text. Use a colon, a period, or a rewritten sentence instead. Plain, short sentences. No jargon. This applies to content I write directly with the same rigor as content received from any other source, verified with a direct search of the file before shipping, not assumed.

---

## Page Inventory

| Page | File | Nav Label | Status |
|---|---|---|---|
| Homepage | `index.html` | (wordmark) | Verified: Story Assist copy, pricing clarity, skip link, full a11y bar. Uses an earlier single-sample-card "Examples" section, not the 8-theme gallery. This is a deliberate, deferred decision, not a gap, see note below. |
| Our Story | `about.html` | Our Story | Verified: skip link, `main-content` id, full a11y bar, zero em dashes, correct nav order, `mike-chad-boyhood.png` used correctly here and nowhere else. |
| Story Assist | `story-assist.html` | Story Assist | Verified: no "AI-assisted" language anywhere, the funding-the-free-tier paragraph present, the "what it will never do" section present, the milestone/historical-context expansion (birth, wedding day, president, song, with the honesty caveat) present, skip link, a11y bar, zero em dashes, correct nav order. Also now includes a real interactive demo in the "See It In Action" section, using Mike's own already-verified facts, clearly labeled as a fixed example, not a live lookup on visitor input. |
| Pricing | `pricing.html` | not yet in nav | New this session. Three tiers (Basic free, Story Assist $99 one time, Legacy Vault $19/year), the One-Year Moment framed as an invitation with VLM offered as a standing safety net available on any tier, not an exit-only choice. Checkout intentionally not wired, scaffold notes say so plainly. Not linked from any nav or homepage CTA yet, needs a decision on where it's linked from before launch. |
| Partners | `partners.html` | For Partners | New this session. Leads with the Medicare bereavement-follow-up requirement as the real value to hospices, states the Anti-Kickback compliance position plainly (no per-referral payment, ever), offers two paths (hospices: goodwill only; funeral homes: goodwill or a flat, non-referral-tied co-branding fee), and includes an explicit not-legal-advice disclaimer. All nav and homepage links to the former `#partners` homepage anchor and the unbuilt "white-labeled" claim have been updated or removed across every page. |
| Help for Families | `help-for-families.html` | not yet in nav | New this session. Covers first-steps-after-death, VA burial and survivor benefits (burial flag, Presidential Memorial Certificate, DIC, burial allowance, national cemetery burial), Veteran Service Officers, and Veteran Pinning Ceremonies, with a Story Assist tie-in for families who experienced one. Every specific claim traces to sourced research from this session; the DIC dollar figure and burial-allowance automaticity are explicitly hedged as subject to change, with a prominent non-affiliation disclaimer at the top. Not yet linked from any nav, needs a placement decision. |
| Mike's tribute (flagship, Default theme) | `mike-mesarch.html` | linked from Examples section | Verified: source of the shared style system, skip link, `main-content` id, a11y bar, zero em dashes, correct nav order, American Flag theme correctly wired into the footnote switcher. |
| Marine Corps example | `example-marine-corps.html` | linked from Examples section | Verified via direct code check, plus this session's accessibility and nav fixes. |
| Navy example | `example-navy.html` | linked from Examples section | Verified via direct code check, plus this session's accessibility and nav fixes. |
| Army example | `example-army.html` | linked from Examples section | This session's accessibility and nav fixes verified directly. Underlying theme content last confirmed via report, not independently re-checked. |
| Air Force example | `example-air-force.html` | linked from Examples section | This session's accessibility and nav fixes verified directly. Underlying theme content last confirmed via report, not independently re-checked. |
| Coast Guard example | `example-coast-guard.html` | linked from Examples section | This session's accessibility and nav fixes verified directly. Underlying theme content last confirmed via report, not independently re-checked. |
| Space Force example | `example-space-force.html` | linked from Examples section | Verified via direct code check, plus this session's accessibility and nav fixes. |
| American Flag example | `example-flag.html` | linked from Examples section | Verified via direct code check, plus this session's accessibility and nav fixes. Confirmed no blue-to-red gradient blend anywhere on the page. |

**Deferred, deliberate**: the homepage's `#preview` section currently shows a single generic sample card, not the 8-theme gallery linking to all seven branch pages. That gallery exists as a separate, verified build (with the corrected non-gradient American Flag card) but has not been merged into the committed homepage. None of the seven branch pages are currently discoverable from the live homepage as a result. This was confirmed and consciously left as-is, not an oversight, revisit when ready to surface the branch themes publicly.

**Resolved architecture decision**: there is no separate `templates.html` page in the committed repo, it was never actually present there despite earlier confusion. The example gallery, once merged, lives as a section on the homepage (`#preview`, labeled "Examples" in the nav). Any reference to a standalone "Templates" page elsewhere in this project's history is superseded by this.

**Standing nav order, every page, confirmed identical across all eleven live files**: Our Story, How It Works, Story Assist, Examples, For Partners, then the Start a Tribute button.

---

## Asset Inventory

Real photos, not placeholders, live in `/images/`. Usage rules:

- `mike-chad-boyhood.png`: reserved exclusively for the About page. Never used on Mike's tribute page or anywhere else.
- `mike-end-of-life.png`: held back entirely. Never used in any build, anywhere.
- All other Mike photos (`flag.png`, `letter.png`, `mike-shadowbox.png`, `mike-canoe.png`, `mike-obituary-clipping.png`, `mike-program-cover.png`, `mike-program-interior.png`, `mike-and-joan.png`, `mike-and-robyn-flag.png`, `mike-rafting-with-joan.png`, `mike-and-grandson.png`) are approved for use on Mike's tribute page.
- No official military seals, crests, or insignia are ever used as template assets on any branch example page. Colors and abstracted motifs only.

---

## Accessibility Standard

WCAG 2.1 Level AA baseline on every page, no exceptions:

- The a11y bar (text size decrease, reset, increase, high contrast toggle) present at the top of every page, matching the exact implementation already verified on Mike's page.
- A skip-to-content link as the first focusable element on every page.
- Visible keyboard focus states throughout.
- Contrast meeting AA at minimum by default, high contrast mode available as a further option.

---

## The VLM Connection

Valor & Serenity is not affiliated with, endorsed by, or connected to the Department of Veterans Affairs or its Veterans Legacy Memorial. Where a tribute page links to a veteran's real VLM record, it is plain text only: "Also honored at the VA's Veterans Legacy Memorial →". No VA seal, no badge, no styling implying partnership.

---

## Verification Discipline

Before any page or fix is considered complete:

1. Check the actual rendered code directly, grep for the specific claim, don't accept a description of what changed.
2. Check for em dashes with `python3 scripts/check-em-dash.py`, which covers the literal character, HTML entity forms (`&mdash;`, `&#8212;`, `&#x2014;`), and the backslash-u-2014 JS string escape (case-insensitive). A literal-character search alone misses all three of the others; the escape form shipped undetected in the audio player's error message across all seven example pages until this script existed.
3. Confirm cross-links actually resolve to files that exist.
4. When a color palette combines two contrasting hues (currently only American Flag), confirm no gradient blends them.
5. State plainly what was and wasn't independently re-verified in this session versus carried forward from an earlier report. The "Status" column above must stay honest about this distinction.

---

## Build Order, Current

1. Homepage, About, Story Assist, Mike's page, and all seven branch example pages: verified, staged locally, not yet committed or pushed, per standing project decision to hold until Story Assist and pricing are fully settled.
2. Story Assist and pricing clarity: verified correct in the committed-candidate files, this was the actual gate on launch and it now holds.
3. Merge the 8-theme homepage gallery (with the corrected American Flag card) into the committed homepage, when ready to make the branch themes publicly discoverable. Deliberately deferred, not yet scheduled.
4. Final full-site pass before any push: audio links on branch pages confirmed playable in a real browser, one more full em-dash and nav-order sweep after the gallery merge lands, since merging files is exactly the kind of change that can silently reintroduce something already fixed.
