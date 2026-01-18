import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Image as ImageIcon, 
  MessageSquareQuote, // New Icon
  Tag,
  Star,               // New Icon
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  ChevronRight,
  Search
} from 'lucide-react';

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';

// --- MOCK DATA ---
const initialOrders = [
  { id: 101, customer: "Alice Brown", total: 125.00, status: "Pending", instruction: "" },
  { id: 102, customer: "Mark Wilson", total: 45.00, status: "Shipped", instruction: "Leave at door" },
];

// --- COMPONENTS ---

// 1. PRODUCTS COMPONENT
const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  React.useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      )
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id))
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      name: currentProduct.name || '',
      price: Number(currentProduct.price || 0),
      stock: Number(currentProduct.stock || 0),
      category: currentProduct.category || '',
      imageUrl: currentProduct.imageUrl || '',
      description: currentProduct.description || '',
      updatedAt: serverTimestamp(),
    }

    if (currentProduct.id) {
      await setDoc(doc(db, 'products', currentProduct.id), payload, { merge: true })
    } else {
      await addDoc(collection(db, 'products'), {
        ...payload,
        createdAt: serverTimestamp(),
      })
    }

    setIsEditing(false);
    setCurrentProduct(null);
  };

  const openEdit = (
    product = { name: '', price: '', stock: '', category: '', imageUrl: '', description: '' },
  ) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Product Inventory</h2>
        <button 
          onClick={() => openEdit()}
          className="bg-primary-button hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {isEditing && (
        <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-text-secondary">
            {currentProduct.id ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              placeholder="Product Name" 
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
            />
            <input 
              placeholder="Price" 
              type="number"
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentProduct.price}
              onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
            />
             <input 
              placeholder="Stock" 
              type="number"
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentProduct.stock}
              onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})}
            />
            <input 
              placeholder="Category" 
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
            />
            <input 
              placeholder="Image URL (Cloudinary or any link)" 
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted md:col-span-2"
              value={currentProduct.imageUrl}
              onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
            />
            <textarea 
              placeholder="Description" 
              rows="3"
              className="w-full bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted md:col-span-2"
              value={currentProduct.description}
              onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
            />
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary cursor-pointer">Cancel</button>
              <button type="submit" className="bg-primary-button text-white px-6 py-2 rounded-lg hover:bg-primary-hover cursor-pointer">Save Product</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-bg-section text-text-secondary uppercase text-sm font-semibold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td className="p-4 text-text-secondary" colSpan={5}>Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td className="p-4 text-text-secondary" colSpan={5}>No products yet.</td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id} className="hover:bg-bg-main transition-colors">
                <td className="p-4 font-medium text-text-primary">{product.name}</td>
                <td className="p-4 text-text-secondary">{product.category}</td>
                <td className="p-4 text-text-primary">${product.price}</td>
                <td className="p-4 text-text-secondary">{product.stock}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => openEdit(product)} className="text-accent hover:text-primary-button cursor-pointer">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-danger hover:text-red-700 cursor-pointer">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. PROMO / COUPON SETTINGS
