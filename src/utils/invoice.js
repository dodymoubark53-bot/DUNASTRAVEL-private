/**
 * Normalizes the backend invoice response for the legacy booking/invoice views.
 * The API keeps billing and the immutable booking snapshot nested, while the
 * views render a flat booking-like object.
 */
export function normalizeInvoiceResponse(invoice = {}) {
  const snapshot = invoice.snapshot || {};
  const billing = invoice.billing || snapshot.billingRecipient || {};
  const passengers = invoice.passengers || snapshot.passengers || [];

  return {
    ...invoice,
    createdAt: invoice.createdAt || invoice.issuedAt,
    bookingId: invoice.bookingId || invoice.id,
    tourTitle: invoice.tourTitle || snapshot.tourTitle,
    tourSlug: invoice.tourSlug || snapshot.tourSlug,
    arrivalDate: invoice.arrivalDate || snapshot.arrivalDate,
    departureDate: invoice.departureDate ?? snapshot.departureDate,
    adults: invoice.adults ?? snapshot.adults ?? 0,
    children: invoice.children ?? snapshot.children ?? 0,
    infants: invoice.infants ?? snapshot.infants ?? 0,
    totalAmount: Number(invoice.totalAmount ?? invoice.total ?? snapshot.total ?? 0),
    totalAmountUsd: invoice.totalAmountUsd ?? invoice.total ?? snapshot.total,
    currency: invoice.currency || snapshot.currency || 'USD',
    fullName: invoice.fullName || billing.fullName,
    email: invoice.email || billing.email,
    phone: invoice.phone || billing.phone,
    invoiceType: String(invoice.invoiceType || billing.invoiceType || '').toLowerCase(),
    companyName: invoice.companyName ?? billing.companyName,
    taxId: invoice.taxId ?? billing.taxId,
    address: invoice.address ?? billing.address,
    city: invoice.city ?? billing.city,
    country: invoice.country ?? billing.country,
    passengers,
  };
}

