const PAYLINK_CHECKOUT_ORIGIN = 'https://pay.getpayin.com';

export function assertPayLinkCheckoutUrl(value) {
  const url = new URL(String(value));
  if (url.protocol !== 'https:' || url.origin !== PAYLINK_CHECKOUT_ORIGIN) {
    throw new Error('The payment provider returned an untrusted checkout URL');
  }
  return url.toString();
}

export function redirectToPayLinkCheckout(value) {
  window.location.assign(assertPayLinkCheckoutUrl(value));
}
