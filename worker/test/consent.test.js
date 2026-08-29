import { describe, it, expect, beforeEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../src/index.js';
import { createTribute, getTribute, MissingConsentError } from '../src/tributes.js';

const ORIGIN = 'http://localhost:8935';

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM tributes').run();
});

describe('the real consent record, not just the checkbox UI', () => {
  it('refuses to create a tribute if any of the three attestations is missing, at the storage layer', async () => {
    await expect(
      createTribute(env.DB, {
        visibility: 'private',
        consentPhotoRights: true,
        consentAuthorized: true,
        consentStoryReviewed: false, // the one that's missing
        consentVersion: '1',
      })
    ).rejects.toThrow(MissingConsentError);
  });

  it('refuses if consentVersion is missing even when all three booleans are true', async () => {
    await expect(
      createTribute(env.DB, {
        visibility: 'private',
        consentPhotoRights: true,
        consentAuthorized: true,
        consentStoryReviewed: true,
        // consentVersion omitted
      })
    ).rejects.toThrow(MissingConsentError);
  });

  it('rejects a truthy-but-not-strictly-true value, so "yes" or 1 cannot slip past the gate', async () => {
    await expect(
      createTribute(env.DB, {
        visibility: 'private',
        consentPhotoRights: 'yes',
        consentAuthorized: true,
        consentStoryReviewed: true,
        consentVersion: '1',
      })
    ).rejects.toThrow(MissingConsentError);
  });

  it('stores a real, timestamped, versioned consent record when all three are genuinely true, queryable back from D1', async () => {
    const created = await createTribute(env.DB, {
      visibility: 'private',
      fullName: 'Consent Test Subject',
      consentPhotoRights: true,
      consentAuthorized: true,
      consentStoryReviewed: true,
      consentVersion: '1',
    });

    // Query it back directly from D1, not just trust createTribute's return value.
    const row = await env.DB
      .prepare(
        `SELECT consent_photo_rights, consent_authorized, consent_story_reviewed,
          consent_version, consent_recorded_at FROM tributes WHERE token = ?`
      )
      .bind(created.token)
      .first();

    expect(row.consent_photo_rights).toBe(1);
    expect(row.consent_authorized).toBe(1);
    expect(row.consent_story_reviewed).toBe(1);
    expect(row.consent_version).toBe('1');
    expect(row.consent_recorded_at).toBeTruthy();
    // A real ISO timestamp, not a placeholder string.
    expect(new Date(row.consent_recorded_at).toString()).not.toBe('Invalid Date');

    // Also confirm getTribute() surfaces the same real record.
    const fetched = await getTribute(env.DB, created.token);
    expect(fetched.consentPhotoRights).toBe(true);
    expect(fetched.consentAuthorized).toBe(true);
    expect(fetched.consentStoryReviewed).toBe(true);
    expect(fetched.consentVersion).toBe('1');
    expect(fetched.consentRecordedAt).toBe(row.consent_recorded_at);
  });

  it('POST /tribute rejects publishing over the real HTTP path when consent is incomplete, with a plain error, not a silent 500', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/tribute', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Origin: ORIGIN },
        body: JSON.stringify({
          fullName: 'Should Not Publish',
          consentPhotoRights: true,
          consentAuthorized: true,
          consentStoryReviewed: false,
          consentVersion: '1',
        }),
      }),
      env
    );
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toMatch(/consent/i);

    // And confirm nothing was actually written.
    const { results } = await env.DB.prepare('SELECT * FROM tributes').all();
    expect(results.length).toBe(0);
  });

  it('POST /tribute succeeds and the real record is queryable when all three are genuinely checked', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/tribute', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Origin: ORIGIN },
        body: JSON.stringify({
          fullName: 'Real Consent Publish',
          consentPhotoRights: true,
          consentAuthorized: true,
          consentStoryReviewed: true,
          consentVersion: '1',
        }),
      }),
      env
    );
    expect(response.status).toBe(201);
    const { token } = await response.json();

    const row = await env.DB
      .prepare('SELECT consent_photo_rights, consent_authorized, consent_story_reviewed FROM tributes WHERE token = ?')
      .bind(token)
      .first();
    expect(row.consent_photo_rights).toBe(1);
    expect(row.consent_authorized).toBe(1);
    expect(row.consent_story_reviewed).toBe(1);
  });
});
