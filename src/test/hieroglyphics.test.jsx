import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HieroglyphicName from '../components/home/HieroglyphicName';
import api from '../utils/api';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

describe('Prompt 06: AI Hieroglyphics Name Translator Proxy', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends name string to POST /api/tools/hieroglyphics and renders glyphs, transliteration, and historic note', async () => {
    const mockAiResponse = {
      glyphs: 'B𓏏𓂋',
      transliteration: 'b-t-r',
      historicNote: 'Written in royal cartouche for protection.',
    };

    vi.spyOn(api, 'post').mockResolvedValue(mockAiResponse);

    render(<HieroglyphicName />);

    const input = screen.getByPlaceholderText(/e\.g\. Dina/i);
    fireEvent.change(input, { target: { value: 'Dina' } });

    const submitBtn = screen.getByRole('button', { name: /Inscribe My Name/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('B𓏏𓂋')).toBeInTheDocument();
      expect(screen.getByText('b-t-r')).toBeInTheDocument();
      expect(screen.getByText('Written in royal cartouche for protection.')).toBeInTheDocument();
    });

    expect(api.post).toHaveBeenCalledWith('/tools/hieroglyphics', { text: 'Dina' });
  });

  it('displays honest error message when AI service fails', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new Error('AI Hieroglyphics Service unavailable'));

    render(<HieroglyphicName />);

    const input = screen.getByPlaceholderText(/e\.g\. Dina/i);
    fireEvent.change(input, { target: { value: 'Alex' } });

    const submitBtn = screen.getByRole('button', { name: /Inscribe My Name/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/AI Hieroglyphics Service unavailable/i)).toBeInTheDocument();
    });
  });
});
