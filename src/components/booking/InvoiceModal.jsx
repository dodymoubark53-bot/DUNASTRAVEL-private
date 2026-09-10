import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaTimes, 
  FaFileInvoiceDollar, 
  FaPrint, 
  FaShieldAlt, 
  FaPlaneDeparture, 
  FaUser, 
  FaBuilding, 
  FaCheckCircle, 
  FaClock, 
  FaQrcode,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCreditCard,
  FaGlobe
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { normalizeInvoiceResponse } from '../../utils/invoice';
import { redirectToPayLinkCheckout } from '../../utils/paylink';
import { generateEtaQrDataUrl } from '../../utils/eta-qr';

const InvoiceModal = ({ booking: initialBooking = {}, invoiceNumber: propInvoiceNumber, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const isAr = i18n.language === 'ar';

  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const targetInvoiceNum = propInvoiceNumber || initialBooking?.invoiceNumber;
  const targetRefCode = initialBooking?.referenceCode || initialBooking?.bookingReference || initialBooking?.id;

  useEffect(() => {
    let isMounted = true;
    if (!targetInvoiceNum && !targetRefCode) return;

    const fetchInvoice = async () => {
      setLoadingInvoice(true);
      try {
        let data;
        if (targetInvoiceNum) {
          data = await api.get(`/invoices/${encodeURIComponent(targetInvoiceNum)}`);
        } else if (targetRefCode) {
          data = await api.get(`/bookings/${encodeURIComponent(targetRefCode)}/invoice`);
        }
        if (isMounted && data) setInvoiceData(data);
      } catch (err) {
        console.warn('[InvoiceModal] Failed to fetch invoice details from API:', err);
      } finally {
        if (isMounted) setLoadingInvoice(false);
      }
    };
    fetchInvoice();
    return () => {
      isMounted = false;
    };
  }, [targetInvoiceNum, targetRefCode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const booking = invoiceData
    ? normalizeInvoiceResponse({ ...initialBooking, ...invoiceData })
    : normalizeInvoiceResponse(initialBooking);

  const [qrDataUrl, setQrDataUrl] = useState('');
  useEffect(() => {
    let active = true;
    const generateQr = async () => {
      try {
        const total = booking?.totalAmount ?? booking?.total ?? 0;
        const subtotal = booking?.subtotal ?? total;
        const tax = booking?.tax ?? '0.00';
        const url = await generateEtaQrDataUrl({
          sellerName: 'Dunas Travel Group (DMC Lic. #1882)',
          taxId: booking?.taxId || '482-901-382',
          timestamp: booking?.createdAt || new Date().toISOString(),
          total,
          tax,
        });
        if (active) setQrDataUrl(url);
      } catch (err) {
        console.warn('[InvoiceModal] ETA QR generation error:', err);
      }
    };
    generateQr();
    return () => {
      active = false;
    };
  }, [booking?.totalAmount, booking?.total, booking?.tax, booking?.createdAt]);

  const handlePayNow = async () => {
    const bId = booking.id || booking.bookingId || initialBooking.id || initialBooking.bookingId;
    if (!bId) {
      setPaymentError(t('booking.noBookingId', 'Booking ID not available for checkout.'));
      return;
    }
    setIsPaying(true);
    setPaymentError('');
    try {
      const res = await api.post('/payments/initiate', { bookingId: bId });
      const checkoutUrl =
        res?.checkoutUrl ||
        res?.sessionUrl ||
        res?.url ||
        res?.paymentUrl ||
        res?.data?.sessionUrl ||
        res?.data?.url;
      if (checkoutUrl) {
        redirectToPayLinkCheckout(checkoutUrl);
      } else {
        setPaymentError(
          t('booking.paymentInitiated', 'Payment request processed. Please check your email or concierge status.')
        );
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setPaymentError(
        err?.response?.data?.message ||
          err?.message ||
          t('booking.paymentError', 'Unable to initiate online payment session with gateway.')
      );
    } finally {
      setIsPaying(false);
    }
  };

  const rawDate = booking.createdAt || booking.date || booking.issueDate;
  const d = rawDate ? new Date(rawDate) : new Date();

  const totalPax = (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0) || 1;

  const passengerList = [];
  if (booking.passengerNames || booking.passengers) {
    const names =
      typeof booking.passengerNames === 'object' ? booking.passengerNames : booking.passengers;
    if (Array.isArray(names)) {
      names.forEach((passenger) => {
        const name = typeof passenger === 'string' ? passenger : passenger?.fullName;
        if (name) passengerList.push(name);
      });
    } else {
      Object.entries(names || {}).forEach(([, name]) => {
        if (name) passengerList.push(name);
      });
    }
  }

  const handlePrint = () => window.print();

  const totalNum = Number(booking?.totalAmount ?? booking?.total ?? 0);
  const paidNum = Number(booking?.paidAmount ?? (['confirmed', 'paid', 'completed'].includes(String(booking.status).toLowerCase()) ? totalNum : 0));
  const isConfirmed = ['confirmed', 'paid', 'completed'].includes(String(booking.status).toLowerCase()) || (totalNum > 0 && paidNum >= totalNum);

  const subtotal = booking.subtotal ? Number(booking.subtotal) : totalNum;
  const tax = booking.tax ? Number(booking.tax) : 0;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="relative bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl z-[100000] print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:overflow-visible print:w-full print:m-0"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar (Screen only) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <FaFileInvoiceDollar size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-100 block">
                {isAr ? 'الفاتورة الضريبية الرسمية وقسيمة الحجز الفاخرة' : 'Official Tax Invoice & VIP Voucher'}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {booking.invoiceNumber ? `#${booking.invoiceNumber}` : 'Dunas Concierge Billing'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-zinc-950 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FaPrint size={12} /> {isAr ? 'طباعة / حفظ PDF' : 'Print / Save PDF'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>

        {/* ── LUXURY EXECUTIVE INVOICE SHEET ── */}
        <div className="p-4 sm:p-6 md:p-8 bg-zinc-950 print:p-0 print:bg-white">
          <div 
            id="printable-customer-invoice"
            className="bg-white text-neutral-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-neutral-200 print:border-none print:shadow-none print:p-6 print:m-0 print:w-full print:rounded-none"
          >
            {/* ── HEADER: COMPANY EMBLEM & CREDENTIALS ── */}
            <div className="relative pb-6 border-b-2 border-amber-500/40 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="space-y-1.5 max-w-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white font-serif font-black text-xl shadow-md">
                    D
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-black tracking-wider font-serif text-neutral-950">
                        DUNAS TRAVEL GROUP
                      </span>
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        LIC. #1882
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-amber-800 tracking-wide uppercase">
                      {isAr 
                        ? 'إدارة الوجهات السياحية والكونسيرج الفاخر • فئة (أ) معتمدة من وزارة السياحة والآثار' 
                        : 'Luxury Destination Management Company (DMC) • Category A Ministry Approved'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-neutral-600 space-y-0.5">
                  <p>
                    <span className="font-semibold text-neutral-800">
                      {isAr ? 'رقم التسجيل الضريبي الموحد (ETA):' : 'Tax Registration No:'}
                    </span>{' '}
                    <strong className="font-mono text-neutral-950">482-901-382</strong> •{' '}
                    <span className="font-semibold text-neutral-800">
                      {isAr ? 'السجل التجاري:' : 'Commercial Reg:'}
                    </span>{' '}
                    <strong className="font-mono text-neutral-950">104928</strong>
                  </p>
                  <p>
                    {isAr
                      ? 'المقر الرئيسي: أبراج نايل سيتي، البرج الشمالي، كورنيش النيل، القاهرة، مصر'
                      : 'Headquarters: North Tower, Nile City Towers, Corniche El-Nil, Cairo, Egypt'}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    Branches: Cairo • Luxor • Aswan • Sharm El-Sheikh • Istanbul | www.dunastravel.com
                  </p>
                </div>
              </div>

              {/* Status Stamp & Numbers */}
              <div className={`flex flex-col sm:items-${isAr ? 'start' : 'end'} text-${isAr ? 'start' : 'end'} space-y-2 shrink-0`}>
                <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-black tracking-wider uppercase shadow-xs ${
                  isConfirmed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}>
                  {isConfirmed ? (
                    <>
                      <FaCheckCircle className="text-emerald-600" />
                      <span>{isAr ? 'مسددة بالكامل (PAID IN FULL)' : 'PAID IN FULL'}</span>
                    </>
                  ) : (
                    <>
                      <FaClock className="text-amber-600" />
                      <span>{isAr ? 'قيد التحصيل (ON REQUEST)' : 'ON REQUEST / PENDING'}</span>
                    </>
                  )}
                </div>

                <div className="space-y-0.5 pt-1">
                  {booking.invoiceNumber && (
                    <div className="font-mono text-xs font-bold text-neutral-950">
                      {isAr ? 'رقم الفاتورة:' : 'Invoice No:'}{' '}
                      <span className="text-amber-700 font-black">{booking.invoiceNumber}</span>
                    </div>
                  )}
                  {(booking.referenceCode || booking.bookingReference) && (
                    <div className="font-mono text-xs text-neutral-700">
                      {isAr ? 'مرجع الحجز:' : 'Booking Ref:'}{' '}
                      <span className="font-bold text-neutral-900">#{booking.referenceCode || booking.bookingReference}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-neutral-600">
                    {isAr ? 'تاريخ الإصدار:' : 'Issue Date:'}{' '}
                    {d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2-COLUMN GRID: BILLED TO & ITINERARY ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Client Information */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 border-b border-neutral-200 pb-1.5">
                  <FaUser size={11} />
                  <span>{isAr ? 'بيانات العميل والجهة المفَوْترة (Billed To)' : 'Billed To / Client Particulars'}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm text-neutral-950">
                    {booking.fullName || (isAr ? 'العميل الكريم (Guest)' : 'Valued Guest')}
                  </div>
                  {booking.companyName && (
                    <div className="text-neutral-700 font-medium">
                      {isAr ? 'الشركة:' : 'Company:'} <strong>{booking.companyName}</strong>
                      {booking.taxId && ` (${isAr ? 'الرقم الضريبي:' : 'Tax ID:'} ${booking.taxId})`}
                    </div>
                  )}
                  <div className="text-neutral-600 flex items-center gap-2 font-mono text-[11px]">
                    <FaEnvelope className="text-neutral-400" size={11} />
                    <span>{booking.email || '—'}</span>
                  </div>
                  <div className="text-neutral-600 flex items-center gap-2 font-mono text-[11px]">
                    <FaPhone className="text-neutral-400" size={11} />
                    <span>{booking.phone || '—'}</span>
                  </div>
                  {(booking.address || booking.city || booking.country) && (
                    <div className="text-neutral-600 flex items-center gap-2 text-[11px]">
                      <FaMapMarkerAlt className="text-neutral-400" size={11} />
                      <span>{[booking.address, booking.city, booking.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Itinerary & Party */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 border-b border-neutral-200 pb-1.5">
                  <FaPlaneDeparture size={11} />
                  <span>{isAr ? 'تفاصيل الرحلة والبرنامج (Itinerary & Party)' : 'Curated DMC Itinerary & Party'}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-sm text-neutral-950">
                    {booking.tourTitle || 'Bespoke Luxury Experience'}
                  </div>
                  <div className="text-neutral-700">
                    <span className="text-neutral-500">{isAr ? 'فترة الرحلة:' : 'Travel Dates:'}</span>{' '}
                    <strong className="font-mono text-neutral-950">{booking.arrivalDate || 'TBD'}</strong>
                    {booking.departureDate && (
                      <span>
                        {' '}{isAr ? 'إلى' : 'to'}{' '}
                        <strong className="font-mono text-neutral-950">{booking.departureDate}</strong>
                      </span>
                    )}
                  </div>
                  <div className="text-neutral-700">
                    <span className="text-neutral-500">{isAr ? 'المسافرون المشمولون:' : 'Party Manifest:'}</span>{' '}
                    <strong className="text-neutral-950">
                      {booking.adults || totalPax} {isAr ? 'بالغين' : 'Adult(s)'}
                      {booking.children > 0 && ` • ${booking.children} ${isAr ? 'أطفال' : 'Child(ren)'}`}
                      {booking.infants > 0 && ` • ${booking.infants} ${isAr ? 'رضّع' : 'Infant(s)'}`}
                    </strong>
                  </div>
                  {passengerList.length > 0 && (
                    <div className="text-neutral-600 text-[11px] truncate">
                      <span className="text-neutral-500">{isAr ? 'الأسماء:' : 'Names:'}</span> {passengerList.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── ITEMIZED ACCOUNTING TABLE ── */}
            <div className="rounded-xl border border-neutral-300 overflow-hidden mb-6">
              <table className="w-full border-collapse text-xs text-start">
                <thead className="bg-neutral-100 border-b border-neutral-300 text-neutral-800">
                  <tr>
                    <th className="p-3.5 text-start font-bold">#</th>
                    <th className="p-3.5 text-start font-bold">
                      {isAr ? 'بيان الخدمة السياحية والكونسيرج (Curated Service Description)' : 'Curated DMC Service Description'}
                    </th>
                    <th className="p-3.5 text-center font-bold">{isAr ? 'الكمية (Qty)' : 'Qty'}</th>
                    <th className="p-3.5 text-end font-bold">{isAr ? 'سعر الوحدة (Rate)' : 'Rate'}</th>
                    <th className="p-3.5 text-end font-bold">{isAr ? 'المجموع (Amount)' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="p-3.5 font-mono text-neutral-500">01</td>
                    <td className="p-3.5">
                      <div className="font-bold text-neutral-950 text-[13px]">
                        {isAr
                          ? 'باقة الرحلة السياحية المتكاملة شاملة الإقامة والاستقبال الخاص وتنسيق الكونسيرج'
                          : 'All-Inclusive Bespoke DMC Package: Accommodations, VIP Transfers & Egyptologist Guide'}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {isAr ? 'برنامج سياحي حصري معتمد وموثق' : 'Curated Exclusive DMC Itinerary & VIP Concierge Services'}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono font-medium text-neutral-800">{totalPax}</td>
                    <td className="p-3.5 text-end font-mono text-neutral-800">
                      ${totalNum > 0 ? (subtotal / Math.max(1, totalPax)).toFixed(2) : '0.00'}
                    </td>
                    <td className="p-3.5 text-end font-mono font-bold text-neutral-950">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-neutral-50/40">
                    <td className="p-3.5 font-mono text-neutral-500">02</td>
                    <td className="p-3.5">
                      <div className="font-medium text-neutral-800">
                        {isAr ? 'ضريبة القيمة المضافة السياحية المعتمدة (VAT 14%)' : 'Statutory Tourism Value Added Tax (VAT 14%)'}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {isAr ? 'وفقاً للوائح هيئة الضرائب المصرية ووزارة المالية' : 'Egyptian Tax Authority Statutory Regulation'}
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-mono text-neutral-500">—</td>
                    <td className="p-3.5 text-end font-mono text-neutral-500">14%</td>
                    <td className="p-3.5 text-end font-mono text-neutral-800">
                      {tax > 0 ? `$${tax.toFixed(2)}` : (isAr ? 'شاملة (Included)' : 'Included')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals Summary */}
              <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div className="space-y-1.5 text-xs text-neutral-600 max-w-sm">
                  <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                    <FaCreditCard className="text-amber-700" size={12} />
                    <span>{isAr ? 'طريقة ومصدر السداد:' : 'Settlement Method:'}</span>
                  </div>
                  <p className="text-[11px] text-neutral-700">
                    GetPayIn SSL Secure Gateway (Credit / Debit Card)
                  </p>
                  <p className="text-[10px] text-neutral-500 leading-relaxed">
                    {isAr
                      ? 'جميع المعاملات المالية محمية بتشفير 256-bit SSL ومعتمدة لدى البنك المركزي المصري.'
                      : 'All financial transactions are secured with 256-bit SSL encryption and authorized by Central Bank of Egypt regulations.'}
                  </p>
                </div>

                <div className="w-full sm:w-72 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>{isAr ? 'المجموع الفرعي (Subtotal):' : 'Subtotal:'}</span>
                    <span className="font-mono font-medium text-neutral-950">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>{isAr ? 'ضريبة القيمة المضافة (VAT):' : 'VAT (14%):'}</span>
                    <span className="font-mono font-medium text-neutral-950">
                      {tax > 0 ? `$${tax.toFixed(2)}` : (isAr ? 'شاملة (Included)' : 'Included')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black pt-2 border-t-2 border-neutral-300 text-neutral-950">
                    <span className="text-amber-800">{isAr ? 'الإجمالي الكلي (Total):' : 'Total Amount:'}</span>
                    <span className="font-mono text-lg text-amber-800 font-black">
                      {booking.currency === 'EUR' ? '€' : '$'}{totalNum.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-emerald-700 font-bold">{isAr ? 'المبلغ المدفوع (Paid):' : 'Amount Paid:'}</span>
                    <span className="font-mono text-emerald-700 font-bold">${paidNum.toFixed(2)}</span>
                  </div>
                  {totalNum - paidNum > 0 && (
                    <div className="flex justify-between text-xs pt-0.5 text-amber-700 font-bold">
                      <span>{isAr ? 'المتبقي للتحصيل (Due):' : 'Balance Due:'}</span>
                      <span className="font-mono font-black">${(totalNum - paidNum).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Online Payment Button (if pending) */}
            {!isConfirmed && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 print:hidden flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FaShieldAlt />
                  {isPaying
                    ? (isAr ? 'جارٍ تحويلك للبوابة البنكية...' : 'Initiating Secure Gateway...')
                    : (isAr ? 'متابعة الدفع الإلكتروني الآن (GetPayIn SSL)' : 'Proceed to Online Payment (GetPayIn SSL)')}
                </button>
                {paymentError && (
                  <p className="text-xs text-red-600 text-center mt-1 bg-red-100 p-2 rounded-lg">
                    {paymentError}
                  </p>
                )}
              </div>
            )}

            {/* ── SECURITY & ETA QR VERIFICATION FOOTER ── */}
            <div className="pt-5 border-t border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px] text-neutral-600">
              <div className="space-y-1.5 max-w-md text-start">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 text-xs">
                  <FaShieldAlt className="text-emerald-600" />
                  <span>
                    {isAr
                      ? 'وثيقة رسمية معتمدة ومؤمنة رقمياً (ETA Certified E-Invoice)'
                      : 'Official ETA Certified Digital Tax Document & Voucher'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {isAr
                    ? 'تم إصدار هذه الفاتورة إلكترونياً وهي معتمدة ومسجلة رسمياً لدى مصلحة الضرائب المصرية ووزارة السياحة والآثار برقم ترخيص 1882 (فئة أ).'
                    : 'Electronically issued and registered with Egyptian Tax Authority (ETA) and Ministry of Tourism License #1882 Category A.'}
                </p>
                <p className="text-[10px] text-neutral-500 font-medium">
                  VIP Concierge Support: concierge@dunastravel.com | +20 100 414 6843
                </p>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl border border-neutral-300 bg-neutral-50 shrink-0">
                <div className="w-16 h-16 bg-white rounded-lg p-1 border border-neutral-300 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="ETA E-Invoice QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FaQrcode size={32} className="text-amber-800" />
                  )}
                </div>
                <div className="text-[10px] space-y-0.5 text-start">
                  <div className="font-bold text-neutral-900">
                    {isAr ? 'فحص الرمز الضريبي' : 'ETA E-INVOICE'}
                  </div>
                  <div className="font-mono text-neutral-500 text-[9px]">SCAN TO VERIFY</div>
                  <div className="font-mono text-emerald-700 font-bold text-[10px]">AUTHENTIC DMC</div>
                  <div className="text-[9px] text-neutral-400">Lic. #1882 / Cat. A</div>
                </div>
              </div>
            </div>

            {/* Signature Line */}
            <div className="mt-8 pt-4 border-t border-dashed border-neutral-300 flex justify-between items-end text-[10px] text-neutral-500 font-mono">
              <div>
                <span>ISSUED BY: DUNAS CONCIERGE BILLING SYSTEM</span>
              </div>
              <div className="text-end">
                <div className="w-40 border-b border-neutral-400 mb-1" />
                <span>AUTHORIZED DMC SEAL & SIGNATURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InvoiceModal;
