import React from 'react';
import { Mail, MapPin, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#63483D] text-white pt-12 pb-6 px-8 rounded-t-[40px] font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl tracking-[0.2em] font-light">mud and</h2>
            {/* Simple representation of the logo icon */}
            <div className="flex items-end space-x-1">
               <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-bottom-[15px] border-white"></div>
               <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h2 className="text-3xl tracking-[0.2em] font-light">on</h2>
          </div>
          <p className="text-sm tracking-widest italic opacity-90">Artisanal skincare luxuries</p>
          <div className="w-px h-16 bg-white/40 ml-16 hidden md:block"></div>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm font-light">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">Story</a></li>
            <li><a href="#" className="hover:underline">Shop</a></li>
            <li><a href="#" className="hover:underline">Connect</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif mb-6">Policies</h3>
          <ul className="space-y-4 text-sm font-light">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline">Shipping & Delivery</a></li>
            <li><a href="#" className="hover:underline">Return and Refund Policy</a></li>
          </ul>
        </div>

        {/* Reach Us */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-serif mb-6">Reach Us</h3>
          <ul className="space-y-4 text-sm font-light">
            <li className="flex items-center justify-center md:justify-start gap-3">
              <MapPin size={18} /> <span>India</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <Mail size={18} /> <span>mudandmoonco@gmail.com</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <Instagram size={18} /> <span>@mud_and_moon</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/20 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-xs opacity-80 uppercase tracking-widest">
          All right reserved | mud and moon
        </p>
        <div className="flex items-center gap-6">
          <Instagram size={20} className="cursor-pointer hover:opacity-70" />
          <Youtube size={20} className="cursor-pointer hover:opacity-70" />
          {/* WhatsApp Floating-style button */}
          <div className="bg-[#25D366] p-2 rounded-xl cursor-pointer">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;