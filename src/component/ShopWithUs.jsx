import React from 'react';
import { BadgeCheck, Sparkles, ShieldCheck, Truck } from 'lucide-react';

const WhyShopWithUs = () => {
  const features = [
    {
      id: 1,
      icon: BadgeCheck,
      title: "Curated Sellers",
      description: "Every boutique is hand-selected for quality and craftsmanship"
    },
    {
      id: 2,
      icon: Sparkles,
      title: "Quality Products",
      description: "Premium materials and artisanal attention to detail"
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: "Secure Shopping",
      description: "Your transactions are protected with industry-leading security"
    },
    {
      id: 4,
      icon: Truck,
      title: "Easy Delivery",
      description: "Complimentary shipping on orders over $150 worldwide"
    }
  ];

  return (
    <section className="py-20 bg-[#FDFBF7] text-gray-900 border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#1A1A1A]">
            Why Shop With Us
          </h2>
        </div>

        {/* 4 Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 text-center">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="flex flex-col items-center group">
                
                {/* Icon Box with Terracotta Theme */}
                <div className="w-16 h-16 rounded-full bg-[#F5EBE6] group-hover:bg-[#B85028] transition-colors duration-300 flex items-center justify-center mb-6 text-[#B85028] group-hover:text-white shadow-sm">
                  <IconComponent className="w-7 h-7 stroke-[1.5] transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-serif font-normal text-gray-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed max-w-xs">
                  {feature.description}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyShopWithUs;