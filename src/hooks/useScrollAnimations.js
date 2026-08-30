import { useEffect } from 'react';

const useScrollAnimations = () => {
  useEffect(() => {
    let ctx;
    let isReverted = false;
    let scrollTriggerInstance = null;

    // Check if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const initAnimations = async () => {
      // Check if any matching elements exist before loading GSAP
      const revealCount = document.querySelectorAll('.gsap-reveal').length;
      const parallaxCount = document.querySelectorAll('.gsap-parallax').length;
      const countCount = document.querySelectorAll('.gsap-count').length;

      if (revealCount === 0 && parallaxCount === 0 && countCount === 0) {
        return;
      }

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (isReverted) return;

      scrollTriggerInstance = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const sections = document.querySelectorAll('.gsap-reveal');
        sections.forEach((section) => {
          const children = section.children;
          gsap.fromTo(
            children,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              force3D: true,
              clearProps: 'transform',
              scrollTrigger: {
                trigger: section,
                start: 'top 90%',
                once: true,
              },
            }
          );
        });

        const parallaxEls = document.querySelectorAll('.gsap-parallax');
        parallaxEls.forEach((el) => {
          gsap.to(el, {
            yPercent: -15,
            ease: 'none',
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });

        const counters = document.querySelectorAll('.gsap-count');
        counters.forEach((counter) => {
          const target = parseInt(counter.dataset.count) || 0;
          const obj = { value: 0 };
          
          ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              gsap.to(obj, {
                value: target,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => {
                  counter.textContent = Math.round(obj.value);
                },
              });
            },
          });
        });
      });
    };

    const scheduleInit = () => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          initAnimations();
        });
      } else {
        setTimeout(initAnimations, 200);
      }
    };

    if (document.readyState === 'complete') {
      scheduleInit();
    } else {
      window.addEventListener('load', scheduleInit, { once: true });
    }

    return () => {
      isReverted = true;
      window.removeEventListener('load', scheduleInit);
      if (ctx) ctx.revert();
      if (scrollTriggerInstance) {
        scrollTriggerInstance.getAll().forEach((t) => t.kill());
      }
    };
  }, []);
};

export default useScrollAnimations;
