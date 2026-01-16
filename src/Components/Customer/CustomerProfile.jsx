import React, { useState } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  Camera, 
  Save,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import Navbar from '../Pages/Navbar';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
};

const mockOrders = [
  { id: "#ORD-7782", date: "Jan 15, 2026", total: 1200, status: "Delivered", items: ["Ceramic Vase", "Scented Candle"] },
  { id: "#ORD-9921", date: "Jan 10, 2026", total: 850, status: "Shipped", items: ["Linen Tablecloth"] },
  { id: "#ORD-1102", date: "Dec 28, 2025", total: 2400, status: "Processing", items: ["Wooden Bowl Set", "Postcards"] },
];

const mockAddresses = [
  { id: 1, type: "Home", text: "123, Earthy Lane, Green Valley, Pune - 411001" },
  { id: 2, type: "Work", text: "Tech Park, Building B, Mumbai - 400001" },
];

// --- SUB-COMPONENTS ---

// 1. EDIT PROFILE TAB
const ProfileTab = () => {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-bg-surface shadow-md" 
          />
          <button className="absolute bottom-0 right-0 bg-primary-button text-white p-2 rounded-full hover:bg-primary-hover shadow-sm cursor-pointer">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-serif text-text-primary">{user.name}</h2>
          <p className="text-text-secondary">{user.email}</p>
        </div>
      </div>

      <div className="bg-bg-surface p-8 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">Personal Details</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="text-primary-button hover:underline text-sm font-medium cursor-pointer"
          >
            {isEditing ? 'Cancel' : 'Edit Details'}
          </button>
        </div>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">Full Name</label>
            <input 
              disabled={!isEditing}
              value={user.name}
              onChange={(e) => setUser({...user, name: e.target.value})}
              className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary disabled:opacity-60 focus:outline-none focus:border-primary-button"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">Email Address</label>
            <input 
              disabled={!isEditing}
              value={user.email}
              onChange={(e) => setUser({...user, email: e.target.value})}
              className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary disabled:opacity-60 focus:outline-none focus:border-primary-button"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">Phone Number</label>
            <input 
              disabled={!isEditing}
              value={user.phone}
              onChange={(e) => setUser({...user, phone: e.target.value})}
              className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary disabled:opacity-60 focus:outline-none focus:border-primary-button"
            />
          </div>
          
          {isEditing && (
            <div className="md:col-span-2 flex justify-end">
              <button className="bg-primary-button text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm cursor-pointer">
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// 2. ORDERS TAB
const OrdersTab = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-text-primary mb-6">Order History</h3>
      {mockOrders.map((order) => (
        <div key={order.id} className="bg-bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-border pb-4">
            <div>
              <span className="font-bold text-text-primary text-lg">{order.id}</span>
              <p className="text-text-secondary text-sm">{order.date}</p>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${order.status === 'Delivered' ? 'bg-success/20 text-success' : 
                  order.status === 'Shipped' ? 'bg-warning/20 text-warning' : 'bg-text-muted/20 text-text-muted'}`}>
                {order.status}
              </span>
              <span className="font-bold text-text-primary ml-4">Rs. {order.total}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-secondary">
              <span className="font-bold">Items:</span> {order.items.join(", ")}
            </p>
            <button className="text-primary-button hover:text-primary-hover text-sm font-medium border border-primary-button px-4 py-2 rounded-lg hover:bg-primary-button hover:text-white transition-all cursor-pointer">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. ADDRESS TAB
const AddressTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif text-text-primary">Saved Addresses</h3>
        <button className="text-primary-button text-sm font-bold uppercase hover:underline cursor-pointer">+ Add New</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAddresses.map((addr) => (
          <div key={addr.id} className="bg-bg-surface border border-border p-6 rounded-xl flex flex-col justify-between h-40">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-primary-button" />
                <span className="font-bold text-text-primary">{addr.type}</span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{addr.text}</p>
            </div>
            <div className="flex gap-4 mt-4 text-sm font-medium">
              <button className="text-text-primary hover:text-primary-button cursor-pointer">Edit</button>
              <button className="text-danger hover:text-red-700 cursor-pointer">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session logic here
    navigate('/customer/login'); // Redirect to login
  };

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={20} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-bg-main">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif text-text-primary mb-8 text-center md:text-left">
          My Account
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
              <nav className="flex flex-col">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-6 py-4 text-left transition-colors cursor-pointer border-b border-border/50 last:border-0
                      ${activeTab === item.id 
                        ? 'bg-primary-button text-white font-medium' 
                        : 'text-text-secondary hover:bg-bg-main hover:text-text-primary'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-left text-danger hover:bg-red-50 transition-colors cursor-pointer border-t border-border"
                >
                  <LogOut size={20} />
                  Log Out
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-white/50 backdrop-blur-sm rounded-xl border border-border p-6 md:p-8 min-h-[500px]">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'addresses' && <AddressTab />}
            {activeTab === 'wishlist' && (
              <div className="text-center py-20">
                <Heart size={48} className="mx-auto text-text-muted mb-4" />
                <h3 className="text-xl text-text-primary">Your wishlist is empty</h3>
                <p className="text-text-secondary mt-2">Save items you love to view them here.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;