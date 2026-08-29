-- Adds the actual tribute content the 8-step guided flow collects.
-- 0001_init.sql covers only what the tribute-link security slice needed
-- (token, visibility, title, privacy word). Everything below is new;
-- 0001 is untouched, per migration convention.
--
-- Text, not integer, for every year field: start.html's inputs are plain
-- text (data-check="year" is a soft format hint, not a numeric input
-- type), so a family can type "around 1969" and have it stored exactly
-- as given, not rejected or coerced.

ALTER TABLE tributes ADD COLUMN subject_mode TEXT;
ALTER TABLE tributes ADD COLUMN full_name TEXT;
ALTER TABLE tributes ADD COLUMN branch TEXT;
ALTER TABLE tributes ADD COLUMN service_from_year TEXT;
ALTER TABLE tributes ADD COLUMN service_to_year TEXT;
ALTER TABLE tributes ADD COLUMN born_year TEXT;
ALTER TABLE tributes ADD COLUMN passed_year TEXT;
ALTER TABLE tributes ADD COLUMN story_text TEXT;
ALTER TABLE tributes ADD COLUMN honors TEXT;
ALTER TABLE tributes ADD COLUMN photo_key TEXT;
