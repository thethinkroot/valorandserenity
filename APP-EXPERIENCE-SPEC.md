# App Experience Spec: Valor & Serenity

The complete specification for the future guided tribute-builder application. This document supersedes all prior fragments and partial updates. This is a spec for a future build, not something the current marketing site implements.

---

## Governing Principle

Every screen in this application is measured against one test: could someone's mother-in-law, alone at midnight, grieving, use this without ever once feeling confused, lost, or afraid of breaking something.

Not "does this look premium." Whether a person who does not consider themselves technical would feel calm, capable, and cared for, from the first screen to the last.

This principle governs every other section of this document. Where anything else conflicts with it, this principle wins.

---

## On Elegance

Elegance is not decoration. It is what remains after everything unnecessary has been removed, and obsessive care has been given to what is left.

**The one sentence this product exists to deliver**: a grieving person can build a beautiful, true tribute in fifteen minutes, without ever feeling lost. Every feature in version one must serve that sentence directly. Everything else, no matter how good, ships later.

**The first ten seconds are sacred.** Before Step 1 begins, one still, quiet screen: the mission line alone, "No veteran's story should be lost to time, and no family should have to preserve it alone," fading in, nothing to tap yet. A full second of stillness before the first button appears.

**The last moment is sacred.** The finished tribute fades quietly into full view, exactly as the public will see it, before any button or next step appears. Let the person sit with what they built before anything else happens. Only then, quietly beneath it: "It's live. Thank you for taking the time to do this for him." The tribute is the reward, not a message about the tribute.

**Every choice in the flow must justify its own existence.** For each decision point, ask honestly whether a well-chosen default could remove the choice entirely rather than merely simplify it. Where a choice cannot be eliminated, it remains. Where it can, it is removed. The theme confirmation at Step 7 (below) is the one deliberate exception reasoned through under this test: a family's own sense of what looks right cannot be reliably defaulted away, so the choice remains, offered once, at the moment of review.

**Microcopy is a design surface, not an afterthought.** Every word in the interface is held to the same rigor as visual design. If a sentence would sound wrong spoken aloud to a grieving person by a real human being, it is wrong for this app.

---

## Entry Point

Two doors, framed in plain, concrete terms so the person knows exactly what happens next before choosing:

- **Start on your own.** "You go through each step yourself. You can invite family to help anytime later."
- **Start with family.** "We'll ask early on who you'd like to invite, so they can start adding photos and memories right away too."

Beneath both: **"Free to start, either way. No payment is needed to build a complete tribute."** This is stated before any step begins, not left for the person to discover or worry about later.

The choice adjusts tone and framing only, never the underlying steps.

**Above both doors, one small, optional link: "Already looking for someone? Search existing tributes first."** This is scoped honestly and only ever searches Community-tier tributes, the ones already public and discoverable by design. It never searches Private or Family and Friends tributes, since those are correctly unsearchable on purpose, and the search page states this plainly rather than implying it checked everything: "This searches public tributes only. A private or family tribute may already exist and simply not show up here." A real person looking at real names, dates, and branches is a better judge of whether a match is actually their own relative than any automated system, this exists to let them make that call themselves with real information, not to replace the check below.

---

## The Guiding Design Standard

Every screen in the flow below must satisfy all of the following before it is considered complete:

- **One question, one screen, always.** Never a form with multiple fields stacked.
- **Nothing is ever lost.** Silent autosave after every answer. No visible save button. Closing the tab by accident loses nothing.
- **No modal dialogs, no pop-ups, no confirmation stacking.** One obvious next action per screen, as a single large button.
- **Voice is a first-class option.** A visible microphone icon sits next to every text field, always.
- **Typography stays large by default.** Not an accessibility mode to find and turn on.
- **No jargon, anywhere.** Plain words. "Continue." "Tell me about him." "You're almost done."
- **Undo is always visible and always safe.** Nothing should ever feel permanent or risky to touch.
- **Progress is shown honestly and calmly.** Never a percentage bar that feels like a test being graded.
- **No hamburger menus, no gear icons, no hidden settings drawers.** If a choice matters, it is visible when it matters.
- **Pacing is unhurried, not slow.** Calm and confident, never sluggish, never rushed.

---

## The Core Flow, Screen by Screen

### Step 1, Name and Dates

Single screen: "What was their name?" Voice icon visible by default. One line beneath: "Their full name, exactly as they'd want it remembered."

On the same screen, an optional pair of fields beneath: "When were they born, and when did they pass, if you know?" Clearly framed as optional. These dates feed the tribute's hero display and become the foundation for Story Assist's historical context work in Step 4.

**Date validation, gentle and non-blocking.** If a date entered is not a plausible four-digit year, a soft note appears beneath the field: "That doesn't look like a full year. Try something like 1951." This never blocks continuing and is never styled as an error. If both a birth and passing year are entered and the passing year comes before the birth year, the note instead reads: "That second year comes before the first. Mind double-checking?" The same standard applies wherever a paired date range is collected in this flow.

One button: "Continue." Silent autosave on every pause in typing.

### Step 2, Service Details

Two separate screens, not one combined form.

Screen one: "What branch did they serve in?" Large, tappable tiles, never a dropdown. The six real service branches: Army, Navy, Marine Corps, Air Force, Coast Guard, Space Force.

Screen two: "What years did they serve?" Two large fields, from and to, with: "Not sure of exact dates? Your best guess is fine. You can always fix it later." The same gentle, non-blocking year and date-order validation from Step 1 applies here.

This screen's answers, combined with the name and dates from Step 1, become the raw material Story Assist draws on in Step 4, and the branch selected here is what automatically determines the tribute's visual theme at Step 7.

**A quiet, higher-precision duplicate check runs here, once branch and service years are known, not any earlier.** A match on name and birth year alone is too weak a signal to act on, especially for common names, waiting for branch and approximate service years turns a coincidence into a real signal worth surfacing. If nothing close exists, nothing happens, and the flow continues exactly as normal with zero added friction. If a plausible match on name, branch, and overlapping service years is found, one additional screen appears before Step 3: "It looks like there may already be a tribute for someone with this name, branch, and years of service. Want us to check with them, or continue on your own?" Two equally weighted choices, "Check with them" and "Continue on my own," neither framed as the wrong answer, since even this stronger match is never a certainty.

If "Check with them" is chosen, an email is sent to the *existing* tribute's verified owner, using the same email-verification channel already used for publishing: "Someone may be trying to create a second tribute for a veteran with the same name, branch, and years of service as yours. If this might be the same person, you may want to reach out to them directly." The new person creating a tribute never sees the existing one's content, its visibility tier, or who owns it, this only connects two real people to sort it out themselves. This is a soft, unguaranteed path, not a resolution: it depends entirely on the existing owner actually reading and acting on that email, there is no way to force or confirm that happens, and the product should never imply otherwise. If "Continue on my own" is chosen, or if the person never responds, tribute creation proceeds exactly as normal, this is never a hard block.

**This can never be made fully certain, and that is a real, permanent limit worth stating plainly rather than engineering around.** A truly bulletproof match would require a unique identifier, something like a Social Security number or DD-214 number, both of which this product has already and correctly ruled out collecting. Every version of this check is a matter of likelihood, never certainty, given that constraint.

**For duplicates that already exist, unknowingly, before this check existed or because two people both chose to continue independently**, a simple, low-key "Think this might be a duplicate?" contact option on a published tribute routes to a real person for early stage, not an automated merge. Automatically merging two independently written tributes risks losing content or blending two families' words incorrectly; a human quietly helping two families sort it out by hand is the right scale of solution while volume is still small.

### Step 3, Photos and Recordings

One primary action: "Add a photo." A secondary option, "Add a voice or video memory, if you have one," is revealed only after the first is complete, never both at once. Reassurance: "You can add more anytime. One is enough to start."

