import React from 'react';
import { BadgeCheck, Sparkles, ShieldCheck, Truck } from 'lucide-react';

const WhyShopWithUs = () => {
  const features = [
    {
      id: 1,
      icon: BadgeCheck,
      title: "Curated Sellers",
      description: "Discover thoughtfully selected boutiques with distinctive collections"
    },
    {
      id: 2,
      icon: Sparkles,
      title: "Quality Products",
      description: "Explore carefully chosen pieces from independent sellers"
    },
    {
      id: 3,
      icon: ShieldCheck,
      title: "Secure Shopping",
      description: "A smooth and secure shopping experience from browsing to checkout"
    },
    {
      id: 4,
      icon: Truck,
      title: "Reliable Delivery",
      description: "Delivery options and charges are provided by each boutique"
    }
  ];

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#F5F0E9] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 sm:mb-16">
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#B85028] mb-3">
            The Tanlia Difference
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight">
            Why shop with Tanlia
          </h2>

          <p className="mt-4 text-sm text-gray-600 font-light leading-relaxed">
            A thoughtfully curated marketplace made to bring independent
            boutiques and their collections closer to you.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.id}
                className={`group text-center px-6 py-8 lg:py-4 ${
                  index !== features.length - 1
                    ? "lg:border-r border-[#D8CEC3]"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center border border-[#D8CEC3] rounded-full bg-[#FDFBF7] text-[#B85028] transition-all duration-300 group-hover:bg-[#B85028] group-hover:text-white group-hover:border-[#B85028]">
                  <IconComponent className="w-6 h-6 stroke-[1.4]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-serif font-normal mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="max-w-xs mx-auto text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
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