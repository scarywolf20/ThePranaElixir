import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocsFromCache, getDocsFromServer, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'products'), where('isBestSeller', '==', true), limit(3))
        const mapSnap = (snap) => {
          return snap.docs.map((d) => {
            const data = d.data()
            return {
              id: d.id,
              name: data.name || '',
              price: Number(data.price || 0),
              imageUrl: data.imageUrl || '',
              stock: Number(data.stock || 0),
            }
          })
        }

        // 1) Try cache first for near-instant paint.
        try {
          const cacheSnap = await getDocsFromCache(q)
          if (cacheSnap.size > 0) {
            setProducts(mapSnap(cacheSnap))
          }
        } catch {
          // Cache miss is normal on first visit.
        }

        // 2) Always refresh from server.
        const serverSnap = await getDocsFromServer(q)
        setProducts(mapSnap(serverSnap))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const SkeletonCard = () => {
    return (
      <div className="flex flex-col group animate-pulse">
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-200 mb-6" />
        <div className="flex justify-between items-start px-2">
          <div className="flex flex-col space-y-2 w-full">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Section Heading */}
      <h2 className="text-center text-4xl md:text-5xl font-serif text-[#6D5447] mb-12">
        Best Sellers
      </h2>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
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