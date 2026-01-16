import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Sparkles, Sprout } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';

const Story = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-bg-main min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1615887023516-9b6c255c27f6?q=80&w=2000&auto=format&fit=crop" 
          alt="Making Soap Process" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase font-bold mb-4">Est. 2024</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6">
              Rooted in <br/><span className="italic font-light">Nature</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- THE ORIGINS --- */}
      <section className="py-20 md:py-32 px-4 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-text-primary leading-[1.1]">
              It started with a <span className="text-text-secondary italic">simple wish.</span>
            </h2>
            <div className="h-px w-24 bg-primary-button"></div>
            <p className="text-text-secondary text-lg leading-relaxed">
              The Prana Elixir was born not in a boardroom, but in a small kitchen filled with the scent of lavender and beeswax. We wanted to create something that didn't just clean or fragrance a room, but actually <span className="text-text-primary font-medium">healed the soul</span>.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              Disillusioned by synthetic ingredients and mass production, we turned back to the earth. Every soap, every candle, and every jar we fill is a testament to the slow, deliberate art of mindful living.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Image Frame */}
            <div className="aspect-[4/5] bg-bg-surface rounded-[2.5rem] overflow-hidden shadow-xl border border-border/50">
              <img 
                src="https://images.unsplash.com/photo-1605335985278-8314125f1875?q=80&w=1000&auto=format&fit=crop" 
                alt="Mixing Ingredients" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-text-primary rounded-full flex items-center justify-center text-bg-main shadow-lg hidden md:flex">
              <Sprout size={40} strokeWidth={1.5} />
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- OUR VALUES --- */}
      <section className="bg-bg-surface py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <motion.div 
              whileHover={{ y: -10 }} 
              className="space-y-4 px-6"
            >
              <div className="w-16 h-16 mx-auto bg-bg-main rounded-full flex items-center justify-center text-primary-button mb-6">
                <Leaf size={28} />
              </div>
              <h3 className="text-2xl font-serif text-text-primary">Ethically Sourced</h3>
              <p className="text-text-secondary">
                We trace every ingredient back to its roots. Our botanicals are harvested sustainably, ensuring the earth is replenished.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }} 
              className="space-y-4 px-6 md:border-x border-border"
            >
              <div className="w-16 h-16 mx-auto bg-bg-main rounded-full flex items-center justify-center text-primary-button mb-6">
                <Heart size={28} />
              </div>
              <h3 className="text-2xl font-serif text-text-primary">Small Batch</h3>
              <p className="text-text-secondary">
                Quality over quantity, always. We craft in micro-batches to ensure potency, freshness, and attention to detail.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }} 
              className="space-y-4 px-6"
            >
              <div className="w-16 h-16 mx-auto bg-bg-main rounded-full flex items-center justify-center text-primary-button mb-6">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-serif text-text-primary">Toxin Free</h3>
              <p className="text-text-secondary">
                No parabens, no sulfates, no synthetic dyes. Just pure, raw, organic goodness that your body recognizes.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- FOUNDER'S NOTE --- */}
      <section className="py-20 md:py-32 px-4 md:px-12">
        <div className="max-w-5xl mx-auto bg-white/50 backdrop-blur-sm p-8 md:p-16 rounded-[2rem] border border-border text-center shadow-sm">
          <h2 className="text-3xl md:text-5xl font-serif text-text-primary mb-8">
            "We believe that daily rituals should be moments of celebration."
          </h2>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-10">
            Thank you for being part of our journey. Every time you light a candle or use our soap, you are supporting a dream and a movement towards a slower, more intentional way of living.
          </p>
          <div className="font-serif text-2xl text-primary-button italic">
            — The Prana Team
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Story;