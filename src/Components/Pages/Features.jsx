import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Building2, Beaker, Palette, CheckCircle2 } from 'lucide-react';

const features = [
  { id: 1, label: "All Natural", icon: <Leaf size={28} /> },
  { id: 2, label: "Plastic Free Packaging", icon: <Recycle size={28} /> },
  { id: 3, label: "Sustainable", icon: <Building2 size={28} /> },
  { id: 4, label: "Paraben Free", icon: <Beaker size={28} /> },
  { id: 5, label: "Small Batch", icon: <Palette size={28} /> },
  { id: 6, label: "Vegan", icon: <CheckCircle2 size={28} /> },
];

const Features = () => {
  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  // Individual item animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="w-full py-7 bg-bg-surface overflow-hidden">
      <motion.div 
        className="max-w-7xl mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-4">
          {features.map((feature) => (
            <motion.div 
              key={feature.id} 
              variants={itemVariants}
              className="group flex flex-col items-center"
            >
              {/* Icon Container with Unique Shape/Effect */}
              <div className="relative mb-6">
                {/* Background Decorative Element */}
                <motion.div 
                  className="absolute inset-0 bg-primary-button/5 rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 ease-out"
                />
                
                {/* Main Icon Box */}
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="w-20 h-20 rounded-2xl border border-border/40 flex items-center justify-center text-text-primary bg-white/50 backdrop-blur-sm shadow-sm group-hover:shadow-md group-hover:border-primary-button/30 transition-all duration-500"
                >
                  <div className="transition-transform duration-500 group-hover:scale-110 group-hover:text-primary-button">
                    {feature.icon}
                  </div>
                </motion.div>
              </div>

              {/* Label with Refined Typography */}
              <h3 className="text-text-primary font-serif text-center text-sm md:text-base tracking-[0.1em] uppercase leading-relaxed max-w-[120px] transition-colors duration-300 group-hover:text-primary-button">
                {feature.label}
              </h3>

              {/* Minimalist underline indicator */}
              <motion.div 
                className="w-0 h-[1px] bg-primary-button mt-2 transition-all duration-500 group-hover:w-8" 
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Features;