**The same upload control works correctly on any device without separate code paths.** On a phone, it opens the camera roll or camera. On a computer, it opens the operating system's own file browser. This is native browser behavior, not something built or maintained separately per device, and copy anywhere on the site should never assume one device over another, "add a photo" is correct everywhere, "from your phone" is not.

**Two real accommodations for the harder case, someone at a computer who isn't sure where a photo is saved.** The upload area accepts drag and drop directly, so a photo already open in an email or a folder window can be dragged straight onto it, no menu needed. A quiet secondary option, "Or email your photos to us instead," gives a plain email address as a fallback for anyone who would rather send an email than use an upload screen at all, a family member later pairs an emailed photo with its caption in the normal flow.

**Nobody is ever asked to resize, crop, compress, or trim anything themselves.** Every photo is automatically resized and optimized on upload, at whatever resolution and format the family provides, straight from a phone or a scanner. Every video or voice recording is automatically compressed on upload. There is no file-size or format error message anywhere in this step. If a device produces a file too large to process automatically, the system silently compresses further rather than rejecting it or asking the family to do anything technical.

**This is ordinary image and video processing, not AI.** Resizing, compressing, and format conversion are deterministic, mechanical operations, the same technology every photo-sharing service has used for years, not a model interpreting or altering what's in the photo. If a photo needs cropping to fit a specific layout, the default is a plain, centered crop, with a simple, obvious drag handle if a family wants to adjust it themselves. No automated subject detection deciding what to keep in frame. This distinction matters: it keeps this feature entirely separate from the AI-generated-content ban elsewhere in this document, nothing here interprets, generates, or changes the actual content of a family's photo, it only changes its size.

**Free tier includes up to 20 photos and 5 minutes of voice or video, total.** When a family approaches or reaches this limit, they are never met with a rejection or a technical error. Instead, a warm, plain-language message appears: something like "You've reached what's included for free. You can remove something to make room, or add Story Assist for unlimited photos and video." This is framed as a choice, never a wall, and never happens mid-upload without warning, the family should always know where they stand before hitting the limit, not discover it as a failure.

**If a video exceeds the plan's time allowance**, it is never silently cut off or rejected. The family is told plainly, in advance of it counting against anything, and offered the same choice as above.

When a photo is added, ask one question: "What's happening in this photo?" This answer serves as both the visible caption and the image's alt text for screen readers. A visible "Remove this photo" option appears the moment a photo is added, consistent with the undo principle above; nothing added here should ever feel permanent.

If a video is added, offer the option to add captions at the point of upload.

**Free-tier assistance boundary.** A quiet "Get a gentle prompt" link may reveal one simple guiding question, such as "Where was this taken, and who's with him?" This must remain a bare question only. It never drafts, completes, or promises to shape a sentence on the family's behalf. Turning fragments into finished prose is Story Assist's paid capability (Job 2, defined in STORY-ASSIST-SPEC.md) and must not be given away for free in any part of this flow, including here.

### Step 4, Their Story

Two equally weighted choices: "Write it yourself" and "Get some help." Beneath: "Get some help just asks a few gentle questions to jog your memory. Nothing is added that you don't say yourself."

