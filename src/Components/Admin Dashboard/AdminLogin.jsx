import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
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
      const adminSnap = await getDoc(doc(db, 'admins', cred.user.uid))
      if (!adminSnap.exists()) {
        await signOut(auth)
        setError('You do not have admin access.')
        return
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err?.message || 'Invalid credentials')
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface border border-border rounded-2xl shadow-lg overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-bg-section p-8 text-center border-b border-border">
          <div className="w-16 h-16 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4 border border-border text-primary-button">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-text-primary">Admin Access</h2>
          <p className="text-text-secondary mt-2 text-sm">Please sign in to manage your store</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-main border border-border text-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary-button transition-colors"
                  placeholder="admin@store.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-main border border-border text-text-primary pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary-button transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-primary-button hover:bg-primary-hover text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing In...' : 'Sign In to Dashboard'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-bg-section p-4 text-center border-t border-border">
          <p className="text-xs text-text-muted">© 2024 Store Admin Panel. Secure Area.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;