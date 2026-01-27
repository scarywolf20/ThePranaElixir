import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-[#5D4037] text-white pt-20 pb-10 px-6 md:px-12 rounded-t-[50px] font-sans shadow-2xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        
        {/* Brand Section */}
        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl tracking-[0.2em] font-bold uppercase font-serif">
              The Prana Elixir
            </h2>
            <div className="w-12 h-[1px] bg-white/40 mx-auto md:mx-0" />
          </div>
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-light opacity-80 leading-relaxed text-center md:text-left max-w-[250px]">
            Artisanal skincare luxuries mindfully crafted for your soul
          </p>
          
          {/* Social Icons for mobile/desktop integrated */}
          <div className="flex items-center gap-6 pt-2">
            <motion.a whileHover={{ y: -3 }} href="https://www.instagram.com/thepranaelixir?igsh=emhuNzZyd3I3Y2J0&utm_source=qr" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-[#5D4037] transition-all">
              <FaInstagram size={18} />
            </motion.a>
            <motion.a whileHover={{ y: -3 }} href="https://api.whatsapp.com/send/?phone=917709979753&text&type=phone_number&app_absent=0" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-[#5D4037] transition-all">
              <FaWhatsapp size={18} />
            </motion.a>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <h3 className="text-xl font-serif tracking-widest mb-8 border-b border-white/10 pb-4 inline-block md:block">Navigation</h3>
          <ul className="space-y-4 text-[11px] tracking-[0.2em] uppercase font-medium">
            <li><a href="/" className="hover:text-white/60 transition-colors">Home</a></li>
            <li><a href="/story" className="hover:text-white/60 transition-colors">Story</a></li>
            <li><a href="/shop" className="hover:text-white/60 transition-colors">Shop All</a></li>
            <li><a href="/contact" className="hover:text-white/60 transition-colors">Connect</a></li>
            <li><a href="/admin/login" className="hover:text-white/60 transition-colors">Admin</a></li>
          </ul>
        </motion.div>

        {/* Policies */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <h3 className="text-xl font-serif tracking-widest mb-8 border-b border-white/10 pb-4 inline-block md:block">Essentials</h3>
          <ul className="space-y-4 text-[11px] tracking-[0.2em] uppercase font-medium opacity-80">
            <li><a href="/privacy-policy" className="hover:underline underline-offset-4">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions" className="hover:underline underline-offset-4">Terms & Conditions</a></li>
            <li><a href="/shipping-policy" className="hover:underline underline-offset-4">Shipping & Delivery</a></li>
            <li><a href="/refund-policy" className="hover:underline underline-offset-4">Return & Refund</a></li>
          </ul>
        </motion.div>

        {/* Reach Us */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <h3 className="text-xl font-serif tracking-widest mb-8 border-b border-white/10 pb-4 inline-block md:block">Reach Us</h3>
          <ul className="space-y-5 text-xs tracking-widest font-light">
            <li className="flex items-center justify-center md:justify-start gap-4 group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                <MapPin size={16} />
              </div>
              <span className="uppercase tracking-[0.2em]">India</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-4 group">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                <Mail size={16} />
              </div>
              <span className="opacity-90">thepranaelixir@gmail.com</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div 
        variants={itemVariants}
        className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <p className="text-[9px] md:text-[10px] opacity-60 uppercase tracking-[0.5em] font-medium text-center">
          © {new Date().getFullYear()} | All Rights Reserved | The Prana Elixir
        </p>
        <div className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase opacity-60">
          <span>Handcrafted in India</span>
          <span className="w-1 h-1 bg-white/40 rounded-full" />
          <span>Small Batch Production</span>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
