// Tribute link security: token generation, visibility enforcement, and the
// Private-tier "one more layer of privacy" word gate. This is the narrow
// slice specified for this build; it does not implement the 8-step
// creation flow, Story Assist, or payments. See ../README.md for scope,
// storage rationale, and the free-tier volume check.

import {
  createTribute,
  getTribute,
  isNoindexTier,
  requiresPrivacyWordGate,
  verifyPrivacyWord,
  InvalidVisibilityError,
  MissingConsentError,
} from './tributes.js';
import {
  storePhoto,
  fetchPhoto,
  MAX_PHOTO_BYTES,
  PhotoTooLargeError,
  UnsupportedPhotoTypeError,
} from './photos.js';
import { renderTributePage } from './renderer.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS' && (url.pathname === '/photo' || url.pathname.startsWith('/photo/') || url.pathname === '/tribute')) {
      return corsPreflightResponse(request);
    }

    if (request.method === 'POST' && url.pathname === '/tribute') {
      return handleCreate(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/screens/privacy-word') {
      return htmlResponse(renderPrivacyWordScreen(), 200, { noindex: false });
    }

    const match = url.pathname.match(/^\/tribute\/([A-Za-z0-9_-]+)$/);
    if (request.method === 'GET' && match) {
      return handleGet(request, env, match[1]);
    }

    if (request.method === 'POST' && url.pathname === '/photo') {
      return handleUploadPhoto(request, env);
    }

    const photoMatch = url.pathname.match(/^\/photo\/([A-Za-z0-9_-]+)$/);
    if (request.method === 'GET' && photoMatch) {
      return handleGetPhoto(request, env, photoMatch[1]);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

// Draft photo uploads happen from the guided-flow page (a different
// origin than this Worker), so real preflighted, cross-origin fetch()
// calls need real CORS headers, not just a same-origin assumption.
// Allowed: the real production domain (per README.md) and any localhost
// port for local development testing. NOT included: a Cloudflare Pages
// preview subdomain (*.pages.dev), because its exact project-name
// pattern isn't confirmed anywhere in this repo, and guessing one here
// would repeat exactly the mistake README.md already documents (a
// fabricated media.valorandserenity.com that was never real). Add the
// real preview pattern once the Pages project actually exists and its
// domain is known, don't guess it.
function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (origin === 'https://valorandserenity.com' || origin === 'https://www.valorandserenity.com') return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return false;
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  if (!isAllowedOrigin(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
  };
}

function corsPreflightResponse(request) {
  const headers = corsHeaders(request);
  if (!headers['Access-Control-Allow-Origin']) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function handleCreate(request, env) {
  const cors = corsHeaders(request);
  if (!cors['Access-Control-Allow-Origin']) {
    return jsonResponse({ error: 'Origin not allowed' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400, cors);
  }

  // Every field here is real content the 8-step flow already collects
  // (see start.html's serializeDraft()), passed straight through from the
  // browser's draft state at Step 8. No tier-selection UI exists yet, so
  // visibility always defaults to 'private' here, per this build's scope:
  // token-required access, not publicly listed or indexed.
  const {
    title,
    privacyWord,
    subjectMode,
    fullName,
    branch,
    serviceFromYear,
    serviceToYear,
    bornYear,
    passedYear,
    storyText,
    honors,
    photoKey,
    consentPhotoRights,
    consentAuthorized,
    consentStoryReviewed,
    consentVersion,
  } = body || {};

  try {
    // skipConsentCheck is never passed here, on purpose: this is the
    // real publish path, and createTribute enforces the hard consent
    // gate itself, not just this HTTP layer, so no future code path
    // that also calls createTribute can accidentally skip it either.
    const record = await createTribute(env.DB, {
      visibility: 'private',
      privacyWord,
      title: fullName || title || 'Untitled Tribute',
      subjectMode,
      fullName,
      branch,
      serviceFromYear,
      serviceToYear,
      bornYear,
      passedYear,
      storyText,
      honors,
      photoKey,
      consentPhotoRights,
      consentAuthorized,
      consentStoryReviewed,
      consentVersion,
    });
    // Never echo the privacy word or its hash back to the client.
    return jsonResponse({ token: record.token, visibility: record.visibility }, 201, cors);
  } catch (err) {
    if (err instanceof InvalidVisibilityError) {
      return jsonResponse({ error: err.message }, 400, cors);
    }
    if (err instanceof MissingConsentError) {
      return jsonResponse(
        { error: 'All three consent checkboxes must be checked before publishing.' },
        400,
        cors
      );
    }
    throw err;
  }
}

async function handleGet(request, env, token) {
  const record = await getTribute(env.DB, token);
  if (!record) {
    return htmlResponse(renderNotFoundPage(), 404, { noindex: true });
  }

  const noindex = isNoindexTier(record.visibility);

  if (requiresPrivacyWordGate(record)) {
    const supplied = extractPrivacyWord(request);
    const ok = await verifyPrivacyWord(record, supplied);
    if (!ok) {
      return htmlResponse(renderPrivacyWordGatePage(), 401, { noindex });
    }
  }

  // The photo itself isn't fetched here; the rendered page just points its
  // <img> at this same Worker's GET /photo/:key (already real, already
  // tested), and the visitor's browser fetches the bytes when it loads
  // the page, the same way any ordinary <img src> works.
  const photoUrl = record.photoKey ? `/photo/${record.photoKey}` : null;

  return htmlResponse(renderTributePage({ ...record, noindex }, photoUrl), 200, { noindex });
}

function extractPrivacyWord(request) {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get('word');
  if (fromQuery) return fromQuery;

  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/(?:^|;\s*)vs_word=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Step 3's one real photo upload: the request body is the raw file bytes,
// its Content-Type header is the photo's real MIME type (set by the
// browser from the picked file, not chosen by the family). No form
// fields, no JSON wrapper, nothing else in this pass.
async function handleUploadPhoto(request, env) {
  const cors = corsHeaders(request);
  if (!cors['Access-Control-Allow-Origin']) {
    return jsonResponse({ error: 'Origin not allowed' }, 403);
  }

  const contentType = request.headers.get('Content-Type') || '';
  const contentLength = Number(request.headers.get('Content-Length') || 0);

  if (contentLength > MAX_PHOTO_BYTES) {
    return jsonResponse(
      { error: "That photo's a little large for us right now. Could you try a smaller one, or a different photo?" },
      413,
      cors
    );
  }

  const body = await request.arrayBuffer();

  try {
    const key = await storePhoto(env.PHOTOS, {
      body,
      contentType,
      byteLength: body.byteLength,
    });
    return jsonResponse({ key }, 201, cors);
  } catch (err) {
    if (err instanceof PhotoTooLargeError) {
      return jsonResponse(
        { error: "That photo's a little large for us right now. Could you try a smaller one, or a different photo?" },
        413,
        cors
      );
    }
    if (err instanceof UnsupportedPhotoTypeError) {
      return jsonResponse(
        { error: "That file doesn't look like a photo we can use yet. A JPEG, PNG, HEIC, or similar image works best." },
        415,
        cors
      );
    }
    throw err;
  }
}

async function handleGetPhoto(request, env, key) {
  const cors = corsHeaders(request);
  const object = await fetchPhoto(env.PHOTOS, key);
  if (!object) {
    return new Response(null, { status: 404, headers: cors });
  }
  return new Response(object.body, {
    status: 200,
    headers: {
      ...cors,
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  });
}

function jsonResponse(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...extraHeaders },
  });
}

function htmlResponse(body, status, { noindex }) {
  const headers = { 'content-type': 'text/html; charset=utf-8' };
  if (noindex) {
    // Belt and suspenders: both the response header and the in-page meta
    // tag (below) tell crawlers to stay away from Private and Family and
    // Friends tributes.
    headers['X-Robots-Tag'] = 'noindex, nofollow';
  }
  return new Response(body, { status, headers });
}

// The screen a family sees at tribute setup, when Private is chosen. Wording
// is exact, per spec: never call this a passphrase, a password, or a
// security setting anywhere in the interface.
function renderPrivacyWordScreen() {
  // This screen is intentionally not wired to a real, in-progress tribute
  // draft: that requires the 8-step creation flow's session state, which is
  // out of scope for this piece of work. What matters here, and what's
  // tested, is the screen itself: the exact required copy, a single text
  // field, and a "Skip this" option as visible and easy to choose as
  // continuing. Both buttons submit back to this same screen (method="GET",
  // no side effects) rather than pointing at a real endpoint that doesn't
  // exist yet.
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>One More Layer of Privacy</title>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to content</a>
<main id="main-content">
<form method="GET" action="/screens/privacy-word">
<h1>Want one more layer of privacy?</h1>
<p>Choose a simple word to share with family yourself, like handing someone a house key.</p>
<label for="privacy-word">Your word</label>
<input type="text" id="privacy-word" name="privacyWord" autocomplete="off">
<div class="screen-actions">
<button type="submit" name="choice" value="continue" class="btn btn-primary">Continue</button>
<button type="submit" name="choice" value="skip" class="btn btn-secondary">Skip this</button>
</div>
</form>
</main>
</body>
</html>`;
}

// What a visitor sees when a Private tribute has a word set and they
// haven't supplied the right one yet. Same naming rule applies: no
// "passphrase," "password," or "security" anywhere in the visible text.
function renderPrivacyWordGatePage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>This Tribute Is Private</title>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to content</a>
<main id="main-content">
<h1>This tribute is private</h1>
<p>Enter the word the family shared with you to view it.</p>
<form method="GET">
<label for="word">Word</label>
<input type="text" id="word" name="word" autocomplete="off">
<button type="submit">View Tribute</button>
</form>
</main>
</body>
</html>`;
}

function renderNotFoundPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<title>Tribute Not Found</title>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to content</a>
<main id="main-content">
<h1>Tribute not found</h1>
</main>
</body>
</html>`;
}
