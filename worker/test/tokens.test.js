import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateTributeToken } from '../src/tokens.js';

describe('generateTributeToken', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('produces a URL-safe token of substantial length', () => {
    const token = generateTributeToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    // 32 random bytes base64url-encode to 43 characters (no padding).
    expect(token.length).toBeGreaterThanOrEqual(40);
  });

  it('uses crypto.getRandomValues, never Math.random', () => {
    const getRandomValuesSpy = vi.spyOn(crypto, 'getRandomValues');
    const mathRandomSpy = vi.spyOn(Math, 'random');

    generateTributeToken();

    expect(getRandomValuesSpy).toHaveBeenCalledTimes(1);
    expect(mathRandomSpy).not.toHaveBeenCalled();
  });

  it('never repeats across a large sample', () => {
    const seen = new Set();
    const sampleSize = 2000;
    for (let i = 0; i < sampleSize; i++) {
      seen.add(generateTributeToken());
    }
    expect(seen.size).toBe(sampleSize);
  });

  it('two consecutively generated tokens are not predictable from each other', () => {
    // A sequential or counter-based generator would produce tokens that
    // share a long common prefix or differ by a small, structured amount.
    // Across many consecutive pairs, a true CSPRNG should essentially
    // never produce a shared prefix of meaningful length.
    const pairs = 500;
    let sharedPrefixHits = 0;

    let previous = generateTributeToken();
    for (let i = 0; i < pairs; i++) {
      const next = generateTributeToken();
      expect(next).not.toBe(previous);

      const sharedPrefixLength = commonPrefixLength(previous, next);
      if (sharedPrefixLength >= 6) {
        sharedPrefixHits++;
      }
      previous = next;
    }

    // With 64 possible characters per position, a 6-character shared
    // prefix by chance has probability roughly 64^-6, effectively zero
    // across 500 pairs. Any real hit count here would indicate the
    // generator is not producing independent, unpredictable output.
    expect(sharedPrefixHits).toBe(0);
  });

  it('supports a configurable byte length while staying well above a guessable size', () => {
    const token = generateTributeToken(16);
    expect(token.length).toBeGreaterThanOrEqual(20);
  });
});

function commonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return i;
}
