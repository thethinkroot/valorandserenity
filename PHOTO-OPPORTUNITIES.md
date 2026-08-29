# Photo Opportunities

Living tracker for every photo slot across the seven example theme pages
(`example-army.html`, `example-flag.html`, `example-space-force.html`,
`example-coast-guard.html`, `example-air-force.html`,
`example-marine-corps.html`, `example-navy.html`). Reopen and update this
file whenever a new image is generated, placed, renamed, or found to be
wrong, rather than treating it as a one-time snapshot.

Last verified: 2026-08-29, against the live local build, by looking directly
at each rendered page and each image file, not by reading code alone.

## How to use this file

- Update the relevant row the same session you place, replace, or rename an
  image. Don't let this drift from reality.
- "Verified correct" means someone actually looked at the rendered page (or
  the image file itself) and confirmed the depicted gender matches the
  assigned John Smith / Jane Smith name, not just that a file exists.
- If a new secondary photo slot is ever added to a page, add a row for it
  here in the same session.

## Status summary

| Branch | Assigned name | Hero image | Secondary "family photo" slot |
|---|---|---|---|
| Army | John Smith | Placeholder (diagonal stripe) | Placeholder |
| American Flag | John Smith | Filled, verified correct | Placeholder |
| Space Force | Jane Smith | Filled, verified correct | Placeholder |
| Coast Guard | John Smith | Filled, verified correct | Placeholder |
| Air Force | Jane Smith | Filled, verified correct | Placeholder |
| Marine Corps | John Smith | Filled, verified correct | Placeholder |
| Navy | Jane Smith | Filled, verified correct (see note) | Placeholder |

## Detail by page

### Army: `example-army.html`
- **Hero image.** Branch: Army. Assigned gender: John Smith (male).
  Status: **placeholder still showing** (diagonal-stripe `.cover-portrait`,
  "Portrait · Families Add Their Own"). No real image has been generated
  for this theme yet. This is the one page intentionally left untouched
  during the six-image placement pass.
- **Secondary slot.** Type: "family photo" demonstration slot inside the
  Their Story section (`.placeholder-photo`, "Family Photo. Add Your
  Own."). Status: **placeholder still showing**. This slot is meant to
  demonstrate where a real family would add their own keepsake photo, not
  to be pre-filled with a generated image, unless that changes for
  editorial reasons.

### American Flag: `example-flag.html`
- **Hero image.** Branch: American Flag (any branch of service). Assigned
  gender: John Smith (male). Status: **filled and verified correct**.
  `images/american-flag-veteran-tribute-example.png`: elderly man, white
  beard, sitting with a child on a porch, American flag in frame. Visually
  confirmed male. The page's `<h1 class="cover-name">` previously read
  "Jamie Smith," a gender-neutral name chosen before this real image
  existed; it has been corrected to "John Smith" to match the now-real
  photo. See the root-cause note below.
- **Secondary slot.** Status: **placeholder still showing**, same as Army.

### Space Force: `example-space-force.html`
- **Hero image.** Branch: Space Force. Assigned gender: Jane Smith
  (female). Status: **filled and verified correct**.
  `images/space-force-veteran-tribute-example.png`: adult with hair in an
  updo, softer profile, holding a child, looking up at a starfield.
  Visually confirmed female.
- **Secondary slot.** Status: **placeholder still showing**.

### Coast Guard: `example-coast-guard.html`
- **Hero image.** Branch: Coast Guard. Assigned gender: John Smith (male).
  Status: **filled and verified correct**.
  `images/coast-guard-veteran-tribute-example.png`: elderly man, weathered
  profile, dockside at dusk with a lighthouse in the background. Visually
  confirmed male.
- **Secondary slot.** Status: **placeholder still showing**.

### Air Force: `example-air-force.html`
- **Hero image.** Branch: Air Force. Assigned gender: Jane Smith (female).
  Status: **filled and verified correct**.
  `images/air-force-veteran-tribute-example.png`: full natural hair,
  softer profile, close with a child at dusk. Visually confirmed female.
- **Secondary slot.** Status: **placeholder still showing**.

### Marine Corps: `example-marine-corps.html`
- **Hero image.** Branch: Marine Corps. Assigned gender: John Smith (male).
  Status: **filled and verified correct**.
  `images/marine-corps-veteran-tribute-example.png`: bearded man in the
  foreground, a second figure with long hair (read as female, likely a
  spouse, not the tribute subject) beside him, tall grass at golden hour.
  The foreground/primary figure is visually confirmed male.
- **Secondary slot.** Status: **placeholder still showing**. This is the
  slot named explicitly in the brief that prompted this audit; it is not
  unique to this page, all seven pages have the identical slot.

### Navy: `example-navy.html`
- **Hero image.** Branch: Navy. Assigned gender: Jane Smith (female).
  Status: **filled and verified correct, with a note**.
  `images/navy-veteran-tribute-example.png`: very low-key, backlit
  silhouette at a dusk dock scene, an adult figure with a younger person.
  This is the hardest of the six to read confidently from silhouette
  alone; a brightened, cropped inspection of the face and hairline leaned
  toward a soft, rounded profile consistent with "Jane Smith" rather than
  a clear male read (no beard, no strong jaw angularity). Flagged here as
  lower-confidence than the other five in case a future viewer disagrees;
  if so, update this row and the page.
- **Secondary slot.** Status: **placeholder still showing**.

## Root cause: the "Jamie Smith" mismatch

`example-flag.html`'s cover name was never fixed by a prior, failed
attempt: nothing in git history ever tried to change "Jamie" to "John."
What actually happened: commit `6835434` (2026-08-28) replaced the
placeholder surname "Doe" with "Smith" sitewide, including changing "Jamie
Doe" to "Jamie Smith" on this page. "Jamie" was kept deliberately at the
time, because it's the gender-neutral name for the American Flag theme (the
"for any branch of service" theme, not gendered like the others), and no
real image existed yet to check it against. The real photo for this page
was placed the next day, in commit `ffef412` (2026-08-29), and depicts a
man. Nobody had gone back to reconcile the now-real image with the
still-gender-neutral name until this audit. Both decisions were correct
individually, at the time each was made; the mismatch was created by the
gap between them, not by a fix that silently failed.

The homepage's American Flag theme-card teaser (`index.html`, the
`.template-note` under "American Flag Theme") also referenced "Jamie Smith
example" and has been updated to "John Smith example" to match.
