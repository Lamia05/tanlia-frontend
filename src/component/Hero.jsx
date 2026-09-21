
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative w-full h-[85vh] min-h-[550px] bg-gray-900 text-white overflow-hidden flex items-center">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=2000"
          alt="Bangaliana Heritage Fashion"
          className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-6">
          
          {/* Subtitle */}
          <span className="uppercase text-xs sm:text-sm tracking-[0.3em] font-light text-gray-300 block">
            MULTI-VENDOR BOUTIQUE MARKETPLACE
          </span>

          {/* Main Editorial Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-none">
            CURATED FASHION, <br />
            <span className="italic font-normal text-gray-200">ALL IN ONE PLACE.</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 font-light text-sm sm:text-base leading-relaxed max-w-lg">
            Discover unique styles from independent boutique sellers,
            <br></br> carefully curated for the discerning shopper.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            
            {/* All Products */}
            <Link
              to="/products"
              className="bg-white  text-gray-900 px-7 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-orange-400 transition-colors flex items-center justify-center gap-2"
            >
              Explore Products
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Sellers */}
            <Link
              to="/sellers"
              className="border border-white/70 text-white px-7 py-3.5 text-xs font-medium uppercase tracking-widest hover:bg-white hover:text-gray-900 transition-colors text-center"
            >
              Explore Sellers
            </Link>

          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;