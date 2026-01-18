import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'products'), where('isBestSeller', '==', true), limit(3))
        const snap = await getDocs(q)
        setProducts(
          snap.docs.map((d) => {
            const data = d.data()
            return {
              id: d.id,
              name: data.name || '',
              price: Number(data.price || 0),
              imageUrl: data.imageUrl || '',
              stock: Number(data.stock || 0),
            }
          }),
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Section Heading */}
      <h2 className="text-center text-4xl md:text-5xl font-serif text-[#6D5447] mb-12">
        Best Sellers
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {loading ? (
          <div className="text-center text-text-secondary md:col-span-3">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-text-secondary md:col-span-3">No best sellers selected.</div>
        ) : products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="flex flex-col group">
            
            {/* Image Container with Rounded Corners */}
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-6">
              <img
                src={product.imageUrl}
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
                  Rs. {product.price}/-
                </p>
              </div>

              {/* Status Pill / Button */}
              {product.stock <= 0 && (
                <div className="border border-[#6D5447] text-[#6D5447] px-4 py-2 rounded-full text-xs font-light tracking-tight">
                  Out of Stock
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;