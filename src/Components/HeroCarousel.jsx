import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      id: 1,
      title: "WAX TABLETS",
      image: "image_5c5fe7.png", // Replace with your actual image path
    },
    {
      id: 2,
      title: "SOY CANDLES",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80", 
    },
    {
      id: 3,
      title: "GENTLE SOAPS",
      image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80",
    }
  ];

  const nextSlide = (index) => setCurrentIndex(index);

  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-bg-main">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
          >
            {/* Subtle Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Content Overlay */}
          <div className="relative h-full max-w-7xl mx-auto px-12 flex flex-col justify-center items-start">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-bg-surface text-6xl md:text-8xl font-serif tracking-widest mb-8 drop-shadow-sm"
            >
              {slides[currentIndex].title}
            </motion.h2>

            {/* Custom Shop Now Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="group flex items-center bg-bg-surface rounded-full pl-8 pr-2 py-2 cursor-pointer transition-transform hover:scale-105 shadow-md"
            >
              <span className="text-text-primary uppercase tracking-[0.2em] text-xs font-semibold mr-4">
                Shop Now
              </span>
              <div className="bg-text-primary w-10 h-10 rounded-full flex items-center justify-center text-bg-surface transition-colors group-hover:bg-primary-hover">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Right-side Vertical Navigation Dots */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => nextSlide(index)}
            className="relative flex items-center justify-center cursor-pointer group"
          >
            {/* The Active Circle Ring */}
            {currentIndex === index && (
              <motion.div 
                layoutId="activeCircle"
                className="absolute w-6 h-6 border border-bg-surface rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {/* The Inner Dot */}
            <div className={`
              w-1.5 h-1.5 rounded-full transition-all duration-300
              ${currentIndex === index ? 'bg-bg-surface' : 'bg-bg-surface/40 group-hover:bg-bg-surface'}
            `} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;