import { describe, it, expect, beforeEach, vi } from 'vitest';
import api, { clearCsrfToken, createClientRequestId, unwrap } from '../utils/api';

describe('Centralized API Client (api.js)', () => {
  beforeEach(() => {
    clearCsrfToken();
    vi.restoreAllMocks();
  });

  it('creates request identifiers from browser cryptographic randomness', () => {
    const id = createClientRequestId('req');
    expect(id).toMatch(/^req_[0-9a-f-]{32,36}$/i);
  });

  it('unwraps exactly one canonical backend response envelope', async () => {
    const mockData = { id: 'tour-123', title: 'Grand Pyramids Luxury Tour' };
    const mockResponse = { success: true, statusCode: 200, data: mockData, timestamp: '2026-08-24T00:00:00.000Z' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    });

    const result = await api.get('/tours/grand-pyramids');
    expect(result).toEqual(mockData);
  });

  it('rejects malformed and failed HTTP-success envelopes', () => {
    expect(() => unwrap({ data: { id: 'tour-123' } })).toThrow('Invalid API success envelope');
    expect(() => unwrap({ success: true, data: { success: false, code: 'TOUR_NOT_PUBLISHABLE', message: 'Tour is not publishable' } })).toThrow('Tour is not publishable');
  });

  it('preserves zero, false, null, and a valid empty page', () => {
    expect(unwrap({ success: true, statusCode: 200, data: { zero: 0, enabled: false, optional: null } }))
      .toEqual({ zero: 0, enabled: false, optional: null });
    expect(unwrap({ success: true, statusCode: 200, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }))
      .toEqual({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
  });

  it('normalizes error responses and attaches HTTP status code', async () => {
    const errorResponse = { success: false, statusCode: 404, code: 'NOT_FOUND', message: 'Tour not found' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => errorResponse,
    });

    await expect(api.get('/tours/invalid-tour')).rejects.toThrow('Tour not found');
  });

  it('automatically fetches and injects x-csrf-token for mutating POST requests', async () => {
    const csrfToken = 'mock-csrf-secret-123';
    
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/auth/csrf')) {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true, statusCode: 200, data: { csrfToken } }),
        });
      }

      return Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, statusCode: 200, data: { success: true } }),
      });
    });

    await api.post('/bookings', { tourId: 't-1' });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const postCall = vi.mocked(global.fetch).mock.calls.find(call => call[0].includes('/bookings'));
    expect(postCall[1].headers['x-csrf-token']).toBe(csrfToken);
    expect(postCall[1].credentials).toBe('include');
  });

  it('clears cached CSRF token on 403 Forbidden response', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/auth/csrf')) {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true, statusCode: 200, data: { csrfToken: 'token-abc' } }),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 403,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'CSRF token invalid' }),
      });
    });

    await expect(api.post('/bookings', {})).rejects.toThrow('CSRF token invalid');
  });
});
