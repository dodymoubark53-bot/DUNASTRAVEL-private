import { useEffect } from 'react';

const useScrollAnimations = () => {
  useEffect(() => {
    let ctx;
    let isReverted = false;

    const initAnimations = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      if (isReverted) return;

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
      
      // Dynamically clean up ScrollTrigger if it has been loaded
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }).catch(() => {});
    };
  }, []);
};

export default useScrollAnimations;
