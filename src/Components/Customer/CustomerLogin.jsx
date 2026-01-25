import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { useAuth } from '../../context/useAuth';

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setSubmitting(true);
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      }
      navigate('/shop');
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!formData.email) {
      setError('Please enter your email first.');
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword(formData.email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      setError(err?.message || 'Unable to send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col selection:bg-primary-button/10">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-button/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-text-secondary/5 rounded-full blur-[100px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-xl w-full max-w-5xl rounded-[3rem] shadow-2xl border border-white/50 flex flex-col md:flex-row overflow-hidden relative z-10"
        >
          
          {/* LEFT SIDE: Image / Brand Vibe */}
          <div className="hidden md:block w-1/2 relative bg-bg-surface overflow-hidden group">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              src="https://res.cloudinary.com/dslr4xced/image/upload/v1769363578/IMG_0363_rqysfp.jpg" 
              alt="Sanctuary Vibe" 
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-12 text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-4xl font-serif mb-4 leading-tight">Your Ritual <br/> Begins Here.</h2>
                <p className="text-sm tracking-wide opacity-90 font-light max-w-xs leading-relaxed">
                  Join our community of mindful souls. Access exclusive collections, track your treasures, and find your calm.
                </p>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
            
            <div className="mb-10 text-center md:text-left">
              <motion.div 
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-3">
                  {isLogin ? 'Welcome Back' : 'Join the Circle'}
                </h1>
                <p className="text-text-secondary text-sm md:text-base font-light">
                  {isLogin 
                    ? 'Please enter your details to sign in.' 
                    : 'Create an account to start your journey.'}
                </p>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                  >
                    {error}
                  </motion.div>
                )}
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Name Field (Only for Signup) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-3">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-button transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Jane Doe"
                        required={!isLogin}
                        className="w-full bg-bg-surface border border-border/40 rounded-2xl px-12 py-4 text-text-primary outline-none focus:border-primary-button focus:ring-4 focus:ring-primary-button/5 transition-all placeholder:text-text-secondary/40"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-3">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-button transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    required
                    className="w-full bg-bg-surface border border-border/40 rounded-2xl px-12 py-4 text-text-primary outline-none focus:border-primary-button focus:ring-4 focus:ring-primary-button/5 transition-all placeholder:text-text-secondary/40"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-3">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-button transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-bg-surface border border-border/40 rounded-2xl px-12 py-4 text-text-primary outline-none focus:border-primary-button focus:ring-4 focus:ring-primary-button/5 transition-all placeholder:text-text-secondary/40"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Forgot Password Link (Only Login) */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-primary-button transition-colors"
                    disabled={submitting}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full bg-text-primary text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-primary-button transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                disabled={submitting}
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                   {submitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </span>
                {!submitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-10 text-center pt-8 border-t border-border/30">
              <p className="text-text-secondary text-sm">
                {isLogin ? "New to The Prana Elixir?" : "Already part of our family?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
                  className="ml-2 font-bold text-text-primary hover:text-primary-button underline underline-offset-4 cursor-pointer transition-colors"
                >
                  {isLogin ? 'Join us now' : 'Log in here'}
                </button>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerLogin;