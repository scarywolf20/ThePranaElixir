import React from 'react';
import ShopNowButton from './ShopNowButton';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      title: "POSTCARDS",
      price: "Rs.700/-",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59", // Replace with actual path
    },
    {
      id: 2,
      title: "BATH ACCESSORIES",
      price: "Rs.295/-",
      image: "image_887f6d.png", // Replace with actual path
    },
    {
      id: 3,
      title: "GENTLE HABITS SOAPS",
      price: "Rs.250/-",
      image: "image_887f6d.png", // Replace with actual path
    },
    
  ];

  return (
    <section className="bg-bg-main py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Wide-Spaced Dotted Divider */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-text-primary text-3xl tracking-[0.3em] font-light uppercase mb-6">
            Featured Products
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

        {/* Product Grid */}
        <div className="relative group">
          {/* Slider Arrows (Visual only to match image) */}
          <button className="absolute -left-8 top-1/2 -translate-y-1/2 text-text-primary text-3xl opacity-50 hover:opacity-100 transition-opacity">
            &#8249;
          </button>
          <button className="absolute -right-8 top-1/2 -translate-y-1/2 text-text-primary text-3xl opacity-50 hover:opacity-100 transition-opacity">
            &#8250;
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col items-center">
                {/* Image Container with Rounded Corners */}
                <div className="w-full aspect-[3/4] overflow-hidden rounded-[40px] mb-6 shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>

                {/* Product Details */}
                <div className="text-center space-y-2">
                  <h3 className="text-text-primary text-lg tracking-[0.15em] font-serif uppercase">
                    {product.title}
                  </h3>
                  <p className="text-text-secondary text-sm tracking-widest italic">
                    From {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional Section Footer Button */}
        <div className="flex justify-center mt-16">
          <ShopNowButton />
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;