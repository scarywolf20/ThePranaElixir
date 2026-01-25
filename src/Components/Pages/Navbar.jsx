import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { FaCartShopping, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import CartDrawer from "../Elements/CartDrawer";
import logo from "../../assets/logo.svg";
import { useAuth } from '../../context/useAuth';
import { useCart } from '../../context/useCart';
import { usePromo } from '../../context/usePromo';

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const activeTab = location.pathname;
  const { user } = useAuth();
  const { totalQuantity } = useCart();
  const { promoText } = usePromo();

  const navLinks = [
    { name: 'home', id: '/' },
    { name: 'story', id: '/story' },
    { name: 'shop', id: '/shop', hasDropdown: true },
    { name: 'custom orders', id: '/custom' },
    // { name: 'connect', id: '/contact' },
  ];

  return (
    <>
      {/* 1. Promo Bar - Uses your brand brown */}
      {promoText ? (
        <div className="w-full bg-[#5D4037] text-white py-2 text-center text-[10px] tracking-[0.2em] uppercase">
          {promoText}
        </div>
      ) : null}

      {/* 2. Sticky Navbar - Uses your Surface color */}
      <nav className="w-full bg-bg-surface sticky top-0 z-[100] border-b border-border/10 shadow-sm">
        <div className="w-full px-4 md:px-10 py-4 flex items-center justify-between">
          
          {/* LOGO SECTION */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-10 md:h-14 w-auto" />
              <div className="flex flex-col">
                <span className="text-lg md:text-3xl tracking-[0.15em]  uppercase text-text-primary leading-none font-serif">
                  The Prana Elixir
                </span>
                <span className="text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-text-secondary mt-1 font-medium">
                  Pure Vitality in Every Drop
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* DESKTOP LINKS - Uses text-text-primary/secondary */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li 
                  key={link.id} 
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setIsShopOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setIsShopOpen(false)}
                >
                  <Link
                    to={link.id}
                    className={`text-[15px] tracking-[0.15em] uppercase font-semibold py-2 transition-colors 
                      ${activeTab === link.id ? 'text-text-primary' : 'text-text-secondary hover:text-primary-button'}`}
                  >
                    {link.name}
                  </Link>
                  {activeTab === link.id && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-text-primary" />
                  )}
                  
                  <AnimatePresence>
                    {link.hasDropdown && isShopOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }} 
                        className="absolute top-full right-0 mt-2 w-56 bg-bg-surface shadow-xl border border-border/20 py-4 z-[110]"
                      >
                        {['Soaps', 'Candles', 'Wax Tablets', 'Gift Boxes'].map((item) => (
                          <Link key={item} to="/shop" className="block px-6 py-2 text-sm text-text-primary hover:bg-bg-section hover:text-primary-button transition-colors">
                            {item}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>

            {/* ICONS - Using text-text-primary */}
            <div className="flex items-center gap-3 border-l border-border/20 pl-4">
              <Link
                to={user ? "/customer/profile" : "/customer/login"}
                className="p-2 hover:text-primary-button transition-colors"
                title={user ? "My Profile" : "Login"}
              >
                <FaUser className="text-xl text-text-primary" />
              </Link>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:text-primary-button transition-colors">
                <FaCartShopping className="text-xl text-text-primary" />
                <span className="absolute top-0 right-0 bg-primary-button text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalQuantity}
                </span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-2xl text-text-primary">
                <FaBars />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU - Colored specifically for your brand */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-0 bg-bg-surface z-[200] flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xs tracking-[0.3em] font-bold uppercase text-text-secondary opacity-60">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-3xl text-text-primary p-2"><FaTimes /></button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <div key={link.id} className="flex flex-col border-b border-border/10 pb-4">
                    <div className="flex justify-between items-center">
                      <Link 
                        to={link.id} 
                        onClick={() => !link.hasDropdown && setIsMobileMenuOpen(false)}
                        className={`text-2xl tracking-tight font-medium uppercase ${activeTab === link.id ? 'text-primary-button' : 'text-text-primary'}`}
                      >
                        {link.name}
                      </Link>
                      {link.hasDropdown && (
                        <button onClick={() => setIsMobileShopOpen(!isMobileShopOpen)} className="p-2 text-text-primary">
                          <FaChevronDown className={`transition-transform duration-300 ${isMobileShopOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {link.hasDropdown && isMobileShopOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="mt-4 flex flex-col gap-4 pl-4 overflow-hidden border-l border-border/20">
                        {['Soaps', 'Candles', 'Wax Tablets', 'Gift Boxes'].map(sub => (
                          <Link key={sub} to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-text-secondary lowercase hover:text-primary-button">
                            {sub}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Mobile Section */}
              <div className="mt-auto pt-10 border-t border-border/10 flex flex-col gap-6">
                <Link to={user ? "/customer/profile" : "/customer/login"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-xl text-text-primary font-medium">
                  <FaUser /> {user ? "My Profile" : "Sign In"}
                </Link>
                <div className="flex gap-8 text-2xl text-text-secondary">
                  <a href="#" className="hover:text-primary-button transition-colors"><FaInstagram /></a>
                  <a href="#" className="hover:text-primary-button transition-colors"><FaWhatsapp /></a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;