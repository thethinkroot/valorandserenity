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
export async function createTribute(db, { visibility, privacyWord = null, title = 'Untitled Tribute' }) {
  if (!VISIBILITY_TIERS.includes(visibility)) {
    throw new InvalidVisibilityError(`Invalid visibility tier: ${visibility}`);
  }

  const token = generateTributeToken();
  const createdAt = new Date().toISOString();
  const privacyWordHash = privacyWord ? await hashPrivacyWord(privacyWord) : null;

  await db
    .prepare(
      'INSERT INTO tributes (token, visibility, title, privacy_word_hash, created_at) VALUES (?, ?, ?, ?, ?)'
    )
    .bind(token, visibility, title, privacyWordHash, createdAt)
    .run();

  return { token, visibility, title, privacyWordHash, createdAt };
}

// One row read per tribute view. This is the only query a page view
// triggers; the privacy-word check happens against the row already in
// hand, never a second query.
export async function getTribute(db, token) {
  const row = await db
    .prepare(
      'SELECT token, visibility, title, privacy_word_hash, created_at FROM tributes WHERE token = ?'
    )
    .bind(token)
    .first();

  if (!row) return null;

  return {
    token: row.token,
    visibility: row.visibility,
    title: row.title,
    privacyWordHash: row.privacy_word_hash,
    createdAt: row.created_at,
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
