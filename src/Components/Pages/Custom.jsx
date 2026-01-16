import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';

// Use strict Earthy Theme colors
const themeColors = {
  text: '#6C4A40',    // text-text-primary
  stroke: '#6C4A40',  // matching stroke color
  bg: '#ECE3D8',      // bg-bg-main
};

export default function Custom() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // 'sending', 'success', 'error'

  // --- 1. SCROLL ANIMATION LOGIC (From your reference) ---
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"]
  });

  // Transform outline to solid fill based on scroll
  const textFill = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. EMAILJS LOGIC (From your reference) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const emailjs = (await import('@emailjs/browser')).default;
      
      await emailjs.send(
        'service_4cfq9ff',     // Your Service ID
        'template_3hti6dh',    // Your Template ID
        {
          name: formData.name,
          email: formData.email,
          message: formData.message
        },
        'rLuwajQp5XZU-eq9U'      // Your Public Key
      );

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="bg-bg-main min-h-screen flex flex-col">
      <Navbar />

      <section 
        id="contact"
        ref={containerRef}
        className="flex-1 pt-12 md:pt-20 pb-16 px-4 sm:px-6 md:px-12 font-sans relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* --- LEFT SIDE: ANIMATED TEXT & INFO --- */}
          <div className="space-y-12 lg:sticky lg:top-32">
            <div ref={headerRef} className="relative z-10">
              {/* Outline Text (Background Layer) */}
              <h2 
                className="text-5xl sm:text-7xl md:text-8xl font-serif font-bold uppercase leading-[0.9] tracking-tight"
                style={{ 
                  WebkitTextStroke: `1.5px ${themeColors.stroke}`, 
                  color: "transparent" 
                }}
              >
                We'd Love <br /> To Hear <br /> From You
              </h2>

              {/* Solid Text (Foreground Layer - Controlled by Scroll) */}
              <motion.h2 
                style={{ opacity: textFill, color: themeColors.text }}
                className="absolute inset-0 text-5xl sm:text-7xl md:text-8xl font-serif font-bold uppercase leading-[0.9] tracking-tight pointer-events-none"
              >
                We'd Love <br /> To Hear <br /> From You
              </motion.h2>
            </div>

            <div className="space-y-8 pt-4">
              <p className="text-text-secondary text-lg max-w-md leading-relaxed">
                Have a question about our products, a custom order, or just want to say hello? Drop us a message and we'll get back to you within 24 hours.
              </p>

              {/* Contact Details */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-primary group-hover:bg-primary-button group-hover:text-white transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-text-secondary tracking-widest">Email Us</p>
                    <a href="mailto:support@store.com" className="text-xl font-serif text-text-primary group-hover:text-primary-button transition-colors">support@store.com</a>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-primary group-hover:bg-primary-button group-hover:text-white transition-colors">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-text-secondary tracking-widest">Call Us</p>
                    <p className="text-xl font-serif text-text-primary group-hover:text-primary-button transition-colors">+91 98765 43210</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: EARTHY THEMED FORM --- */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full bg-bg-surface p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-border relative"
          >
            {/* Decorative Corner Element */}
            <div className="absolute top-8 right-8 text-border opacity-50">
              <Send size={48} strokeWidth={1} />
            </div>

            <h3 className="text-2xl font-serif text-text-primary mb-8">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary tracking-widest ml-1">Your Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-bg-main border-b-2 border-border px-4 py-3 text-text-primary outline-none focus:border-primary-button transition-colors placeholder-text-muted/50 rounded-t-lg" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary tracking-widest ml-1">Your Email</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full bg-bg-main border-b-2 border-border px-4 py-3 text-text-primary outline-none focus:border-primary-button transition-colors placeholder-text-muted/50 rounded-t-lg" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-secondary tracking-widest ml-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5" 
                  placeholder="Tell us about your project or inquiry..."
                  className="w-full bg-bg-main border-b-2 border-border px-4 py-3 text-text-primary outline-none focus:border-primary-button transition-colors resize-none placeholder-text-muted/50 rounded-t-lg" 
                />
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl bg-primary-button text-white text-lg font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:bg-primary-hover transition-all
                    ${status === 'sending' ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {status === 'sending' ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg text-center font-medium"
                >
                  Thank you! We've received your message.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-center font-medium"
                >
                  Something went wrong. Please try again later.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}