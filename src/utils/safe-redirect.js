/**
 * Sanitizes and validates post-login or post-action redirect paths.
 * Enforces strict local relative routing only, eliminating open-redirect attacks.
 *
 * @param {string|null|undefined} rawUrl - The candidate redirect path.
 * @param {string} [fallback='/dashboard'] - The safe fallback route if validation fails.
 * @returns {string} The validated relative URL path.
 */
export function getSafeRedirectUrl(rawUrl, fallback = '/dashboard') {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return fallback;
  }

  const trimmed = rawUrl.trim();

  // Reject empty strings or control characters
  if (!trimmed || /[\r\n\t\0]/.test(trimmed)) {
    return fallback;
  }

  // Must begin with single forward slash, and NOT protocol-relative (//) or backslash (/\)
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return fallback;
  }

  // Reject URL scheme injection (javascript:, data:, vbscript:, http:, https:, etc.)
  if (/^\/+[a-z0-9+.-]+:/i.test(trimmed)) {
    return fallback;
  }

  // Reject encoded double slashes, backslashes or dangerous protocol schemes
  if (trimmed.includes('\\') || /%2f%2f/i.test(trimmed) || /%5c/i.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}
