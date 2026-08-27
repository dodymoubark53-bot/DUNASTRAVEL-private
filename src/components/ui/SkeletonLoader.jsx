import React from 'react';

export const SkeletonLoader = ({ className = 'h-4 w-full', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-obsidian-800/20 animate-pulse rounded ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
