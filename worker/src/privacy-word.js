// Hashing and comparison for the Private-tier "one more layer of privacy"
// word.
//
// This is deliberately not an authentication system: no accounts, no
// sessions tied to a person's identity. It is a single word the family
// chooses and shares however they already talk to each other (per spec:
// "like handing someone a house key"), checked before a Private tribute's
// content is rendered.
//
// Naming note: the product spec is explicit that the word "passphrase" is
// too technical to ever appear on screen, and the interface must never call
// this a passphrase, a password, or a security setting. That rule is about
// the interface a family sees, not this module's internal name, but the
// module is named and worded to match anyway, so no stray internal string
// ever gets copy-pasted into a screen by accident.

export async function hashPrivacyWord(word) {
  const normalized = word.trim();
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return bufferToHex(digest);
}

function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Constant-time comparison of two equal-length hex strings, so a failed
// check does not leak timing information about how many characters
// matched.
export function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
