import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Heart } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { productsData } from './Shop'; // Import the data to find the product

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Find the product matching the ID from the URL
  const product = productsData.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-primary">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-bg-main">
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
              src={product.image} 
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

            <p className="text-text-primary leading-relaxed opacity-80">
              {product.description} This item is crafted with care and attention to detail, ensuring it fits perfectly into your lifestyle. Made from high-quality materials that are designed to last.
            </p>

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
              <button className="flex-1 bg-primary-button text-white py-4 px-8 rounded-full font-medium hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2">
                <ShoppingBag size={20} />
                Buy Now
              </button>
              <button className="flex-1 border border-text-primary text-text-primary py-4 px-8 rounded-full font-medium hover:bg-text-primary hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Heart size={20} />
                Add to Wishlist
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