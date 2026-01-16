import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Pages/Navbar';

// Shared Mock Data (You would usually fetch this from an API)
export const productsData = [
  { 
    id: 1, 
    name: "POSTCARDS", 
    price: 700, 
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1000&auto=format&fit=crop", 
    description: "Handcrafted paper postcards for your loved ones."
  },
  { 
    id: 2, 
    name: "BATH ACCESSORIES", 
    price: 295, 
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", 
    description: "Leather and sustainable materials for your daily carry."
  },
  { 
    id: 3, 
    name: "GENTLE HABITS SOAPS", 
    price: 250, 
    image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=1000&auto=format&fit=crop", 
    description: "Organic, scented soaps for a relaxing bath experience."
  },
  { 
    id: 4, 
    name: "CERAMIC VASE", 
    price: 1200, 
    image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=1000&auto=format&fit=crop", 
    description: "Minimalist ceramic vase for modern homes."
  },
];

const Shop = () => {
  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-serif text-text-primary text-center mb-4">
          Shop All
        </h1>
        <p className="text-text-secondary text-center mb-16 italic">
          Curated essentials for a mindful lifestyle.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {productsData.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id} 
              className="group cursor-pointer"
            >
              {/* Image Container with strict rounded corners from your reference */}
              <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-bg-section mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Text Info */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-serif tracking-wide text-text-primary uppercase group-hover:text-primary-button transition-colors">
                  {product.name}
                </h3>
                <p className="text-text-secondary italic font-light">
                  From Rs.{product.price}/-
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;