import React, { useState } from 'react';
import ShopNowButton from './ShopNowButton';

const ProductSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    { id: 1, title: "POSTCARDS", price: "700/-", image: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&q=80" },
    { id: 2, title: "BATH ACCESSORIES", price: "295/-", image: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80" },
    { id: 3, title: "GENTLE HABITS SOAPS", price: "250/-", image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80" },
    { id: 4, title: "WAX TABLETS", price: "450/-", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80" },
    { id: 5, title: "SOY CANDLES", price: "850/-", image: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80" },
  ];

  const maxIndex = products.length - 3;

  const nextSlide = () => {
    if (currentIndex < maxIndex) setCurrentIndex(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <section className="bg-bg-main py-16 px-4 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-text-primary text-3xl tracking-[0.3em] font-light uppercase mb-8">
            Our Collection
          </h2>
          <div 
            className="w-full h-[1px]" 
            style={{
              backgroundImage: `linear-gradient(to right, #CBBBAA 25%, transparent 25%)`,
              backgroundSize: '20px 1px',
              backgroundRepeat: 'repeat-x'
            }}
          />
        </div>

        {/* Slider Wrapper - Added extra padding to prevent edge cutting */}
        <div className="relative px-2">
          
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute -left-8 md:-left-12 top-[40%] z-20 text-4xl text-text-primary transition-all cursor-pointer ${currentIndex === 0 ? 'opacity-10' : 'opacity-60 hover:opacity-100'}`}
          >
            &#8249;
          </button>

          <button 
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className={`absolute -right-8 md:-right-12 top-[40%] z-20 text-4xl text-text-primary transition-all cursor-pointer ${currentIndex >= maxIndex ? 'opacity-10' : 'opacity-60 hover:opacity-100'}`}
          >
            &#8250;
          </button>

          {/* Visible Area */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                // Adding gap via margin to items instead of parent gap to prevent clipping
              }}
            >
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="w-full md:w-1/3 flex-shrink-0 px-4 flex flex-col items-center"
                >
                  {/* Card Image */}
                  <div className="w-full aspect-[3/4.2] overflow-hidden rounded-[45px] bg-bg-surface shadow-sm">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="mt-8 text-center">
                    <h3 className="text-text-primary text-lg tracking-[0.18em] font-serif uppercase mb-1">
                      {product.title}
                    </h3>
                    <p className="text-text-secondary text-sm tracking-widest italic">
                      From Rs.{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Footer */}
        <div className="flex justify-center mt-16">
          <ShopNowButton />
        </div>
      </div>
    </section>
  );
};

export default ProductSection;