import React from 'react';
import { Leaf, Recycle, Building2, Beaker, Palette, CheckCircle2 } from 'lucide-react';

const features = [
  { id: 1, label: "All Natural", icon: <Leaf size={24} strokeWidth={3} /> },
  { id: 2, label: "Plastic Free Packaging", icon: <Recycle size={24} strokeWidth={3} /> },
  { id: 3, label: "Sustainable", icon: <Building2 size={24} strokeWidth={3} /> },
  { id: 4, label: "Paraben Free", icon: <Beaker size={24} strokeWidth={3} /> },
  { id: 5, label: "Small Batch", icon: <Palette size={24} strokeWidth={3} /> },
  { id: 6, label: "Vegan", icon: <CheckCircle2 size={24} strokeWidth={3} /> },
];

const Features = () => {
  return (
    <section className="w-full py-8 bg-bg-main">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center flex-1 min-w-[100px]">
              <div className="w-16 h-16 mb-3 rounded-full border border-text-primary flex items-center justify-center text-[#6D5447] transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-text-primary font-serif text-center md:text-m leading-tight">
                {feature.label}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;