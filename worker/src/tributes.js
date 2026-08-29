// Tribute record storage and visibility enforcement, backed by Cloudflare
// D1. See ../README.md for why D1 was chosen over KV for this slice, and
// for the free-tier read/write volume check.

import { generateTributeToken } from './tokens.js';
import { hashPrivacyWord, constantTimeEqual } from './privacy-word.js';

export const VISIBILITY_TIERS = ['private', 'family', 'community'];

export class InvalidVisibilityError extends Error {}

// Creates a tribute record with a freshly generated, unguessable token and
// persists it to D1. The privacy word, if given, is hashed before storage;
// the plaintext is never written to the database or logged. One row
// written per tribute created.
//
// The content fields (subjectMode through honors) are the actual data the
// 8-step guided flow collects (see start.html's serializeDraft()), added
// in 0002_content.sql. All optional here, since createTribute is also used
// by the older tribute-link tests that only care about visibility/title.
export async function createTribute(db, {
  visibility,
  privacyWord = null,
  title = 'Untitled Tribute',
  subjectMode = null,
  fullName = null,
  branch = null,
  serviceFromYear = null,
  serviceToYear = null,
  bornYear = null,
  passedYear = null,
  storyText = null,
  honors = null,
  photoKey = null,
} = {}) {
  if (!VISIBILITY_TIERS.includes(visibility)) {
    throw new InvalidVisibilityError(`Invalid visibility tier: ${visibility}`);
  }

  const token = generateTributeToken();
  const createdAt = new Date().toISOString();
  const privacyWordHash = privacyWord ? await hashPrivacyWord(privacyWord) : null;
  // Stored as a JSON string (a plain array of honor names); D1 has no
  // native array/JSON column type, and Step 5 doesn't collect anything
  // richer than a name per honor yet.
  const honorsJson = honors ? JSON.stringify(honors) : null;

  await db
    .prepare(
      `INSERT INTO tributes (
        token, visibility, title, privacy_word_hash, created_at,
        subject_mode, full_name, branch, service_from_year, service_to_year,
        born_year, passed_year, story_text, honors, photo_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      token, visibility, title, privacyWordHash, createdAt,
      subjectMode, fullName, branch, serviceFromYear, serviceToYear,
      bornYear, passedYear, storyText, honorsJson, photoKey
    )
    .run();

  return {
    token, visibility, title, privacyWordHash, createdAt,
    subjectMode, fullName, branch, serviceFromYear, serviceToYear,
    bornYear, passedYear, storyText, honors: honors || null, photoKey,
  };
}

// One row read per tribute view. This is the only query a page view
// triggers; the privacy-word check happens against the row already in
// hand, never a second query.
export async function getTribute(db, token) {
  const row = await db
    .prepare(
      `SELECT token, visibility, title, privacy_word_hash, created_at,
        subject_mode, full_name, branch, service_from_year, service_to_year,
        born_year, passed_year, story_text, honors, photo_key
      FROM tributes WHERE token = ?`
    )
    .bind(token)
    .first();

  if (!row) return null;

  let honors = null;
  if (row.honors) {
    try { honors = JSON.parse(row.honors); } catch { honors = null; }
  }

  return {
    token: row.token,
    visibility: row.visibility,
    title: row.title,
    privacyWordHash: row.privacy_word_hash,
    createdAt: row.created_at,
    subjectMode: row.subject_mode,
    fullName: row.full_name,
    branch: row.branch,
    serviceFromYear: row.service_from_year,
    serviceToYear: row.service_to_year,
    bornYear: row.born_year,
    passedYear: row.passed_year,
    storyText: row.story_text,
    honors,
    photoKey: row.photo_key,
  };
}

// Private and Family and Friends tiers must never be indexed: no search
// engine, no AI crawler, no internal listing should ever learn these pages
// exist. Community is the only tier a crawler is welcome to see.
export function isNoindexTier(visibility) {
  return visibility === 'private' || visibility === 'family';
}

// Only Private tributes ever show the privacy-word gate, and only when the
// family actually chose to set a word rather than skipping it. Family and
// Friends and Community rely on the link alone (per spec: "the link is the
// key"), never on this extra word.
export function requiresPrivacyWordGate(record) {
  return record.visibility === 'private' && Boolean(record.privacyWordHash);
}

export async function verifyPrivacyWord(record, suppliedWord) {
  if (!record.privacyWordHash) {
    // The family skipped this; nothing to check.
    return true;
  }
  if (!suppliedWord) {
    return false;
  }
  const suppliedHash = await hashPrivacyWord(suppliedWord);
  return constantTimeEqual(suppliedHash, record.privacyWordHash);
}

// Returns only the tributes eligible to appear in a public listing or
// sitemap. This is the single choke point a sitemap generator or any future
// "browse tributes" feature must call through, so Private and Family and
// Friends tributes structurally cannot leak into a crawlable listing. Rows
// read equals the number of Community tributes that exist, not the total
// tribute count.
export async function listSitemapEligibleTributes(db) {
  const { results } = await db
    .prepare(
      "SELECT token, visibility, title, created_at FROM tributes WHERE visibility = 'community'"
    )
    .all();

  return results.map((row) => ({
    token: row.token,
    visibility: row.visibility,
    title: row.title,
    createdAt: row.created_at,
  }));
}
