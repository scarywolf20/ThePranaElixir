import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../Elements/SEO';
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';
import { useToast } from '../../context/useToast';
import { db } from '../../firebase';
import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { addToast } = useToast();
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoadingProduct(true)
      try {
        const snap = await getDoc(doc(db, 'products', String(id)))
        if (!snap.exists()) {
          setProduct(null)
          return
        }
        const data = snap.data()
        setProduct({
          id: snap.id,
          name: data.name || '',
          price: Number(data.price || 0),
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          category: data.category || '',
          stock: Number(data.stock || 0),
        })
      } finally {
        setLoadingProduct(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    const load = async () => {
      if (!user || !product) {
        setWishlisted(false)
        return
      }
      const productId = String(product.id)
      const snap = await getDoc(doc(db, 'users', user.uid, 'wishlist', productId))
      setWishlisted(snap.exists())
    }
    load()
  }, [user, product])

  const toggleWishlist = async () => {
    if (!user) {
      addToast('Please log in to use wishlist', 'info')
      navigate('/customer/login')
      return
    }
    if (!product) return
    const productId = String(product.id)
    setWishlistBusy(true)
    try {
      if (wishlisted) {
        await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId))
        setWishlisted(false)
        addToast('Removed from wishlist', 'success')
      } else {
        await setDoc(
          doc(db, 'users', user.uid, 'wishlist', productId),
          {
            productId,
            title: product.name,
            price: product.price,
            image: product.imageUrl,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        )
        setWishlisted(true)
        addToast('Added to wishlist', 'success')
      }
    } catch (e) {
      addToast('Wishlist update failed', 'error')
      throw e
    } finally {
      setWishlistBusy(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-primary">
        Loading...
      </div>
    )
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-primary">Product not found</div>;
  }

  const handleAddToCart = async () => {
    if (!user) {
      addToast('Please log in to add items to cart', 'info')
      navigate('/customer/login')
      return
    }
    await addItem(product, quantity)
  }

  return (
    <div className="min-h-screen bg-bg-main">
      <SEO 
        title={product.name} 
        description={product.description.substring(0, 150) + '...'} 
        image={product.imageUrl} 
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Product Image */}
          <div className="rounded-[2.5rem] overflow-hidden bg-bg-section shadow-sm aspect-[4/5]">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-8 pt-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4 uppercase tracking-wide">
                {product.name}
              </h1>
              <p className="text-2xl text-text-secondary font-light">
                Rs. {product.price}/-
              </p>
            </div>

            <div className="h-px bg-border w-full"></div>

            <div className="text-text-primary leading-relaxed space-y-4">
              {product.description.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return null;
                
                // Check if it's a bullet point
                if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                  return (
                    <div key={index} className="flex items-start gap-3 ml-4">
                      <span className="text-primary-button mt-1">•</span>
                      <span className="opacity-80">{trimmedLine.replace(/^[•-]\s*/, '')}</span>
                    </div>
                  );
                }
                
                // Regular paragraph
                return (
                  <p key={index} className="opacity-80">
                    {trimmedLine}
                  </p>
                );
              })}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <span className="text-sm font-bold uppercase text-text-secondary tracking-widest">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-full px-4 py-2 bg-bg-surface">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium text-text-primary">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary-button text-white py-4 px-8 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                disabled={!user || wishlistBusy}
                className={`flex-1 border py-4 px-8 rounded-full font-medium transition-colors flex items-center justify-center gap-2
                  ${wishlisted
                    ? 'bg-primary-button border-primary-button text-white hover:bg-primary-hover'
                    : 'border-text-primary text-text-primary hover:bg-text-primary hover:text-white'
                  }
                  ${!user ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-bg-section flex items-center justify-center text-text-secondary">
                  📦
                </div>
                <span className="text-xs text-text-secondary uppercase">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-bg-section flex items-center justify-center text-text-secondary">
                  🌿
                </div>
                <span className="text-xs text-text-secondary uppercase">Eco Friendly</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-bg-section flex items-center justify-center text-text-secondary">
                  🛡️
                </div>
                <span className="text-xs text-text-secondary uppercase">Secure Pay</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;