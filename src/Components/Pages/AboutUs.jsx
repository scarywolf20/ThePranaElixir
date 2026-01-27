import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  // Animation variants for the text reveal
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <section className="w-full mx-auto px-6 py-20 md:py-32 font-sans bg-bg-surface flex justify-center items-center">
      <div className="max-w-3xl w-full text-center">
        
        {/* Content Container */}
        <motion.div 
          className="flex flex-col space-y-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          <header className="space-y-6 flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold text-text-secondary block"
            >
              Our Philosophy
            </motion.span>
            
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-text-primary leading-[1.1]">
              The Prana Elixir 
            </h2>
            
            {/* Centered Divider */}
            <div className="w-24 h-[2px] bg-primary-button/40" />
          </header>

          <motion.blockquote 
            className="text-xl md:text-2xl font-light leading-relaxed text-text-primary/80 italic font-serif px-4 md:px-12"
          >
            “Prana Elixir was created at the intersection of medical understanding, lived experience, and mindful formulation.”
          </motion.blockquote>

          {/* Product Features List - Centered Row */}
          <motion.ul 
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              "Hand-Cut with Love", 
              "100% Natural", 
              "SLS & Paraben-free", 
              "Phthalates-free"
            ].map((item, idx) => (
              <li key={idx} className="flex items-center space-x-3 group">
                <div className="w-1.5 h-1.5 bg-primary-button rounded-full group-hover:scale-150 transition-transform" />
                <span className="text-xs md:text-sm tracking-[0.1em] uppercase text-text-primary font-semibold">
                  {item}
                </span>
              </li>
            ))}
          </motion.ul>

          {/* Centered Button */}
          <motion.div 
            className="pt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/story" className="group relative overflow-hidden bg-text-primary text-white px-10 py-4 rounded-full transition-all hover:pr-14 active:scale-95 shadow-lg inline-flex items-center">
              <span className="relative z-10 text-[10px] tracking-[0.3em] uppercase font-bold">Discover More</span>
              <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutUs;