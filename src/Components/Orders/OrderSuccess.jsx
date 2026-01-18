import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, ArrowRight, Printer } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const OrderSuccess = () => {
  const location = useLocation()
  const { orderId, estimatedDelivery } = location.state || {}
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!orderId) return
      const snap = await getDoc(doc(db, 'orders', orderId))
      if (!snap.exists()) return
      const data = snap.data()
      setOrderNumber(data?.orderNumber || `ORD-${String(orderId).slice(0, 8).toUpperCase()}`)
    }
    load()
  }, [orderId])

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-bg-surface p-8 md:p-12 rounded-[2rem] shadow-xl border border-border text-center">
          
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
              <Check size={32} strokeWidth={4} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-2">Thank You!</h1>
          <p className="text-text-secondary text-lg mb-8">Your order has been placed successfully.</p>

          <div className="bg-bg-main p-6 rounded-xl border border-border mb-8 text-left">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-4">
              <span className="text-text-secondary">Order Number</span>
              <span className="font-bold text-text-primary">#{orderNumber || '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Estimated Delivery</span>
              <span className="font-bold text-text-primary">{estimatedDelivery || '—'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="flex-1 bg-primary-button text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              Continue Shopping <ArrowRight size={18} />
            </Link>
            <button className="flex-1 border border-border text-text-secondary bg-white py-3 px-6 rounded-xl font-medium hover:bg-bg-main transition-colors flex items-center justify-center gap-2">
              <Printer size={18} /> Download Receipt
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;