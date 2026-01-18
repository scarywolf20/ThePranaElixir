import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Image as ImageIcon, 
  MessageSquareQuote, // New Icon
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

// --- MOCK DATA ---
const initialProducts = [
  { id: 1, name: "Ceramic Vase", price: 45.00, stock: 12, category: "Decor" },
  { id: 2, name: "Linen Tablecloth", price: 80.00, stock: 5, category: "Kitchen" },
  { id: 3, name: "Wooden Bowl", price: 25.00, stock: 20, category: "Kitchen" },
];

const initialOrders = [
  { id: 101, customer: "Alice Brown", total: 125.00, status: "Pending", instruction: "" },
  { id: 102, customer: "Mark Wilson", total: 45.00, status: "Shipped", instruction: "Leave at door" },
];

const initialHeroSlides = [
  { id: 1, title: "Summer Collection", subtitle: "Earthy tones for your home", image: "url_to_image_1" },
  { id: 2, title: "Handcrafted Pottery", subtitle: "Made with love", image: "url_to_image_2" },
];

const initialTestimonials = [
  { id: 1, name: "Sarah Jenkins", text: "The ceramic vase is absolutely stunning. The earthy texture fits my home perfectly.", rating: 5 },
  { id: 2, name: "Michael Ross", text: "Fast shipping and great packaging, but the color was slightly lighter than expected.", rating: 4 },
];

// --- COMPONENTS ---

// 1. PRODUCTS COMPONENT
const ProductsManager = () => {
  const [products, setProducts] = useState(initialProducts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentProduct.id) {
      setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
    } else {
      setProducts([...products, { ...currentProduct, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const openEdit = (product = { name: '', price: '', stock: '', category: '' }) => {
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
            {products.map((product) => (
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
  const [slides, setSlides] = useState(initialHeroSlides);

  const handleUpdate = (id, field, value) => {
    setSlides(slides.map(slide => slide.id === id ? { ...slide, [field]: value } : slide));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Hero Slider Configuration</h2>
      <div className="grid grid-cols-1 gap-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-bg-surface border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3 aspect-video bg-bg-section rounded-lg flex items-center justify-center text-text-muted border border-dashed border-border">
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2" />
                <span className="text-xs">Preview: Slide {index + 1}</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Headline Text</label>
                <input 
                  value={slide.title}
                  onChange={(e) => handleUpdate(slide.id, 'title', e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary-button outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Sub-headline</label>
                <input 
                  value={slide.subtitle}
                  onChange={(e) => handleUpdate(slide.id, 'subtitle', e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-2 text-text-primary focus:border-primary-button outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input 
                    value={slide.image}
                    onChange={(e) => handleUpdate(slide.id, 'image', e.target.value)}
                    className="flex-1 bg-bg-main border border-border rounded-lg px-4 py-2 text-text-muted text-sm focus:border-primary-button outline-none"
                  />
                  <button className="bg-primary-button text-white px-4 rounded-lg text-sm hover:bg-primary-hover cursor-pointer">Update</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. TESTIMONIALS COMPONENT (NEW)
const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);

  const handleDelete = (id) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentTestimonial.id) {
      setTestimonials(testimonials.map(t => t.id === currentTestimonial.id ? currentTestimonial : t));
    } else {
      setTestimonials([...testimonials, { ...currentTestimonial, id: Date.now() }]);
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
        {testimonials.map((t) => (
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