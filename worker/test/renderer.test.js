import { describe, it, expect, beforeEach } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../src/index.js';

const ORIGIN = 'http://localhost:8935';

beforeEach(async () => {
  await env.DB.prepare('DELETE FROM tributes').run();
});

async function createViaApi(fields) {
  const response = await worker.fetch(
    new Request('https://example.com/tribute', {
      method: 'POST',
      headers: { 'content-type': 'application/json', Origin: ORIGIN },
      body: JSON.stringify(fields),
    }),
    env
  );
  expect(response.status).toBe(201);
  return response.json();
}

describe('the real tribute renderer, end to end', () => {
  it('renders an Army, passed-mode tribute with real name, dates, branch theme, story, and honors', async () => {
    const { token } = await createViaApi({
      subjectMode: 'passed',
      fullName: 'Major Mike Test',
      branch: 'Army',
      serviceFromYear: '1971',
      serviceToYear: '1994',
      bornYear: '1951',
      passedYear: '2020',
      storyText: 'He served with the 187th Infantry.\n\nHe loved his family above all.',
      honors: ['Bronze Star', 'Army Commendation Medal'],
      photoKey: 'test-photo-key-army',
    });

    const response = await worker.fetch(new Request(`https://example.com/tribute/${token}`), env);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('data-theme="army"');
    expect(body).toContain('Major Mike Test');
    expect(body).toContain('United States Army');
    expect(body).toContain('1971&ndash;1994');
    expect(body).toContain('1951&ndash;2020');
    expect(body).toContain('He served with the 187th Infantry.');
    expect(body).toContain('He loved his family above all.');
    expect(body).toContain('Bronze Star');
    expect(body).toContain('Army Commendation Medal');
    expect(body).toContain('src="/photo/test-photo-key-army"');
    // Real theme color, not the default fallback.
    expect(body).toContain('--copper: #A8842A');
  });

  it('renders a Navy, living-mode tribute differently, to confirm this is not hardcoded to one case', async () => {
    const { token } = await createViaApi({
      subjectMode: 'living',
      fullName: 'Petty Officer Jane Living',
      branch: 'Navy',
      serviceFromYear: '2005',
      bornYear: '1983',
      storyText: 'Still serving, still telling stories.',
      honors: [],
      photoKey: null,
    });

    const response = await worker.fetch(new Request(`https://example.com/tribute/${token}`), env);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('data-theme="navy"');
    expect(body).toContain('Petty Officer Jane Living');
    expect(body).toContain('United States Navy');
    expect(body).toContain('Still serving, still telling stories.');
    expect(body).toContain('--copper: #9C8737');
    // Living mode: no passed year, so no en-dash date range, just the birth year.
    expect(body).not.toContain('<p class="cover-dates">1983&ndash;');
    expect(body).toContain('1983');
    // No photo this time, no rendered honors list, and definitely not the other test's data.
    expect(body).not.toContain('<img');
    expect(body).not.toContain('<ul class="honors-list">');
    expect(body).not.toContain('Major Mike Test');
  });

  it('every new tribute defaults to private (noindex, token-required) since there is no tier-selection UI yet', async () => {
    const { visibility } = await createViaApi({ fullName: 'Default Visibility Check' });
    expect(visibility).toBe('private');
  });

  it('rejects the create request from a disallowed origin, same as the photo endpoint', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/tribute', {
        method: 'POST',
        headers: { 'content-type': 'application/json', Origin: 'https://not-this-site.example' },
        body: JSON.stringify({ fullName: 'Should Not Be Created' }),
      }),
      env
    );
    expect(response.status).toBe(403);
  });
});
