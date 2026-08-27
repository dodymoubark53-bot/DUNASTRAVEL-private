import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const DEFAULT_IMAGE = 'https://dunastravel.com/dunas-travel-logo.png';
const SITE_NAME = 'Dunas Travel - Luxury Egypt & Middle East Journeys';
const SITE_URL = 'https://dunastravel.com';

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  schema,
  noindex = false,
}) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language || 'en';
  const pageTitle = title ? `${title} | Dunas Travel` : SITE_NAME;
  const pageDesc = description || t('site.defaultDescription', 'Experience the epitome of luxury travel across Egypt, Jordan, Turkey, Morocco, Dubai, Greece, Brazil, Italy, and Spain with bespoke private itineraries from Dunas Travel.');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : SITE_URL;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? `${SITE_URL}${window.location.pathname}` : SITE_URL);

  const metaKeywords = Array.isArray(keywords) ? keywords.join(', ') : (keywords || 'luxury travel, egypt tours, nile cruise, bespoke travel, jordan tours, morocco luxury tours, private guide');

  // Format schema(s)
  const schemaList = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet htmlAttributes={{ lang: currentLang, dir: i18n.dir() }}>
      {/* Standard Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={metaKeywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}

      {/* Open Graph Tags */}
      <meta property="og:site_name" content="Dunas Travel" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={currentLang} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data Schema */}
      {schemaList.map((item, index) => (
        <script key={`schema-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
