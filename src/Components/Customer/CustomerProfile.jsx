import React, { useEffect, useMemo, useState } from 'react';
import { 
  User, Package, MapPin, Heart, LogOut, Camera, Save, X, ChevronRight, Trash2, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Pages/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { updateProfile } from 'firebase/auth';
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs,
  limit, orderBy, query, serverTimestamp, setDoc, where
} from 'firebase/firestore';
import { db } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- UTILS ---
const getInitials = (name, email) => {
  const safeName = typeof name === 'string' ? name.trim() : '';
  if (safeName) {
    return safeName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const safeEmail = typeof email === 'string' ? email.trim() : '';
  if (safeEmail) {
    const localPart = safeEmail.split('@')[0] || '';
    return localPart.toUpperCase().slice(0, 2) || 'U';
  }

  return 'U';
};

// --- SUB-COMPONENTS ---

const ProfileTab = ({ user, onSave, saving, onAvatarUpload }) => {
  const [localUser, setLocalUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarUpload) {
      await onAvatarUpload(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-bg-surface/30 rounded-3xl border border-border/50">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full bg-primary-button flex items-center justify-center text-white text-3xl font-serif border-4 border-white shadow-xl">
            {getInitials(user.name, user.email)}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-white text-text-primary p-2 rounded-full shadow-lg hover:bg-primary-button hover:text-white transition-all cursor-pointer"
          >
            <Camera size={16} />
          </button>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-serif text-text-primary">{user.name}</h2>
          <p className="text-text-secondary tracking-widest text-sm uppercase mt-1">{user.email}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-border/60 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.2em]">Account Settings</h3>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="text-primary-button text-xs font-bold uppercase tracking-widest hover:underline"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(localUser); setIsEditing(false); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['name', 'email', 'phone'].map((field) => (
            <div key={field} className="space-y-3">
              <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest">
                {field === 'name' ? 'Full Name' : field === 'email' ? 'Email' : 'Phone'}
              </label>
              <input 
                disabled={!isEditing || field === 'email'}
                value={localUser[field] || ''}
                onChange={(e) => setLocalUser({...localUser, [field]: e.target.value})}
                className="w-full bg-bg-main/50 border-b border-border py-2 text-text-primary focus:border-primary-button transition-colors outline-none disabled:opacity-50"
              />
            </div>
          ))}
          <AnimatePresence>
            {isEditing && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="md:col-span-2 flex justify-end"
              >
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="bg-text-primary text-white px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-button transition-all disabled:opacity-50"
                >
                  {saving ? 'Processing...' : 'Save Changes'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
};

const OrdersTab = ({ orders, loading }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.2em] mb-8">Order History</h3>
    {loading ? (
      <div className="py-10 text-center text-text-secondary italic">Loading your treasures...</div>
    ) : orders.length === 0 ? (
      <div className="py-20 text-center bg-bg-surface/20 rounded-3xl border border-dashed border-border">
        <Package className="mx-auto text-border mb-4" size={40} />
        <p className="text-text-secondary italic">Your order history is currently empty.</p>
      </div>
    ) : (
      orders.map((order) => (
        <div key={order.id} className="group bg-white border border-border/60 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-border/30 pb-4">
            <div>
              <span className="font-serif text-xl text-text-primary">{order.id}</span>
              <p className="text-text-secondary text-xs uppercase tracking-tighter mt-1">{order.date}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                order.status === 'Processing' ? 'bg-yellow-50 text-yellow-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                {order.status}
              </span>
              <span className="font-bold text-text-primary">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-text-secondary uppercase tracking-wide truncate max-w-md">
              {order.items.join(" • ")}
            </p>
            <button className="text-text-primary group-hover:text-primary-button transition-colors">
              <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      ))
    )}
  </motion.div>
);