**A real, honest demonstration of value sits alongside both choices**, not hidden behind either one: a labeled example, using a real, already-verified case (not a fabricated preview of this family's own veteran, since nothing has been researched for them yet), such as: "Here's a real example of what Story Assist can find," followed by a blurred sample historical-context line, and beneath it: "This is a real example from another family's tribute, shown so you can see how it works. Your own veteran's story stays completely private until you choose to publish it." A single closing line reinforces the product's actual differentiation without naming any competitor: "Most memorial pages only record what happened. This also shows you what the world was like when it happened, so more memories come back to you." This example is visible to every visitor, whether or not they choose Story Assist.

**If "Write it yourself" is chosen**, the screen is never a bare textarea. A quiet "See a few ideas" link reveals three universal, non-personalized starter prompts: "What do you want people to know about him?", "What is a memory that still makes you smile?", "What did he care about most?" These are generic enough to belong to any story and must never be built from the veteran's specific branch, era, or dates, since that personalization is reserved for Story Assist. A single, low-key link beneath the writing field, offered once and never repeated, allows the family to switch into Story Assist instead: "Want more than a starting point? Get gentle guidance from Story Assist instead."

**If "Get some help" is chosen**, this is the moment the one-time $99 Story Assist charge occurs. Not before, and nowhere else in this flow. Story Assist then begins as one continuous conversation, not a single static feature. Full behavioral rules, including sourcing requirements and the non-negotiable historical framing rule, are specified in STORY-ASSIST-SPEC.md and apply in full here. Within this flow, three things happen together, not as separate steps:

- **Guided questions.** One question per screen, voice icon always visible, built from the name, branch, era, and dates already collected in Steps 1 and 2. Not a generic script, questions narrowed to this specific person.
- **Shaping as they go.** The family's answers are shaped into readable prose in the background as the conversation continues, not as a separate pass afterward.
- **Live historical context.** The moment a relevant date is known, whether from Step 1 or newly mentioned in an answer, Story Assist can surface real, sourced historical context in the conversation itself: "Did you know? The day he was born, this was happening in the world. Does that sound familiar?" If a family mentions a new date in an answer, such as when they met their spouse, Story Assist can ask a gentle follow-up to confirm it and generate the same kind of moment. This is always framed as a question inviting confirmation, never an assertion. This turns historical context into a real, surprising moment during the building experience itself, not only a decoration discovered later on the finished page.

After every answer, a warm one-line acknowledgment before advancing, such as "That's a wonderful detail" or simply "Thank you."

### Step 5, Honors

One screen: "Did they receive any medals or honors?" A repeatable "Add one" action, alongside an equally visible, non-judgmental option: "None, or not sure, and that's okay." Beneath both: "Don't worry about remembering every one right now. You can always come back and add more, even after this is published." Nothing collected in this flow should ever feel like a closing door.

If Story Assist is active from Step 4, offer one optional prompt per honor added: "Do you know what this was awarded for?"

Scripture and readings search is deferred past version one, per the Elegance section above. When built, it offers the King James Version and Douay-Rheims translations, both public domain, plus an "add your own words" field for any other verse, poem, or reading, framed as one optional addition, never a headline feature.

### Step 6, Invite Family

One screen: "Would you like family to help add memories?" Two equal options: "Not right now" and "Send an invite." If invited, one field, one button, "Send." No permission levels exposed to the person sending it.

**A concrete privacy statement appears the moment an email or phone number is entered**, not buried in a separate policy page: "We'll only use this to send them one invite to help with this memorial. We won't add them to any mailing list, and we won't use it for anything else." This must remain true in practice, not only in wording: contact information collected here is used solely to deliver that one invite and is never stored for marketing, sold, or repurposed beyond helping build this specific tribute.

A shareable invite link requires no account for a contributor to add a photo or memory. One clear owner per tribute, verified by email, controls final edits. Contributors add but do not overwrite.

### Step 7, Preview

Full render of the actual tribute. **The veteran's theme is applied automatically, matched to the branch selected in Step 2.** Beneath the preview, a single quiet line offers a confirmed exception to the general no-visible-switcher rule (see Deferred Past Version One): "Shown here in [Branch] colors. View in Default or American Flag instead," each a plain text link. This is the one moment in the entire flow where the family reviews and may override the automatic match, including switching to the non-branch-specific American Flag theme or the plain Default look. This exception exists because a family's own sense of what looks right cannot be reliably defaulted away, and reviewing before publishing is exactly the right moment to offer it, once, not repeatedly.

Every Story Assist historical context moment generated during Step 4 appears here as a visible callout embedded in the tribute's timeline, styled as already established on Mike's real page, each including a "Know more? Add it here" invitation connected to family members invited in Step 6.

One button forward. A persistent, low-key link: "Go back and change something," never framed as a warning.

### Step 8, Publish

One screen: "One last step. We'll send a quick email to confirm it's really you, then your tribute goes live." One button: "Send the confirmation." This is the only mandatory identity checkpoint in the entire family-facing flow.

After confirmation, per the Elegance section: the finished tribute fades into full view first. Only then, quietly beneath it: "It's live. Thank you for taking the time to do this for him."

---

## The Theme System

Eight themes exist: **Default**, **American Flag** (a patriotic, non-branch-specific option for any veteran's family), and the six branch themes, **Marine Corps**, **Navy**, **Army**, **Air Force**, **Coast Guard**, **Space Force**. Each branch theme's visual system (palette, structural rhythm, and single signature motif) is defined separately in the site's design documentation.

The theme is selected automatically at Step 2 based on the branch entered, and confirmed or changed once, at Step 7, per the exception described above. Outside of Step 7, no other screen in this application exposes theme switching.

---

## The VLM Connection

Valor and Serenity is not affiliated with, endorsed by, or connected to the Department of Veterans Affairs or its Veterans Legacy Memorial. Every part of this section must make that distinction unmistakable to the family at every step.

**A simple link, included in version one.** After publishing, in the tribute's settings, a family may optionally add a link if their veteran already has a page on the VA's Veterans Legacy Memorial. Displayed on the published tribute as plain text only, matching the treatment already established on Mike's real page: "Also honored at the VA's Veterans Legacy Memorial →". No VA seal, no badge, no styling that implies partnership or endorsement.

**Preparing materials for VLM, a standing safety net, not a one-time exit choice.** A separate, clearly optional tool, available at any time, to any family on any tier, when their veteran is VLM-eligible (interment in a qualifying VA, DoD, or state veterans cemetery, or a claimed headstone or medallion, not every veteran qualifies, and the product must say so honestly rather than imply universal access). Continuing with the Legacy Vault and also keeping a safety copy with the federal registry are not mutually exclusive, and the product should say so plainly: "Even if you keep growing your tribute here, we'll always make it easy to also have a copy safely prepared for VLM.gov, because your veteran's story should be protected no matter what happens to us." This tool:

- Maps the family's own Story Assist answers into VLM's own published question format, producing plain, copy-ready text in the family's own words.
- Offers simple guidance on selecting and sizing a handful of photos for VLM's own upload process.
- Offers a basic redaction helper, letting a family blur or black out sensitive information such as Social Security numbers or addresses on a scanned document before they upload it to VLM's Historical Docs section themselves.

**Hard rules, non-negotiable.** This tool never logs into VLM, submits on the family's behalf, scrapes VLM's site, or automates any part of the actual submission. The family always completes the real submission themselves, directly on VLM.gov, and VLM's own moderators make the final decision, exactly as they would for anyone else. Every screen in this tool carries a plain, unmissable statement: "This helps you prepare materials for your own submission to VLM.gov. Valor and Serenity is not affiliated with or endorsed by the VA. You'll submit this yourself, directly through their site."

---

## Visibility, Chosen at Publish

- **Private.** Only people invited, by direct link, plus one optional passphrase the family sets and shares verbally or by phone, never through the link itself. This is the one additional safeguard reserved for the most restrictive tier.

**How this is actually presented to a family, since the word "passphrase" itself is too technical to ever appear on screen.** This only appears as one small, clearly optional, skippable addition, shown only when Private is chosen, never for Family and Friends or Community. One question, one screen, plain language: "Want one more layer of privacy? Choose a simple word to share with family yourself, like handing someone a house key." A single text field beneath it, and a visible "Skip this" option equally easy to choose. Nothing about this should ever feel like a security setting, a technical decision, or something requiring care to get right, it's simply one more word, chosen once, shared however the family already talks to each other.
- **Family and Friends.** A wider circle the family chooses, never publicly searchable.
- **Community.** Public and discoverable within Valor and Serenity.

**How the link itself is actually secured, for Private and Family and Friends.** Every URL contains a long, cryptographically random token, never a sequential or guessable ID. Both tiers are marked `noindex` and are never included in the sitemap, so search engines and AI crawlers never learn the page exists.

**The honest limit of this model, stated plainly rather than implied away.** This is a "the link is the key" system, the same tradeoff every mainstream private-link-sharing feature makes. Whoever has the link can view the page, regardless of whether they were the intended recipient. If a family forwards it somewhere public, that specific safeguard does not stop it. This is the deliberate, correct tradeoff for this product, requiring viewer accounts or logins to see a memorial page would introduce exactly the kind of friction this product exists to remove, but it must never be described to families as equivalent to a password wall or account-gated access, since it isn't one.

This choice belongs to the tribute's owner alone and can be changed anytime after publishing.

---

## Verification, Scoped Narrowly

The application never receives, stores, or processes a DD-214, government ID, or Social Security number directly. Where identity verification appears, it uses a vetted third-party provider returning only a verified or not verified result.

Verification applies only in two places, never blocking the core family flow:

1. **Living-veteran self-authoring**, since it is the veteran's own record at stake.
2. **An optional "verified service record" badge**, which a family may choose to add. Never required, never a gate on publishing.

A family building a tribute for a deceased relative never encounters a verification step.

---

## Deferred Past Version One

The following are real, valuable, and explicitly not part of the initial release, per the Elegance principle above:

- **Any persistent, always-visible theme switcher** appearing outside the one-time confirmation at Step 7. The Step 7 review moment is a deliberate, reasoned exception (see On Elegance and Step 7 above), not a precedent for switching being available elsewhere in the app.
- **Scripture and readings search.**
- **The service song player.**
- **Keepsakes**, the post-publish affiliate section for physical mementos. Affiliate only, curated categories, verified sellers, no reproduction of official military insignia.
- **The anniversary and remembrance loop**, gentle re-engagement on Memorial Day, Veterans Day, and the anniversary of passing.
- **Read aloud** on published tribute pages.
- **The VLM preparation tool**, described in full under The VLM Connection above.

**Share as a Card remains in version one**, since it is free-tier, low-complexity, and directly serves the core sentence by helping a finished tribute be seen and shared.

---

## Accessibility Standard

WCAG 2.1 Level AA is the baseline requirement across the entire application, not an optional enhancement.

- Every form field has a real, programmatically associated label. Placeholder text alone is never used as a label.
- Every interactive element has a screen-reader-accessible name describing its specific action and destination.
- Story Assist supports full two-way voice interaction: questions read aloud by the application, not only spoken answers accepted, so the entire flow can be completed without reading anything on screen.
- Contrast ratios meet WCAG AA at minimum by default. The high-contrast toggle is available as a further option, not a substitute for baseline compliance.
- Full keyboard navigation is supported throughout, with a clearly visible focus indicator at all times.
- A skip-navigation link is present at the top of every page.
- Text resizes up to 200 percent without breaking layout or causing content overlap.

A screen is not complete until it satisfies this section and the Guiding Design Standard together.

---

## What Must Never Appear

- No AI-generated or synthetic images, video, or voice of the veteran, at any point in their life, under any circumstance.
- No fabricated quotes or messages attributed to real people, living or deceased.
- No official military seals, crests, or insignia used as template assets. Families may add their own via personal photo upload.
- No verification requirement of any kind blocking the core family-facing flow.
- No visible theme-switching control on a family's published, public-facing tribute page. Once a theme is confirmed at Step 7, that is simply the design of their page. This is distinct from, and does not apply to, the marketing site's own illustrative Templates gallery or the founder's flagship tribute, both of which sit outside the scope of this application.
- No promise, anywhere in the free-tier experience, that fragments will be shaped into finished prose. That capability belongs to Story Assist alone.

---

## Scaling Principle

Every screen must feel calm and unhurried to someone unfamiliar with software, and fast and uncluttered to someone who is not. Progressive disclosure, simple by default, more control available only if sought out, is the mechanism. One experience that quietly adapts, not two different experiences for two different ages.
