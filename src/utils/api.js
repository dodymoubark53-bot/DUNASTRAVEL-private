/**
 * api.js — Centralized API Client for Dunas Travel Frontend
 *
 * Handles automatically:
 *  1. CSRF token: fetches from /api/auth/csrf once, caches it in memory,
 *     and sends it as x-csrf-token header on every mutating request (POST/PUT/PATCH/DELETE).
 *  2. Response unwrapping: the backend wraps all non-health responses in
 *     { success: true, statusCode, data, meta?, timestamp }. This client
 *     accepts exactly that one envelope and never guesses legacy shapes.
 *  3. Error normalisation: throws an Error with the backend's message string.
 *  4. Cookie-based auth: always sends credentials: 'include' so the
 *     HttpOnly access_token cookie is sent automatically.
 *  5. Guest Token: attaches header 'x-guest-token' from localStorage ('dunas_guest_token') on all requests.
 */

const rawApiUrl = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL ||
    'https://dunastravel-backend-seven.vercel.app/api';
const normalizedApiUrl = String(rawApiUrl).replace(/\/+$/, '');
export const BASE_URL = normalizedApiUrl.endsWith('/api') ? normalizedApiUrl : `${normalizedApiUrl}/api`;

// ── CSRF Token Cache ──────────────────────────────────────────────────────────
let _csrfToken = null;
let _csrfFetchPromise = null;

