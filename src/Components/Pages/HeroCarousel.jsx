import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShopNowButton from '../Elements/ShopNowButton';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setSlides(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            image: data.imageUrl || '',
          };
        })
      );
    });
    return unsubscribe;
  }, []);

  const effectiveSlides = slides.length
    ? slides
    : [
        { id: 1, title: "Artisan Wellness, Thoughtfully Crafted", image: "https://res.cloudinary.com/dslr4xced/image/upload/v1769348646/tprmqlnyvwvpgixwzpvr.png" },
        { id: 2, title: "Awaken Your Daily Ritual", image: "https://res.cloudinary.com/dslr4xced/image/upload/v1769348378/kfj9ijvhkzjbzhoslxus.png" },
        { id: 3, title: "Crafted by Nature", image: "https://res.cloudinary.com/dslr4xced/image/upload/v1769348339/haz9uy1gjvhdmni3bvmw.png" },
      ];

  useEffect(() => {
    if (effectiveSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % effectiveSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [effectiveSlides.length]);

  return (
    <section className="relative w-full h-[70vh] md:h-[75vh] overflow-hidden bg-black">
      {/* Set initial={true} to trigger animations on first mount */}
      <AnimatePresence initial={true}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 z-0"
        >
          {/* To fix the first-load animation:
            We ensure scale starts at 1.15 and moves to 1 immediately on mount.
          */}
          <motion.div 
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${effectiveSlides[currentIndex].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          </motion.div>

          <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center items-start">
            <div className="overflow-hidden max-w-4xl space-y-6">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
                className="text-white text-4xl md:text-7xl lg:text-8xl font-serif tracking-wide leading-tight drop-shadow-lg"
              >
                The Prana Elixir <br/>
                <span className="text-2xl md:text-4xl lg:text-5xl font-light italic text-white/90 tracking-normal drop-shadow-md">
                  – {effectiveSlides[currentIndex].title}
                </span>
              </motion.h1>
              
              <motion.p
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.6, duration: 0.8 }}
                 className="text-white/90 text-sm md:text-lg lg:text-xl font-light tracking-wide max-w-2xl leading-relaxed drop-shadow-md"
              >
                Crafted by an doctor, our artisanal cold-process soaps and pure botanical skincare blends are designed to nurture your skin and elevate your daily wellness rituals. Embrace the essence of holistic living, free from harsh chemicals.
              </motion.p>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <ShopNowButton />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-30">
        {effectiveSlides.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentIndex(index)}
            className="relative w-3 h-3 flex items-center justify-center"
          >
            {currentIndex === index && (
              <motion.div 
                layoutId="activeIndicator" 
                className="absolute w-8 h-8 border border-white/40 rounded-full" 
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            )}
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              currentIndex === index ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'
            }`} />
          </button>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-20">
        <motion.div 
          key={currentIndex}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-white/50"
        />
      </div>
    </section>
  );
};

export default HeroCarousel;