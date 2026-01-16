import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import Navbar from '../Pages/Navbar';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Mock Cart Data (In real app, get this from useCart context)
  const cartTotal = 1785.00;
  const shipping = 0; // Free shipping
  const finalTotal = 1785.00;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Simulate Payment Processing...
    setTimeout(() => {
      navigate('/order-success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif text-text-primary mb-8 text-center md:text-left">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* LEFT COLUMN: FORMS */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Contact & Shipping */}
            <div className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center text-primary-button">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-serif text-text-primary">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">First Name</label>
                  <input required className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">Last Name</label>
                  <input required className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">Address</label>
                  <input required className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" placeholder="Street address, Apt, Suite" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">City</label>
                  <input required className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">Postal Code</label>
                  <input required className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-bg-main flex items-center justify-center text-primary-button">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-serif text-text-primary">Payment Method</h2>
              </div>

              {/* Payment Tabs */}
              <div className="flex gap-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer
                    ${paymentMethod === 'card' ? 'border-primary-button bg-primary-button/10 text-primary-button' : 'border-border text-text-secondary'}`}
                >
                  Credit/Debit Card
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all cursor-pointer
                    ${paymentMethod === 'cod' ? 'border-primary-button bg-primary-button/10 text-primary-button' : 'border-border text-text-secondary'}`}
                >
                  Cash on Delivery
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-text-secondary">Card Number</label>
                    <input placeholder="0000 0000 0000 0000" className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-text-secondary">Expiry Date</label>
                      <input placeholder="MM/YY" className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-text-secondary">CVC</label>
                      <input placeholder="123" className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-bg-main p-4 rounded-lg flex items-start gap-3 text-text-secondary text-sm">
                  <Truck className="shrink-0 text-primary-button" size={20} />
                  <p>You can pay with cash upon delivery. An additional fee of Rs. 50 may apply for handling.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-border sticky top-24 shadow-lg">
              <h3 className="text-xl font-serif text-text-primary mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {/* Mock Item 1 */}
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-bg-section rounded-lg overflow-hidden border border-border">
                     <img src="https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=100&h=100&fit=crop" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">Ceramic Vase</h4>
                    <p className="text-sm text-text-secondary">Qty: 1</p>
                  </div>
                  <span className="font-bold text-text-primary">Rs. 1200</span>
                </div>
                 {/* Mock Item 2 */}
                 <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-bg-section rounded-lg overflow-hidden border border-border">
                     <img src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=100&h=100&fit=crop" className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary">Scented Candle</h4>
                    <p className="text-sm text-text-secondary">Qty: 1</p>
                  </div>
                  <span className="font-bold text-text-primary">Rs. 450</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-text-secondary text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-serif text-text-primary pt-2 border-t border-dashed border-border mt-2">
                  <span>Total</span>
                  <span>Rs. {finalTotal}</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary-button text-white py-4 rounded-xl font-medium hover:bg-primary-hover transition-all mt-6 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <ShieldCheck size={20} />
                Pay Rs. {finalTotal}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-text-muted">
                <ShieldCheck size={14} />
                Secure SSL Encryption
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;