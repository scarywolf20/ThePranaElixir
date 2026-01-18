import React, { useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '../../context/useAuth';
import { updateProfile } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

// --- MOCK DATA ---
const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
};

// --- SUB-COMPONENTS ---

// 1. EDIT PROFILE TAB
const ProfileTab = ({ user, onSave, saving }) => {
  const [localUser, setLocalUser] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setLocalUser(user)
  }, [user])

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="relative">
          <img 
            src={localUser.avatar} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-bg-surface shadow-md" 
          />
          <button className="absolute bottom-0 right-0 bg-primary-button text-white p-2 rounded-full hover:bg-primary-hover shadow-sm cursor-pointer">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-serif text-text-primary">{localUser.name}</h2>
          <p className="text-text-secondary">{localUser.email}</p>
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
        
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSave(localUser)
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">Full Name</label>
            <input 
              disabled={!isEditing}
              value={localUser.name}
              onChange={(e) => setLocalUser({...localUser, name: e.target.value})}
              className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary disabled:opacity-60 focus:outline-none focus:border-primary-button"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">Email Address</label>
            <input 
              disabled={!isEditing}
              value={localUser.email}
              onChange={(e) => setLocalUser({...localUser, email: e.target.value})}
              className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary disabled:opacity-60 focus:outline-none focus:border-primary-button"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">Phone Number</label>
            <input 
              disabled={!isEditing}
              value={localUser.phone}
              onChange={(e) => setLocalUser({...localUser, phone: e.target.value})}
              className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary disabled:opacity-60 focus:outline-none focus:border-primary-button"
            />
          </div>
          
          {isEditing && (
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-button text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

// 2. ORDERS TAB
const OrdersTab = ({ orders, loading }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-text-primary mb-6">Order History</h3>
      {loading ? (
        <div className="text-text-secondary">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-text-secondary">No orders yet.</div>
      ) : (
        orders.map((order) => (
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
        ))
      )}
    </div>
  );
};

// 3. ADDRESS TAB
const AddressTab = ({ addresses, onAdd, onRemove, saving }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif text-text-primary">Saved Addresses</h3>
        <button
          onClick={onAdd}
          disabled={saving}
          className="text-primary-button text-sm font-bold uppercase hover:underline cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          + Add New
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <div className="text-text-secondary">No addresses saved yet.</div>
        ) : (
          addresses.map((addr) => (
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
              <button
                onClick={() => onRemove(addr.id)}
                disabled={saving}
                className="text-danger hover:text-red-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const [profileDoc, setProfileDoc] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressForm, setAddressForm] = useState({ type: 'Home', text: '' })

  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)

  const profileUser = useMemo(() => {
    if (!user) return mockUser
    return {
      ...mockUser,
      name: profileDoc?.name || user.displayName || mockUser.name,
      email: profileDoc?.email || user.email || mockUser.email,
      phone: profileDoc?.phone || mockUser.phone,
      avatar: profileDoc?.avatarUrl || mockUser.avatar,
    }
  }, [user, profileDoc]);

  const handleSaveProfile = async (nextUser) => {
    if (!user) return
    setSaving(true)
    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          name: nextUser.name,
          email: nextUser.email,
          phone: nextUser.phone,
          avatarUrl: nextUser.avatar,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      if (nextUser.name && nextUser.name !== user.displayName) {
        await updateProfile(user, { displayName: nextUser.name })
      }

      setProfileDoc((prev) => ({
        ...(prev || {}),
        name: nextUser.name,
        email: nextUser.email,
        phone: nextUser.phone,
        avatarUrl: nextUser.avatar,
      }))
    } finally {
      setSaving(false)
    }
  }

  const openAddressModal = () => {
    setAddressForm({ type: 'Home', text: '' })
    setShowAddressModal(true)
  }

  const closeAddressModal = () => {
    setShowAddressModal(false)
  }

  const handleCreateAddress = async (e) => {
    e.preventDefault()
    if (!user) return
    if (!addressForm.text.trim()) return

    setSaving(true)
    try {
      const ref = await addDoc(collection(db, 'users', user.uid, 'addresses'), {
        type: addressForm.type,
        text: addressForm.text.trim(),
        createdAt: serverTimestamp(),
      })
      setAddresses((prev) => [
        ...prev,
        { id: ref.id, type: addressForm.type, text: addressForm.text.trim() },
      ])
      closeAddressModal()
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveAddress = async (addressId) => {
    if (!user) return
    setSaving(true)
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', addressId))
      setAddresses((prev) => prev.filter((a) => a.id !== addressId))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      navigate('/customer/login')
    }
  }, [loading, user, navigate])

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoadingData(true)
      try {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        setProfileDoc(userSnap.exists() ? userSnap.data() : null)

        const addressesSnap = await getDocs(collection(db, 'users', user.uid, 'addresses'))
        setAddresses(
          addressesSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        )

        const wishlistSnap = await getDocs(collection(db, 'users', user.uid, 'wishlist'))
        setWishlist(
          wishlistSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        )

        const ordersQ = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20),
        )
        const ordersSnap = await getDocs(ordersQ)
        setOrders(
          ordersSnap.docs.map((d) => {
            const data = d.data()
            return {
              id: data.orderNumber || `#${d.id.slice(0, 8).toUpperCase()}`,
              date: data.createdAt?.toDate?.()?.toLocaleDateString?.() || '',
              total: data.total || 0,
              status: data.status || 'Processing',
              items: (data.items || []).map((it) => it.title || it.name || it.productId).filter(Boolean),
            }
          }),
        )
      } finally {
        setLoadingData(false)
      }
    }

    load()
  }, [user])

  const handleLogout = async () => {
    await logout();
    navigate('/customer/login');
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
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-serif text-text-primary">
            My Account
          </h1>
          <p className="text-text-secondary mt-2">
            {profileUser.name} • {profileUser.email}
          </p>
        </div>

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
            {activeTab === 'profile' && (
              <ProfileTab user={profileUser} onSave={handleSaveProfile} saving={saving} />
            )}
            {activeTab === 'orders' && (
              <OrdersTab orders={orders} loading={loadingData} />
            )}
            {activeTab === 'addresses' && (
              <AddressTab
                addresses={addresses}
                onAdd={openAddressModal}
                onRemove={handleRemoveAddress}
                saving={saving}
              />
            )}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-text-primary">Wishlist</h3>
                {loadingData ? (
                  <div className="text-text-secondary">Loading wishlist...</div>
                ) : wishlist.length === 0 ? (
                  <div className="text-text-secondary">Your wishlist is empty.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlist.map((w) => (
                      <div
                        key={w.id}
                        className="bg-bg-surface border border-border p-6 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-text-primary">
                            {w.title || w.name || w.productId || w.id}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {w.productId ? `Product: ${w.productId}` : ''}
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!user) return
                            setSaving(true)
                            try {
                              await deleteDoc(doc(db, 'users', user.uid, 'wishlist', w.id))
                              setWishlist((prev) => prev.filter((x) => x.id !== w.id))
                            } finally {
                              setSaving(false)
                            }
                          }}
                          disabled={saving}
                          className="text-danger hover:text-red-700 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>

        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={closeAddressModal}
            aria-label="Close"
          />
          <div className="relative w-full max-w-lg bg-bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-primary uppercase tracking-wider">Add Address</h3>
              <button
                onClick={closeAddressModal}
                className="text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Type</label>
                <select
                  value={addressForm.type}
                  onChange={(e) => setAddressForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary-button cursor-pointer"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Address</label>
                <textarea
                  value={addressForm.text}
                  onChange={(e) => setAddressForm((p) => ({ ...p, text: e.target.value }))}
                  rows={4}
                  className="w-full bg-bg-main border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary-button"
                  placeholder="House no, street, city, pincode"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-5 py-2 rounded-lg border border-border text-text-primary hover:bg-bg-main transition-colors cursor-pointer"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary-button text-white hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;