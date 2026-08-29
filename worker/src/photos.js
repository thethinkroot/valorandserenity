// Real photo storage for Step 3 of the guided tribute flow, in R2.
//
// Scoped narrowly, on purpose (see the Phase 1 brief this was built from):
// one photo, really uploaded, really stored, really displayed back. No
// resizing, no compression, no multi-photo support, no captions beyond
// what Step 3 already asks. Those are later work; the spec's "no
// file-size error message anywhere in this step" rule assumes automatic
// compression exists to make that promise true. It doesn't yet, so this
// piece takes the brief's explicit, narrower substitute instead: a
// reasonable size ceiling with a warm, human error message rather than a
// technical rejection, until compression lands and removes the ceiling.

import { generateTributeToken } from './tokens.js';

export const MAX_PHOTO_BYTES = 15 * 1024 * 1024; // 15 MB: comfortably covers a real phone photo.

export const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
]);

export class PhotoTooLargeError extends Error {}
export class UnsupportedPhotoTypeError extends Error {}

// Stores one photo under a fresh, unguessable key (same token generator
// used for tribute links, so access depends on knowing the key, not on
// any enumerable id) and returns that key. The caller builds whatever
// URL fetches it back via GET /photo/:key.
export async function storePhoto(bucket, { body, contentType, byteLength }) {
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new UnsupportedPhotoTypeError(
      `Unsupported content type: ${contentType}`
    );
  }
  if (byteLength > MAX_PHOTO_BYTES) {
    throw new PhotoTooLargeError(
      `Photo is ${byteLength} bytes, over the ${MAX_PHOTO_BYTES}-byte limit`
    );
  }

  const key = generateTributeToken(16); // 128 bits: plenty for a single draft photo.
  await bucket.put(key, body, {
    httpMetadata: { contentType },
  });
  return key;
}

// Fetches a stored photo back out of R2, or null if the key doesn't
// resolve to anything (a wrong key, or one that's since been deleted).
export async function fetchPhoto(bucket, key) {
  const object = await bucket.get(key);
  if (!object) return null;
  return object;
}
