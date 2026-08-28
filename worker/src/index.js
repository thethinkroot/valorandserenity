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
} from './tributes.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

async function handleCreate(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { visibility, privacyWord, title } = body || {};

  try {
    const record = await createTribute(env.DB, { visibility, privacyWord, title });
    // Never echo the privacy word or its hash back to the client.
    return jsonResponse({ token: record.token, visibility: record.visibility }, 201);
  } catch (err) {
    if (err instanceof InvalidVisibilityError) {
      return jsonResponse({ error: err.message }, 400);
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

  return htmlResponse(renderTributePage(record), 200, { noindex });
}

function extractPrivacyWord(request) {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get('word');
  if (fromQuery) return fromQuery;

  const cookie = request.headers.get('Cookie') || '';
  const match = cookie.match(/(?:^|;\s*)vs_word=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
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

function renderTributePage(record) {
  const noindexMeta = isNoindexTier(record.visibility)
    ? '<meta name="robots" content="noindex, nofollow">'
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${noindexMeta}
<title>${escapeHtml(record.title)}</title>
</head>
<body>
<a href="#main-content" class="skip-link">Skip to content</a>
<main id="main-content">
<h1>${escapeHtml(record.title)}</h1>
<p>Placeholder tribute render. The actual tribute page, built from the
8-step flow, is out of scope for this piece of work.</p>
</main>
</body>
</html>`;
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

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
