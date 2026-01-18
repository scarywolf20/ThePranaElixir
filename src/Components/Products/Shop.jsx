import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronDown, X, SlidersHorizontal, Heart } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { useAuth } from '../../context/useAuth';
import { db } from '../../firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

const Shop = () => {
  // --- STATE ---
  const [showFilters, setShowFilters] = useState(false); // Toggle State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistBusyId, setWishlistBusyId] = useState(null);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlistIds(new Set())
        return
      }
      const snap = await getDocs(collection(db, 'users', user.uid, 'wishlist'))
      setWishlistIds(new Set(snap.docs.map((d) => d.id)))
    }

    loadWishlist()
  }, [user])

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setProducts(
          snap.docs.map((d) => {
            const data = d.data()
            return {
              id: d.id,
              name: data.name || '',
              price: Number(data.price || 0),
              category: data.category || 'Other',
              imageUrl: data.imageUrl || '',
              description: data.description || '',
              stock: Number(data.stock || 0),
            }
          }),
        )
        setLoadingProducts(false)
      },
      () => {
        setLoadingProducts(false)
      },
    )

    return unsubscribe
  }, [])

  const toggleWishlist = async (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return

    const productId = String(product.id)
    setWishlistBusyId(productId)
    try {
      if (wishlistIds.has(productId)) {
        await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId))
        setWishlistIds((prev) => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
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
        setWishlistIds((prev) => new Set(prev).add(productId))
      }
    } finally {
      setWishlistBusyId(null)
    }
  }

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOption === "featured") return 0;
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, sortOption]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== "" || selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-bg-main font-sans">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        
        {/* Header & Toggle Button */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary mb-4">
            Shop All
          </h1>
          <p className="text-text-secondary italic mb-8">
            Curated essentials for a mindful lifestyle.
          </p>
          
          {/* THE TOGGLE BUTTON */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300
              ${showFilters || hasActiveFilters
                ? 'bg-text-primary text-bg-surface border-text-primary' 
                : 'bg-transparent text-text-primary border-text-primary hover:bg-text-primary/5'}
            `}
          >
            {showFilters ? <X size={18} /> : <SlidersHorizontal size={18} />}
            <span className="uppercase tracking-widest text-xs font-bold">
              {showFilters ? 'Close Filters' : 'Search & Filter'}
            </span>
          </button>
        </div>

        {/* --- EXPANDABLE FILTER SECTION --- */}
        <div 
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${showFilters ? 'max-h-[500px] opacity-100 mb-12' : 'max-h-0 opacity-0 mb-0'}
          `}
        >
          <div className="bg-bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-xl pl-12 pr-10 py-3 text-text-primary focus:outline-none focus:border-primary-button transition-colors placeholder-text-muted"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <div className="relative group min-w-[140px] flex-1 md:flex-none">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-muted">
                    <Filter size={16} />
                  </div>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-bg-main border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary-button cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="relative group min-w-[160px] flex-1 md:flex-none">
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-text-muted">
                    <ChevronDown size={16} />
                  </div>
                  <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full appearance-none bg-bg-main border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary-button cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Tags */}
            {(selectedCategory !== "All" || searchQuery) && (
              <div className="flex gap-2 mt-4 flex-wrap animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => {setSelectedCategory("All"); setSearchQuery(""); setSortOption("featured")}} 
                  className="text-xs text-text-secondary underline hover:text-primary-button mr-2"
                >
                  Clear all
                </button>
                {selectedCategory !== "All" && (
                  <span className="bg-bg-section text-text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-border">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="hover:text-primary-button"><X size={12} /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- PRODUCTS GRID --- */}
        {loadingProducts ? (
          <div className="text-center py-20 bg-bg-surface rounded-[2.5rem] border border-dashed border-border">
            <h3 className="text-2xl font-serif text-text-primary mb-2">Loading products...</h3>
            <p className="text-text-secondary">Please wait</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-bg-section mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.category}
                  </span>

                  <button
                    onClick={(e) => toggleWishlist(e, product)}
                    disabled={!user || wishlistBusyId === String(product.id)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm border transition-colors cursor-pointer
                      ${wishlistIds.has(String(product.id))
                        ? 'bg-primary-button text-white border-primary-button'
                        : 'bg-white/80 text-text-primary border-white/60 hover:bg-white'
                      }
                      ${!user ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    aria-label="Toggle wishlist"
                    title={!user ? 'Login to use wishlist' : 'Wishlist'}
                  >
                    <Heart size={18} fill={wishlistIds.has(String(product.id)) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-serif tracking-wide text-text-primary uppercase group-hover:text-primary-button transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-text-secondary italic font-light">
                    Rs.{product.price}/-
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-surface rounded-[2.5rem] border border-dashed border-border">
            <h3 className="text-2xl font-serif text-text-primary mb-2">No products found</h3>
            <p className="text-text-secondary">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
              className="mt-6 text-primary-button border-b border-primary-button pb-0.5 hover:opacity-80"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;