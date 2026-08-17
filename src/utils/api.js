/**
 * api.js — Centralized API Client for Dunas Travel Frontend
 *
 * Handles automatically:
 *  1. CSRF token: fetches from /api/auth/csrf once, caches it in memory,
 *     and sends it as x-csrf-token header on every mutating request (POST/PUT/PATCH/DELETE).
 *  2. Response unwrapping: the backend wraps all responses in
 *     { data: { success, statusCode, data: <actual> } }. This client
 *     transparently unwraps it so callers receive the actual payload.
 *  3. Error normalisation: throws an Error with the backend's message string.
 *  4. Cookie-based auth: always sends credentials: 'include' so the
 *     HttpOnly access_token cookie is sent automatically.
 *  5. Guest Token: attaches header 'x-guest-token' from localStorage ('dunas_guest_token') on all requests.
 */

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  'https://dunastravel-backend-seven.vercel.app/api';
const BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

// ── CSRF Token Cache ──────────────────────────────────────────────────────────
let _csrfToken = null;
let _csrfFetchPromise = null;

/**
 * Fetches the CSRF token from the backend and caches it.
 * De-duplicates concurrent calls so only one request is made.
 */
async function fetchCsrfToken() {
  if (_csrfToken) return _csrfToken;

  // De-duplicate concurrent calls
  if (_csrfFetchPromise) return _csrfFetchPromise;

  _csrfFetchPromise = fetch(`${BASE_URL}/auth/csrf`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch CSRF token');
      const body = await res.json();
      // Backend returns { data: { csrfToken: "..." } } or { csrfToken: "..." }
      _csrfToken =
        body?.data?.csrfToken ||
        body?.data?.data?.csrfToken ||
        body?.csrfToken ||
        null;
      return _csrfToken;
    })
    .catch((err) => {
      // Do not cache a failed attempt
      console.warn('[api] CSRF fetch failed:', err.message);
      return null;
    })
    .finally(() => {
      _csrfFetchPromise = null;
    });

  return _csrfFetchPromise;
}

/** Clears the cached CSRF token (call after logout) */
export function clearCsrfToken() {
  _csrfToken = null;
}

/**
 * Retrieves or creates a persistent guest token in localStorage ('dunas_guest_token').
 */
export function getOrCreateGuestToken() {
  if (typeof window === 'undefined') return null;
  let token = localStorage.getItem('dunas_guest_token') || sessionStorage.getItem('dunas_guest_token');
  if (!token) {
    token = 'gt_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    try {
      localStorage.setItem('dunas_guest_token', token);
    } catch {
      // ignore storage errors
    }
  }
  return token;
}

// ── Response Unwrapper ────────────────────────────────────────────────────────
/**
 * Unwraps the backend's TransformInterceptor envelope.
 * Backend format:  { data: { success, statusCode, data: <payload>, timestamp } }
 * Returns: <payload>
 */
function unwrap(body) {
  // Handle double-wrapped: { data: { success, data: <payload> } }
  if (body && typeof body === 'object') {
    if ('data' in body) {
      const inner = body.data;
      if (inner && 'data' in inner) return inner.data;
      if (inner && 'success' in inner) return inner; // return inner if no nested data
      return inner;
    }
  }
  return body;
}

// ── Auth Refresh & Event Management ─────────────────────────────────────────
let _isRefreshing = false;
let _refreshSubscribers = [];

function onRefreshed(success) {
  _refreshSubscribers.forEach((callback) => callback(success));
  _refreshSubscribers = [];
}

function addRefreshSubscriber(callback) {
  _refreshSubscribers.push(callback);
}

function notifyUnauthorized() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }
}

// ── Core Request Function ─────────────────────────────────────────────────────
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Makes an API request to the backend.
 *
 * @param {string} path    - Path relative to /api (e.g. '/tours', '/bookings')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @param {object} opts    - Extra options
 * @param {boolean} opts.raw - If true, return the raw unwrapped body without further processing
 * @returns {Promise<any>} The unwrapped response data
 */
export async function apiRequest(path, options = {}, { raw = false, _retry = false } = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const isMutating = MUTATING_METHODS.includes(method);

  // Build headers
  const guestToken = getOrCreateGuestToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(guestToken ? { 'x-guest-token': guestToken } : {}),
    ...options.headers,
  };

  // Attach CSRF token for mutating requests
  if (isMutating) {
    const token = await fetchCsrfToken();
    if (token) {
      headers['x-csrf-token'] = token;
    }
  }

  const url = `${BASE_URL}${path}`;

  let res = await fetch(url, {
    ...options,
    method,
    headers,
    credentials: 'include', // Always send cookies (HttpOnly auth token)
    body:
      options.body !== undefined
        ? typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
  });

  // Handle 401 Unauthorized for Refresh Token (exclude /auth/me, /auth/login, /auth/refresh)
  if (res.status === 401 && !_retry && !path.includes('/auth/refresh') && !path.includes('/auth/login') && !path.includes('/auth/me')) {
    if (_isRefreshing) {
      const success = await new Promise((resolve) => addRefreshSubscriber(resolve));
      if (success) {
        return apiRequest(path, options, { raw, _retry: true });
      } else {
        notifyUnauthorized();
        const error = new Error('Unauthorized');
        error.status = 401;
        throw error;
      }
    } else {
      _isRefreshing = true;
      try {
        const csrfToken = await fetchCsrfToken();
        const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(guestToken ? { 'x-guest-token': guestToken } : {}),
            // Refresh uses the HttpOnly refresh cookie, so it is an
            // ambient-authority request and must satisfy the CSRF guard.
            ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
          },
        });
        
        _isRefreshing = false;
        
        if (refreshRes.ok) {
          clearCsrfToken(); // Need new CSRF token after refresh
          onRefreshed(true);
          return apiRequest(path, options, { raw, _retry: true });
        } else {
          onRefreshed(false);
          notifyUnauthorized();
        }
      } catch {
        _isRefreshing = false;
        onRefreshed(false);
        notifyUnauthorized();
      }
    }
  } else if (res.status === 401 && (path.includes('/auth/refresh') || path.includes('/auth/me') || _retry)) {
    notifyUnauthorized();
  }

  // Parse body
  let body;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    // If CSRF token expired/invalid, clear cache and surface the real error
    if (res.status === 403) {
      clearCsrfToken();
    }
    // Extract error message from backend's error envelope
    const rawMsg = body?.data?.message || body?.message;
    const message = Array.isArray(rawMsg)
      ? rawMsg.join(' • ')
      : (rawMsg || `Request failed with status ${res.status}`);
    const error = new Error(message);
    error.status = res.status;
    error.body = body;
    throw error;
  }

  if (raw) return body;
  return unwrap(body);
}

// ── Convenience Methods ───────────────────────────────────────────────────────

export const api = {
  get: (path, options = {}) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) =>
    apiRequest(path, { ...options, method: 'POST', body }),
  patch: (path, body, options = {}) =>
    apiRequest(path, { ...options, method: 'PATCH', body }),
  put: (path, body, options = {}) =>
    apiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, options = {}) =>
    apiRequest(path, { ...options, method: 'DELETE' }),
};

export default api;
