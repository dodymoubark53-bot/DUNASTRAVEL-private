import React from 'react';
import { FaInbox } from 'react-icons/fa';

export const EmptyState = ({
  title = 'No items found',
  message = 'There are no items matching your criteria at this time.',
  action,
}) => {
  return (
    <div className="p-12 rounded-2xl bg-obsidian-800/10 border border-gold-500/10 text-center max-w-md mx-auto my-6">
      <FaInbox className="text-gold-500/40 text-4xl mx-auto mb-3" />
      <h3 className="text-lg font-bold text-obsidian-800 dark:text-ivory-100 mb-2 font-display">{title}</h3>
      <p className="text-sm text-obsidian-500 dark:text-ivory-400 mb-6">{message}</p>
      {action}
    </div>
  );
};

export default EmptyState;
