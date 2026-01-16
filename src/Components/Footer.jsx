import React from 'react';
import { Mail, MapPin} from 'lucide-react';
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className="bg-[#63483D] text-white pt-12 pb-6 px-8 rounded-t-[40px] font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-3xl tracking-[0.2em] font-light">The Prana Elixir</h2>
            {/* Simple representation of the logo icon */}
            {/* <div className="flex items-end space-x-1">
               <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-bottom-[15px] border-white"></div>
               <div className="w-4 h-4 bg-white rounded-full"></div>
            </div> */}
            {/* <h2 className="text-3xl tracking-[0.2em] font-light">on</h2> */}
          </div>
          <p className="text-sm tracking-widest italic opacity-90">Artisanal skincare luxuries</p>
          {/* <div className="w-px h-16 bg-white/40 ml-16 hidden md:block"></div> */}
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
              <Mail size={18} /> <span>thepranaelixir@gmail.com</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-3">
              <FaInstagram size={18} /> <span>@thepranaelixir</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/20 flex flex-col md:row justify-between items-center gap-4">
        <p className="text-xs opacity-80 uppercase tracking-widest">
          All right reserved | The Prana Elixir
        </p>
        <div className="flex items-center gap-6">
          <FaInstagram size={20} className="cursor-pointer hover:opacity-70" />
          <FaWhatsapp size={20} className="cursor-pointer hover:opacity-70" />
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;