/**
 * analytics.js — First-party Visitor Event Tracking Client
 * Sends privacy-aware visitor events to POST /api/v1/analytics/events
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    const locale = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'en';
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    const eventId = payload.eventId || generateEventId();

    const body = {
      eventId,
      eventName,
      sessionId,
      deviceCategory,
      locale,
      referrer,
      pathname: typeof window !== 'undefined' ? window.location.pathname : undefined,
      interfaceSlug: payload.interfaceSlug,
      tourSlug: payload.tourSlug,
      bookingRef: payload.bookingRef,
      utmSource: payload.utmSource,
      utmMedium: payload.utmMedium,
      utmCampaign: payload.utmCampaign,
      properties: payload.properties,
    };

    const url = `${API_BASE_URL}/api/v1/analytics/events`;

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
