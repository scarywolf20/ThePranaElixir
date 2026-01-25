import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Tag, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart'
import { usePromo } from '../../context/usePromo'

const CartDrawer = ({ isOpen, onClose }) => {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [showCouponInput, setShowCouponInput] = useState(false)
  const { items: cartItems, setItemQuantity, removeItem: removeCartItem } = useCart()
  const { promoCoupon } = usePromo()

  const validCoupons = {
    ...(promoCoupon?.code
      ? {
          [promoCoupon.code]: {
            discount: promoCoupon.discount,
            type: promoCoupon.type,
          },
        }
      : {}),
    'HAPPY': { discount: 10, type: 'percentage' },
    'SAVE20': { discount: 20, type: 'percentage' },
    'FLAT100': { discount: 100, type: 'fixed' },
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  let discount = 0
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.discount) / 100 
      : appliedCoupon.discount
  }
  const total = subtotal - discount

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-primary/40 backdrop-blur-[4px] z-[190]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-bg-surface shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[200] flex flex-col"
          >
            {/* Header */}
            <div className="flex-none flex items-center justify-between px-8 py-8 border-b border-border/10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-text-primary" strokeWidth={1.5} />
                  <span className="absolute -top-2 -right-2 bg-primary-button text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <h2 className="text-2xl font-serif text-text-primary tracking-tight">Your Selection</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform duration-300 text-text-secondary">
                <X className="w-6 h-6" strokeWidth={1} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-20 h-20 bg-bg-main rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-text-secondary opacity-30" strokeWidth={1} />
                  </div>
                  <p className="text-lg font-serif italic text-text-secondary">Your cart is as light as air.</p>
                  <button onClick={onClose} className="text-xs tracking-[0.3em] font-bold uppercase text-primary-button border-b border-primary-button pb-1">Start Discovering</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-6 group"
                    >
                      <div className="w-24 h-32 bg-bg-main rounded-2xl overflow-hidden shrink-0 shadow-sm">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="font-serif text-text-primary text-lg leading-tight uppercase tracking-wide">{item.title}</h3>
                          <p className="text-text-secondary text-xs font-medium tracking-widest">Rs. {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center bg-bg-main rounded-full px-2 py-1 border border-border/20">
                            <button onClick={() => setItemQuantity(item.id, Math.max(1, item.quantity - 1))} className="p-1 text-text-secondary hover:text-text-primary"><Minus size={14}/></button>
                            <span className="w-8 text-center text-xs font-bold text-text-primary">{item.quantity}</span>
                            <button onClick={() => setItemQuantity(item.id, item.quantity + 1)} className="p-1 text-text-secondary hover:text-text-primary"><Plus size={14}/></button>
                          </div>
                          <button onClick={() => removeCartItem(item.id)} className="text-text-secondary hover:text-red-400 transition-colors">
                            <Trash2 size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="flex-none p-8 bg-white border-t border-border/10 space-y-6">
                {/* Coupon UI */}
                {!appliedCoupon ? (
                  <div className="relative">
                    {!showCouponInput ? (
                      <button onClick={() => setShowCouponInput(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary-button">
                        <Tag size={12} /> Apply Promo Code
                      </button>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                        <input 
                          type="text" 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 bg-bg-main border-b border-border/60 py-2 px-1 text-xs outline-none focus:border-primary-button uppercase tracking-widest"
                          placeholder="CODE"
                        />
                        <button onClick={() => {
                          const code = couponCode.trim();
                          if (validCoupons[code]) { setAppliedCoupon({ code, ...validCoupons[code] }); setCouponError(''); }
                          else setCouponError('Invalid');
                        }} className="text-[10px] font-bold uppercase tracking-widest text-text-primary">Verify</button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50/50 p-3 rounded-xl border border-green-100">
                    <span className="text-[10px] font-bold text-green-700 tracking-widest uppercase">{appliedCoupon.code} APPLIED</span>
                    <button onClick={() => setAppliedCoupon(null)} className="text-[10px] font-bold text-text-secondary uppercase">Remove</button>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs tracking-widest uppercase text-text-secondary">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
                      <span>Incentive</span>
                      <span>- Rs. {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl  text-text-primary pt-4 border-t border-border/10">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full bg-text-primary text-white py-5 rounded-full flex items-center justify-center gap-4 group hover:bg-primary-button transition-all duration-500 shadow-xl"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.3em]">Checkout</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer