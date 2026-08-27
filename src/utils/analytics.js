/**
 * analytics.js — First-party Visitor Event Tracking Client
 * Sends privacy-aware visitor events to POST /api/analytics/events
 */

const rawApiUrl = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'https://dunastravel-backend-seven.vercel.app/api';
const normalizedApiUrl = String(rawApiUrl).replace(/\/+$/, '');
const BASE_URL = normalizedApiUrl.endsWith('/api') ? normalizedApiUrl : `${normalizedApiUrl}/api`;

function getSessionId() {
  if (typeof window === 'undefined') return null;
  let sid = localStorage.getItem('dunas_analytics_sid');
  if (!sid) {
    sid = 'sid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('dunas_analytics_sid', sid);
  }
  return sid;
}

function getDeviceCategory() {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function generateEventId() {
  return 'evt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
}

export async function trackEvent(eventName, payload = {}) {
  try {
    const sessionId = getSessionId();
    const deviceCategory = getDeviceCategory();
    const rawLocale = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'en';
    const locale = ['en', 'ar', 'es', 'pt', 'it'].includes(rawLocale.split('-')[0].toLowerCase())
      ? rawLocale.split('-')[0].toLowerCase()
      : 'en';
    const rawReferrer = typeof document !== 'undefined' ? document.referrer : '';
    // Only include referrer when it's a valid absolute URL the backend @IsUrl validator accepts.
    // document.referrer can be '' (no referrer) or 'about:blank' / 'file://...' (non-http origins),
    // all of which would cause a 400 from the strict @IsUrl({ protocols: ['http','https'] }) rule.
    const validReferrer = /^https?:\/\//i.test(rawReferrer) ? rawReferrer : undefined;
    const eventId = payload.eventId || generateEventId();

    const body = {
      eventId,
      eventName,
      sessionId,
      deviceCategory,
      locale,
      ...(validReferrer ? { referrer: validReferrer } : {}),
      pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
      interfaceSlug: payload.interfaceSlug,
      tourSlug: payload.tourSlug,
      bookingRef: payload.bookingRef,
      utmSource: payload.utmSource,
      utmMedium: payload.utmMedium,
      utmCampaign: payload.utmCampaign,
      properties: payload.properties,
    };

    const url = `${BASE_URL}/analytics/events`;

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      });
    }
  } catch (err) {
    // Non-blocking catch
    console.warn('[Analytics] Track event failed:', err);
  }
}
