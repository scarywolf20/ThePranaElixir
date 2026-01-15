import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { id: 1, text: "The Banaras Stripe soap is a game changer. My skin has never felt more hydrated and clean.", author: "Ananya R." },
  { id: 2, text: "I love the commitment to natural ingredients. The packaging is as beautiful as the product.", author: "Marcus T." },
  { id: 3, text: "These soaps are works of art. They make my whole bathroom smell like a botanical garden.", author: "Sarah L." },
  { id: 4, text: "Mindfully made and beautifully delivered. This is my new favorite self-care ritual.", author: "David K." },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % (testimonials.length - 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const visibleTestimonials = [
    testimonials[index],
    testimonials[(index + 1) % testimonials.length]
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 overflow-hidden">
      <header className="mb-12 text-center">
        <span className="uppercase tracking-[0.3em] text-xs font-semibold text-text-secondary block mb-2">
          Reviews
        </span>
        <h2 className="text-3xl font-serif text-text-primary">What our community says</h2>
      </header>

      {/* The container needs a fixed max-width and relative positioning */}
      <div className="relative max-w-3xl mx-auto min-h-[300px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div 
            key={index}
            // Using opacity + x for a smooth slide
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            // Use a slightly snappier spring for less "floaty" feel
            transition={{ 
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            {visibleTestimonials.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square p-6 rounded-2xl border border-text-primary transition-all duration-500 cursor-default flex flex-col justify-center items-center text-center overflow-hidden bg-bg-section"
              >
                {/* Hover Fill Effect */}
                <div className="absolute inset-0 bg-text-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
                
                <div className="relative z-10">
                  <p className="text-sm md:text-base font-light leading-relaxed text-[#6D5447] group-hover:text-white transition-colors duration-500 italic mb-4">
                    “{item.text}”
                  </p>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-[#6D5447] group-hover:text-white transition-colors duration-500 uppercase">
                    — {item.author}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: testimonials.length - 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === i ? 'w-6 bg-text-primary' : 'w-1.5 bg-text-secondary'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;