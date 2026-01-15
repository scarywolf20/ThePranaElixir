import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShopNowButton from './ShopNowButton'; // Import your new button

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const slides = [
    { id: 1, title: "WAX TABLETS", image: "/path-to-your-image.png" },
    { id: 2, title: "SOY CANDLES", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59" },
    { id: 3, title: "GENTLE SOAPS", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[75vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
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
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-bg-surface text-7xl font-serif tracking-[0.1em] mb-12"
            >
              {slides[currentIndex].title}
            </motion.h2>

            {/* USE THE NEW COMPONENT HERE */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ShopNowButton />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators on the Right */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-20">
        {slides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentIndex(index)}
            className="relative w-4 h-4 flex items-center justify-center group"
          >
            {currentIndex === index && (
              <motion.div 
                layoutId="activeCircle" 
                className="absolute w-6 h-6 border border-bg-surface rounded-full" 
              />
            )}
            <div className={`w-1.5 h-1.5 rounded-full ${currentIndex === index ? 'bg-bg-surface' : 'bg-bg-surface/50 group-hover:bg-bg-surface'}`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;