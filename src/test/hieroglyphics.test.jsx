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

  it('sends name string to POST /api/ai/hieroglyphics and renders glyphs, transliteration, and historic note', async () => {
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

    expect(api.post).toHaveBeenCalledWith('/ai/hieroglyphics', expect.objectContaining({
      text: 'Dina',
      name: 'Dina',
      language: 'en',
    }));
  });

  it('falls back to POST /api/tools/hieroglyphics when AI endpoint fails', async () => {
    vi.spyOn(api, 'post').mockImplementation((path) => {
      if (path === '/ai/hieroglyphics') return Promise.reject(new Error('AI Busy'));
      if (path === '/tools/hieroglyphics') {
        return Promise.resolve({
          translation: '𓄤𓆑𓂋',
          translit: 'n-f-r',
          note: 'Fallback scribal translation',
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<HieroglyphicName />);

    const input = screen.getByPlaceholderText(/e\.g\. Dina/i);
    fireEvent.change(input, { target: { value: 'Sara' } });

    const submitBtn = screen.getByRole('button', { name: /Inscribe My Name/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('𓄤𓆑𓂋')).toBeInTheDocument();
      expect(screen.getByText('n-f-r')).toBeInTheDocument();
    });
  });

  it('falls back gracefully to internal phonetic mapping when offline', async () => {
    vi.spyOn(api, 'post').mockRejectedValue(new Error('Network offline'));

    render(<HieroglyphicName />);

    const input = screen.getByPlaceholderText(/e\.g\. Dina/i);
    fireEvent.change(input, { target: { value: 'Alex' } });

    const submitBtn = screen.getByRole('button', { name: /Inscribe My Name/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Transliterated from phonetic mapping/i)).toBeInTheDocument();
    });
  });
});
