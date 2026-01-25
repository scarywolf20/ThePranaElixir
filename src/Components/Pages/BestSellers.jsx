import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocsFromCache, getDocsFromServer, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), where('isBestSeller', '==', true), limit(3));
        const mapSnap = (snap) => {
          return snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name || '',
              price: Number(data.price || 0),
              imageUrl: data.imageUrl || '',
              stock: Number(data.stock || 0),
            };
          });
        };

        try {
          const cacheSnap = await getDocsFromCache(q);
          if (cacheSnap.size > 0) setProducts(mapSnap(cacheSnap));
        } catch (e) { /* Cache miss */ }

        const serverSnap = await getDocsFromServer(q);
        setProducts(mapSnap(serverSnap));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const SkeletonCard = () => (
    <div className="flex flex-col group animate-pulse">
      <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-200/50 mb-6" />
      <div className="flex justify-between items-start px-2">
        <div className="flex flex-col space-y-3 w-full">
          <div className="h-4 w-3/4 bg-gray-200/50 rounded" />
          <div className="h-4 w-1/3 bg-gray-200/50 rounded" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="max-w-full mx-auto px-6 py-24 bg-bg-surface">
      {/* Section Heading with Staggered Fade-in */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-16 space-y-4"
      >
        <span className="uppercase tracking-[0.5em] text-[10px] font-bold text-text-secondary">
          Customer Favorites
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-text-primary tracking-tight">
          Best Sellers
        </h2>
        <div className="w-16 h-[2px] bg-primary-button/30" />
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {loading && products.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <AnimatePresence>
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link to={`/product/${product.id}`} className="flex flex-col group">
                  
                  {/* Image Container */}
                  <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-bg-main mb-8 relative shadow-sm border border-border/5">
                    <motion.img
                      src={product.imageUrl}
                      alt={product.name}
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Floating Stock Badge */}
                    {product.stock <= 0 && (
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-text-primary px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase shadow-lg">
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex justify-between items-start px-4">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-xs md:text-sm tracking-[0.2em] font-bold text-text-primary uppercase group-hover:text-primary-button transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-text-secondary text-xs tracking-widest font-medium opacity-80">
                        Rs. {product.price}/-
                      </p>
                    </div>
                    
                    {/* View Icon (Appears on Hover) */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                       <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                       </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center text-text-secondary py-10 font-serif italic">
          New treasures arriving soon.
        </div>
      )}
    </section>
  );
};

export default BestSellers;