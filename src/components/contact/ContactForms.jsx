import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { useDestinations } from '../../hooks/useDestinations';

const ContactForms = () => {
  const { t, i18n } = useTranslation();
  const { destinations: publishedDestinations } = useDestinations();
  const [activeTab, setActiveTab] = useState('b2c'); // 'b2c' | 'b2b'

  // B2C Form States
  const [b2cForm, setB2cForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destination: 'egypt',
    date: '',
    duration: '8-14',
    adults: 2,
    children: 0,
    accommodation: '5star',
    pace: 'balanced',
    agreePrivacy: false,
  });
  const [b2cLanguages, setB2cLanguages] = useState(new Set(['english']));
  const [b2cSubmitted, setB2cSubmitted] = useState(false);
  const [b2cSubmitError, setB2cSubmitError] = useState('');
  const [b2cErrors, setB2cErrors] = useState({});

  // B2B Form States
  const [b2bForm, setB2bForm] = useState({
    agentName: '',
    jobTitle: '',
    agentEmail: '',
    agentPhone: '',
    agencyName: '',
    website: '',
    address: '',
    iataNumber: '',
    expectedVolume: '10-50',
    sourceCountry: '',
    additionalInfo: '',
    agreePrivacy: false,
  });
  const [b2bDestinations, setB2bDestinations] = useState(new Set(['egypt', 'turkey']));
  const [b2bFiles, setB2bFiles] = useState({
    license: null,
    tax: null,
  });
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bSubmitError, setB2bSubmitError] = useState('');
  const [b2bErrors, setB2bErrors] = useState({});

  // IATA / Partner Real-Time Verification States
  const [iataVerificationState, setIataVerificationState] = useState('idle'); // 'idle' | 'verifying' | 'verified' | 'unverified'
  const [verifiedCompany, setVerifiedCompany] = useState(null);
  const [iataVerificationError, setIataVerificationError] = useState('');
  const iataDebounceRef = useRef(null);

  // Drag and Drop Dragging States
  const [dragOverLicense, setDragOverLicense] = useState(false);
  const [dragOverTax, setDragOverTax] = useState(false);

  // File Input Refs
  const licenseInputRef = useRef(null);
  const taxInputRef = useRef(null);

  // B2C Handlers
  const handleB2cChange = (e) => {
    const { name, value, type, checked } = e.target;
    setB2cForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (b2cErrors[name]) {
      setB2cErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleB2cCounter = (field, action) => {
    setB2cForm((prev) => {
      let val = prev[field];
      if (action === 'inc') val += 1;
      if (action === 'dec') {
        const minVal = field === 'adults' ? 1 : 0;
        val = Math.max(minVal, val - 1);
      }
      return { ...prev, [field]: val };
    });
  };

  const toggleB2cLanguage = (lang) => {
    setB2cLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(lang)) {
        if (next.size > 1) next.delete(lang);
      } else {
        next.add(lang);
      }
      return next;
    });
  };

  const validateB2c = () => {
    const errors = {};
    if (!b2cForm.firstName.trim()) errors.firstName = true;
    if (!b2cForm.lastName.trim()) errors.lastName = true;
    if (!b2cForm.email.trim() || !/\S+@\S+\.\S+/.test(b2cForm.email)) errors.email = true;
    if (!b2cForm.phone.trim()) errors.phone = true;
    if (!b2cForm.date) errors.date = true;
    if (!b2cForm.agreePrivacy) errors.agreePrivacy = true;
    return errors;
  };

  const handleB2cSubmit = async (e) => {
    e.preventDefault();
    setB2cSubmitError('');
    const errors = validateB2c();
    if (Object.keys(errors).length > 0) {
      setB2cErrors(errors);
      const firstError = Object.keys(errors)[0];
      const el = document.getElementsByName(firstError)[0];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const b2cMessage = [
        `Destination: ${b2cForm.destination}`,
        `Travel Date: ${b2cForm.date}`,
        `Duration: ${b2cForm.duration} days`,
        `Travelers: ${b2cForm.adults} Adults, ${b2cForm.children} Children`,
        `Accommodation: ${b2cForm.accommodation}`,
        `Pace: ${b2cForm.pace}`,
        `Preferred Guides: ${Array.from(b2cLanguages).join(', ')}`
      ].join('\n');

      await api.post('/contact', {
        firstName: b2cForm.firstName.trim(),
        lastName: b2cForm.lastName.trim(),
        email: b2cForm.email.trim(),
        phone: b2cForm.phone.trim() || undefined,
        subject: `B2C Inquiry: ${b2cForm.destination.toUpperCase()} (${b2cForm.duration} days)`,
        message: b2cMessage,
        locale: (() => {
          const locale = String(i18n?.language || 'en').toLowerCase().split('-')[0];
          return ['en', 'es', 'fr', 'de', 'ar', 'pt', 'it'].includes(locale) ? locale : 'en';
        })(),
      });
      setB2cSubmitted(true);
    } catch (err) {
      console.error('B2C contact submission error', err);
      setB2cSubmitError(err?.message || t('common.errorOccurred', 'Your request could not be sent. Please try again.'));
    }
  };

  // B2B Handlers
  const handleB2bChange = (e) => {
    const { name, value, type, checked } = e.target;
    let nextValue = type === 'checkbox' ? checked : value;

    if (name === 'iataNumber') {
      // Strictly extract up to 8 digits
      const digitsOnly = String(value).replace(/\D/g, '').slice(0, 8);
      nextValue = digitsOnly;

      if (iataDebounceRef.current) {
        clearTimeout(iataDebounceRef.current);
      }

      if (digitsOnly.length === 8) {
        setIataVerificationState('verifying');
        setIataVerificationError('');

        iataDebounceRef.current = setTimeout(async () => {
          try {
            const res = await api.get(`/agencies/verify-partner/${digitsOnly}`);
            if (res.data?.valid && res.data?.company) {
              setIataVerificationState('verified');
              setVerifiedCompany(res.data.company);
              setIataVerificationError('');

              // Auto-fill company details if empty
              setB2bForm((prev) => ({
                ...prev,
                agencyName: prev.agencyName || res.data.company.name || '',
                website: prev.website || res.data.company.website || '',
                address: prev.address || res.data.company.address || '',
              }));
            } else {
              setIataVerificationState('unverified');
              setVerifiedCompany(null);
              setIataVerificationError(
                res.data?.message || 'رقم الاعتماد غير مسجل في قاعدة بيانات الشركاء المتعاقدين'
              );
            }
          } catch (err) {
            setIataVerificationState('unverified');
            setVerifiedCompany(null);
            setIataVerificationError(
              err?.response?.data?.message || err?.message || 'تعذر التحقق من رقم الاعتماد حالياً'
            );
          }
        }, 300);
      } else {
        setIataVerificationState('idle');
        setVerifiedCompany(null);
        setIataVerificationError('');
      }
    }

    setB2bForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
    if (b2bErrors[name]) {
      setB2bErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const toggleB2bDestination = (dest) => {
    setB2bDestinations((prev) => {
      const next = new Set(prev);
      if (next.has(dest)) {
        if (next.size > 1) next.delete(dest);
      } else {
        next.add(dest);
      }
      return next;
    });
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setB2bFiles((prev) => ({ ...prev, [field]: file }));
      setB2bErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleDrag = (e, field, state) => {
    e.preventDefault();
    e.stopPropagation();
    if (field === 'license') setDragOverLicense(state);
    if (field === 'tax') setDragOverTax(state);
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    if (field === 'license') setDragOverLicense(false);
    if (field === 'tax') setDragOverTax(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(field, e.dataTransfer.files[0]);
    }
  };

  const validateB2b = () => {
    const errors = {};
    if (!b2bForm.agentName.trim()) errors.agentName = true;
    if (!b2bForm.jobTitle.trim()) errors.jobTitle = true;
    if (!b2bForm.agentEmail.trim() || !/\S+@\S+\.\S+/.test(b2bForm.agentEmail)) errors.agentEmail = true;
    if (!b2bForm.agentPhone.trim()) errors.agentPhone = true;
    if (!b2bForm.agencyName.trim()) errors.agencyName = true;
    if (!b2bForm.address.trim()) errors.address = true;
    
    // IATA: Exactly 8 numeric digits validation
    const iataClean = b2bForm.iataNumber.replace(/\s+/g, '');
    if (!/^\d{8}$/.test(iataClean)) {
      errors.iataNumber = true;
    }

    if (!b2bForm.sourceCountry.trim()) errors.sourceCountry = true;
    if (!b2bFiles.license) errors.license = true;
    if (!b2bFiles.tax) errors.tax = true;
    if (!b2bForm.agreePrivacy) errors.agreePrivacy = true;
    return errors;
  };

  const handleB2bSubmit = async (e) => {
    e.preventDefault();
    setB2bSubmitError('');
    const errors = validateB2b();
    if (Object.keys(errors).length > 0) {
      setB2bErrors(errors);
      const firstError = Object.keys(errors)[0];
      const el = document.getElementsByName(firstError)[0] || document.getElementById(`${firstError}-dropzone`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const b2bMessage = [
        `B2B Partnership Application`,
        `Agent: ${b2bForm.agentName} (${b2bForm.jobTitle})`,
        `Agency: ${b2bForm.agencyName}`,
        `Website: ${b2bForm.website || 'N/A'}`,
        `Address: ${b2bForm.address}`,
        `IATA / Tax ID: ${b2bForm.iataNumber}`,
        `Source Country: ${b2bForm.sourceCountry}`,
        `Expected Volume: ${b2bForm.expectedVolume}`,
        `Interested Destinations: ${Array.from(b2bDestinations).join(', ')}`,
        `Notes: ${b2bForm.additionalInfo || 'N/A'}`
      ].join('\n');

      const nameParts = b2bForm.agentName.trim().split(' ');
      const firstName = nameParts[0] || b2bForm.agentName.trim();
      const lastName = nameParts.slice(1).join(' ') || 'Agent';

      await api.post('/contact', {
        firstName,
        lastName,
        email: b2bForm.agentEmail.trim(),
        phone: b2bForm.agentPhone.trim() || undefined,
        subject: `B2B Partnership: ${b2bForm.agencyName}`,
        message: b2bMessage,
        locale: (() => {
          const locale = String(i18n?.language || 'en').toLowerCase().split('-')[0];
          return ['en', 'es', 'fr', 'de', 'ar', 'pt', 'it'].includes(locale) ? locale : 'en';
        })(),
      });

      try {
        await api.post('/agencies/register', {
          name: b2bForm.agencyName.trim(),
          email: b2bForm.agentEmail.trim(),
          phone: b2bForm.agentPhone.trim() || undefined,
          taxId: b2bForm.iataNumber.trim(),
          address: b2bForm.address.trim() || undefined,
          website: b2bForm.website.trim() && b2bForm.website.startsWith('https://') ? b2bForm.website.trim() : undefined,
        });
      } catch (agencyError) {
        // A duplicate agency is idempotent; surface validation/server errors.
        if (agencyError?.status !== 409) throw agencyError;
      }

      setB2bSubmitted(true);
    } catch (err) {
      console.error('B2B contact submission error', err);
      setB2bSubmitError(err?.message || t('common.errorOccurred', 'Your application could not be sent. Please try again.'));
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .contact-forms-section {
          background-color: transparent;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .contact-forms-section h2, 
        .contact-forms-section h3,
        .contact-forms-section .price-value {
          font-family: 'Cormorant Garamond', serif;
        }

        .contact-forms-container {
          max-width: 1040px;
          margin: 0 auto;
        }

        /* Tabs Switcher styling - Header Royal Palette */
        .forms-tab-switcher {
          display: flex;
          background: linear-gradient(135deg, rgba(9, 13, 31, 0.95) 0%, rgba(5, 8, 26, 0.98) 100%);
          border: 2px solid rgba(212, 168, 67, 0.5);
          border-radius: 9999px;
          padding: 6px;
          margin-bottom: 2.5rem;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 168, 67, 0.15);
          backdrop-filter: blur(20px);
        }

        .forms-tab-btn {
          flex: 1;
          background: transparent;
          color: #CBD5E1;
          border: none;
          padding: 16px 24px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
          border-radius: 9999px;
        }

        .forms-tab-btn:hover {
          color: #F0C96A;
        }

        .forms-tab-btn.active {
          background: linear-gradient(135deg, #D4A843 0%, #B88E28 100%);
          color: #05081A !important;
          box-shadow: 0 4px 25px rgba(212, 168, 67, 0.45);
        }

        /* Form Card - Exact Header Royal Obsidian & Gold Aesthetic */
        .forms-card {
          background: linear-gradient(145deg, #090D1F 0%, #05081A 60%, #0F162E 100%);
          border: 2px solid rgba(212, 168, 67, 0.45);
          border-radius: 28px;
          padding: 3rem 2.5rem;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
        }

        .form-section-title {
          font-size: 28px;
          font-weight: 600;
          color: #F0C96A;
          font-family: 'Cormorant Garamond', serif;
          border-bottom: 1px solid rgba(212, 168, 67, 0.25);
          padding-bottom: 12px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .form-section-num {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 3px;
          color: #F0C96A;
          background: rgba(212, 168, 67, 0.2);
          border: 1px solid rgba(212, 168, 67, 0.45);
          padding: 4px 12px;
          border-radius: 9999px;
        }

        .form-field-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #F0C96A;
          margin-bottom: 10px;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          background-color: rgba(5, 8, 26, 0.9);
          border: 1px solid rgba(212, 168, 67, 0.35);
          padding: 16px 20px;
          color: #F8F6F0;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 14px !important;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #F0C96A;
          background-color: rgba(15, 21, 53, 0.98);
          outline: none;
          box-shadow: 0 0 20px rgba(212, 168, 67, 0.35);
        }

        .form-input.error, .form-select.error, .form-textarea.error, .dropzone.error {
          border-color: #EF4444 !important;
        }

        /* Toggle Pills styling */
        .pills-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pill-btn {
          background-color: rgba(5, 8, 26, 0.85);
          border: 1px solid rgba(212, 168, 67, 0.3);
          color: #E2E8F0;
          padding: 12px 22px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 12px !important;
        }

        .pill-btn:hover {
          border-color: #D4A843;
          color: #F0C96A;
          transform: translateY(-2px);
          background-color: rgba(212, 168, 67, 0.15);
        }

        .pill-btn.active {
          border-color: #F0C96A;
          color: #F0C96A !important;
          background: rgba(212, 168, 67, 0.22);
          box-shadow: 0 4px 18px rgba(212, 168, 67, 0.3);
        }

        /* Counter controls styling */
        .counter-container {
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: rgba(5, 8, 26, 0.9);
          border: 1px solid rgba(212, 168, 67, 0.35);
          padding: 8px 18px;
          width: fit-content;
          border-radius: 14px !important;
        }

        .counter-btn {
          background: transparent;
          border: 1px solid rgba(212, 168, 67, 0.4);
          color: #F0C96A;
          width: 34px;
          height: 34px;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 10px !important;
        }

        .counter-btn:hover {
          background-color: #D4A843;
          color: #05081A;
          border-color: #D4A843;
        }

        .counter-value {
          font-size: 16px;
          font-weight: 700;
          min-width: 24px;
          text-align: center;
          color: #F8F6F0;
        }

        /* Commission Preview box */
        .commission-preview-box {
          background: rgba(26, 47, 122, 0.05);
          border: 1px solid rgba(61, 92, 199, 0.2);
          padding: 24px;
          border-radius: 16px;
          margin-bottom: 24px;
        }
        .dark .commission-preview-box {
          background: rgba(26, 47, 122, 0.3);
          border-color: rgba(61, 92, 199, 0.4);
        }

        .commission-rate {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          color: #B88E28;
          font-weight: 400;
          margin-top: 6px;
        }
        .dark .commission-rate {
          color: #D4A843;
        }

        /* Drag and Drop Zone */
        .dropzone {
          border: 2px dashed #CBD5E1;
          background-color: #F8FAFC;
          padding: 28px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 16px !important;
        }
        .dark .dropzone {
          border-color: rgba(212, 168, 67, 0.3);
          background-color: rgba(5, 8, 26, 0.8);
        }

        .dropzone.dragover {
          border-color: #D4A843;
          background-color: rgba(212, 168, 67, 0.08);
        }

        .dropzone-text {
          font-size: 13px;
          color: #64748B;
        }
        .dark .dropzone-text {
          color: #8A8FA8;
        }

        .dropzone-filename {
          font-size: 13px;
          color: #B88E28;
          font-weight: 600;
          margin-top: 6px;
        }
        .dark .dropzone-filename {
          color: #D4A843;
        }

        /* Urgency bar */
        .urgency-bar {
          background-color: rgba(212, 168, 67, 0.08);
          border-left: 3px solid #D4A843;
          padding: 16px;
          color: #B88E28;
          font-size: 13px;
          border-radius: 0 12px 12px 0;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        .dark .urgency-bar {
          color: #F0C96A;
        }

        /* Summary panel styling */
        .price-summary-panel {
          background: #F8FAFC;
          border-left: 4px solid #D4A843;
          padding: 24px;
          border-radius: 0 16px 16px 0;
          margin-bottom: 24px;
          border-top: 1px solid #E2E8F0;
          border-right: 1px solid #E2E8F0;
          border-bottom: 1px solid #E2E8F0;
        }
        .dark .price-summary-panel {
          background: linear-gradient(135deg, rgba(20, 26, 61, 0.9) 0%, rgba(10, 14, 38, 0.95) 100%);
          border-left: 3px solid #D4A843;
          border-top: none;
          border-right: none;
          border-bottom: none;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .price-value {
          font-size: 32px;
          color: #B88E28;
          font-weight: 600;
        }
        .dark .price-value {
          color: #F0C96A;
        }

        /* Secure badges */
        .secure-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 28px;
          justify-content: center;
          opacity: 0.9;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #64748B;
          text-transform: uppercase;
        }
        .dark .secure-badge {
          color: #A0A5BC;
        }

        .secure-badge svg {
          color: #D4A843;
          width: 14px;
          height: 14px;
        }

        /* Submit Button */
        .submit-inquiry-btn {
          width: 100%;
          background: linear-gradient(135deg, #D4A843 0%, #B88E28 100%);
          color: #05081A;
          padding: 20px 32px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 4px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 16px !important;
          box-shadow: 0 8px 30px rgba(212, 168, 67, 0.3);
        }

        .submit-inquiry-btn:hover {
          background: linear-gradient(135deg, #F0C96A 0%, #D4A843 100%);
          box-shadow: 0 12px 36px rgba(212, 168, 67, 0.5);
          transform: translateY(-2px);
        }

        /* Success Message screen */
        .success-screen {
          text-align: center;
          padding: 4rem 2rem;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          color: #D4A843;
          margin: 0 auto 24px auto;
        }

        /* Responsive Layouts */
        @media (max-width: 640px) {
          .forms-tab-switcher {
            flex-direction: column;
            border-radius: 20px;
            padding: 8px;
          }
          .forms-tab-btn {
            border-radius: 14px;
          }
          .forms-card {
            padding: 2rem 1.25rem;
            border-radius: 20px;
          }
        }
      ` }} />

      <section id="contact-forms" className="contact-forms-section py-20 px-4 sm:px-6 relative z-20">
        <div className="contact-forms-container">
          
          <div className="text-center mb-12">
            <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-[4px] font-semibold block mb-3">
              ✨ {t('contactForms.subtitle', 'TAILOR-MADE LUXURY EXPERIENCES')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-slate-900 dark:text-ivory-50 mb-4" style={{ fontWeight: 400 }}>
              {t('contactForms.title', 'Request Your Bespoke Itinerary')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full"></div>
          </div>

          {/* Form Tabs Switcher */}
          <div className="forms-tab-switcher">
            <button
              type="button"
              className={`forms-tab-btn ${activeTab === 'b2c' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('b2c');
                setB2cSubmitted(false);
                setB2bSubmitted(false);
              }}
            >
              {t('contactForms.tabB2c', 'Individual Traveler')}
            </button>
            <button
              type="button"
              className={`forms-tab-btn ${activeTab === 'b2b' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('b2b');
                setB2cSubmitted(false);
                setB2bSubmitted(false);
              }}
            >
              {t('contactForms.tabB2b', 'Travel Agent / Company')}
            </button>
          </div>

          {/* Tab 1: B2C Form Panel */}
          {activeTab === 'b2c' && (
            <div className="forms-card">
              {b2cSubmitted ? (
                <div className="success-screen">
                  <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-display-md text-gold-500 mb-4">{t('contactForms.b2cSuccessTitle', 'Inquiry Received')}</h3>
                  <p className="text-body-md text-ivory-300 max-w-lg mx-auto">
                    {t('contactForms.b2cSuccessDesc', 'Thank you for choosing Dunas Travel. Our luxury travel consultants will contact you within 24 hours to design your bespoke journey.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setB2cForm({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        destination: 'egypt',
                        date: '',
                        duration: '8-14',
                        adults: 2,
                        children: 0,
                        accommodation: '5star',
                        pace: 'balanced',
                        agreePrivacy: false,
                      });
                      setB2cLanguages(new Set(['english']));
                      setB2cSubmitted(false);
                    }}
                    className="submit-inquiry-btn max-w-xs mx-auto mt-8 block"
                  >
                    {t('contactForms.submitAnother', 'Submit Another Inquiry')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleB2cSubmit} noValidate>
                  {b2cSubmitError && (
                    <div role="alert" className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
                      {b2cSubmitError}
                    </div>
                  )}
                  
                  {/* Section 1: Personal Information */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">01</span> {t('contactForms.secPersonalInfo', 'Personal Information')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.firstName', 'First Name *')}</label>
                        <input
                          type="text"
                          name="firstName"
                          value={b2cForm.firstName}
                          onChange={handleB2cChange}
                          className={`form-input ${b2cErrors.firstName ? 'error' : ''}`}
                          placeholder={t('contactForms.firstNamePlaceholder', 'Enter your first name')}
                          required
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.lastName', 'Last Name *')}</label>
                        <input
                          type="text"
                          name="lastName"
                          value={b2cForm.lastName}
                          onChange={handleB2cChange}
                          className={`form-input ${b2cErrors.lastName ? 'error' : ''}`}
                          placeholder={t('contactForms.lastNamePlaceholder', 'Enter your last name')}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.email', 'Email Address *')}</label>
                        <input
                          type="email"
                          name="email"
                          value={b2cForm.email}
                          onChange={handleB2cChange}
                          className={`form-input ${b2cErrors.email ? 'error' : ''}`}
                          placeholder={t('contactForms.emailPlaceholder', 'Enter your email address')}
                          required
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.phone', 'Phone Number *')}</label>
                        <input
                          type="tel"
                          name="phone"
                          value={b2cForm.phone}
                          onChange={handleB2cChange}
                          className={`form-input ${b2cErrors.phone ? 'error' : ''}`}
                          placeholder={t('contactForms.phonePlaceholder', 'Enter phone with country code (e.g. +1...)')}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Trip Details */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">02</span> {t('contactForms.secTripDetails', 'Trip Details')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.bespokeDestination', 'Bespoke Destination *')}</label>
                        <select
                          name="destination"
                          value={b2cForm.destination}
                          onChange={handleB2cChange}
                          className="form-select"
                        >
                          {publishedDestinations.map((destination) => (
                            <option key={destination.id} value={destination.slug}>
                              {destination.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.travelDate', 'Travel Date *')}</label>
                        <input
                          type="date"
                          name="date"
                          value={b2cForm.date}
                          onChange={handleB2cChange}
                          className={`form-input ${b2cErrors.date ? 'error' : ''}`}
                          required
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.duration', 'Duration *')}</label>
                        <select
                          name="duration"
                          value={b2cForm.duration}
                          onChange={handleB2cChange}
                          className="form-select"
                        >
                          <option value="1-7">{t('contactForms.dur1_7', '1 - 7 Days (Expedition)')}</option>
                          <option value="8-14">{t('contactForms.dur8_14', '8 - 14 Days (Grand Voyage)')}</option>
                          <option value="15+">{t('contactForms.dur15plus', '15+ Days (Ultimate Leisure)')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#141A3D] p-6 border border-gold-500/10">
                      <div>
                        <label className="form-label block mb-2">{t('contactForms.adults', 'Adults (Age 12+)')}</label>
                        <div className="counter-container">
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => handleB2cCounter('adults', 'dec')}
                          >
                            -
                          </button>
                          <span className="counter-value">{b2cForm.adults}</span>
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => handleB2cCounter('adults', 'inc')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="form-label block mb-2">{t('contactForms.children', 'Children (Age 0-11)')}</label>
                        <div className="counter-container">
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => handleB2cCounter('children', 'dec')}
                          >
                            -
                          </button>
                          <span className="counter-value">{b2cForm.children}</span>
                          <button
                            type="button"
                            className="counter-btn"
                            onClick={() => handleB2cCounter('children', 'inc')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Preferences */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">03</span> {t('contactForms.secPreferences', 'Custom Preferences')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.accommodation', 'Accommodation Style')}</label>
                        <select
                          name="accommodation"
                          value={b2cForm.accommodation}
                          onChange={handleB2cChange}
                          className="form-select"
                        >
                          <option value="5star">{t('contactForms.acc5star', '5-Star Palace & Resorts')}</option>
                          <option value="boutique">{t('contactForms.accBoutique', 'Luxury Heritage Boutique')}</option>
                          <option value="villa">{t('contactForms.accVilla', 'Private Villa & Estate')}</option>
                        </select>
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.pace', 'Tour Pace')}</label>
                        <select
                          name="pace"
                          value={b2cForm.pace}
                          onChange={handleB2cChange}
                          className="form-select"
                        >
                          <option value="relaxed">{t('contactForms.paceRelaxed', 'Relaxed (Leisure focus)')}</option>
                          <option value="balanced">{t('contactForms.paceBalanced', 'Balanced (Highlights & downtime)')}</option>
                          <option value="active">{t('contactForms.paceActive', 'Active (Full-day explorations)')}</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label className="form-label mb-3">{t('contactForms.languages', 'Preferred Guide Languages')}</label>
                      <div className="pills-grid">
                        {['english', 'spanish', 'portuguese', 'italian', 'arabic'].map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            className={`pill-btn ${b2cLanguages.has(lang) ? 'active' : ''}`}
                            onClick={() => toggleB2cLanguage(lang)}
                          >
                            {t(`contactForms.lang${lang.charAt(0).toUpperCase() + lang.slice(1)}`, lang)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="urgency-bar">
                    <strong>{t('contactForms.urgencyLabel', 'Exclusive Notice:')}</strong> {t('contactForms.urgencyText', 'Peak luxury season availability is highly restricted. Submitting your inquiry now reserves your consultation priority.')}
                  </div>

                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={b2cForm.agreePrivacy}
                        onChange={handleB2cChange}
                        className={`mt-1 border-gold-500/20 text-gold-500 focus:ring-gold-500 bg-[#0F1535] rounded-none ${b2cErrors.agreePrivacy ? 'ring-2 ring-red-600' : ''}`}
                        required
                      />
                      <span className="text-body-sm text-ivory-300">
                        {t('contactForms.consent', 'I authorize Dunas Travel to store and process my information in order to create my tailored holiday plan, according to the privacy policy. *')}
                      </span>
                    </label>
                  </div>

                  <button type="submit" className="submit-inquiry-btn">
                    {t('contactForms.sendInquiry', 'Send My Inquiry')} →
                  </button>

                  <div className="secure-badges-row">
                    <div className="secure-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9C2 .6 4.7 0 9.5 0h1c4.8 0 7.5.6 7.334 4.9C18 9 17.5 12 15 15c-2 2.5-4.5 4.5-5.5 5h-1c-1-.5-3.5-2.5-5.5-5-2.5-3-3-6-3.334-10.1zM9 5a1 1 0 012 0v5a1 1 0 11-2 0V5zm1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                      {t('contactForms.ssl', 'SSL Secure Processing')}
                    </div>
                    <div className="secure-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {t('contactForms.privacy', 'Privacy Guaranteed')}
                    </div>
                    <div className="secure-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                      {t('contactForms.verified', 'Verified Destination Partner')}
                    </div>
                  </div>

                </form>
              )}
            </div>
          )}

          {/* Tab 2: B2B Form Panel */}
          {activeTab === 'b2b' && (
            <div className="forms-card">
              {b2bSubmitted ? (
                <div className="success-screen">
                  <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-display-md text-gold-500 mb-4">{t('contactForms.b2bSuccessTitle', 'Partner Application Received')}</h3>
                  <p className="text-body-md text-ivory-300 max-w-lg mx-auto">
                    {t('contactForms.b2bSuccessDesc', 'We appreciate your interest in partnering with Dunas Travel. Our Agency Relations manager will review your documents and active registration within 2 business days.')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setB2bForm({
                        agentName: '',
                        jobTitle: '',
                        agentEmail: '',
                        agentPhone: '',
                        agencyName: '',
                        website: '',
                        address: '',
                        iataNumber: '',
                        expectedVolume: '10-50',
                        sourceCountry: '',
                        additionalInfo: '',
                        agreePrivacy: false,
                      });
                      setB2bDestinations(new Set(['egypt', 'turkey']));
                      setB2bFiles({ license: null, tax: null });
                      setB2bSubmitted(false);
                    }}
                    className="submit-inquiry-btn max-w-xs mx-auto mt-8 block"
                  >
                    {t('contactForms.submitAnotherApp', 'Submit Another Application')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleB2bSubmit} noValidate>
                  {b2bSubmitError && (
                    <div role="alert" className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
                      {b2bSubmitError}
                    </div>
                  )}

                  {/* Section 1: Agent Details */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">01</span> {t('contactForms.secAgentInfo', 'Agent Information')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.fullName', 'Full Name *')}</label>
                        <input
                          type="text"
                          name="agentName"
                          value={b2bForm.agentName}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.agentName ? 'error' : ''}`}
                          placeholder={t('contactForms.fullNamePlaceholder', 'Enter your name')}
                          required
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.jobTitle', 'Job Title / Role *')}</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={b2bForm.jobTitle}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.jobTitle ? 'error' : ''}`}
                          placeholder={t('contactForms.jobTitlePlaceholder', 'e.g. Travel Consultant, Director')}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.corpEmail', 'Corporate Email *')}</label>
                        <input
                          type="email"
                          name="agentEmail"
                          value={b2bForm.agentEmail}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.agentEmail ? 'error' : ''}`}
                          placeholder={t('contactForms.corpEmailPlaceholder', 'Enter your corporate email')}
                          required
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.agentPhone', 'Agent Direct Phone *')}</label>
                        <input
                          type="tel"
                          name="agentPhone"
                          value={b2bForm.agentPhone}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.agentPhone ? 'error' : ''}`}
                          placeholder={t('contactForms.agentPhonePlaceholder', 'Direct phone line')}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Company Details */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">02</span> {t('contactForms.secAgency', 'Agency & Company Details')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.agencyName', 'Agency / Company Name *')}</label>
                        <input
                          type="text"
                          name="agencyName"
                          value={b2bForm.agencyName}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.agencyName ? 'error' : ''}`}
                          placeholder={t('contactForms.agencyNamePlaceholder', 'Enter legal company name')}
                          required
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.agencyWebsite', 'Agency Website')}</label>
                        <input
                          type="url"
                          name="website"
                          value={b2bForm.website}
                          onChange={handleB2bChange}
                          className="form-input"
                          placeholder={t('contactForms.agencyWebsitePlaceholder', 'https://agency-website.com (optional)')}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <div className="flex items-center justify-between mb-1">
                          <label className="form-label mb-0">
                            {t('contactForms.iata', 'IATA / TRUE / CLIA Number * (8 Digits Only)')}
                          </label>
                          {iataVerificationState === 'verifying' && (
                            <span className="text-[10px] text-gold-400 flex items-center gap-1.5 animate-pulse font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping inline-block" />
                              {t('contactForms.iataVerifying', 'جاري التحقق الفوري...')}
                            </span>
                          )}
                          {iataVerificationState === 'verified' && (
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                              ✓ {t('contactForms.iataVerifiedBadge', 'شريك معتمد')}
                            </span>
                          )}
                          {iataVerificationState === 'unverified' && (
                            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                              ✕ {t('contactForms.iataUnverifiedBadge', 'كود غير مسجل')}
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            name="iataNumber"
                            value={b2bForm.iataNumber}
                            onChange={handleB2bChange}
                            className={`form-input tracking-widest font-mono ${
                              b2bErrors.iataNumber
                                ? 'error'
                                : iataVerificationState === 'verified'
                                  ? '!border-emerald-500/70 !bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                  : iataVerificationState === 'unverified'
                                    ? '!border-amber-500/70 !bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                    : ''
                            }`}
                            placeholder="••••••••"
                            maxLength={8}
                            inputMode="numeric"
                            required
                          />
                          {iataVerificationState === 'verifying' && (
                            <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                          {iataVerificationState === 'verified' && (
                            <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400 font-bold text-sm">
                              ✓
                            </div>
                          )}
                          {iataVerificationState === 'unverified' && (
                            <div className="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400 font-bold text-sm">
                              ✕
                            </div>
                          )}
                        </div>

                        {b2bErrors.iataNumber && (
                          <span className="text-red-500 text-xs mt-1 block">
                            {t('contactForms.iataError', 'Must be exactly 8 numeric digits')}
                          </span>
                        )}

                        {/* Verified Partner Card */}
                        {iataVerificationState === 'verified' && verifiedCompany && (
                          <div className="mt-2.5 p-3.5 bg-gradient-to-r from-emerald-950/40 via-[#0F1535] to-gold-950/20 border border-emerald-500/40 rounded-sm shadow-md">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-400 font-bold text-sm leading-none mt-0.5">✓</span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-emerald-300 text-xs tracking-wide">
                                      {verifiedCompany.name}
                                    </span>
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/40 rounded-xs">
                                      {verifiedCompany.tier || 'PLATINUM'} TIER
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-ivory-300/80 mt-1">
                                    {t('contactForms.iataVerifiedDesc', 'تم التحقق من بيانات الشريك المعتمد بنجاح')} • <span className="font-mono text-gold-400 font-semibold">{verifiedCompany.referenceCode}</span>
                                  </p>
                                </div>
                              </div>
                              {verifiedCompany.commissionRate > 0 && (
                                <div className="text-end flex-shrink-0">
                                  <span className="text-[9px] text-muted-foreground uppercase block">{t('contactForms.approvedCommission', 'العمولة المعتمدة')}</span>
                                  <span className="text-xs font-bold text-gold-400">{verifiedCompany.commissionRate}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Unverified Warning Card */}
                        {iataVerificationState === 'unverified' && (
                          <div className="mt-2.5 p-3 bg-amber-950/30 border border-amber-500/40 rounded-sm text-xs text-amber-200">
                            <div className="flex items-start gap-2">
                              <span className="text-amber-400 font-bold text-sm leading-none">!</span>
                              <div>
                                <span className="font-semibold text-amber-300 block mb-0.5">
                                  {t('contactForms.unverifiedTitle', 'رقم الاعتماد غير مسجل في شبكة الشركاء المعتمدين')}
                                </span>
                                <p className="text-ivory-300/80 text-[11px] leading-relaxed">
                                  {iataVerificationError || t('contactForms.unverifiedDesc', 'هذا الرقم غير مسجل في عقود الشركاء الحالية لدينا. يمكنك إكمال النموذج وسيقوم فريق العلاقات التجارية بمراجعة بياناتكم والتواصل لإنشاء وتفعيل عقد الوكالة.')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.officeAddress', 'Office Address *')}</label>
                        <input
                          type="text"
                          name="address"
                          value={b2bForm.address}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.address ? 'error' : ''}`}
                          placeholder={t('contactForms.officeAddressPlaceholder', 'Full office address')}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Partnership Scope */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">03</span> {t('contactForms.secPartnership', 'Partnership Scope')}
                    </h3>
                    <div className="form-field-group mb-6">
                      <label className="form-label mb-3">{t('contactForms.targetDests', 'Target Destinations for Luxury Clients')}</label>
                      <div className="pills-grid">
                        {publishedDestinations.map((destination) => (
                          <button
                            key={destination.id}
                            type="button"
                            className={`pill-btn ${b2bDestinations.has(destination.slug) ? 'active' : ''}`}
                            onClick={() => toggleB2bDestination(destination.slug)}
                          >
                            {destination.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.bookingVolume', 'Expected Annual Booking Volume *')}</label>
                        <select
                          name="expectedVolume"
                          value={b2bForm.expectedVolume}
                          onChange={handleB2bChange}
                          className="form-select"
                        >
                          <option value="under-10">{t('contactForms.volUnder10', 'Under 10 bookings per year')}</option>
                          <option value="10-50">{t('contactForms.vol10_50', '10 - 50 bookings per year')}</option>
                          <option value="50+">{t('contactForms.vol50plus', '50+ bookings per year')}</option>
                        </select>
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.sourceCountry', 'Main Client Source Country *')}</label>
                        <input
                          type="text"
                          name="sourceCountry"
                          value={b2bForm.sourceCountry}
                          onChange={handleB2bChange}
                          className={`form-input ${b2bErrors.sourceCountry ? 'error' : ''}`}
                          placeholder={t('contactForms.sourceCountryPlaceholder', 'e.g. USA, Spain, Mexico')}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Document Upload Zone */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">04</span> {t('contactForms.secCredentials', 'Credentials Verification')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.license', 'Business Registry / Tourism License *')}</label>
                        <div
                          id="license-dropzone"
                          className={`dropzone ${dragOverLicense ? 'dragover' : ''} ${b2bErrors.license ? 'error' : ''}`}
                          onDragOver={(e) => handleDrag(e, 'license', true)}
                          onDragLeave={(e) => handleDrag(e, 'license', false)}
                          onDrop={(e) => handleDrop(e, 'license')}
                          onClick={() => licenseInputRef.current.click()}
                        >
                          <input
                            type="file"
                            ref={licenseInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange('license', e.target.files[0])}
                            accept=".pdf,.png,.jpg,.jpeg"
                          />
                          {b2bFiles.license ? (
                            <div>
                              <div className="dropzone-text" style={{ color: '#F0C96A' }}>{t('contactForms.selectedDoc', 'Selected Document:')}</div>
                              <div className="dropzone-filename">{b2bFiles.license.name}</div>
                            </div>
                          ) : (
                            <div className="dropzone-text">
                              {t('contactForms.dropzone', 'Drag and drop file here or')} <strong>{t('contactForms.browse', 'browse')}</strong>.<br />
                              <span style={{ fontSize: '10px', opacity: 0.7 }}>{t('contactForms.dropzoneHint', '(PDF, PNG, JPG max 5MB)')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label className="form-label">{t('contactForms.taxCert', 'Tax Identification Certificate *')}</label>
                        <div
                          id="tax-dropzone"
                          className={`dropzone ${dragOverTax ? 'dragover' : ''} ${b2bErrors.tax ? 'error' : ''}`}
                          onDragOver={(e) => handleDrag(e, 'tax', true)}
                          onDragLeave={(e) => handleDrag(e, 'tax', false)}
                          onDrop={(e) => handleDrop(e, 'tax')}
                          onClick={() => taxInputRef.current.click()}
                        >
                          <input
                            type="file"
                            ref={taxInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange('tax', e.target.files[0])}
                            accept=".pdf,.png,.jpg,.jpeg"
                          />
                          {b2bFiles.tax ? (
                            <div>
                              <div className="dropzone-text" style={{ color: '#F0C96A' }}>{t('contactForms.selectedDoc', 'Selected Document:')}</div>
                              <div className="dropzone-filename">{b2bFiles.tax.name}</div>
                            </div>
                          ) : (
                            <div className="dropzone-text">
                              {t('contactForms.dropzone', 'Drag and drop file here or')} <strong>{t('contactForms.browse', 'browse')}</strong>.<br />
                              <span style={{ fontSize: '10px', opacity: 0.7 }}>{t('contactForms.dropzoneHint', '(PDF, PNG, JPG max 5MB)')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 6: Additional Information */}
                  <div className="mb-10">
                    <h3 className="form-section-title">
                      <span className="form-section-num">05</span> {t('contactForms.secAdditional', 'Additional Information')}
                    </h3>
                    <div className="form-field-group">
                      <label className="form-label">{t('contactForms.specialRequests', 'Special Scope Requests / Notes')}</label>
                      <textarea
                        name="additionalInfo"
                        value={b2bForm.additionalInfo}
                        onChange={handleB2bChange}
                        rows="4"
                        className="form-textarea resize-none"
                        placeholder={t('contactForms.specialRequestsPlaceholder', 'Detail any special markets, custom request volume, or dynamic itinerary setups required...')}
                      />
                    </div>
                  </div>

                  {/* Consent & Submit */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreePrivacy"
                        checked={b2bForm.agreePrivacy}
                        onChange={handleB2bChange}
                        className={`mt-1 border-gold-500/20 text-gold-500 focus:ring-gold-500 bg-[#0F1535] rounded-none ${b2bErrors.agreePrivacy ? 'ring-2 ring-red-600' : ''}`}
                        required
                      />
                      <span className="text-body-sm text-ivory-300">
                        {t('contactForms.b2bConsent', 'Our company certifies that all submitted records are authentic, and we authorize Dunas Travel to store and process this partner application. *')}
                      </span>
                    </label>
                  </div>

                  <button type="submit" className="submit-inquiry-btn">
                    {t('contactForms.submitPartner', 'Submit Partner Application')} →
                  </button>

                  <div className="secure-badges-row">
                    <div className="secure-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9C2 .6 4.7 0 9.5 0h1c4.8 0 7.5.6 7.334 4.9C18 9 17.5 12 15 15c-2 2.5-4.5 4.5-5.5 5h-1c-1-.5-3.5-2.5-5.5-5-2.5-3-3-6-3.334-10.1zM9 5a1 1 0 012 0v5a1 1 0 11-2 0V5zm1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                      {t('contactForms.ssl', 'SSL Secure Processing')}
                    </div>
                    <div className="secure-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      {t('contactForms.partnershipGuarantee', 'Partnership Guarantee')}
                    </div>
                    <div className="secure-badge">
                      <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                      {t('contactForms.b2bVerified', 'B2B Verified Portal')}
                    </div>
                  </div>

                </form>
              )}
            </div>
          )}

        </div>
      </section>
    </>
  );
};

export default ContactForms;
