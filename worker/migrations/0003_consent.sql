-- The real legal record behind Step 8's three required consent
-- checkboxes. The checkbox UI alone proves nothing after the fact; this
-- is what does: what was agreed to, exactly which wording version was
-- shown, and when. All three checkboxes are a hard, server-enforced
-- gate (see handleCreate in index.js), so in practice these three
-- columns are always 1 on a real published tribute, but they're stored
-- individually rather than as one combined flag in case the checkboxes
-- are ever split into genuinely separate, independently-gated consents.

ALTER TABLE tributes ADD COLUMN consent_photo_rights INTEGER;
ALTER TABLE tributes ADD COLUMN consent_authorized INTEGER;
ALTER TABLE tributes ADD COLUMN consent_story_reviewed INTEGER;
ALTER TABLE tributes ADD COLUMN consent_version TEXT;
ALTER TABLE tributes ADD COLUMN consent_recorded_at TEXT;
