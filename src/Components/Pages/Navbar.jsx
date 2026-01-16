import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from "react-icons/fa"
// import { FaSearch } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";
import CartDrawer from "../Elements/CartDrawer";

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  // Update activeTab when route changes
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const navLinks = [
    { name: 'home', id: '/' },
    { name: 'story', id: '/story' },
    { name: 'shop', id: '/shop', hasDropdown: true },
    { name: 'custom orders', id: '/custom' },
    { name: 'connect', id: '/contact' },
  ];

  return (
    <>
      <nav className="w-full bg-bg-surface font-sans">
        {/* 1. Promo Bar */}
        <div className="w-full bg-text-primary text-bg-surface py-1.5 text-center text-[10px] sm:text-xs tracking-[0.25em] uppercase">
          10% Off On Your First Order. Use Code 'HAPPY'
        </div>

        {/* 2. Logo Section */}
        <div className="flex justify-center py-4">
          <Link to="/" className="text-3xl md:text-4xl tracking-[0.35em] text-text-primary font-light hover:opacity-80 transition-opacity">
            The Prana Elixir
          </Link>
        </div>

        {/* 3. Divider Dots */}
        <div 
          className="w-full h-[1px]" 
          style={{
            backgroundImage: `linear-gradient(to right, #CBBBAA 25%, transparent 25%)`,
            backgroundSize: '20px 1px', 
            backgroundRepeat: 'repeat-x'
          }}
        />

        {/* 4. Navigation Links Row */}
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between py-3">
          
          {/* Socials */}
          <div className="flex gap-6 text-icon">
            <button className="hover:text-primary-button cursor-pointer transition-colors">
              <FaInstagram className="text-xl" />
            </button>
            <button className="hover:text-primary-button cursor-pointer transition-colors">
              <FaWhatsapp className="text-xl" />
            </button>
          </div>

          {/* Center Menu */}
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              
              return (
                <li key={link.id} className="relative group">
                  {link.hasDropdown ? (
                    // RENDER AS BUTTON (For Dropdowns)
                    <button
                      onMouseEnter={() => setIsShopOpen(true)}
                      onClick={() => setActiveTab(link.id)}
                      className={`
                        relative pb-1 text-sm tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer
                        hover:text-primary-button
                        ${isActive ? 'text-text-primary' : 'text-text-secondary'}
                      `}
                    >
                      <span className="flex items-center">
                        {link.name}
                        <svg className={`ml-1.5 w-3.5 h-3.5 transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    // RENDER AS LINK (For Routes)
                    <Link
                      to={link.id}
                      className={`
                        relative pb-1 text-sm tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer inline-block
                        hover:text-primary-button
                        ${isActive ? 'text-text-primary' : 'text-text-secondary'}
                      `}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Persistent Underline */}
                  <div className={`
                    absolute -bottom-1 left-0 h-[1.5px] bg-text-primary transition-all duration-300
                    ${isActive ? 'w-full opacity-100' : 'w-0 group-hover:w-full group-hover:opacity-100'}
                  `} />

                  {/* Shop Dropdown */}
                  {link.hasDropdown && isShopOpen && (
                    <div 
                      onMouseLeave={() => setIsShopOpen(false)}
                      className="absolute left-1/2 -translate-x-1/2 mt-4 w-60 bg-bg-surface border border-border rounded-2xl shadow-2xl z-50 py-5"
                    >
                      {[
                        'gentle habits soaps', 'core collection', 'soy wax candles', 
                        'gift boxes', 'wax tablets', 'workshops'
                      ].map((item) => (
                        <a 
                          key={item} 
                          href="#" 
                          className="block px-8 py-2.5 text-text-primary lowercase text-base font-light hover:bg-bg-section hover:text-primary-button transition-colors"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Action Icons */}
          <div className="flex gap-6 text-text-primary">
            {/* <button className="hover:text-primary-button cursor-pointer transition-all hover:scale-105">
              <FaSearch className="text-xl" />
            </button> */}
            <Link 
              to="/customer/login" 
              className="hover:text-primary-button cursor-pointer transition-all hover:scale-105 inline-block"
            >
              <FaUser className="text-xl" />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-primary-button cursor-pointer transition-all hover:scale-105"
            >
              <FaCartShopping className="text-xl" />
              {/* Optional: Cart badge */}
              <span className="absolute -top-2 -right-2 bg-primary-button text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;