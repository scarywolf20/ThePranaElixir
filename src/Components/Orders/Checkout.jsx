import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, MapPin, Tag, Check, X } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';
import { httpsCallable } from 'firebase/functions'
import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db, functions } from '../../firebase';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const [placing, setPlacing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  // Mock coupon codes (in real app, validate from backend)
  const validCoupons = {
    'HAPPY': { discount: 10, type: 'percentage' },
    'SAVE20': { discount: 20, type: 'percentage' },
    'FLAT100': { discount: 100, type: 'fixed' }
  };

  const shipping = 0; // Free shipping
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (cartSubtotal * appliedCoupon.discount) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discount = appliedCoupon.discount;
    }
  }

  const finalTotal = cartSubtotal - discount + shipping;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/customer/login')
    }
  }, [loading, user, navigate])

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return
      const snap = await getDocs(
        query(collection(db, 'users', user.uid, 'addresses'), orderBy('createdAt', 'desc')),
      )
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setAddresses(list)
      if (list.length > 0) {
        setSelectedAddressId(list[0].id)
      }
    }
    loadAddresses()
  }, [user])

  useEffect(() => {
    const selected = addresses.find((a) => a.id === selectedAddressId)
    if (!selected) return

    const nextAddress = String(selected.addressLine || selected.text || '').trim()
    const nextCity = String(selected.city || '').trim()
    const nextPostal = String(selected.postalCode || '').trim()
    const nextFirstName = String(selected.firstName || '').trim()
    const nextLastName = String(selected.lastName || '').trim()

    setShippingForm((prev) => ({
      ...prev,
      address: nextAddress || prev.address,
      city: nextCity || prev.city,
      postalCode: nextPostal || prev.postalCode,
      firstName: nextFirstName || prev.firstName,
      lastName: nextLastName || prev.lastName,
    }))
  }, [addresses, selectedAddressId])

  const estimatedDelivery = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 4)
    return d.toLocaleDateString()
  }, [])

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (validCoupons[code]) {
      setAppliedCoupon({ code, ...validCoupons[code] });
      setCouponError('');
      setCouponCode('');
      setShowCouponInput(false);
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const loadRazorpayScript = () => {
    if (typeof window === 'undefined') return Promise.resolve(false)
    if (window.Razorpay) return Promise.resolve(true)

    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) return
    if (cartItems.length === 0) return
    setPaymentError('')

    setPlacing(true)
    try {
      const payloadItems = cartItems.map((it) => ({
        productId: String(it.productId || it.id),
        title: it.title || '',
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 0),
        image: it.image || '',
      }))

      const shippingAddress = {
        firstName: shippingForm.firstName.trim(),
        lastName: shippingForm.lastName.trim(),
        address: shippingForm.address.trim(),
        city: shippingForm.city.trim(),
        postalCode: shippingForm.postalCode.trim(),
        savedAddressId: selectedAddressId || null,
      }

      const ok = await loadRazorpayScript()
      if (!ok) {
        setPaymentError('Failed to load Razorpay. Please check your internet and try again.')
        return
      }

      const createRazorpayOrder = httpsCallable(functions, 'createRazorpayOrder')
      const createRes = await createRazorpayOrder({
        total: Number(finalTotal || 0),
        subtotal: Number(cartSubtotal || 0),
        discount: Number(discount || 0),
        shipping: Number(shipping || 0),
        items: payloadItems,
        shippingAddress,
        customerEmail: user.email || '',
      })

      const {
        firestoreOrderId,
        razorpayOrderId,
        amount,
        currency,
        keyId,
      } = createRes?.data || {}

      if (!firestoreOrderId || !razorpayOrderId || !keyId) {
        setPaymentError('Payment initialization failed. Please try again.')
        return
      }

      const options = {
        key: keyId,
        amount,
        currency: currency || 'INR',
        name: 'The Prana Elixir',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        prefill: {
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
          email: user.email || '',
        },
        notes: {
          firestoreOrderId,
        },
        handler: async (response) => {
          try {
            const verifyRazorpayPayment = httpsCallable(functions, 'verifyRazorpayPayment')
            await verifyRazorpayPayment({
              firestoreOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            await clearCart()
            navigate('/order-success', { state: { orderId: firestoreOrderId, estimatedDelivery } })
          } catch (err) {
            setPaymentError(err?.message || 'Payment verification failed. If money was deducted, please contact support.')
          } finally {
            setPlacing(false)
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentError('Payment cancelled.')
            setPlacing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (resp) => {
        setPaymentError(resp?.error?.description || 'Payment failed. Please try again.')
        setPlacing(false)
      })
      rzp.open()
    } finally {
      // placing is controlled by Razorpay flow; do not blindly reset here.
    }
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
              
              {addresses.length > 0 ? (
                <div className="mb-6">
                  <label className="text-xs font-bold uppercase text-text-secondary">Saved Address</label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="mt-2 w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none"
                  >
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.type || 'Address'}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">First Name</label>
                  <input
                    required
                    value={shippingForm.firstName}
                    onChange={(e) => setShippingForm((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">Last Name</label>
                  <input
                    required
                    value={shippingForm.lastName}
                    onChange={(e) => setShippingForm((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">Address</label>
                  <input
                    required
                    value={shippingForm.address}
                    onChange={(e) => setShippingForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none"
                    placeholder="Street address, Apt, Suite"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">City</label>
                  <input
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm((p) => ({ ...p, city: e.target.value }))}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-secondary">Postal Code</label>
                  <input
                    required
                    value={shippingForm.postalCode}
                    onChange={(e) => setShippingForm((p) => ({ ...p, postalCode: e.target.value }))}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button focus:outline-none"
                  />
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

              <div className="bg-bg-main p-4 rounded-lg flex items-start gap-3 text-text-secondary text-sm">
                <ShieldCheck className="shrink-0 text-primary-button" size={20} />
                <p>Online payment via Razorpay (UPI, Cards, NetBanking, Wallets). Cash on Delivery is not available.</p>
              </div>

              {paymentError ? <div className="mt-4 text-danger text-sm">{paymentError}</div> : null}
            </div>

          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="lg:w-1/3">
            <div className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-border sticky top-24 shadow-lg">
              <h3 className="text-xl font-serif text-text-primary mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.length === 0 ? (
                  <div className="text-text-secondary">Your cart is empty.</div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-bg-section rounded-lg overflow-hidden border border-border">
                        <img src={item.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{item.title}</h4>
                        <p className="text-sm text-text-secondary">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-text-primary">Rs. {Number(item.price || 0) * Number(item.quantity || 0)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon Code Section */}
              <div className="mb-6 pb-6 border-b border-border">
                {!appliedCoupon ? (
                  <>
                    {!showCouponInput ? (
                      <button
                        type="button"
                        onClick={() => setShowCouponInput(true)}
                        className="flex items-center gap-2 text-primary-button hover:text-primary-hover transition-colors text-sm font-medium cursor-pointer"
                      >
                        <Tag className="w-4 h-4" />
                        Have a coupon code?
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                setCouponError('');
                              }}
                              onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                              placeholder="Enter coupon code"
                              className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:border-primary-button focus:outline-none uppercase"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-4 py-2.5 bg-primary-button text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-danger text-xs">{couponError}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setShowCouponInput(false);
                            setCouponCode('');
                            setCouponError('');
                          }}
                          className="text-text-secondary hover:text-text-primary text-xs underline cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-success/10 border border-success/30 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-success font-medium text-sm">Coupon Applied!</p>
                        <p className="text-text-secondary text-xs">Code: {appliedCoupon.code}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-text-secondary hover:text-danger transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-text-secondary text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-success font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>- Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-serif text-text-primary pt-2 border-t border-dashed border-border mt-2">
                  <span>Total</span>
                  <span>Rs. {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="w-full bg-primary-button text-white py-4 rounded-xl font-medium hover:bg-primary-hover transition-all mt-6 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                <ShieldCheck size={20} />
                {placing ? 'Processing...' : `Pay Rs. ${finalTotal}`}
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