export function createClientRequestId(prefix) {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === 'function') {
    return `${prefix}_${cryptoApi.randomUUID()}`;
  }
  if (typeof cryptoApi?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    cryptoApi.getRandomValues(bytes);
    return `${prefix}_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
  }
  throw new Error('Secure browser randomness is unavailable');
}

function getCsrfFromCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
  if (match && match[1]) {
    try {
      const decoded = decodeURIComponent(match[1]).trim();
      return decoded.length >= 16 ? decoded : null;
    } catch {
      return match[1].length >= 16 ? match[1] : null;
    }
  }
  return null;
}

/**
 * Fetches the CSRF token from the backend and caches it.
 * De-duplicates concurrent calls so only one request is made.
 */
async function fetchCsrfToken() {
  if (_csrfToken && _csrfToken.length >= 16) return _csrfToken;

  const cookieToken = getCsrfFromCookie();
  if (cookieToken) {
    _csrfToken = cookieToken;
    return _csrfToken;
  }

  // De-duplicate concurrent calls
  if (_csrfFetchPromise) return _csrfFetchPromise;

  _csrfFetchPromise = fetch(resolveFullUrl('/auth/csrf'), {
    method: 'GET',
    credentials: 'include',
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch CSRF token');
      const body = await res.json();
      const csrfPayload = unwrap(body);
      const token = csrfPayload?.csrfToken ?? null;
      if (token && typeof token === 'string' && token.length >= 16) {
        _csrfToken = token;
      } else {
        _csrfToken = getCsrfFromCookie();
      }
      return _csrfToken;
    })
    .catch((err) => {
      console.warn('[api] CSRF fetch failed:', err.message);
      _csrfToken = getCsrfFromCookie();
      return _csrfToken;
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
    token = createClientRequestId('gt');
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
 * Unwraps exactly one canonical backend envelope.  An HTTP success carrying a
 * failed business result is rejected rather than being shown as success.
 */
export function unwrap(body) {
  if (!body || typeof body !== 'object' || body.success !== true || !Object.prototype.hasOwnProperty.call(body, 'data')) {
    const error = new Error('Invalid API success envelope');
    error.code = 'INVALID_SUCCESS_ENVELOPE';
    throw error;
  }
  if (body.data && typeof body.data === 'object' && body.data.success === false) {
    const error = new Error(body.data.message || 'The operation was not completed');
    error.code = body.data.code || 'BUSINESS_OPERATION_FAILED';
    throw error;
  }
  if (body.meta !== undefined) {
    return { data: body.data, meta: body.meta };
  }
  return body.data;
}

/**
 * Reads a collection from either the current canonical pagination envelope
 * ({ data: [], meta }) or the legacy paginated payload ({ items: [] }).
 * The backend remains the source of pagination truth; this helper only
 * normalizes the transport shape at the UI boundary.
 */
export function readCollection(response, label = 'collection') {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  throw new Error(`Invalid ${label} response`);
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

// ── Centralized Network Observability & Redaction ─────────────────────────────
const SENSITIVE_KEYS = /password|token|authorization|cookie|secret|apiKey|accessToken|refreshToken|card|cvv/i;

export function redactSensitiveData(data) {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(redactSensitiveData);
  const clean = {};
  for (const [k, v] of Object.entries(data)) {
    if (SENSITIVE_KEYS.test(k)) {
      clean[k] = '[REDACTED]';
    } else if (v && typeof v === 'object') {
      clean[k] = redactSensitiveData(v);
    } else {
      clean[k] = v;
    }
  }
  return clean;
}

const isDevLogging = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test'
  ? false
  : Boolean(import.meta.env?.DEV || (typeof window !== 'undefined' && window.localStorage?.getItem('dunas_debug_api') === 'true'));

// ── Core Request Function ─────────────────────────────────────────────────────
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function resolveFullUrl(path = '') {
  if (/^https?:\/\//i.test(path)) return path;
  const base = BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (/^https?:\/\//i.test(base)) {
    return `${base}${cleanPath}`;
  }
  if (typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null') {
    return `${window.location.origin}${base}${cleanPath}`;
  }
  return `http://localhost:3000${base}${cleanPath}`;
}

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
  const requestId = options.headers?.['x-request-id'] || createClientRequestId('req');
  // The currently deployed API does not advertise X-Request-Id in its CORS
  // preflight response. Keep the header for local development and explicit
  // callers, but omit it from ordinary production browser requests so older
  // deployments remain compatible. The backend generates its own correlation
  // ID when the header is absent.
  const shouldSendRequestId = Boolean(import.meta.env?.DEV || options.headers?.['x-request-id']);

  const headers = {
    'Content-Type': 'application/json',
    ...(guestToken ? { 'x-guest-token': guestToken } : {}),
    ...(shouldSendRequestId ? { 'x-request-id': requestId } : {}),
    ...options.headers,
  };

  // Attach CSRF token and Idempotency-Key for mutating requests
  if (isMutating) {
    const token = await fetchCsrfToken();
    if (token) {
      headers['x-csrf-token'] = token;
    }
    if (!headers['idempotency-key'] && !headers['Idempotency-Key']) {
      headers['idempotency-key'] = createClientRequestId('idemp');
    }
  }

  const url = resolveFullUrl(path);
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  if (isDevLogging) {
    let safeBody;
    try {
      safeBody = options.body ? redactSensitiveData(typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : undefined;
    } catch {
      safeBody = '[Unparseable Body]';
    }
    console.debug(`[API REQUEST] id: ${requestId} | ${method} ${path}`, {
      url,
      body: safeBody,
    });
  }

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
        const refreshRes = await fetch(resolveFullUrl('/auth/refresh'), {
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

  const duration = typeof performance !== 'undefined' ? Math.round(performance.now() - startTime) : 0;
  if (isDevLogging) {
    console.debug(`[API RESPONSE] id: ${requestId} | status: ${res.status} | duration: ${duration}ms`, {
      path,
      ok: res.ok,
      summary: typeof body === 'object' ? redactSensitiveData(body) : String(body).substring(0, 100),
    });
  }

  if (!res.ok) {
    // If CSRF token expired/invalid, clear cache and surface the real error
    if (res.status === 403) {
      clearCsrfToken();
    }
    // Extract error message from backend's error envelope
    const rawMsg = body?.message;
    const message = Array.isArray(rawMsg)
      ? rawMsg.join(' • ')
      : (rawMsg || `Request failed with status ${res.status}`);
    const error = new Error(message);
    error.status = res.status;
    error.code = typeof body?.code === 'string' ? body.code : `HTTP_${res.status}`;
    error.errors = body?.errors;
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
