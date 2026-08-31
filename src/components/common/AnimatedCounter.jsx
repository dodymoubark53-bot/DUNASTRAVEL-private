import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * AnimatedCounter
 * Smoothly animates numbers from 0 to target value when scrolled into view.
 * Built with React state & requestAnimationFrame to ensure robust rendering and
 * complete immunity to React re-render resets.
 */
export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  formatter,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const [count, setCount] = useState(0);
  const targetNumber = typeof value === 'number' ? value : parseInt(value, 10) || 0;

  useEffect(() => {
    // If reduced motion is preferred, jump straight to target value
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(targetNumber);
      return;
    }

    if (!isInView) return;

    let startTime = null;
    let animationFrameId;

    const startValue = 0;
    const endValue = targetNumber;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easeOut);

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, targetNumber, duration]);

  const formattedCount = formatter 
    ? formatter(count) 
    : count.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}
