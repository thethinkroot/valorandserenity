# Story Assist — Feature Specification

Story Assist is a paid, Signature-tier feature of the future tribute-builder
application (not part of this repo — this is a static marketing site). It is
the primary reason the Signature tier justifies its price, not one of several
generic "premium features." This document is the source of truth for its
behavior until that application exists; whoever builds it should start here.

Basic tier ships with zero Story Assist. Fully manual, family's own words
only, free always.

## Naming and tone

- Always "Story Assist," sentence case.
- No icon, sparkle, robot glyph, or any AI-associated visual. Never its own
  logo or wordmark.
- Never described as "AI-generated." Describe what it does, not the
  technology behind it.

## Job 1 — Surfacing lost memories

Ask guided questions built around who, what, when, where, and why — but
specific to what the family has already provided, not a fixed generic script.

If the family has mentioned a branch and era, questions narrow accordingly.
Example: for a Vietnam-era Army veteran, ask about boot camp, letters home,
homecoming — not the same five questions regardless of context.

## Job 2 — Turning fragments into a finished story

Take whatever the family has provided — a few lines, a half-remembered
anecdote, a letter excerpt — and shape it into a coherent, readable narrative
in their own words and voice.

**Hard rule:** never introduce details, quotes, or specifics the family
didn't provide. This is formatting and connecting, not inventing.

## Job 3 — Historical context (the premium differentiator)

Cross-reference the veteran's branch, unit, and service dates against real,
documented historical events — major operations, campaigns, or significant
unit activity during that period and theater.

**Sourcing requirement:** must come from verifiable records — National
Archives, published unit histories, DoD historical records. Never from
general model knowledge presented as fact. Never fabricated or inferred to
sound plausible when real data isn't available.

If no confident, sourced information exists for a specific unit or
timeframe, Story Assist says so plainly rather than inventing something that
sounds historically accurate.

**Critical framing rule — non-negotiable:** historical context is always
presented as a question, never an assertion about the individual.

- Correct: "Records show the [unit] was active in [region] during [dates] —
  does that line up with anything he mentioned?"
- Never: a statement implying this specific veteran was present at or
  affected by a documented event.

Unit-level history and individual experience are not the same thing. Story
Assist must never blur them.

## Data handling

Whatever the family enters is processed to help with the three jobs above,
then discarded. Never stored for AI training, by this product or any third
party. This must be stated explicitly in Story Assist's own on-page
description — not only in the site's general trust section.

## Exclusions (hard, site-wide — not unique to Story Assist)

Story Assist works with text and story content only. It does not generate
images, video, or synthetic voice under any circumstance. This is a
separate, hard site-wide policy (see the "Held With Care" section of
`index.html` and the content policy in `README.md`) and applies fully here.

## Pricing

Signature's price is justified specifically by these three capabilities —
not by generic "premium features." See the pricing teaser in `index.html`
(`#start` section) for the current customer-facing phrasing.
