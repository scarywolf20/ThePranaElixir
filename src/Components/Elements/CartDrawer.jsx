import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Ceramic Vase',
      price: 1200.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=200&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Scented Soy Candle',
      price: 450.00,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=200&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Linen Napkins (Set of 4)',
      price: 850.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop'
    }
  ])

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
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05 
  const total = subtotal + tax

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-bg-surface shadow-2xl border-l border-border transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) z-50 flex flex-col ${
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
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <h3 className="font-serif text-text-primary text-lg leading-tight mb-1">{item.name}</h3>
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
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-text-secondary">
                <span>Tax (5%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-serif text-text-primary border-t border-border pt-3">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-primary-button text-white py-4 rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer