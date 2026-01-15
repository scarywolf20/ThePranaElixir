import React, { useState } from 'react';

const Navbar = () => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <nav className="w-full bg-bg-surface border-b border-border relative font-sans">
      {/* Promo Bar */}
      <div className="w-full bg-text-primary text-bg-surface py-2 text-center text-xs tracking-widest uppercase">
        10% Off On Your First Order. Use Code ‘HAPPY’
      </div>

      {/* Main Header Logo Area */}
      <div className="flex flex-col items-center pt-6 pb-2">
        <h1 className="text-4xl tracking-[0.2em] text-text-primary font-light uppercase">
          mud and moon
        </h1>
      </div>

      {/* Navigation Links Container */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-t border-dashed border-border mt-4">
        
        {/* Social Icons */}
        <div className="flex space-x-4 text-icon">
          <button className="hover:text-primary-button transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 5V3a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
          </button>
          <button className="hover:text-primary-button transition-colors cursor-pointer">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
          </button>
        </div>

        {/* Center Menu */}
        <div className="flex items-center space-x-8 text-text-primary uppercase text-sm tracking-[0.15em] font-medium">
          <a href="#" className="hover:text-primary-button border-b-2 border-text-primary">home</a>
          <a href="#" className="hover:text-primary-button transition-colors">story</a>
          
          {/* Shop Dropdown Trigger */}
          <div className="relative">
            <button 
              onMouseEnter={() => setIsShopOpen(true)}
              onClick={() => setIsShopOpen(!isShopOpen)}
              className="flex items-center hover:text-primary-button uppercase cursor-pointer"
            >
              shop
              <svg className={`ml-1 w-4 h-4 transition-transform ${isShopOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {/* Dropdown Menu - Matches Image 1 */}
            {isShopOpen && (
              <div 
                onMouseLeave={() => setIsShopOpen(false)}
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-bg-surface rounded-2xl shadow-xl z-50 border border-border overflow-hidden py-4"
              >
                {[
                  'gentle habits soaps',
                  'core collection',
                  'soy wax candles',
                  'gift boxes',
                  'wax tablets',
                  'workshops',
                  'postcards',
                  'bath accessories'
                ].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="block px-8 py-3 text-text-primary lowercase text-lg font-light hover:bg-bg-section transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#" className="hover:text-primary-button transition-colors">custom orders</a>
          <a href="#" className="hover:text-primary-button transition-colors">connect</a>
        </div>

        {/* Action Icons */}
        <div className="flex space-x-6 text-text-primary">
          <button className="hover:text-primary-button cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </button>
          <button className="hover:text-primary-button cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </button>
          <button className="hover:text-primary-button cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;