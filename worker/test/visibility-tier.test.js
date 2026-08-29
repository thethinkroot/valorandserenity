import { describe, it, expect, beforeEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../src/index.js';

const ORIGIN = 'http://localhost:8935';

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM tributes').run();
});

function basePayload(overrides) {
  return {
    fullName: 'Visibility Test Subject',
    consentPhotoRights: true,
    consentAuthorized: true,
    consentStoryReviewed: true,
    consentVersion: '1',
    ...overrides,
  };
}

async function postTribute(payload) {
  return worker.fetch(
    new Request('https://example.com/tribute', {
      method: 'POST',
      headers: { 'content-type': 'application/json', Origin: ORIGIN },
      body: JSON.stringify(payload),
    }),
    env
  );
}

describe('the real visibility-tier choice, wired through to a real D1 row', () => {
  it.each(['private', 'family', 'community'])(
    'stores exactly the chosen tier (%s), queried back from the real row, not just trusted from the create response',
    async (tier) => {
      const response = await postTribute(basePayload({ visibility: tier }));
      expect(response.status).toBe(201);
      const { token, visibility } = await response.json();
      expect(visibility).toBe(tier);

      const row = await env.DB.prepare('SELECT visibility FROM tributes WHERE token = ?').bind(token).first();
      expect(row.visibility).toBe(tier);
    }
  );

  it('falls back to the most restrictive tier (private) when visibility is missing entirely', async () => {
    const response = await postTribute(basePayload());
    expect(response.status).toBe(201);
    const { visibility } = await response.json();
    expect(visibility).toBe('private');
  });

  it('falls back to private rather than rejecting or defaulting open, for a malformed value', async () => {
    const response = await postTribute(basePayload({ visibility: 'public-to-everyone' }));
    expect(response.status).toBe(201);
    const { visibility } = await response.json();
    expect(visibility).toBe('private');
  });

  it('only stores a privacy word hash for Private, never for Family or Community, even if one is sent', async () => {
    const response = await postTribute(
      basePayload({ visibility: 'community', privacyWord: 'should be ignored for this tier' })
    );
    const { token } = await response.json();
    const row = await env.DB.prepare('SELECT privacy_word_hash FROM tributes WHERE token = ?').bind(token).first();
    expect(row.privacy_word_hash).toBeNull();
  });

  it('does store a real privacy word hash for Private when one is given, and it actually gates access', async () => {
    const response = await postTribute(
      basePayload({ visibility: 'private', privacyWord: 'his favorite fishing spot' })
    );
    const { token } = await response.json();

    const noWord = await worker.fetch(new Request(`https://example.com/tribute/${token}`), env);
    expect(noWord.status).toBe(401);

    const withWord = await worker.fetch(
      new Request(`https://example.com/tribute/${token}?word=${encodeURIComponent('his favorite fishing spot')}`),
      env
    );
    expect(withWord.status).toBe(200);
  });

  it('the consent gate still applies regardless of which visibility tier is chosen', async () => {
    const response = await postTribute({
      fullName: 'Should Not Publish',
      visibility: 'community',
      consentPhotoRights: true,
      consentAuthorized: true,
      consentStoryReviewed: false,
      consentVersion: '1',
    });
    expect(response.status).toBe(400);
  });
});
