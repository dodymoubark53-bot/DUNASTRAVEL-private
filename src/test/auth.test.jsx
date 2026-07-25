import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TestComponent = ({ onAuth }) => {
  const auth = useAuth();
  if (onAuth) onAuth(auth);

  return (
    <div>
      <div data-testid="user-email">{auth.user ? auth.user.email : 'guest'}</div>
      <button onClick={() => auth.login('admin@dunas.com', 'password123')}>Login</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext Security & Session Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('bootstraps user session via GET /auth/me and sets user state', async () => {
    const mockUser = { id: 'u-1', email: 'traveler@luxury.com', name: 'John Doe' };
    vi.spyOn(api, 'get').mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('traveler@luxury.com');
    });

    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles guest state gracefully when /auth/me returns 401', async () => {
    vi.spyOn(api, 'get').mockRejectedValue({ status: 401, message: 'Unauthorized' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('guest');
    });

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('connects register, updateProfile, changePassword, forgotPassword, resetPassword, verifyEmail, and resendVerification', async () => {
    vi.spyOn(api, 'get').mockRejectedValue({ status: 401, message: 'Unauthorized' });
    vi.spyOn(api, 'post').mockImplementation((path) => {
      if (path === '/auth/register') return Promise.resolve({ user: { id: 'u-2', email: 'new@dunas.com', name: 'New User' } });
      if (path === '/auth/forgot-password') return Promise.resolve({ message: 'Instructions sent' });
      if (path === '/auth/reset-password') return Promise.resolve({ message: 'Password reset' });
      if (path === '/auth/change-password') return Promise.resolve({ message: 'Password changed' });
      if (path === '/auth/verify-email') return Promise.resolve({ message: 'Email verified' });
      if (path === '/auth/resend-verification') return Promise.resolve({ message: 'Verification resent' });
      if (path === '/auth/logout-all') return Promise.resolve({ message: 'Logged out all' });
      if (path === '/auth/refresh') return Promise.resolve({ message: 'Refreshed' });
      return Promise.resolve({});
    });
    vi.spyOn(api, 'patch').mockResolvedValue({ user: { name: 'Updated Name', phone: '+123456789' } });

    let authRef;
    render(
      <AuthProvider>
        <TestComponent onAuth={(auth) => { authRef = auth; }} />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('guest');
    });

    // Test register
    await act(async () => {
      await authRef.register({ name: 'New User', email: 'new@dunas.com', password: 'Password1!' });
    });
    expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({ email: 'new@dunas.com' }));
    expect(authRef.user.email).toBe('new@dunas.com');

    // Test updateProfile
    await act(async () => {
      await authRef.updateProfile({ name: 'Updated Name', phone: '+123456789' });
    });
    expect(api.patch).toHaveBeenCalledWith('/auth/profile', { name: 'Updated Name', phone: '+123456789' });
    expect(authRef.user.name).toBe('Updated Name');

    // Test changePassword
    await act(async () => {
      await authRef.changePassword('OldPass123!', 'NewPass123!');
    });
    expect(api.post).toHaveBeenCalledWith('/auth/change-password', expect.objectContaining({ oldPassword: 'OldPass123!', newPassword: 'NewPass123!' }));

    // Test forgotPassword
    await act(async () => {
      await authRef.forgotPassword('new@dunas.com');
    });
    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', { email: 'new@dunas.com' });

    // Test resetPassword
    await act(async () => {
      await authRef.resetPassword('token-123', 'NewPass123!');
    });
    expect(api.post).toHaveBeenCalledWith('/auth/reset-password', { token: 'token-123', newPassword: 'NewPass123!' });

    // Test verifyEmail
    await act(async () => {
      await authRef.verifyEmail('token-xyz');
    });
    expect(api.post).toHaveBeenCalledWith('/auth/verify-email', { token: 'token-xyz' });

    // Test resendVerification
    await act(async () => {
      await authRef.resendVerification('new@dunas.com');
    });
    expect(api.post).toHaveBeenCalledWith('/auth/resend-verification', { email: 'new@dunas.com' });

    // Test logoutAll
    await act(async () => {
      await authRef.logoutAll();
    });
    expect(api.post).toHaveBeenCalledWith('/auth/logout-all', {});
    expect(authRef.user).toBeNull();
  });
});

