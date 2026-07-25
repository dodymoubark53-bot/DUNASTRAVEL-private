import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export const FormFeedback = ({ type = 'error', message }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
        isSuccess
          ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300'
          : 'bg-red-950/30 border border-red-500/40 text-red-300'
      }`}
      role="alert"
    >
      {isSuccess ? (
        <FaCheckCircle className="text-emerald-400 text-lg flex-shrink-0" />
      ) : (
        <FaExclamationCircle className="text-red-400 text-lg flex-shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default FormFeedback;
