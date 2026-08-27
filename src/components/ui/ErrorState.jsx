import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this content.',
  onRetry,
  actionLabel = 'Try again',
  actionLink,
}) => {
  return (
    <div className="mx-auto my-6 max-w-md rounded-2xl border border-gold-500/30 bg-obsidian-900/80 p-8 text-center text-ivory-100 backdrop-blur-md">
      <FaExclamationTriangle className="mx-auto mb-3 text-3xl text-gold-400" aria-hidden="true" />
      <h3 className="mb-2 font-display text-lg font-bold text-ivory-100">{title}</h3>
      <p className="mb-5 text-sm text-ivory-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="min-h-11 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-obsidian-950 shadow-gold transition-all duration-300 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900"
        >
          {actionLabel}
        </button>
      )}
      {!onRetry && actionLink && <Link to={actionLink} className="inline-flex min-h-11 items-center rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-obsidian-950 shadow-gold transition-all duration-300 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900">{actionLabel}</Link>}
    </div>
  );
};

export default ErrorState;
