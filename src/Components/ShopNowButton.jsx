import React from 'react';
import { FaArrowRight } from "react-icons/fa6";

const ShopNowButton = () => {
  return (
    <div className="relative flex items-center group cursor-pointer">
      {/* White Pill Background with hover fill effect */}
      <div className="relative h-16 pl-20 pr-12 rounded-full flex items-center shadow-lg overflow-hidden transition-all group-hover:shadow-xl">
        {/* White background */}
        <div className="absolute inset-0 bg-white z-0" />
        
        {/* Brown background that fills from left to right */}
        <div className="absolute inset-0 bg-[#8B6F5C] origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100 z-0" />
        
        {/* Text content */}
        <span className="relative z-10 text-gray-900 text-base tracking-[0.25em] font-semibold uppercase whitespace-nowrap transition-colors duration-700 group-hover:text-white">
          Shop Now
        </span>
      </div>

      {/* Brown Circle with Arrow - Moves from left to right on hover */}
      <div className="absolute left-0 w-16 h-16 bg-[#8B6F5C] rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-700 ease-out group-hover:left-[calc(100%-4rem)] group-hover:bg-[#735A48]">
        <FaArrowRight className="text-lg" />
      </div>
    </div>
  );
};

export default ShopNowButton;