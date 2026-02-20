import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../Elements/SEO';
import emailjs from '@emailjs/browser';
import { Send, Gift, CheckCircle, Package, Plus, X, ShoppingBag } from 'lucide-react';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';
import { db } from '../../firebase';
import { doc, onSnapshot, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useCart } from '../../context/useCart';
import { useToast } from '../../context/useToast';

const Custom = () => {
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'inquiry'
  const [combos, setCombos] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Builder State
  const [selectedCombo, setSelectedCombo] = useState(null); // Full combo object
  const [slots, setSlots] = useState({}); // { 0: product, 1: product, ... }
  const [showPicker, setShowPicker] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  
  // Cart
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    // 1. Fetch Combos
    const qCombos = query(collection(db, 'combos'), orderBy('price', 'asc'));
    const unsubCombos = onSnapshot(qCombos, (snap) => {
      setCombos(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(c => c.active));
    });

    // 2. Fetch Products
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('name'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchProducts();

    return () => unsubCombos();
  }, []);

  const handleSlotClick = (index) => {
    setActiveSlotIndex(index);
    setShowPicker(true);
  };

  const handleProductSelect = (product) => {
    setSlots(prev => ({ ...prev, [activeSlotIndex]: product }));
    setShowPicker(false);
  };

  const getFilteredProducts = () => {
    if (!selectedCombo) return [];
    
    const template = selectedCombo.template || 'all_core';

    // Logic Templates
    
    // 1. All Core: All slots must be Core Variant
    if (template === 'all_core') {
      return products.filter(p => p.category === 'Core Variant');
    }

    // 2. Signature Mix: Slots 0, 1 = Core; Slot 2 = Signature
    if (template === 'mixed') {
      if (activeSlotIndex === 0 || activeSlotIndex === 1) {
        return products.filter(p => p.category === 'Core Variant');
      }
      return products.filter(p => p.category === 'Signature Variant');
    }

    // 3. Gift Box: Slot 0 = Soap (Core or Signature)
    if (template === 'gift_box') {
       return products.filter(p => p.category === 'Core Variant' || p.category === 'Signature Variant');
    }

    return products;
  };

  const currentPrice = () => {
    if (!selectedCombo) return 0;
    
    // Dynamic price for Gift Box logic
    // If Gift Box template AND Slot 0 is Signature, add premium (e.g. +50)
    // We can assume base price covers Core, and if Signature selected, we add difference.
    // For now, let's keep it simple or stick to the requirement: "Gift Box price updates if you pick a Signature soap (+₹50)"
    if (selectedCombo.template === 'gift_box' && slots[0]) {
      if (slots[0].category === 'Signature Variant') {
        const base = selectedCombo.price;
        return base + 50; 
      }
    }

    return selectedCombo.price || 0;
  };

  const isComplete = () => {
    if (!selectedCombo) return false;
    const requiredSlots = selectedCombo.template === 'gift_box' ? 1 : 3;
    return Object.keys(slots).length === requiredSlots;
  };

  const handleAddToCart = async () => {
    if (!isComplete()) return;
    
    const itemTitle = `Custom Combo: ${selectedCombo.name}`;
    const itemPrice = currentPrice();
    const comboImage = slots[0]?.imageUrl || slots[0]?.image || "https://images.unsplash.com/photo-1628746766624-d2eew17d1216?q=80&w=1000"; 
    
    const itemsList = Object.values(slots).map(p => p.name).join(', ');

    const customProduct = {
      id: `combo-${Date.now()}`, 
      name: itemTitle,
      price: itemPrice,
      image: comboImage,
      category: 'Combo', 
      description: itemsList
    };

    await addItem(customProduct, 1);
    addToast('Combo added to cart!', 'success');
    
    setSlots({});
    setSelectedCombo(null);
  };

  const resetBuilder = () => {
    setSelectedCombo(null);
    setSlots({});
  };

  // Background colors for variety
  const BG_COLORS = ['bg-[#FDF6F0]', 'bg-[#F4F9F9]', 'bg-[#FFF8F8]', 'bg-blue-50', 'bg-purple-50'];

  return (
    <div className="bg-bg-main min-h-screen flex flex-col font-sans selection:bg-primary-button/20">
      <SEO 
        title="Custom Curations & Combos" 
        description="Curate your own bespoke wellness and skincare box. Build custom combos with our handcrafted organic soaps."
      />
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full py-20 bg-bg-surface border-b border-border/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-serif text-text-primary mb-6">
            Curate Your Experience
          </motion.h1>
          <div className="flex justify-center gap-6">
            <button 
              onClick={() => setActiveTab('builder')}
              className={`pb-2 text-xs font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'builder' ? 'text-primary-button border-primary-button' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
            >
              Build Your Box
            </button>
            <button 
               onClick={() => setActiveTab('inquiry')}
               className={`pb-2 text-xs font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'inquiry' ? 'text-primary-button border-primary-button' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
            >
               Bespoke Requests
            </button>
          </div>
        </div>
      </section>

      {/* --- CONTENT --- */}
      <div className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'builder' ? (
             <AnimatePresence mode="wait">
               {!selectedCombo ? (
                 <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? <div className="col-span-full text-center italic text-text-secondary">Loading bundles...</div> : 
                     combos.length === 0 ? <div className="col-span-full text-center italic text-text-secondary">No active combos at the moment.</div> :
                     combos.map((combo, idx) => (
                        <div key={combo.id} onClick={() => setSelectedCombo(combo)} className={`group cursor-pointer rounded-[2.5rem] p-8 border border-border/40 hover:shadow-xl transition-all duration-500 relative overflow-hidden ${BG_COLORS[idx % BG_COLORS.length]}`}>
                           <div className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Plus size={20} className="text-primary-button" />
                           </div>
                           <h3 className="text-2xl font-serif text-text-primary mb-2 mt-4">{combo.name}</h3>
                           <p className="text-3xl font-bold text-text-primary mb-6">₹{combo.price}<span className="text-sm font-normal text-text-secondary">+</span></p>
                           <p className="text-xs text-text-secondary uppercase tracking-widest leading-relaxed opacity-80">{combo.description || 'Custom Selection'}</p>
                        </div>
                    ))}
                 </motion.div>
               ) : (
                 <motion.div key="builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-12">
                    {/* LEFT: Builder Interface */}
                    <div className="flex-1 space-y-8">
                       <button onClick={resetBuilder} className="flex items-center gap-2 text-text-secondary hover:text-primary-button transition-colors text-xs font-bold uppercase tracking-widest mb-4">
                         <X size={14} /> Cancel Selection
                       </button>
                       
                       <div className="bg-white p-8 rounded-[2.5rem] border border-border/40 shadow-lg relative">
                          <h2 className="font-serif text-3xl text-text-primary mb-2">{selectedCombo.name}</h2>
                          <p className="text-text-secondary text-sm mb-8">Tap a slot to fill it with your choice.</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {Array.from({ length: selectedCombo.template === 'gift_box' ? 1 : 3 }).map((_, idx) => (
                               <div 
                                 key={idx} 
                                 onClick={() => handleSlotClick(idx)}
                                 className={`aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${slots[idx] ? 'border-primary-button bg-primary-button/5' : 'border-border hover:border-text-secondary hover:bg-bg-surface'}`}
                               >
                                  {slots[idx] ? (
                                    <>
                                      <img src={slots[idx].imageUrl} className="w-20 h-20 object-cover rounded-full mb-4 shadow-md" />
                                      <p className="text-xs font-bold text-text-primary text-center px-2">{slots[idx].name}</p>
                                      <p className="text-[9px] uppercase text-text-secondary mt-1 tracking-widest">{slots[idx].category}</p>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-12 h-12 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary mb-3"><Plus size={20} /></div>
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Select Soap</p>
                                    </>
                                  )}
                               </div>
                             ))}
                             {/* Fixed items visualization for Gift Box */}
                             {selectedCombo.template === 'gift_box' && (
                               <div className="col-span-1 md:col-span-2 aspect-video bg-bg-surface/50 rounded-2xl flex items-center justify-center border border-border/20">
                                  <div className="text-center">
                                    <Gift className="mx-auto text-primary-button mb-3 opacity-50" size={32} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Standard Inclusions</p>
                                    <p className="text-xs text-text-primary mt-1">Bath Salt • Body Wax • Loofah</p>
                                  </div>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* RIGHT: Summary */}
                    <div className="lg:w-96">
                       <div className="bg-bg-surface p-8 rounded-[2.5rem] border border-border/20 sticky top-32">
                          <h3 className="font-serif text-xl text-text-primary mb-6">Summary</h3>
                          
                          <div className="space-y-4 mb-8">
                             {Object.entries(slots).map(([idx, prod]) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                   <span className="text-text-secondary">{prod.name}</span>
                                   {prod.category === 'Signature Variant' && <span className="text-[9px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">SIG</span>}
                                </div>
                             ))}
                             {Object.keys(slots).length === 0 && <p className="text-text-secondary italic text-sm">Your box is empty.</p>}
                          </div>
                          
                          <div className="border-t border-border/10 pt-6 flex justify-between items-center mb-8">
                             <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Total Price</span>
                             <span className="text-2xl font-serif text-text-primary">₹{currentPrice()}</span>
                          </div>
                          
                          <button 
                            disabled={!isComplete()}
                            onClick={handleAddToCart}
                            className="w-full bg-text-primary text-white py-4 rounded-full flex items-center justify-center gap-3 shadow-xl hover:bg-primary-button transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                          >
                            <ShoppingBag size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Add to Cart</span>
                          </button>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          ) : (
            <BespokeForm />
          )}
        </div>
      </div>

      {/* Product Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPicker(false)} className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-serif text-2xl text-text-primary">Select Item</h3>
                 <button onClick={() => setShowPicker(false)} className="p-2 hover:bg-bg-surface rounded-full"><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 custom-scrollbar">
                {getFilteredProducts().map(p => (
                   <div key={p.id} onClick={() => handleProductSelect(p)} className="cursor-pointer group">
                      <div className="aspect-[3/4] bg-bg-surface rounded-2xl overflow-hidden mb-3 relative">
                         <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                         {p.category.includes('Signature') && <span className="absolute top-2 left-2 bg-text-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Signature</span>}
                      </div>
                      <h4 className="text-sm font-bold text-text-primary text-center leading-tight">{p.name}</h4>
                   </div>
                ))}
                {getFilteredProducts().length === 0 && (
                   <div className="col-span-3 text-center py-10 text-text-secondary italic">No products available for this slot.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

const BespokeForm = () => {
    const form = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
  
    const sendEmail = (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      emailjs.sendForm('service_z3jofzy', 'template_u18wde6', form.current, '64vnB1DuhI2UDC7ZX')
      .then(() => { setIsSent(true); setIsSubmitting(false); }, 
      (error) => { console.log(error.text); setIsSubmitting(false); alert("Something went wrong."); });
    };

    return !isSent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-lg border border-border/20">
            <h2 className="text-3xl font-serif text-text-primary mb-2">Inquiry Form</h2>
            <p className="text-text-secondary text-sm mb-8">For weddings, corporate gifts, and bulk orders.</p>
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Name</label><input name="user_name" required className="w-full border-b border-border/40 py-2 outline-none bg-transparent" /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Email</label><input name="user_email" required type="email" className="w-full border-b border-border/40 py-2 outline-none bg-transparent" /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest">Message</label><textarea name="message" rows="4" className="w-full border-b border-border/40 py-2 outline-none bg-transparent resize-none" /></div>
                <button disabled={isSubmitting} className="w-full bg-text-primary text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary-button disabled:opacity-50">{isSubmitting ? "Sending..." : "Submit Inquiry"}</button>
            </form>
        </motion.div>
    ) : (
        <div className="text-center py-20"><h3 className="text-2xl font-serif text-text-primary">Request Sent</h3><p className="text-text-secondary mt-2">We will contact you shortly.</p></div>
    );
};

export default Custom;