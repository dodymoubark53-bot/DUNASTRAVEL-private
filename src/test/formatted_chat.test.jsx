import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FormattedChatMessage from '../components/ui/FormattedChatMessage';

describe('FormattedChatMessage Component', () => {
  it('renders bold text without raw asterisks', () => {
    const text = 'أنا **جايدر (GuideR)**، المستشار السياحي الخاص لدى **دوناس ترافيل**.';
    const { container } = render(<FormattedChatMessage text={text} />);

    // Must NOT contain raw ** in text content
    expect(container.textContent).not.toContain('**');

    // Strong tags should contain the bold words
    const strongTags = container.querySelectorAll('strong');
    expect(strongTags.length).toBe(2);
    expect(strongTags[0].textContent).toBe('جايدر (GuideR)');
    expect(strongTags[1].textContent).toBe('دوناس ترافيل');
  });

  it('renders bullet lists with custom styled items', () => {
    const listText = '- زيارة أهرامات الجيزة\n- رحلة نايل كروز فاخرة\n- جولة في وادي الملوك';
    const { container } = render(<FormattedChatMessage text={listText} />);

    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
    expect(listItems[0].textContent).toContain('زيارة أهرامات الجيزة');
    expect(listItems[1].textContent).toContain('رحلة نايل كروز فاخرة');
    expect(listItems[2].textContent).toContain('جولة في وادي الملوك');
  });

  it('renders numbered lists properly', () => {
    const numberedText = '1. اليوم الأول: الوصول للقاهرة\n2. اليوم الثاني: الأقصر وأسوان';
    const { container } = render(<FormattedChatMessage text={numberedText} />);

    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain('اليوم الأول: الوصول للقاهرة');
    expect(listItems[1].textContent).toContain('اليوم الثاني: الأقصر وأسوان');
  });

  it('renders headings cleanly', () => {
    const headingText = '### برنامج الرحلة المقترح\nتفاصيل اليوم الأول...';
    const { container } = render(<FormattedChatMessage text={headingText} />);

    const h4 = container.querySelector('h4');
    expect(h4).not.toBeNull();
    expect(h4.textContent).toBe('برنامج الرحلة المقترح');
  });

  it('renders markdown links', () => {
    const linkText = 'استعرض [رحلة الأقصر وأسوان](/tours/luxor-aswan) لمزيد من التفاصيل.';
    const { container } = render(<FormattedChatMessage text={linkText} />);

    const link = container.querySelector('a');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe('رحلة الأقصر وأسوان');
    expect(link.getAttribute('href')).toBe('/tours/luxor-aswan');
  });
});
