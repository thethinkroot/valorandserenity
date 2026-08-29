# Field-Mapping Spec: What the Guided App Needs to Collect

Derived directly from building out `mike-mesarch.html` as the full, no-half-measures
reference for what every tribute can become. Every section below reflects real
material that actually exists for Mike; nothing here describes an invented
scenario. Where the current 8-step guided flow (`start.html`) doesn't yet collect
what a section needs, that's called out explicitly as a gap, not implied.

This document is the literal backend schema the real guided-flow application
needs to collect from a new family, section by section, in one place, so this
mapping work never has to be re-derived.

---

## 1. Cover

**What it needs:** full name; branch; years of service (or a single birth year
for someone still living); birth date; passing date (omitted entirely in
self/living mode, per the autosave/copy work already done in `start.html`); a
hero portrait photo; one short closing sentence ("Beloved husband,
grandfather, and mentor to generations of young people.").

**Source type:** name, branch, and dates typed directly (Steps 1 and 2 of the
guided flow); hero photo uploaded directly (Step 3); closing sentence typed
directly, or lightly shaped by Story Assist from whatever the family wrote in
Step 4.

**Register:** mostly factual/record (name, branch, dates), with one warm,
personal line at the end.

**Graceful degradation:** with no photo, the cover shows the same
"Portrait · Families Add Their Own" placeholder already used on the seven
example pages, not a blank space. With no closing sentence, the line is
omitted rather than defaulted to filler text.

---

## 2. Their Story

**What it needs:** birth date; birthplace; one line about where they were
raised, if known.

**Source type:** birth date typed directly (Step 1). Birthplace and
upbringing are not collected anywhere in the current 8-step flow; this is a
real gap, not something Story Assist infers. The historical-context callout
("Did you know?") is Story Assist research keyed off the birth year.

**Register:** factual (date, place) plus Story Assist's historical color,
which is meant to read as warmth-through-context, not a citation.

**Graceful degradation:** already built and correct in `start.html`, this
session: with no birth year, Story Assist declines honestly rather than
guessing (verified against multiple boundary years, not just one). With no
birthplace, the entry can read with just the date and a raising line, or
omit the raising line.

---

## 3. Unit History (new this session)

**What it needs:** branch; the specific unit or regiment name; the years
affiliated with that unit; real, sourced unit-level history (headquarters,
relocations, wartime role, inactivation, or equivalent).

**Source type:** branch is a structured selection (Step 2's branch tiles).
**The specific unit/regiment name is not collected anywhere in the current
8-step flow.** Only top-level branch is. This is the clearest gap this
section exposed: without a named unit, there is nothing for Story Assist to
research at this level of specificity. The unit history narrative itself is
Story Assist research against real public sources (for the 187th, verified
this session via Wikipedia's sourced account: reactivation date,
headquarters moves, Cold War Iceland role, inactivation date and cause), not
something the family types.

**Register:** factual/record. This section should never contain personal
narrative; that's what Step 4's Story Assist questions are for, kept
deliberately separate per the Story Assist spec's rule that unit-level
history and individual experience are not the same thing.

**Graceful degradation:** if no specific unit is named, hide this section
entirely rather than show generic branch-level trivia. A named unit with no
researchable public history should read the same way the historical-context
decline path now does: say so honestly, don't fill the gap with something
plausible-sounding.

---

## 4. In Service

**What it needs:** enlistment date; commissioning or promotion milestones,
if any; retirement or discharge date; a short line for each milestone.

**Source type:** enlistment and retirement dates are an extension of what
Step 2 already collects (branch and from/to years). **Intermediate
milestones (a commissioning date, a specific school, a promotion) are not
collected anywhere in the current flow**, which only asks for a single
start/end year pair. Mike's page has this texture because it was built
directly from his real record, not generated from a start/end year alone.

**Register:** factual/record, with Story Assist historical color attached to
any milestone that has a real date.

**Graceful degradation:** with only branch and years, this section
correctly degrades to the two-point version the current flow can actually
support: an enlisted entry and a retired/discharged entry. It should not
try to invent intermediate milestones to match Mike's page's richness.

---

## 5. In Their Own Words

**What it needs:** one attributed quote: the quote text, the speaker's name,
and their relation to the veteran.

**Source type:** typed directly by a family member. **There is no step in
the current 8-step flow that collects this at all.** Step 4 collects the
veteran's own story in the family's words; this section is explicitly a
second, different voice, someone else's words about the veteran, which the
current flow has no mechanism to gather.

**Register:** warmth/personal, verbatim, never rephrased or shaped by Story
Assist. This is the one section where the exact words matter more than
anything else on the page.

**Graceful degradation:** hide entirely if no quote exists. Never generate a
placeholder quote or attribute words to a real person that weren't
actually said, per the site's hard, non-negotiable rule against fabricated
quotes.

---

## 6. The Person We Knew

**What it needs:** personal life milestones after service (a spouse, a
career chapter, ongoing hobbies or community involvement); roughly one
sentence each.

**Source type:** typed directly, an extension of Step 4's open narrative
capture. Story Assist historical color attaches to any milestone with a
real date, the same mechanism as the other timeline sections.

**Register:** personal narrative first, historical color second.

**Graceful degradation:** with minimal family input, this collapses to
whatever the family wrote in Step 4 as a single block, no timeline
structure forced onto it.

---

## 7. A Life in Photographs

**What it needs:** multiple photos, each with a caption.

**Source type:** uploaded files (Step 3) with captions typed directly
("What's happening in this photo?"). **The current flow only actually
handles one photo**, despite the free tier's spec'd 20-photo allowance;
multi-photo upload doesn't exist yet (confirmed in the prior session's
inventory).

**Register:** personal/warmth.

**Graceful degradation:** with one photo, this section should show a
single-photo layout, not an empty gallery grid waiting to be filled. With
zero (not currently possible, since Step 3 requires attempting one), hide
the section.

---

## 8. Video Memories (new this session)

**What it needs:** one or more video files, each with a short caption.

**Source type:** uploaded file. This section was built with an honest
placeholder first, then Chad supplied a real clip of Mike (on the deck,
raising a glass) partway through the session, which now plays in the
section directly. That swap is itself the point: **the guided app still
has no video upload mechanism anywhere** (confirmed in the prior session's
inventory: the "Add a voice or video memory" button on Step 3 is a pure
visual mockup with no real capture behind it). Mike's real clip was added
by hand, outside the app, which is exactly why this gap matters, a family
today has no path to get a real video onto their page without that kind
of manual help.

**Register:** personal/warmth.

**Graceful degradation:** with no video, this section should show the
clearly labeled placeholder ("Video Memory. Not Yet Added.") this session
built first, never implying one exists when it doesn't. With a real video,
it should play directly, exactly as uploaded, no re-encoding or filtering
that changes what was actually recorded.

---

## 9. Remembered By

**What it needs:** open-ended memory submissions from any invited
contributor, each with text and an optional photo.

**Source type:** contributor-typed, after publishing, via the invite-family
mechanism (Step 6's invite link). This is the one section genuinely meant
to stay empty at first; it isn't a family-authoring field at all.

**Register:** personal/warmth, one contributor's own words at a time.

**Graceful degradation:** already correct and already built: an empty-state
invitation ("This space is just getting started... waiting for family and
friends to share") rather than an empty box that reads as broken.

---

## 10. Artifacts

**What it needs:** scanned documents or keepsake photos, each with a plain
caption.

**Source type:** uploaded files with captions typed directly, the same
upload mechanism as the photo gallery, applied to documents instead of life
photos.

**Register:** factual/record for the documents themselves, with plain,
unsentimental captions ("Printed obituary, August 2020").

**Graceful degradation:** hide the section entirely if nothing has been
uploaded to it; never substitute a generic stand-in document.

---

## 11. Final Honors

**What it needs:** passing date; service or burial date and location;
specific medals or honors, if any; any notable circumstances worth naming.

**Source type:** passing date typed directly (Step 1's Passed field, in
passed mode). **Service/burial date and location are not collected
anywhere in the current 8-step flow.** This is a real gap; Step 1 only
asks for birth and passing years, nothing about the ceremony itself.
Medals come from Step 5's honors list, currently just a name field per
honor with no follow-up detail captured. Story Assist historical color
attaches to the service date, the same mechanism used elsewhere.

**Register:** factual/record, handled gently.

**Graceful degradation:** without burial specifics, this section can show
just the passing date. Step 5 already correctly handles "None, or not
sure" for honors without it reading as a gap. If a family has genuinely
no additional detail, this section should stay short rather than reach
for filler.

---

## 12. Their Legacy

**What it needs:** one closing reflective statement.

**Source type:** typed directly, or lightly synthesized by Story Assist
from everything already gathered in the flow, the same "shaping fragments"
job Story Assist is meant to do elsewhere.

**Register:** warmth, brief.

**Graceful degradation:** if nothing distinctive was gathered, this can
default to a short, generic closing line rather than being left blank,
since a tribute reads oddly with no closing note at all, unlike the
sections above where hiding entirely is the right call.

---

## Cross-Cutting Gaps Surfaced by This Build

Building out Mike's page to its full potential, using only material that
already exists for him, surfaced several fields the current 8-step guided
flow (`start.html`) does not yet collect at all. Listed once here so they
don't need re-discovering:

- **Specific unit/regiment name** (Section 3), beyond top-level branch.
- **Intermediate service milestones** (Section 4): commissioning, schools,
  promotions, beyond a single start/end year pair.
- **An attributed quote from a family member, distinct from the veteran's
  own story** (Section 5). No step gathers a second voice today.
- **Multi-photo upload** (Section 7): the flow currently handles exactly
  one photo, not the free tier's spec'd allowance of 20.
- **Real video upload** (Section 8): confirmed not built anywhere, a mockup
  button only.
- **Service/burial date and location** (Section 11), distinct from the
  passing date already collected.
- **Per-honor detail** (Section 11): Step 5 collects a name per medal with
  no "what was this awarded for" follow-up, despite
  `APP-EXPERIENCE-SPEC.md` describing exactly that optional prompt.

None of these are required to ship a basic tribute; the graceful-degradation
notes above describe exactly how each section should behave for a family
with less material than Mike's page has. They matter for prioritizing what
the real guided-flow backend should eventually collect, in roughly the order
a family would notice the absence.
