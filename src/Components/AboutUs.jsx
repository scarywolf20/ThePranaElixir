import React from 'react';

const AboutUs = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
        
        {/* Left Side: Overlapping Image Grid */}
        <div className="relative">
          {/* Main Owner Image */}
          <div className="rounded-[2rem] overflow-hidden shadow-xl w-3/4 aspect-[4/5] bg-gray-100">
            <img 
              src="/owners-image.jpg" 
              alt="Business Owners" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Floating Product Image Overlay */}
          {/* <div className="absolute -bottom-10 -right-4 md:-right-10 w-1/2 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
            <div className="aspect-square">
              <img 
                src="/product-detail.jpg" 
                alt="Product detail" 
                className="w-full h-full object-cover"
              />
            </div>
          </div> */}
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col space-y-6 md:pl-1">
          <header>
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-text-secondary block mb-2">
              About Us
            </span>
            <h2 className="text-5xl md:text-5xl font-light tracking-widest text-gray-800 ">
             The Prana Elixir 
            </h2>
          </header>

          <blockquote className="text-xl md:text-3xl font-light leading-relaxed text-gray-600 italic">
            “All our soaps are mindfully hand-made with cold process technique 
            using pure plant-based oils and coloured with botanical powders 
            & naturally occurring clays.”
          </blockquote>

          {/* Product Features List */}
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-m text-text-primary font-medium">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-text-primary rounded-full"></span>
              <span>Hand-Cut</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-text-primary rounded-full"></span>
              <span>Natural</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-text-primary rounded-full"></span>
              <span>SLS & Paraben-free</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-text-primary rounded-full"></span>
              <span>Phthalates-free</span>
            </li>
          </ul>

          {/* <div className="pt-4">
            <button className="bg-[#6D5447] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#5a453a] transition-colors uppercase text-xs tracking-widest">
              More 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div> */}
        </div>

      </div>
    </section>
  );
};

export default AboutUs;