import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Tag, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/useCart'

const CartDrawer = ({ isOpen, onClose }) => {
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [showCouponInput, setShowCouponInput] = useState(false)
  const { items: cartItems, setItemQuantity, removeItem: removeCartItem } = useCart()

  // Mock coupon codes (in real app, validate from backend)
  const validCoupons = {
    'HAPPY': { discount: 10, type: 'percentage' },
    'SAVE20': { discount: 20, type: 'percentage' },
    'FLAT100': { discount: 100, type: 'fixed' }
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const updateQuantity = (id, change) => {
    const current = cartItems.find((it) => String(it.id) === String(id))
    const nextQty = Math.max(1, Number(current?.quantity || 1) + change)
    setItemQuantity(String(id), nextQty)
  }

  const removeItem = (id) => {
    removeCartItem(String(id))
  }

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase()
    if (validCoupons[code]) {
      setAppliedCoupon({ code, ...validCoupons[code] })
      setCouponError('')
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError('')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  // Calculate discount
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100
    } else if (appliedCoupon.type === 'fixed') {
      discount = appliedCoupon.discount
    }
  }

  const tax = (subtotal - discount) * 0.05 
  const total = subtotal - discount + tax

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-bg-surface shadow-2xl border-l border-border transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) z-100 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 1. Header (Fixed Height, Don't Shrink) */}
        <div className="flex-none flex items-center justify-between p-6 border-b border-border bg-bg-main/50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary-button" />
            <h2 className="text-xl font-serif text-text-primary tracking-wide">Your Cart</h2>
            <span className="bg-primary-button text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-bg-main">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-main rounded-full text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 2. Scrollable Content (Takes Remaining Space) */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-text-muted space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-50" />
              <p className="text-lg font-serif">Your cart is empty.</p>
              <button onClick={onClose} className="text-primary-button hover:underline text-sm uppercase tracking-widest font-bold cursor-pointer">Start Shopping</button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 group"
                >
                  <div className="w-24 h-28 bg-bg-section rounded-xl overflow-hidden shrink-0 border border-border">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <h3 className="font-serif text-text-primary text-lg leading-tight mb-1">{item.title}</h3>
                        <p className="text-text-secondary text-sm">Rs. {item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-border rounded-lg bg-bg-main">
                            <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-section rounded-l-lg transition-colors cursor-pointer"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-medium text-text-primary text-sm">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg-section rounded-r-lg transition-colors cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-text-muted hover:text-danger transition-colors cursor-pointer"
                            title="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Footer (Fixed Height, Don't Shrink) */}
        {cartItems.length > 0 && (
          <div className="flex-none border-t border-border p-6 bg-bg-section pb-8 md:pb-6">
            
            {/* Coupon Code Section */}
            <div className="mb-6">
              {!appliedCoupon ? (
                <>
                  {!showCouponInput ? (
                    <button
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
                              setCouponCode(e.target.value.toUpperCase())
                              setCouponError('')
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            placeholder="Enter coupon code"
                            className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:border-primary-button focus:outline-none uppercase"
                          />
                        </div>
                        <button
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
                        onClick={() => {
                          setShowCouponInput(false)
                          setCouponCode('')
                          setCouponError('')
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
                    onClick={handleRemoveCoupon}
                    className="text-text-secondary hover:text-danger text-xs font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && discount > 0 && (
                <div className="flex justify-between text-sm text-success font-medium">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>- Rs. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Tax (5%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-text-primary border-t border-border pt-3">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
           <Link
                to="/checkout"
                onClick={onClose} // 2. Close drawer when clicking
                className="w-full bg-primary-button text-white py-4 rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
                </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer