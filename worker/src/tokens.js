// Tribute link token generation.
//
// Every tribute's shareable URL is built around this token. It must never be
// guessable or sequential: a family's privacy tier (Private, Family and
// Friends) depends entirely on the token being infeasible to enumerate or
// predict, since there is no account or login gating the link itself.

const DEFAULT_TOKEN_BYTES = 32; // 256 bits of entropy.

// Generates a cryptographically random, URL-safe token using the Workers
// runtime's crypto.getRandomValues. Never use Math.random here: it is not a
// cryptographically secure source and must not be used for anything that
// gates access to a family's private page.
export function generateTributeToken(byteLength = DEFAULT_TOKEN_BYTES) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function base64UrlEncode(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
