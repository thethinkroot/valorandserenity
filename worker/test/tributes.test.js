import { describe, it, expect, beforeEach, vi } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../src/index.js';
import {
  createTribute,
  getTribute,
  isNoindexTier,
  requiresPrivacyWordGate,
  verifyPrivacyWord,
  listSitemapEligibleTributes,
  InvalidVisibilityError,
} from '../src/tributes.js';

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM tributes').run();
});

describe('createTribute / getTribute', () => {
  it('round-trips a tribute record through D1', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'community',
      title: "Major Mike Mesarch's Tribute",
    });

    const fetched = await getTribute(env.DB, created.token);
    expect(fetched.title).toBe("Major Mike Mesarch's Tribute");
    expect(fetched.visibility).toBe('community');
    expect(fetched.privacyWordHash).toBeNull();
  });

  it('rejects an invalid visibility tier', async () => {
    await expect(
      createTribute(env.DB, { skipConsentCheck: true, visibility: 'public-to-everyone' })
    ).rejects.toThrow(InvalidVisibilityError);
  });

  it('never stores the privacy word in plaintext', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'private',
      privacyWord: 'his favorite fishing spot',
    });
    const row = await env.DB
      .prepare('SELECT privacy_word_hash FROM tributes WHERE token = ?')
      .bind(created.token)
      .first();
    expect(row.privacy_word_hash).not.toContain('his favorite fishing spot');
    expect(row.privacy_word_hash).toMatch(/^[0-9a-f]{64}$/); // SHA-256 hex
  });

  it('round-trips every real content field the 8-step flow collects (0002_content.sql)', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'private',
      title: 'Jane Smith',
      subjectMode: 'passed',
      fullName: 'Jane Smith',
      branch: 'Navy',
      serviceFromYear: '1990',
      serviceToYear: '2010',
      bornYear: '1968',
      passedYear: '2023',
      storyText: 'She loved the sea long before she ever served on it.',
      honors: ['Navy Achievement Medal', 'Good Conduct Medal'],
      photoKey: 'somePhotoKey123',
    });

    const fetched = await getTribute(env.DB, created.token);
    expect(fetched.subjectMode).toBe('passed');
    expect(fetched.fullName).toBe('Jane Smith');
    expect(fetched.branch).toBe('Navy');
    expect(fetched.serviceFromYear).toBe('1990');
    expect(fetched.serviceToYear).toBe('2010');
    expect(fetched.bornYear).toBe('1968');
    expect(fetched.passedYear).toBe('2023');
    expect(fetched.storyText).toBe('She loved the sea long before she ever served on it.');
    expect(fetched.honors).toEqual(['Navy Achievement Medal', 'Good Conduct Medal']);
    expect(fetched.photoKey).toBe('somePhotoKey123');
  });

  it('leaves every new content field null when a caller (e.g. the older tribute-link flow) never sets them', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'community', title: 'Untouched Fields' });
    const fetched = await getTribute(env.DB, created.token);
    expect(fetched.fullName).toBeNull();
    expect(fetched.branch).toBeNull();
    expect(fetched.honors).toBeNull();
    expect(fetched.photoKey).toBeNull();
  });
});

describe('D1 read/write volume, per the free-tier check', () => {
  // The free-tier math in README.md rests on one claim: creating a tribute
  // is exactly one write, and viewing one is exactly one read. These tests
  // verify that structurally, by spying on env.DB.prepare, rather than
  // assuming it from reading the code.
  it('creates a tribute with exactly one D1 statement', async () => {
    const prepareSpy = vi.spyOn(env.DB, 'prepare');
    await createTribute(env.DB, { skipConsentCheck: true, visibility: 'community', title: 'Spy Test' });
    expect(prepareSpy).toHaveBeenCalledTimes(1);
    prepareSpy.mockRestore();
  });

  it('reads a tribute with exactly one D1 statement', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'community', title: 'Spy Test 2' });
    const prepareSpy = vi.spyOn(env.DB, 'prepare');
    await getTribute(env.DB, created.token);
    expect(prepareSpy).toHaveBeenCalledTimes(1);
    prepareSpy.mockRestore();
  });
});

describe('visibility rules', () => {
  it('marks Private and Family and Friends as noindex, and Community as not', () => {
    expect(isNoindexTier('private')).toBe(true);
    expect(isNoindexTier('family')).toBe(true);
    expect(isNoindexTier('community')).toBe(false);
  });

  it('a Community tribute has no privacy-word gate at all', async () => {
    const record = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'community' });
    expect(requiresPrivacyWordGate(record)).toBe(false);

    // Even if somehow asked to verify a word against a Community record
    // (which never has a hash), verification is a no-op pass, never a gate.
    expect(await verifyPrivacyWord(record, undefined)).toBe(true);
    expect(await verifyPrivacyWord(record, 'anything')).toBe(true);
  });

  it('a Family and Friends tribute never gates on a word either', async () => {
    const record = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'family' });
    expect(requiresPrivacyWordGate(record)).toBe(false);
  });

  it('a Private tribute that skipped the word has no gate', async () => {
    const record = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'private' });
    expect(requiresPrivacyWordGate(record)).toBe(false);
  });

  it('a Private tribute with a word set requires it, and rejects the wrong one', async () => {
    const record = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'private',
      privacyWord: 'correct horse battery staple',
    });
    expect(requiresPrivacyWordGate(record)).toBe(true);
    expect(await verifyPrivacyWord(record, 'guessed wrong')).toBe(false);
    expect(await verifyPrivacyWord(record, undefined)).toBe(false);
    expect(await verifyPrivacyWord(record, 'correct horse battery staple')).toBe(true);
  });
});

describe('listSitemapEligibleTributes', () => {
  it('only ever returns Community tributes, never Private or Family and Friends', async () => {
    await createTribute(env.DB, { skipConsentCheck: true, visibility: 'private', title: 'Private One' });
    await createTribute(env.DB, { skipConsentCheck: true, visibility: 'family', title: 'Family One' });
    const communityA = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'community', title: 'Community A' });
    const communityB = await createTribute(env.DB, { skipConsentCheck: true, visibility: 'community', title: 'Community B' });

    const eligible = await listSitemapEligibleTributes(env.DB);
    const titles = eligible.map((r) => r.title).sort();

    expect(titles).toEqual(['Community A', 'Community B']);
    expect(eligible.some((r) => r.token === communityA.token)).toBe(true);
    expect(eligible.some((r) => r.token === communityB.token)).toBe(true);
  });
});

describe('HTTP behavior end to end', () => {
  it('serves a Community tribute directly, with no privacy-word gate and no noindex', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'community',
      title: 'A Public Tribute',
      fullName: 'A Public Tribute',
    });

    const response = await worker.fetch(
      new Request(`https://example.com/tribute/${created.token}`),
      env
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Robots-Tag')).toBeNull();
    expect(body).not.toContain('noindex');
    expect(body).toContain('A Public Tribute');
  });

  it("does not render a Private tribute's content without the correct word", async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'private',
      privacyWord: 'his favorite fishing spot',
      title: 'A Very Private Tribute',
      fullName: 'A Very Private Tribute',
    });

    const noWord = await worker.fetch(
      new Request(`https://example.com/tribute/${created.token}`),
      env
    );
    const noWordBody = await noWord.text();
    expect(noWord.status).toBe(401);
    expect(noWordBody).not.toContain('A Very Private Tribute');

    const wrongWord = await worker.fetch(
      new Request(`https://example.com/tribute/${created.token}?word=nope`),
      env
    );
    const wrongWordBody = await wrongWord.text();
    expect(wrongWord.status).toBe(401);
    expect(wrongWordBody).not.toContain('A Very Private Tribute');
  });

  it('renders a Private tribute once the correct word is supplied, marked noindex', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'private',
      privacyWord: 'his favorite fishing spot',
      title: 'A Very Private Tribute',
      fullName: 'A Very Private Tribute',
    });

    const response = await worker.fetch(
      new Request(
        `https://example.com/tribute/${created.token}?word=${encodeURIComponent('his favorite fishing spot')}`
      ),
      env
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('A Very Private Tribute');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(body).toContain('<meta name="robots" content="noindex, nofollow">');
  });

  it('marks a Family and Friends tribute noindex even though it has no privacy-word gate', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'family',
      title: 'A Family Tribute',
      fullName: 'A Family Tribute',
    });

    const response = await worker.fetch(
      new Request(`https://example.com/tribute/${created.token}`),
      env
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('A Family Tribute');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
  });

  it('creates a tribute via POST and returns only the token and visibility, never the word', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/tribute', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Origin: 'http://localhost:8935' },
        body: JSON.stringify({
          visibility: 'private',
          privacyWord: 'super secret',
          title: 'Created Through the API',
          consentPhotoRights: true,
          consentAuthorized: true,
          consentStoryReviewed: true,
          consentVersion: '1',
        }),
      }),
      env
    );
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.token).toBeTruthy();
    expect(json.visibility).toBe('private');
    expect(JSON.stringify(json)).not.toContain('super secret');
  });

  it('returns 404 for an unknown token', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/tribute/does-not-exist'),
      env
    );
    expect(response.status).toBe(404);
  });
});

describe('the privacy-word screen', () => {
  it('uses the exact required copy, and never the words passphrase, password, or security', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/screens/privacy-word'),
      env
    );
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('Want one more layer of privacy?');
    expect(body).toContain(
      'Choose a simple word to share with family yourself, like handing someone a house key.'
    );
    expect(body).toContain('Skip this');

    const lowerBody = body.toLowerCase();
    expect(lowerBody).not.toContain('passphrase');
    expect(lowerBody).not.toContain('password');
    expect(lowerBody).not.toContain('security');
  });

  it('gives Continue and Skip this equal visual weight, not a buried secondary link', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/screens/privacy-word'),
      env
    );
    const body = await response.text();

    // Both are real, equally-styled buttons inside the same actions group,
    // not a prominent button next to a plain text link.
    expect(body).toMatch(/<button[^>]*>Continue<\/button>/);
    expect(body).toMatch(/<button[^>]*>Skip this<\/button>/);
  });
});

describe('the gate page shown for a Private tribute', () => {
  it('never uses the words passphrase, password, or security either', async () => {
    const created = await createTribute(env.DB, { skipConsentCheck: true,
      visibility: 'private',
      privacyWord: 'his favorite fishing spot',
      title: 'A Very Private Tribute',
    });

    const response = await worker.fetch(
      new Request(`https://example.com/tribute/${created.token}`),
      env
    );
    const body = (await response.text()).toLowerCase();

    expect(body).not.toContain('passphrase');
    expect(body).not.toContain('password');
    expect(body).not.toContain('security');
  });
});