const AddressesTab = ({ addresses, onAdd, onRemove, loading }) => {
  const [showModal, setShowModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine: '',
    city: '',
    postalCode: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd(addressForm);
    setAddressForm({
      type: 'Home',
      firstName: '',
      lastName: '',
      phone: '',
      addressLine: '',
      city: '',
      postalCode: ''
    });
    setShowModal(false);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.2em]">Saved Addresses</h3>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-text-primary text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary-button transition-all flex items-center gap-2"
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-text-secondary italic">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="py-20 text-center bg-bg-surface/20 rounded-3xl border border-dashed border-border">
            <MapPin className="mx-auto text-border mb-4" size={40} />
            <p className="text-text-secondary italic">No saved addresses yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map(addr => (
              <div key={addr.id} className="bg-white border border-border p-8 rounded-[2rem] flex flex-col justify-between min-h-[12rem] hover:shadow-lg transition-shadow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-button mb-2 block">
                    {addr.type}
                  </span>
                  <p className="text-text-primary font-serif text-lg mb-2">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {addr.addressLine}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {addr.city}, {addr.postalCode}
                  </p>
                  <p className="text-text-secondary text-sm mt-1">
                    {addr.phone}
                  </p>
                </div>
                <button 
                  onClick={() => onRemove(addr.id)} 
                  className="text-red-400 hover:text-red-600 self-end mt-4"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Address Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-text-primary">Add New Address</h3>
                <button onClick={() => setShowModal(false)} className="text-text-secondary hover:text-text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                    Address Type
                  </label>
                  <select
                    value={addressForm.type}
                    onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                    className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                  >
                    <option>Home</option>
                    <option>Work</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                      First Name
                    </label>
                    <input
                      required
                      value={addressForm.firstName}
                      onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                      className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                      Last Name
                    </label>
                    <input
                      required
                      value={addressForm.lastName}
                      onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                      className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                    Address Line
                  </label>
                  <input
                    required
                    value={addressForm.addressLine}
                    onChange={(e) => setAddressForm({...addressForm, addressLine: e.target.value})}
                    className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                      City
                    </label>
                    <input
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest block mb-2">
                      Postal Code
                    </label>
                    <input
                      required
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                      className="w-full bg-bg-main/50 border border-border rounded-lg py-3 px-4 text-text-primary focus:border-primary-button transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-border text-text-primary px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-bg-main transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-text-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary-button transition-all"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const WishlistTab = ({ wishlist, loading, onRemove }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <h3 className="text-xs font-bold text-text-primary uppercase tracking-[0.2em] mb-8">My Wishlist</h3>
    {loading ? (
      <div className="py-10 text-center text-text-secondary italic">Loading your treasures...</div>
    ) : wishlist.length === 0 ? (
      <div className="py-20 text-center bg-bg-surface/20 rounded-3xl border border-dashed border-border">
        <Heart className="mx-auto text-border mb-4" size={40} />
        <p className="text-text-secondary italic">Your wishlist is empty.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="group bg-white border border-border/60 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500">
            <div className="aspect-square bg-bg-surface/30 relative overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                  No Image
                </div>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-400 p-2 rounded-full hover:text-red-600 hover:bg-white transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-4">
              <h4 className="font-serif text-lg text-text-primary mb-1">{item.name}</h4>
              <p className="text-text-secondary text-sm mb-2">{item.category}</p>
              <p className="font-bold text-text-primary">Rs. {item.price?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

// --- MAIN PAGE ---

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [profileDoc, setProfileDoc] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const profileUser = useMemo(() => {
    if (!user) return { name: "Guest", email: "", phone: "", avatar: null };
    return {
      name: profileDoc?.name || user.displayName || "User",
      email: profileDoc?.email || user.email,
      phone: profileDoc?.phone || "",
      avatar: profileDoc?.avatarUrl || user.photoURL || null,
    }
  }, [user, profileDoc]);

  // Profile Save Handler
  const handleSaveProfile = async (nextUser) => {
    if (!user) return;
    setSaving(true);
    try {
      const updateData = {
        name: nextUser.name,
        phone: nextUser.phone,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'users', user.uid), updateData, { merge: true });
      
      if (nextUser.name !== user.displayName) {
        await updateProfile(user, { displayName: nextUser.name });
      }
      
      setProfileDoc(prev => ({ ...prev, ...updateData }));
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Avatar Upload Handler
  const handleAvatarUpload = async (file) => {
    if (!user) return;
    setSaving(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uid}/${Date.now()}_${file.name}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await setDoc(doc(db, 'users', user.uid), {
        avatarUrl: downloadURL,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      await updateProfile(user, { photoURL: downloadURL });
      
      setProfileDoc(prev => ({ ...prev, avatarUrl: downloadURL }));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Address Handlers
  const handleAddAddress = async (addressData) => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'addresses'), {
        ...addressData,
        createdAt: serverTimestamp()
      });
      
      setAddresses(prev => [...prev, { id: docRef.id, ...addressData }]);
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAddress = async (id) => {
    if (!user) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error removing address:', error);
      alert('Failed to remove address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Wishlist Handler
  const handleRemoveFromWishlist = async (productId) => {
    if (!user) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId));
      setWishlist(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/customer/login');
    }
  }, [loading, user, navigate]);
  
  // Fetch all user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoadingData(true);
      
      try {
        // Fetch user profile
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setProfileDoc(userSnap.data());
        }

        // Fetch addresses
        const addressesSnap = await getDocs(collection(db, 'users', user.uid, 'addresses'));
        setAddresses(addressesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch wishlist
        const wishlistSnap = await getDocs(collection(db, 'users', user.uid, 'wishlist'));
        setWishlist(wishlistSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const ordersSnap = await getDocs(ordersQuery);
        
        setOrders(ordersSnap.docs.map(d => {
          const data = d.data();
          return {
            id: data.orderNumber || `#${d.id.slice(0, 6).toUpperCase()}`,
            date: data.createdAt?.toDate().toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) || 'N/A',
            total: data.total || 0,
            status: data.status || 'Processing',
            items: (data.items || []).map(i => i.name || 'Item')
          };
        }));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center font-serif text-xl tracking-widest animate-pulse">
        The Prana Elixir...
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: 'Identity', icon: <User size={18} /> },
    { id: 'orders', label: 'History', icon: <Package size={18} /> },
    { id: 'addresses', label: 'Address', icon: <MapPin size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary-button/10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary">My Profile</h1>
          <p className="text-text-secondary mt-3 tracking-[0.2em] text-xs uppercase font-bold">
            Welcome back, {profileUser.name}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-4 shadow-xl">
              <nav className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                      ${activeTab === item.id 
                        ? 'bg-text-primary text-white shadow-lg' 
                        : 'text-text-secondary hover:bg-white hover:text-text-primary'
                      }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
                <button 
                  onClick={async () => { 
                    await logout(); 
                    navigate('/customer/login'); 
                  }}
                  className="flex items-center gap-4 px-6 py-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-full transition-all mt-6"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </nav>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'profile' && (
                  <ProfileTab 
                    user={profileUser} 
                    onSave={handleSaveProfile} 
                    onAvatarUpload={handleAvatarUpload}
                    saving={saving} 
                  />
                )}
                
                {activeTab === 'orders' && (
                  <OrdersTab orders={orders} loading={loadingData} />
                )}
                
                {activeTab === 'addresses' && (
                  <AddressesTab 
                    addresses={addresses} 
                    onAdd={handleAddAddress}
                    onRemove={handleRemoveAddress}
                    loading={loadingData}
                  />
                )}
                
                {activeTab === 'wishlist' && (
                  <WishlistTab 
                    wishlist={wishlist} 
                    loading={loadingData}
                    onRemove={handleRemoveFromWishlist}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;