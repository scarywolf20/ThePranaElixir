import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '../../firebase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    try {
      setSubmitting(true);
      const cred = await signInWithEmailAndPassword(auth, email, password)
      
      // Verify Admin Role in Firestore
      const adminSnap = await getDoc(doc(db, 'admins', cred.user.uid))
      
      if (!adminSnap.exists()) {
        await signOut(auth)
        setError('Access Denied: Admin privileges required.')
        return
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-button/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-text-secondary/5 rounded-full blur-[80px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/60 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
      >
        
        {/* Header Section */}
        <div className="pt-12 pb-8 px-10 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border/20 text-primary-button"
          >
            <Shield size={32} strokeWidth={1.5} />
          </motion.div>
          <h2 className="text-3xl font-serif text-text-primary tracking-tight">The Prana Elixir</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-text-secondary mt-3">Admin Console</p>
        </div>

        {/* Form Section */}
        <div className="px-10 pb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-3">Email Access</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-button transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-border/40 text-text-primary pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-button focus:ring-4 focus:ring-primary-button/5 transition-all placeholder:text-border/50"
                    placeholder="admin@thepranaelixir.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-3">Secure Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-button transition-colors" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-border/40 text-text-primary pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-primary-button focus:ring-4 focus:ring-primary-button/5 transition-all placeholder:text-border/50"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={submitting}
              className="w-full bg-text-primary hover:bg-primary-button text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-text-primary/10 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em]">
                {submitting ? 'Verifying...' : 'Enter Dashboard'}
              </span>
              {!submitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-border/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] uppercase tracking-widest text-text-secondary font-bold">Secure Environment</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-6 text-center w-full z-10">
        <p className="text-[10px] text-text-secondary opacity-40 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} The Prana Elixir
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;