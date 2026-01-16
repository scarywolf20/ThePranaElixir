import React from 'react';

const BestSellers = () => {
  const products = [
    {
      id: 1,
      name: "THE BANARAS STRIPE",
      price: "₹445.00",
      image: "/path-to-your-soap-image.jpg",
      status: "Out of Stock"
    },
    {
      id: 1,
      name: "THE BANARAS STRIPE",
      price: "₹445.00",
      image: "/path-to-your-soap-image.jpg",
      status: "Out of Stock"
    },
    {
      id: 1,
      name: "THE BANARAS STRIPE",
      price: "₹445.00",
      image: "/path-to-your-soap-image.jpg",
      status: "Out of Stock"
    },
    
    // Add more product objects here
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Section Heading */}
      <h2 className="text-center text-4xl md:text-5xl font-serif text-[#6D5447] mb-12">
        Best Sellers
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col group">
            
            {/* Image Container with Rounded Corners */}
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Product Details Row */}
            <div className="flex justify-between items-start px-2">
              <div className="flex flex-col space-y-1">
                <h3 className="text-sm tracking-widest font-medium text-gray-700 uppercase">
                  {product.name}
                </h3>
                <p className="text-gray-500 font-light">
                  {product.price}
                </p>
              </div>

              {/* Status Pill / Button */}
              {product.status === "Out of Stock" && (
                <div className="border border-[#6D5447] text-[#6D5447] px-4 py-2 rounded-full text-xs font-light tracking-tight">
                  {product.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;