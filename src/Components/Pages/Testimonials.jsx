import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

const fallbackTestimonials = [
  { id: 1, text: "The Banaras Stripe soap is a game changer. My skin has never felt more hydrated and clean.", author: "Ananya R." },
  { id: 2, text: "I love the commitment to natural ingredients. The packaging is as beautiful as the product.", author: "Marcus T." },
  { id: 3, text: "These soaps are works of art. They make my whole bathroom smell like a botanical garden.", author: "Sarah L." },
  { id: 4, text: "Mindfully made and beautifully delivered. This is my new favorite self-care ritual.", author: "David K." },
  { id: 5, text: "The quality is exceptional. I've recommended these to all my friends and family.", author: "Priya S." },
  { id: 6, text: "A luxurious experience every time. The scents are divine and long-lasting.", author: "James M." },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setTestimonials(
        snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            text: data.text || '',
            author: data.name || '',
            rating: Number(data.rating || 5),
          }
        }),
      )
    })
    return unsubscribe
  }, [])

  const effectiveTestimonials = testimonials.length ? testimonials : fallbackTestimonials

  const safeIndex = effectiveTestimonials.length ? index % effectiveTestimonials.length : 0

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % (effectiveTestimonials.length - 2));
    }, 4000);
    return () => clearInterval(timer);
  }, [effectiveTestimonials.length]);

  const visibleTestimonials = [
    effectiveTestimonials[safeIndex],
    effectiveTestimonials[(safeIndex + 1) % effectiveTestimonials.length],
    effectiveTestimonials[(safeIndex + 2) % effectiveTestimonials.length]
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
      <div className="relative max-w-6xl mx-auto min-h-[300px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <div 
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ 
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full"
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
                    "{item.text}"
                  </p>
                  <p className="text-[10px] tracking-[0.2em] font-bold text-[#6D5447] group-hover:text-white transition-colors duration-500 uppercase">
                    — {item.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: effectiveTestimonials.length - 2 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              safeIndex === i ? 'w-6 bg-text-primary' : 'w-1.5 bg-text-secondary'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;