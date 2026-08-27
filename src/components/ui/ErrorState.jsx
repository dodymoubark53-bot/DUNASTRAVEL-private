import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this content.',
  onRetry,
}) => {
  return (
    <div className="p-8 rounded-2xl bg-red-950/20 border border-red-500/30 text-center max-w-md mx-auto my-6">
      <FaExclamationTriangle className="text-red-400 text-3xl mx-auto mb-3 animate-bounce" />
      <h3 className="text-lg font-bold text-red-200 mb-2 font-display">{title}</h3>
      <p className="text-sm text-red-300/80 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-900 font-semibold text-xs uppercase tracking-wider transition-colors shadow-md"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
