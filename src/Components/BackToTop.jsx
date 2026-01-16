import React, { useEffect, useState, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const pathRef = useRef(null);
  const rafRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      
      // Update target progress
      targetProgressRef.current = progress;
      setIsVisible(window.scrollY > 300);
    };

    // Smooth animation loop using lerp (linear interpolation)
    const animate = () => {
      // Lerp factor - lower = smoother but slower, higher = faster but less smooth
      const lerpFactor = 0.1;
      
      // Smoothly interpolate current progress towards target
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * lerpFactor;
      
      // Only update state if there's a meaningful difference
      if (Math.abs(targetProgressRef.current - currentProgressRef.current) > 0.1) {
        setScrollProgress(currentProgressRef.current);
      } else {
        // Snap to target when very close
        currentProgressRef.current = targetProgressRef.current;
        setScrollProgress(targetProgressRef.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // The total length of the "squircle" path
  const pathLength = 192; 
  const progressOffset = pathLength - (scrollProgress * pathLength) / 100;

  return (
    <div
      className={`fixed bottom-8 right-8 z-[9999] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-14 h-14 bg-white text-[#63483D] rounded-xl shadow-2xl hover:bg-stone-50 transition-colors group"
      >
        {/* Progress Border SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 scale-[1.05]">
          {/* Background Track (The 'empty' border) */}
          <path
            d="M 12 4 H 44 A 8 8 0 0 1 52 12 V 44 A 8 8 0 0 1 44 52 H 12 A 8 8 0 0 1 4 44 V 12 A 8 8 0 0 1 12 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-10"
          />
          {/* The Progressive Border */}
          <path
            ref={pathRef}
            d="M 12 4 H 44 A 8 8 0 0 1 52 12 V 44 A 8 8 0 0 1 44 52 H 12 A 8 8 0 0 1 4 44 V 12 A 8 8 0 0 1 12 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={pathLength}
            style={{ 
              strokeDashoffset: progressOffset,
              // Removed CSS transition - we're handling smoothness via JS lerp now
            }}
            strokeLinecap="round"
          />
        </svg>

        <ChevronUp size={22} className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default BackToTop;