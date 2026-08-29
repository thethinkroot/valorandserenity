import { describe, it, expect } from 'vitest';
import { env } from 'cloudflare:test';
import worker from '../src/index.js';
import { storePhoto, fetchPhoto, MAX_PHOTO_BYTES, PhotoTooLargeError, UnsupportedPhotoTypeError } from '../src/photos.js';

function jpegBytes(size = 1024) {
  const bytes = new Uint8Array(size);
  bytes[0] = 0xff;
  bytes[1] = 0xd8; // Real JPEG magic number, not just arbitrary bytes.
  return bytes;
}

describe('storePhoto / fetchPhoto', () => {
  it('round-trips a photo through R2', async () => {
    const body = jpegBytes(2048);
    const key = await storePhoto(env.PHOTOS, {
      body,
      contentType: 'image/jpeg',
      byteLength: body.byteLength,
    });

    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(10);

    const fetched = await fetchPhoto(env.PHOTOS, key);
    expect(fetched).not.toBeNull();
    expect(fetched.httpMetadata.contentType).toBe('image/jpeg');
    const fetchedBytes = new Uint8Array(await fetched.arrayBuffer());
    expect(fetchedBytes).toEqual(body);
  });

  it('generates a different key for every upload, not a predictable one', async () => {
    const body = jpegBytes(100);
    const keyA = await storePhoto(env.PHOTOS, { body, contentType: 'image/jpeg', byteLength: body.byteLength });
    const keyB = await storePhoto(env.PHOTOS, { body, contentType: 'image/jpeg', byteLength: body.byteLength });
    expect(keyA).not.toBe(keyB);
  });

  it('rejects a file over the size limit', async () => {
    const body = jpegBytes(10);
    await expect(
      storePhoto(env.PHOTOS, { body, contentType: 'image/jpeg', byteLength: MAX_PHOTO_BYTES + 1 })
    ).rejects.toThrow(PhotoTooLargeError);
  });

  it('rejects a content type that is not an image', async () => {
    const body = new TextEncoder().encode('not a photo');
    await expect(
      storePhoto(env.PHOTOS, { body, contentType: 'application/pdf', byteLength: body.byteLength })
    ).rejects.toThrow(UnsupportedPhotoTypeError);
  });

  it('returns null for a key that was never stored', async () => {
    const result = await fetchPhoto(env.PHOTOS, 'never-uploaded-key');
    expect(result).toBeNull();
  });
});

describe('POST /photo', () => {
  it('uploads a real photo over the real Worker fetch handler and returns a key', async () => {
    const body = jpegBytes(4096);
    const response = await worker.fetch(
      new Request('https://example.com/photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Length': String(body.byteLength),
          Origin: 'http://localhost:8935',
        },
        body,
      }),
      env
    );

    expect(response.status).toBe(201);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8935');
    const json = await response.json();
    expect(typeof json.key).toBe('string');
  });

  it('rejects an untrusted origin without a CORS header, so a random site cannot use this endpoint', async () => {
    const body = jpegBytes(100);
    const response = await worker.fetch(
      new Request('https://example.com/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Origin: 'https://not-this-site.example' },
        body,
      }),
      env
    );
    expect(response.status).toBe(403);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeNull();
  });

  it('returns a warm, non-technical message when the photo is too large', async () => {
    const body = jpegBytes(MAX_PHOTO_BYTES + 1024); // a real oversized body, not a spoofed header
    const response = await worker.fetch(
      new Request('https://example.com/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Origin: 'http://localhost:8935' },
        body,
      }),
      env
    );
    expect(response.status).toBe(413);
    const json = await response.json();
    expect(json.error).toMatch(/large/i);
    expect(json.error).not.toMatch(/413|byte|error code/i);
  });

  it('answers an OPTIONS preflight for an allowed origin', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/photo', {
        method: 'OPTIONS',
        headers: {
          Origin: 'http://localhost:8935',
          'Access-Control-Request-Method': 'POST',
        },
      }),
      env
    );
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:8935');
    expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
  });
});

describe('GET /photo/:key', () => {
  it('serves back a real uploaded photo, byte for byte', async () => {
    const body = jpegBytes(1500);
    const uploadResponse = await worker.fetch(
      new Request('https://example.com/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'image/jpeg', Origin: 'http://localhost:8935' },
        body,
      }),
      env
    );
    const { key } = await uploadResponse.json();

    const getResponse = await worker.fetch(new Request(`https://example.com/photo/${key}`), env);
    expect(getResponse.status).toBe(200);
    expect(getResponse.headers.get('Content-Type')).toBe('image/jpeg');
    const fetchedBytes = new Uint8Array(await getResponse.arrayBuffer());
    expect(fetchedBytes).toEqual(body);
  });

  it('404s for a key that does not exist', async () => {
    const response = await worker.fetch(new Request('https://example.com/photo/does-not-exist'), env);
    expect(response.status).toBe(404);
  });
});
