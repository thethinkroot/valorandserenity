# Story Assist Research Pipeline

This document specifies the actual mechanism behind Story Assist's live historical research, Job 3 as defined in STORY-ASSIST-SPEC.md. That document defines the behavioral rules and the non-negotiable question-framing requirement. This document defines how the system decides what counts as reliable enough to say at all, and what it does when nothing does.

**The single governing rule underneath everything below**: it is always safer to say nothing than to state something plausible but unconfirmed. A family that gets no historical context for a given date has lost nothing they had. A family that gets a wrong one has lost trust in every true thing on the page around it.

**The second governing rule, equally important**: accuracy is the floor, not the ceiling. This feature exists to give a family a genuine walk down memory lane, a warm, delightful moment of recognition, not a fact-checked report. Every rule below exists to protect that warmth by making sure it's never built on something false. Section "Making It Feel Like Memory, Not a Quiz" at the end of this document is not an afterthought, it is as important as the sourcing rules above it.

---

## Fact Categories, Real Sources, and Real Limits

Verified against actual current sources, not assumed. Each category names where the data genuinely comes from and exactly where its reliability runs out.

**President or head of state on a given date.** Source: public record, complete and uncontested for the entire span of US history. Ceiling: no real limit, statable directly for any date.

**Number one song on a given date.** Three honest tiers, not one. **Day-level**: doesn't exist as a real concept, decline it, no chart has ever tracked a single day. **Week-level**: Billboard's own published historical charts, archived and cross-referenced on Wikipedia's "List of Billboard Hot 100 number ones of [year]" pages, and Billboard's own site hosts the original chart-by-week archive directly. Available from 1958 forward (the Hot 100's actual start), stated as "that week," never "that day." **Year-level, the safest and often the best answer**: Billboard's own year-end recap charts, confirmed running since the 1940s, well before the Hot 100 itself existed, using the era's own named charts. "The year's most popular song" is reliably sourced for essentially any year from the 1940s onward, and is exactly the kind of fact the "born on this day" keepsake industry has long relied on for good reason, it's genuinely well documented without needing false day-level precision.

**Top movie on a given date.** The same three-tier logic applies, and it matters more here, since day and week precision run out much earlier than most people assume. **Day-level**: decline always, this has never been tracked. **Week-level**: Box Office Mojo's real weekend-by-weekend charts, verified to reliably begin only in 1982, decline this tier for anything earlier. **Year-level**: reliable for virtually any year of American film history, either the year's Best Picture Academy Award winner (uncontested public record since the first ceremony in 1929) or the year's highest-grossing or most-discussed film, cross-referenced across industry sources. A film being "the big movie of 1951" is a safe, well-sourced statement even though "the number one movie the week he was born" is not.

**A major news headline on a given date.** Source: the Library of Congress's own "Today in History" collection, and its Chronicling America newspaper archive, which digitizes real American newspaper pages from 1690 through 1963. For dates after 1963, other digitized newspaper archives (ProQuest Historical Newspapers, individual paper archives) extend coverage, cross-referenced the same way. Ceiling: only a specific, dated event confirmed in an actual digitized primary source counts, general "sense of the era" does not.

**Military unit history and service context.** Sources, by branch: the U.S. Army Center of Military History and the Army Heritage and Education Center for Army units, the Naval History and Heritage Command for Navy, the Air Force Historical Research Agency (covering both Air Force and Space Force) for those two, the Coast Guard Historian's Office for Coast Guard, and the National Archives for official unit records across all branches.

**A critical, concrete limit worth building the whole system around**: a 1973 fire at the National Personnel Records Center in St. Louis destroyed roughly 80 percent of Army personnel records from November 1912 to January 1960, and roughly 75 percent of Air Force personnel records from September 1947 to January 1964. This means for a huge share of the exact veterans this product serves, Korean War and early Vietnam War era Army and Air Force service members, an individual's personal service record may simply no longer exist. This is precisely why Story Assist's unit-history research must lean on published, surviving unit histories and the branch historical offices above, not on the assumption that a specific individual's personnel file can ever be retrieved. It also means Story Assist should never imply that the absence of a record found for someone is unusual or suspicious, for a large share of families, it is the expected, well-documented result of a single fire fifty years ago.

---

## The Corroboration Requirement

Any fact above the "president" tier, meaning anything with real ambiguity or thinner sourcing, requires agreement from at least two independent, reputable sources before Story Assist will state it at all. A single source, however credible-sounding, is not sufficient on its own for the song, headline, or unit-history categories. If two sources disagree, or only one can be found, that fact does not get surfaced, full stop, regardless of how plausible it sounds.

---

## The Decline Behavior

When a category's confidence ceiling isn't met for a specific date, the first move is to step down a tier, not give up entirely. For song and movie facts specifically, if day or week-level precision isn't available for the date given, check whether a genuine year-level fact exists before declining, that's very often the honest, satisfying answer sitting one step below the one that was asked for. Only when no tier holds up does Story Assist say so plainly rather than fill the gap. Example, drawn from the actual case that surfaced this rule:

> "We don't have reliable records of what movie was showing on that exact day. Some things about history just weren't tracked that precisely."

This should read as matter-of-fact, not apologetic, and it should never be replaced with a vaguer, softer-sounding guess in an attempt to still say something.

---

## The Personal-Connection Firewall

This is the single most safety-critical rule in the whole pipeline, and it is enforced structurally, not just by instruction. Any content connecting a general historical fact to this specific veteran, "his unit was stationed near X," "he may have experienced Y," must pass through a mandatory question template before it can be shown. There is no code path that allows a personal-connection statement to be generated as a direct assertion. Every one is generated in the form: a verified fact, stated plainly, followed by a direct question inviting the family to confirm or deny any connection. "Records show his unit was in this region during these years. Does that line up with anything he mentioned?" never "He was there when this happened."

---

## Audit Logging

Every fact Story Assist surfaces to a family is logged internally with its category, its sources, and its corroboration status, not shown to the family, but retained. If a family or a later reviewer ever flags something as wrong, there must be a way to trace exactly why the system believed it was reliable enough to show, and to correct the underlying sourcing rule if the failure was systemic rather than a one-off.

---

## What This Means for the Live Conversation (Step 4)

Because reliable research takes real retrieval and cross-checking, not instant recall, Story Assist's live historical-context moments in the conversational flow should be treated as a genuine lookup with a brief, honest pause, not a guaranteed instant response. The interaction standard's calm, unhurried pacing principle applies directly here: a short "Looking into that year for you" moment is honest and appropriate. A confident-sounding instant answer that turns out to be wrong is not an acceptable tradeoff for speed.

---

## Making It Feel Like Memory, Not a Quiz

Every rule above exists so this part can be trusted. This is where the actual experience gets designed.

**Choose the evocative fact over the first fact.** When more than one true, sourced detail is available for a date, pick the one most likely to spark real recognition, a song people would hum, not just its chart position, a cultural moment people lived through, not just an obscure headline that happens to be verifiable. Accuracy is the filter for what's allowed in. Warmth is what decides which of the allowed things actually gets used.

**Write it as a moment, not a citation.** Mike's own example is the model to hold every other one to: a couple of warm sentences that read like someone telling you something, not a database record, "That same day, the Rochester Royals beat the New York Knicks to win the NBA Finals," never "NBA Finals Game 7 result: Rochester def. New York." The sourcing discipline happens behind the scenes. What the family sees is a story.

**Group related facts into one small snapshot, not a list.** Two or three details woven into a short paragraph land as a picture of a moment in time. The same details as bullet points land as a trivia card. Keep the format Mike's callouts already use.

**Never let a decline feel like a failure.** When a category can't be answered for a date, that sentence should carry the same warmth as everything around it, "Some things about history just weren't tracked that precisely," not a clinical "No data available for this query." The family should never feel like they hit an error. They should feel like they learned something true about how memory and record-keeping actually work.

**The question at the end is an invitation, not a test.** "Does that sound familiar?" should read like a friend nudging a memory loose, not a fact-checker asking for confirmation. The entire emotional value of this feature lives in that one sentence landing warm rather than clinical, no matter how rigorous everything that produced it had to be.

---

## Technical Architecture, How the Tiers Actually Get Built

The confidence-tier system above is a specification of behavior, not yet a description of how to build it. Here is the actual, buildable shape, and the core principle is separating fact-finding from fact-telling into two distinct phases that never blur together.

**Phase one: tier routing, deterministic, not left to a model's judgment.** Before any research happens, a simple, hard-coded lookup, not an AI decision, determines which tier is even reachable for a given category and date. A movie query for a date before 1982 never attempts a week-level answer at all, it routes straight to the year tier. A song query before 1958 never attempts an Hot-100-style weekly answer. This routing table is the same for every request, every time, auditable and testable on its own, completely independent of anything a language model decides in the moment.

**Phase two: constrained retrieval, from the approved source list only.** Once the tier is known, retrieval happens only against the specific sources named earlier in this document, Billboard's own historical charts, Box Office Mojo, the Library of Congress's Chronicling America and Today in History, the named service historical offices. This is not an open-ended web search hoping for the best, it is a targeted lookup against a fixed, pre-approved list.

**Phase three: corroboration, a hard gate, not a suggestion.** For anything above the president tier, the retrieved fact must be confirmed by at least two of the approved sources independently before it is allowed to proceed. If only one source can be found, or two sources disagree, the fact is rejected at this stage and the request falls back a tier, or declines, per the rules already specified. This gate runs the same way every time; it is not a matter of the system "feeling confident."

**Phase four: the warmth pass, and only here does language-model rewriting belong.** Once a fact has cleared corroboration, a final step rewrites the verified, structured fact into warm, story-like prose, the "Making It Feel Like Memory" section above. This step is explicitly forbidden from introducing any new fact, date, name, or detail that did not survive phase three. Its only job is tone, turning verified data into something that reads like a person telling a story. Keeping this step strictly downstream of, and blind to anything except, the already-verified fact is what makes the warmth safe to build at all, it can never accidentally invent the very thing the rest of this document exists to prevent.

This four-phase shape, deterministic routing, constrained retrieval, hard corroboration gate, then a strictly bounded rewrite, is buildable and testable independently at each phase, before any of it is wired into the conversational flow in Step 4.
