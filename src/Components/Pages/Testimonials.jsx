import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';

const fallbackTestimonials = [
  { id: 1, text: "The Banaras Stripe soap is a game changer. My skin has never felt more hydrated and clean.", author: "Ananya R.", rating: 5 },
  { id: 2, text: "I love the commitment to natural ingredients. The packaging is as beautiful as the product.", author: "Marcus T.", rating: 5 },
  { id: 3, text: "These soaps are works of art. They make my whole bathroom smell like a botanical garden.", author: "Sarah L.", rating: 5 },
  { id: 4, text: "Mindfully made and beautifully delivered. This is my new favorite self-care ritual.", author: "David K.", rating: 5 },
  { id: 5, text: "The quality is exceptional. I've recommended these to all my friends and family.", author: "Priya S.", rating: 5 },
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setTestimonials(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: data.text || '',
            author: data.name || '',
            rating: Number(data.rating || 5),
          };
        })
      );
    });
    return unsubscribe;
  }, []);

  const effectiveTestimonials = testimonials.length ? testimonials : fallbackTestimonials;
  
  // Responsive: Show 1 card on mobile, 3 on desktop
  const itemsToShow = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
  const maxIndex = Math.max(0, effectiveTestimonials.length - itemsToShow);

  useEffect(() => {
    if (effectiveTestimonials.length <= itemsToShow) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [effectiveTestimonials.length, maxIndex, itemsToShow]);

  return (
    <section className="max-w-full mx-auto px-6 py-24 overflow-hidden bg-bg-surface">
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center space-y-3"
      >
        <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-text-secondary block">
          Community Voices
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-text-primary tracking-tight">
          What our community says
        </h2>
        <div className="w-12 h-[1px] bg-primary-button/40 mx-auto mt-4" />
      </motion.header>

      <div className="relative max-w-6xl mx-auto">
        <div className="overflow-hidden px-2">
          <motion.div 
            animate={{ x: `-${index * (100 / itemsToShow)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex"
          >
            {effectiveTestimonials.map((item) => (
              <div
                key={item.id}
                className="w-full md:w-1/3 flex-shrink-0 px-4"
              >
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="group relative aspect-square p-8 rounded-[2.5rem] border border-border/40 flex flex-col justify-center items-center text-center bg-bg-main shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  {/* Classy Hover Fill */}
                  <div className="absolute inset-0 bg-text-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16, 1, 0.3, 1] z-0" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Star Rating */}
                    <div className="flex gap-1 mb-6 text-primary-button group-hover:text-white/80 transition-colors">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} size={12} className={i < item.rating ? "opacity-100" : "opacity-30"} />
                      ))}
                    </div>

                    <p className="text-sm md:text-base font-serif italic leading-relaxed text-text-primary group-hover:text-white transition-colors duration-500 mb-6">
                      "{item.text}"
                    </p>
                    
                    <div className="w-8 h-[1px] bg-border/40 group-hover:bg-white/30 mb-4 transition-colors" />
                    
                    <p className="text-[10px] tracking-[0.3em] font-bold text-text-secondary group-hover:text-white/90 transition-colors duration-500 uppercase">
                      {item.author}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modern Paginated Indicators */}
      <div className="flex justify-center gap-3 mt-12">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="group py-4 px-1"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div className={`h-[2px] transition-all duration-500 rounded-full ${
              index === i ? 'w-8 bg-text-primary' : 'w-4 bg-border/60 group-hover:bg-text-secondary'
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;