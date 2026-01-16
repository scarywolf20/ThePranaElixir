import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far the user has scrolled
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG Circle Math
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-14 h-14 bg-white text-[#63483D] rounded-xl shadow-lg hover:scale-110 transition-transform group"
        aria-label="Back to top"
      >
        {/* Progress Border SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Static Background Path (Optional) */}
          <rect
            x="4"
            y="4"
            width="48"
            height="48"
            rx="10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-10"
          />
          {/* Progressive Path */}
          <path
            d="M 12 4 H 44 A 8 8 0 0 1 52 12 V 44 A 8 8 0 0 1 44 52 H 12 A 8 8 0 0 1 4 44 V 12 A 8 8 0 0 1 12 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={192} // Approximate perimeter of the square path
            strokeDashoffset={192 - (192 * scrollProgress) / 100}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />
        </svg>

        {/* Arrow Icon */}
        <ChevronUp size={24} className="relative z-10 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
};

export default BackToTop;