import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const ProductSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const products = useMemo(() => [
    { id: 1, title: "POSTCARDS", price: "700/-", image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "BATH ACCESSORIES", price: "295/-", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800" },
    { id: 3, title: "GENTLE HABITS SOAPS", price: "250/-", image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800" },
    { id: 4, title: "WAX TABLETS", price: "450/-", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800" },
    { id: 5, title: "SOY CANDLES", price: "850/-", image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80&w=800" },
  ], []);

  // Show 3 products on desktop, 1 on mobile
  const itemsToShow = window.innerWidth < 768 ? 1 : 3;
  const maxIndex = products.length - itemsToShow;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  return (
    <section className="bg-bg-surface py-20 px-6 md:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-text-primary text-2xl md:text-3xl tracking-[0.4em] font-serif uppercase mb-4">
            Curated Collection
          </h2>
          <div className="w-24 h-[1px] bg-primary-button/30 mx-auto" />
        </motion.div>

        {/* Slider Container */}
        <div className="relative group">
          
          {/* Navigation Buttons */}
          <AnimatePresence>
            {currentIndex > 0 && (
              <motion.button 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={prevSlide}
                className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-text-primary hover:bg-primary-button hover:text-white transition-all"
              >
                <FaChevronLeft size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentIndex < maxIndex && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={nextSlide}
                className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-text-primary hover:bg-primary-button hover:text-white transition-all"
              >
                <FaChevronRight size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Slider Content */}
          <motion.div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <motion.div 
              animate={{ x: `-${currentIndex * (100 / itemsToShow)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="flex"
            >
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => navigate('/shop')} 
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = React.memo(({ product, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={onClick}
      className="w-full md:w-1/3 flex-shrink-0 px-4 group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-[40px] aspect-[3/4] bg-bg-main shadow-sm">
        {/* Image with sophisticated zoom */}
        <motion.img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Elegant hover overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center"
        >
          <span className="bg-white/90 px-6 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold text-text-primary shadow-xl">
            View Details
          </span>
        </motion.div>
      </div>

      {/* Product Details */}
      <div className="mt-8 text-center">
        <h3 className="text-text-primary text-lg tracking-[0.2em] font-serif uppercase mb-2 group-hover:text-primary-button transition-colors">
          {product.title}
        </h3>
        <p className="text-text-secondary text-xs tracking-widest font-medium opacity-80">
          Rs. {product.price}
        </p>
      </div>
    </motion.div>
  );
});

export default ProductSection;