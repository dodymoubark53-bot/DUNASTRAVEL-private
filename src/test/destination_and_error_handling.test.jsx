// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  resolveDestinationSlug,
  getTourDestinationSlug,
  getDestinationName,
  getDestinationUrl
} from '../utils/destinationHelper';
import ErrorState from '../components/ui/ErrorState';

describe('Destination Helper & Safe Error Boundary Handling', () => {
  it('resolves destination slugs accurately for various country/city/slug inputs', () => {
    expect(resolveDestinationSlug('United Arab Emirates')).toBe('dubai');
    expect(resolveDestinationSlug('UAE')).toBe('dubai');
    expect(resolveDestinationSlug('الإمارات')).toBe('dubai');
    expect(resolveDestinationSlug('دبي')).toBe('dubai');
    expect(resolveDestinationSlug('Dubai')).toBe('dubai');
    expect(resolveDestinationSlug('Egypt')).toBe('egypt');
    expect(resolveDestinationSlug('مصر')).toBe('egypt');
    expect(resolveDestinationSlug('Turkey')).toBe('turkey');
    expect(resolveDestinationSlug('تركيا')).toBe('turkey');
    expect(resolveDestinationSlug('Jordan')).toBe('jordan');
    expect(resolveDestinationSlug('الأردن')).toBe('jordan');
    expect(resolveDestinationSlug('Morocco')).toBe('morocco');
    expect(resolveDestinationSlug('Tunisia')).toBe('tunisia');
    expect(resolveDestinationSlug('Greece')).toBe('greece');
    expect(resolveDestinationSlug('Holy Land')).toBe('holy-land');
  });

  it('extracts correct destination from tour objects including ict006', () => {
    const dubaiTour = {
      id: 'REG-28',
      slug: 'ict006',
      country: 'United Arab Emirates',
      city: 'Dubai',
    };
    expect(getTourDestinationSlug(dubaiTour)).toBe('dubai');
    expect(getDestinationUrl(getTourDestinationSlug(dubaiTour))).toBe('/destinations/dubai');

    const egyptTour = {
      id: 'tour-1',
      slug: 'classic-program',
      country: 'Egypt',
      city: 'Cairo',
    };
    expect(getTourDestinationSlug(egyptTour)).toBe('egypt');
    expect(getDestinationUrl(getTourDestinationSlug(egyptTour))).toBe('/destinations/egypt');
  });

  it('returns proper localized destination names in Arabic and English', () => {
    // Arabic
    expect(getDestinationName('dubai', null, 'ar')).toBe('دبي');
    expect(getDestinationName('egypt', null, 'ar')).toBe('مصر');
    expect(getDestinationName('turkey', null, 'ar')).toBe('تركيا');
    expect(getDestinationName('jordan', null, 'ar')).toBe('الأردن');

    // English
    expect(getDestinationName('dubai', null, 'en')).toBe('Dubai');
    expect(getDestinationName('egypt', null, 'en')).toBe('Egypt');
    expect(getDestinationName('turkey', null, 'en')).toBe('Turkey');
    expect(getDestinationName('jordan', null, 'en')).toBe('Jordan');
  });

  it('ErrorState renders safely when given raw Error objects without throwing React error #31', () => {
    const rawError = new Error('Connection timed out');
    const rawTitleError = new Error('Database Error');

    expect(() => {
      render(
        <MemoryRouter>
          <ErrorState title={rawTitleError} message={rawError} />
        </MemoryRouter>
      );
    }).not.toThrow();

    expect(screen.getByText('Connection timed out')).toBeInTheDocument();
    expect(screen.getByText('Database Error')).toBeInTheDocument();
  });

  it('maps Dubai tour catalog items accurately to destination dubai', () => {
    const sampleDubaiTours = [
      { id: 'REG-22', name: { ar: 'استراحة دبي وسفاري الصحراء', en: 'Dubai Stopover' }, country: 'United Arab Emirates' },
      { id: 'REG-23', name: { ar: 'دبي مدينة المستقبل', en: 'Dubai City of Future' }, destination: 'UAE' }
    ];
    sampleDubaiTours.forEach((t) => {
      const destSlug = resolveDestinationSlug(t.destination || t.country);
      expect(destSlug).toBe('dubai');
    });
  });
});
