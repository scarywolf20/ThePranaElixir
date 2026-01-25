import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  // Animation variants for the text reveal
  const textVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="w-full mx-auto px-6 py-20 md:py-32 font-sans overflow-hidden bg-bg-surface">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Overlapping Image Grid */}
        <motion.div 
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={imageVariants}
        >
          {/* Main Decorative Background (Subtle Shape) */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-button/5 rounded-full blur-3xl -z-10" />
          
          {/* Main Owner Image */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl w-4/5 aspect-[4/5] bg-bg-surface relative z-10 border border-border/10">
            <img 
              src="/owners-image.jpg" 
              alt="The Founders" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          
          {/* Floating Aesthetic Overlay */}
          {/* <motion.div 
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -bottom-12 right-0 w-1/2 rounded-[2.5rem] overflow-hidden border-[12px] border-white shadow-2xl bg-white z-20"
          > */}
            {/* <div className="aspect-square">
              <img 
                src="/product-detail.jpg" 
                alt="Mindful Craftsmanship" 
                className="w-full h-full object-cover"
              />
            </div> */}
          {/* </motion.div> */}
        </motion.div>

        {/* Right Side: Content */}
        <motion.div 
          className="flex flex-col space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={textVariants}
        >
          <header className="space-y-4">
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
            <div className="w-20 h-[2px] bg-primary-button/40 mt-2" />
          </header>

          <motion.blockquote 
            className="text-xl md:text-2xl font-light leading-relaxed text-text-primary/80 italic font-serif"
          >
            “Prana Elixir was created at the intersection of medical understanding, lived experience, and mindful formulation.
”
          </motion.blockquote>

          {/* Product Features List */}
          <motion.ul 
            className="grid grid-cols-2 gap-y-4 pt-4"
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

          <motion.div 
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/story" className="group relative overflow-hidden bg-text-primary text-white px-10 py-4 rounded-full transition-all hover:pr-14 active:scale-95 shadow-lg">
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