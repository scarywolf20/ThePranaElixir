import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { useAuth } from '../../context/useAuth';

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Mock Form State
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
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="bg-bg-surface w-full max-w-5xl rounded-[2rem] shadow-xl overflow-hidden border border-border flex flex-col md:flex-row">
          
          {/* LEFT SIDE: Image / Brand Vibe */}
          <div className="hidden md:block w-1/2 relative bg-text-secondary">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop" 
              alt="Aesthetic Interior" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-12 text-white">
              <h2 className="text-4xl font-serif mb-4">Welcome Home.</h2>
              <p className="text-lg opacity-90 font-light">
                Join our community to access exclusive collections and track your orders.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: Form */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
            
            <div className="mb-8 text-center md:text-left">
              <h1 className="text-3xl font-serif text-text-primary mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-text-secondary">
                {isLogin 
                  ? 'Please enter your details to sign in.' 
                  : 'Enter your details to get started.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {error && (
                <div className="bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}
              
              {/* Name Field (Only for Signup) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-text-secondary tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-button transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      required={!isLogin}
                      className="w-full bg-bg-main border border-border rounded-xl px-12 py-3 text-text-primary outline-none focus:border-primary-button focus:ring-1 focus:ring-primary-button transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-text-secondary tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-button transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    required
                    className="w-full bg-bg-main border border-border rounded-xl px-12 py-3 text-text-primary outline-none focus:border-primary-button focus:ring-1 focus:ring-primary-button transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-text-secondary tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-button transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-bg-main border border-border rounded-xl px-12 py-3 text-text-primary outline-none focus:border-primary-button focus:ring-1 focus:ring-primary-button transition-all"
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
                    className="text-sm text-primary-button hover:underline cursor-pointer"
                    disabled={submitting}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-primary-button hover:bg-primary-hover text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Toggle Login/Signup */}
            <div className="mt-8 text-center pt-8 border-t border-border">
              <p className="text-text-secondary">
                {isLogin ? "Don't have an account yet?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-bold text-text-primary hover:text-primary-button underline decoration-wavy decoration-primary-button/50 underline-offset-4 cursor-pointer transition-colors"
                >
                  {isLogin ? 'Sign up free' : 'Log in here'}
                </button>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;