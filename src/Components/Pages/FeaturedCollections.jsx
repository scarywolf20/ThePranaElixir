import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Package } from 'lucide-react';

const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      title: "Build Your Own Box",
      description: "Curate a personalized assortment of nature's finest. Mix and match your favorites.",
      link: "/custom",
      icon: <Package size={32} />,
      bgClass: "bg-[#FDF6F0]", // Warm beige/cream
      image: "https://images.unsplash.com/photo-1628746766624-d2eew17d1216?q=80&w=1000" // Placeholder or actual image
    },
    {
      id: 2,
      title: "The Gifting Studio",
      description: "Thoughtfully assembled hampers for those special moments. Ready to gift.",
      link: "/shop?category=Gift Box",
      icon: <Gift size={32} />,
      bgClass: "bg-[#F4F9F9]", // Cool mint/white
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000" // Placeholder
    }
  ];

  return (
    <section className="w-full py-24 px-6 bg-bg-surface ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="uppercase tracking-[0.4em] text-[10px] font-bold text-text-secondary">Discover More</span>
          <h2 className="text-4xl md:text-5xl font-serif text-text-primary mt-4 mb-6">Curated Collections</h2>
          <div className="w-24 h-[1px] bg-primary-button/30 mx-auto" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {collections.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`group relative overflow-hidden rounded-[3rem] ${item.bgClass} min-h-[500px] flex flex-col justify-end p-10 md:p-14 border border-border/10 cursor-pointer transition-all hover:shadow-xl`}
            >
              {/* Background Image Effect */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-1000 mix-blend-multiply">
                 <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110" />
              </div>
              
              {/* Content Overlay */}
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary-button shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-serif text-text-primary group-hover:translate-x-2 transition-transform duration-500">
                  {item.title}
                </h3>
                
                <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
                  {item.description}
                </p>

                <Link to={item.link}>
                  <button className="flex items-center gap-3 bg-text-primary text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-button transition-all mt-4 group/btn">
                    Explore <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
