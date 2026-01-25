import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Printer, Sparkles } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, estimatedDelivery } = location.state || {};
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!orderId) return;
      const snap = await getDoc(doc(db, 'orders', orderId));
      if (!snap.exists()) return;
      const data = snap.data();
      setOrderNumber(data?.orderNumber || `ORD-${String(orderId).slice(0, 8).toUpperCase()}`);
    };
    load();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary-button/10 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl w-full bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-border/40 text-center relative overflow-hidden"
        >
          {/* Decorative Sparkle Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-10">
            <Sparkles size={120} className="text-primary-button" />
          </div>

          {/* Success Icon */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-24 h-24 bg-primary-button/10 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
              className="w-16 h-16 bg-text-primary rounded-full flex items-center justify-center text-white shadow-xl"
            >
              <Check size={36} strokeWidth={3} />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4">A Pure Selection.</h1>
            <p className="text-text-secondary text-sm md:text-base tracking-[0.1em] uppercase font-bold mb-10">
              Your artisanal journey has begun.
            </p>
          </motion.div>

          {/* Order Brief */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-bg-surface/50 p-8 rounded-[2rem] border border-border/20 mb-12 text-left space-y-4"
          >
            <div className="flex justify-between items-center border-b border-border/10 pb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Identifier</span>
              <span className=" text-lg text-text-primary">#{orderNumber || '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Expected Arrival</span>
              <span className="text-lg text-text-primary">{estimatedDelivery || '—'}</span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link 
              to="/shop" 
              className="flex-1 bg-text-primary text-white py-5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-primary-button transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
              Explore More <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="flex-1 border border-border/60 text-text-primary bg-transparent py-5 px-8 rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-bg-surface transition-all flex items-center justify-center gap-3">
              <Printer size={16} /> Save Receipt
            </button>
          </motion.div>
          
          <p className="mt-12 text-[10px] text-text-secondary opacity-60 uppercase tracking-widest italic">
            A confirmation email is on its way to your sanctuary.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;