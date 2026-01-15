import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShopNowButton from './ShopNowButton';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    { id: 1, title: "WAX TABLETS", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59" },
    { id: 2, title: "SOY CANDLES", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59" },
    { id: 3, title: "GENTLE SOAPS", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Slide Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
          />

          {/* Text & Button Overlay */}
          <div className="relative h-full max-w-7xl mx-auto px-12 flex flex-col justify-center items-start">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white text-6xl md:text-7xl font-serif tracking-[0.15em] mb-10"
            >
              {slides[currentIndex].title}
            </motion.h2>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <ShopNowButton />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators on the Right */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20">
        {slides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentIndex(index)}
            className="relative w-4 h-4 flex items-center justify-center group"
          >
            {currentIndex === index && (
              <motion.div 
                layoutId="activeCircle" 
                className="absolute w-7 h-7 border-2 border-white rounded-full" 
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white' : 'bg-white/50 group-hover:bg-white/80'
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;