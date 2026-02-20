import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../Elements/SEO';
import { Leaf, Heart, Sparkles, Sprout } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';

const Story = () => {
  // Sophisticated animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="bg-bg-main min-h-screen flex flex-col font-sans selection:bg-primary-button selection:text-white">
      <SEO 
        title="Our Story" 
        description="Founded by an Ayurvedic doctor, learn about our journey, ethical sourcing, and commitment to pure, natural skincare."
      />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[70vh] md:h-[90vh] overflow-hidden bg-black">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src="https://res.cloudinary.com/dslr4xced/image/upload/v1769360501/IMG_0371_i5vrga.jpg" 
            alt="Artisanal Process" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="max-w-4xl"
          >
            <motion.p 
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.4em" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-white/80 text-[10px] md:text-xs uppercase font-bold mb-6"
            >
              Since 2024
            </motion.p>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight tracking-tight">
              Rooted in <br/>
              <span className="italic font-light opacity-90">Nature's Essence</span>
            </h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="h-[1px] bg-white/50 mx-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* --- THE ORIGINS --- */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="space-y-10"
          >
            <div className="space-y-4">
               <span className="text-primary-button text-[10px] font-bold tracking-[0.3em] uppercase">Our Journey</span>
               <h2 className="text-4xl md:text-6xl font-serif text-text-primary leading-[1.15]">
                It started with a <span className="text-text-secondary italic">simple wish.</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-text-secondary text-lg md:text-xl font-light leading-relaxed max-w-xl">
              <p>
Founded by a doctor and a mother, the brand is shaped by years of observing real skin concerns — across age, hormones, lifestyle, and life stages. Each soap is handcrafted in small batches using the cold process method, allowing botanical ingredients to retain their integrity.
              </p>
              <p>
              Formulations are guided by skin physiology, seasonal needs, and conscious ingredient selection — not mass production.</p>
<p>
We do not pursue uniformity for scale.</p>
<p>
We prioritise care, responsibility, and skin respect.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-bg-main rounded-[3rem] overflow-hidden shadow-2xl border border-border/20 group">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5 }}
                src="https://res.cloudinary.com/dslr4xced/image/upload/v1769357856/story_tot105.png" 
                alt="Mindful Creation" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Classy Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-36 h-36 bg-text-primary rounded-full flex flex-col items-center justify-center text-bg-main shadow-2xl hidden md:flex"
            >
              <Sprout size={32} strokeWidth={1.5} className="mb-2" />
              <span className="text-[8px] tracking-[0.2em] uppercase font-bold text-center px-4">Naturally Sourced</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- OUR VALUES --- */}
      <section className="bg-bg-main py-24 md:py-32 border-y border-border/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
          >
            {[
              { icon: <Leaf size={28} />, title: "Ethically Sourced", desc: "We trace every botanical back to its roots, ensuring the earth is honored and replenished at every step." },
              { icon: <Heart size={28} />, title: "Small Batch", desc: "Quality over quantity. We craft in micro-batches to ensure the highest potency and soulful attention to detail." },
              { icon: <Sparkles size={28} />, title: "Toxin Free", desc: "No parabens, no sulfates, no noise. Just pure, raw organic goodness that your body instinctively recognizes." }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="group flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-bg-surface rounded-2xl flex items-center justify-center text-primary-button shadow-sm group-hover:shadow-md group-hover:bg-primary-button group-hover:text-white transition-all duration-500">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif text-text-primary tracking-wide">{value.title}</h3>
                <p className="text-text-secondary font-light leading-relaxed max-w-[300px]">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FOUNDER'S NOTE --- */}
      <section className="py-14 md:py-14 px-6 md:px-12 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-button/5 rounded-full blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-12"
        >
          <div className="space-y-6">
            <span className="text-primary-button text-4xl font-serif">"</span>
            <h2 className="text-3xl md:text-5xl font-serif text-text-primary leading-[1.3] px-4 italic">
              We believe that daily rituals should be moments of celebration, not just routines.
            </h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-text-secondary text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Thank you for being part of our journey towards a slower, more intentional way of living.
            </p>
            <div className="pt-6">
               <div className="w-10 h-[1px] bg-border mx-auto mb-6" />
               <p className="font-serif text-2xl text-primary-button">The Prana Elixir Team</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Story;