const PromoManager = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    enabled: true,
    text: "",
    code: "",
    discountType: "percentage",
    discountValue: 10,
  })

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'promo'), (snap) => {
      const data = snap.data() || {}
      setForm({
        enabled: data.enabled !== false,
        text: typeof data.text === 'string' ? data.text : "",
        code: typeof data.code === 'string' ? data.code : "",
        discountType: data.discountType === 'fixed' ? 'fixed' : 'percentage',
        discountValue: Number(data.discountValue || 0),
      })
      setLoading(false)
    })
    return unsub
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await setDoc(
        doc(db, 'settings', 'promo'),
        {
          enabled: !!form.enabled,
          text: form.text || '',
          code: (form.code || '').trim().toUpperCase(),
          discountType: form.discountType === 'fixed' ? 'fixed' : 'percentage',
          discountValue: Number(form.discountValue || 0),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Promo / Coupon</h2>
      <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm">
        {loading ? (
          <div className="text-text-secondary">Loading...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-text-primary">Promo Bar</div>
                <div className="text-sm text-text-secondary">Show/hide the top announcement bar</div>
              </div>
              <label className="flex items-center gap-2 text-text-primary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!form.enabled}
                  onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
                />
                Enabled
              </label>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Promo Text</label>
              <input
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                placeholder="10% Off On Your First Order. Use Code 'HAPPY'"
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Coupon Code</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                  placeholder="HAPPY"
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value }))}
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button outline-none cursor-pointer"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Discount Value</label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:border-primary-button outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-button text-white px-6 py-2 rounded-lg hover:bg-primary-hover cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Promo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// 2. ORDERS COMPONENT
const OrdersManager = () => {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const updateInstruction = (id, newInstruction) => {
    setOrders(orders.map(o => o.id === id ? { ...o, instruction: newInstruction } : o));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Order Management</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <h3 className="font-bold text-lg text-text-primary">Order #{order.id}</h3>
                <p className="text-text-secondary text-sm">{order.customer}</p>
              </div>
              <div className="mt-2 md:mt-0 flex items-center gap-3">
                <span className="font-bold text-text-primary text-lg">${order.total}</span>
                <select 
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border border-border outline-none cursor-pointer
                    ${order.status === 'Shipped' ? 'bg-success text-white' : 'bg-warning text-white'}`}
                >
                  <option className="text-black" value="Pending">Pending</option>
                  <option className="text-black" value="Processing">Processing</option>
                  <option className="text-black" value="Shipped">Shipped</option>
                  <option className="text-black" value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
            
            <div className="bg-bg-section p-4 rounded-lg">
              <label className="block text-xs uppercase font-bold text-text-muted mb-2">Admin Instructions / Notes</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={order.instruction}
                  onChange={(e) => updateInstruction(order.id, e.target.value)}
                  placeholder="Add note for customer..."
                  className="flex-1 bg-bg-main border-none rounded-md px-3 py-2 text-text-primary focus:ring-1 focus:ring-accent outline-none"
                />
                <button className="text-primary-button hover:text-primary-hover p-2">
                  <Save size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. HERO SLIDER SETTINGS
const HeroManager = () => {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(null)

  React.useEffect(() => {
    const q = query(collection(db, 'hero_slides'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setSlides(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const openEdit = (slide = { title: '', subtitle: '', imageUrl: '' }) => {
    setCurrentSlide(slide)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'hero_slides', id))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = {
      title: currentSlide.title || '',
      subtitle: currentSlide.subtitle || '',
      imageUrl: currentSlide.imageUrl || '',
      updatedAt: serverTimestamp(),
    }

    if (currentSlide.id) {
      await setDoc(doc(db, 'hero_slides', currentSlide.id), payload, { merge: true })
    } else {
      await addDoc(collection(db, 'hero_slides'), {
        ...payload,
        createdAt: serverTimestamp(),
      })
    }

    setIsEditing(false)
    setCurrentSlide(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Hero Slider Configuration</h2>
      <div className="flex justify-between items-center">
        <div className="text-text-secondary">Slides</div>
        <button 
          onClick={() => openEdit()}
          className="bg-primary-button hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={18} /> Add Slide
        </button>
      </div>

      {isEditing && (
        <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-text-secondary">
            {currentSlide.id ? 'Edit Slide' : 'Add New Slide'}
          </h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Headline Text"
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentSlide.title}
              onChange={(e) => setCurrentSlide({ ...currentSlide, title: e.target.value })}
            />
            <input
              placeholder="Sub-headline"
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentSlide.subtitle}
              onChange={(e) => setCurrentSlide({ ...currentSlide, subtitle: e.target.value })}
            />
            <input
              placeholder="Image URL (Cloudinary or any link)"
              className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted md:col-span-2"
              value={currentSlide.imageUrl}
              onChange={(e) => setCurrentSlide({ ...currentSlide, imageUrl: e.target.value })}
            />
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary cursor-pointer">Cancel</button>
              <button type="submit" className="bg-primary-button text-white px-6 py-2 rounded-lg hover:bg-primary-hover cursor-pointer">Save Slide</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-text-secondary">Loading...</div>
        ) : slides.length === 0 ? (
          <div className="text-text-secondary">No hero slides yet.</div>
        ) : (
          slides.map((slide, index) => (
            <div key={slide.id} className="bg-bg-surface border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-1/3 aspect-video bg-bg-section rounded-lg flex items-center justify-center text-text-muted border border-dashed border-border overflow-hidden">
                {slide.imageUrl ? (
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto mb-2" />
                    <span className="text-xs">Preview: Slide {index + 1}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div>
                  <div className="text-lg font-bold text-text-primary">{slide.title}</div>
                  <div className="text-text-secondary">{slide.subtitle}</div>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-border">
                  <button onClick={() => openEdit(slide)} className="text-text-secondary hover:text-primary-button cursor-pointer">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(slide.id)} className="text-danger hover:text-red-700 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 4. TESTIMONIALS COMPONENT (NEW)
const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  React.useEffect(() => {
    const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setTestimonials(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })),
      )
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'testimonials', id))
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: currentTestimonial.name || '',
      text: currentTestimonial.text || '',
      rating: Number(currentTestimonial.rating || 5),
      updatedAt: serverTimestamp(),
    }

    if (currentTestimonial.id) {
      await setDoc(doc(db, 'testimonials', currentTestimonial.id), payload, { merge: true })
    } else {
      await addDoc(collection(db, 'testimonials'), {
        ...payload,
        createdAt: serverTimestamp(),
      })
    }

    setIsEditing(false);
    setCurrentTestimonial(null);
  };

  const openEdit = (testimonial = { name: '', text: '', rating: 5 }) => {
    setCurrentTestimonial(testimonial);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Testimonials</h2>
        <button 
          onClick={() => openEdit()}
          className="bg-primary-button hover:bg-primary-hover text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      {isEditing && (
        <div className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-text-secondary">
            {currentTestimonial.id ? 'Edit Review' : 'Add New Review'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Customer Name" 
                className="bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
                value={currentTestimonial.name}
                onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
              />
              <div className="flex items-center gap-2 bg-bg-main border border-border p-3 rounded-lg">
                <span className="text-text-secondary text-sm">Rating:</span>
                <input 
                  type="number" 
                  min="1" 
                  max="5"
                  className="bg-transparent outline-none text-text-primary font-bold w-12"
                  value={currentTestimonial.rating}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, rating: parseInt(e.target.value)})}
                />
                <Star size={16} className="text-accent fill-accent" />
              </div>
            </div>
            <textarea 
              placeholder="Review Text" 
              rows="3"
              className="w-full bg-bg-main border border-border p-3 rounded-lg focus:outline-none focus:border-primary-button text-text-primary placeholder-text-muted"
              value={currentTestimonial.text}
              onChange={(e) => setCurrentTestimonial({...currentTestimonial, text: e.target.value})}
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary cursor-pointer">Cancel</button>
              <button type="submit" className="bg-primary-button text-white px-6 py-2 rounded-lg hover:bg-primary-hover cursor-pointer">Save Review</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-text-secondary">Loading...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-text-secondary">No testimonials yet.</div>
        ) : testimonials.map((t) => (
          <div key={t.id} className="bg-bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-text-primary">{t.name}</h4>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={`${i < t.rating ? "text-accent fill-accent" : "text-border"}`} />
                  ))}
                </div>
              </div>
              <p className="text-text-secondary text-sm italic">"{t.text}"</p>
            </div>
            <div className="flex justify-end gap-3 mt-4 border-t border-border pt-3">
              <button onClick={() => openEdit(t)} className="text-text-secondary hover:text-primary-button cursor-pointer">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(t.id)} className="text-danger hover:text-red-700 cursor-pointer">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN LAYOUT COMPONENT ---

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/admin/login')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'products': return <ProductsManager />;
      case 'orders': return <OrdersManager />;
      case 'hero': return <HeroManager />;
      case 'testimonials': return <TestimonialsManager />; // Added case
      case 'promo': return <PromoManager />;
      default: return <ProductsManager />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-main font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-section border-r border-border flex flex-col fixed h-full">
        <div className="p-8">
          <h1 className="text-2xl font-serif font-bold text-text-primary ">The Prana Elixir</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem 
            icon={<Package size={20} />} 
            label="Products" 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')} 
          />
          <SidebarItem 
            icon={<ShoppingCart size={20} />} 
            label="Orders" 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')} 
          />
          <SidebarItem 
            icon={<ImageIcon size={20} />} 
            label="Hero Slider" 
            active={activeTab === 'hero'} 
            onClick={() => setActiveTab('hero')} 
          />
          {/* New Sidebar Item */}
          <SidebarItem 
            icon={<MessageSquareQuote size={20} />} 
            label="Testimonials" 
            active={activeTab === 'testimonials'} 
            onClick={() => setActiveTab('testimonials')} 
          />
          <SidebarItem 
            icon={<Tag size={20} />} 
            label="Promo" 
            active={activeTab === 'promo'} 
            onClick={() => setActiveTab('promo')} 
          />
        </nav>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-primary font-bold">A</div>
            <div>
              <p className="text-sm font-bold text-text-primary">Admin User</p>
              <button onClick={handleLogout} className="text-xs text-text-muted hover:text-danger cursor-pointer text-left">Logout</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Header Strip */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-serif text-text-primary">Dashboard</h2>
            <p className="text-text-secondary mt-1">Manage your store content</p>
          </div>
          <div className="bg-bg-surface border border-border rounded-full px-4 py-2 flex items-center gap-2 text-text-secondary w-64 shadow-sm">
            <Search size={18} className="text-text-muted" />
            <input placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full placeholder-text-muted text-text-primary" />
          </div>
        </header>

        {/* Dynamic Content */}
        {renderContent()}
      </main>
    </div>
  );
};

// Helper Component for Sidebar
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
      ${active 
        ? 'bg-primary-button text-white shadow-md' 
        : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
      }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

export default AdminDashboard;