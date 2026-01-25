import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Send, Gift, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';

const Custom = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replace these with your actual IDs from EmailJS
    emailjs.sendForm(
      'service_z3jofzy', 
      'template_u18wde6', 
      form.current, 
      '64vnB1DuhI2UDC7ZX'
    )
    .then((result) => {
        setIsSent(true);
        setIsSubmitting(false);
    }, (error) => {
        console.log(error.text);
        setIsSubmitting(false);
        alert("Something went wrong. Please try again.");
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="bg-bg-main min-h-screen flex flex-col font-sans selection:bg-primary-button/20">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full py-24 md:py-32 bg-bg-surface border-b border-border/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.5em" }}
            className="text-[10px] md:text-xs font-bold text-primary-button uppercase block mb-6"
          >
            Bespoke Creations
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-text-primary mb-8 tracking-tight"
          >
            Custom <span className="italic font-light">Orders</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-text-secondary text-lg font-light leading-relaxed"
          >
            From intimate weddings to grand corporate celebrations, we craft personalized artisanal luxuries tailored to your unique story.
          </motion.p>
        </div>
      </section>

      {/* --- FORM SECTION --- */}
      <section className="py-20 px-6 mb-20">
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-border/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          
          {/* Form Side */}
          <div className="p-10 md:p-14 space-y-8">
            <h2 className="text-3xl font-serif text-text-primary">Inquiry Form</h2>
            
            {!isSent ? (
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div className="space-y-1 border-b border-border/40 pb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Full Name</label>
                  <input name="user_name" required type="text" className="w-full bg-transparent outline-none text-text-primary py-1 placeholder:text-border" placeholder="Your name" />
                </div>
                
                <div className="space-y-1 border-b border-border/40 pb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Email Address</label>
                  <input name="user_email" required type="email" className="w-full bg-transparent outline-none text-text-primary py-1 placeholder:text-border" placeholder="hello@example.com" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1 border-b border-border/40 pb-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Event Type</label>
                    <input name="event_type" type="text" className="w-full bg-transparent outline-none text-text-primary py-1" placeholder="e.g. Wedding" />
                  </div>
                  <div className="space-y-1 border-b border-border/40 pb-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Quantity</label>
                    <input name="quantity" type="number" className="w-full bg-transparent outline-none text-text-primary py-1" placeholder="50+" />
                  </div>
                </div>

                <div className="space-y-1 border-b border-border/40 pb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-text-secondary">Details</label>
                  <textarea name="message" rows="3" className="w-full bg-transparent outline-none text-text-primary py-1 resize-none" placeholder="Tell us about your vision..." />
                </div>

                <motion.button 
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-text-primary text-white py-4 rounded-2xl flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-xs font-bold transition-all hover:bg-primary-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Request"} <Send size={14} />
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-serif text-text-primary">Thank You!</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Your inquiry has been sent. The Prana Team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSent(false)}
                  className="text-xs font-bold uppercase tracking-widest text-primary-button underline mt-4"
                >
                  Send another inquiry
                </button>
              </motion.div>
            )}
          </div>

          {/* Image/Visual Side */}
          <div className="hidden lg:block relative bg-bg-surface">
            <img 
              src="https://res.cloudinary.com/dslr4xced/image/upload/v1769362029/IMG_0364_ihbenf.jpg" 
              className="w-full h-full object-cover opacity-90"
              alt="Custom Packaging"
            />
            <div className="absolute inset-0 bg-primary-button/10 mix-blend-multiply" />
            <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
              <p className="text-white text-xs tracking-widest uppercase font-bold text-center">
                Handcrafted for your special moments
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Custom;