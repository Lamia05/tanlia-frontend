
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[680px] lg:min-h-[760px] overflow-hidden bg-[#F6F1EA]">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=85&w=2200"
          alt="Bangaliana Heritage Fashion"
          className="w-full h-full object-cover object-center"
        />

        {/* Soft luxury overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto min-h-[680px] lg:min-h-[760px] px-6 sm:px-8 lg:px-12 flex items-center">

        <div className="max-w-xl text-white pt-10">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-white/70" />
            <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase font-medium text-white/85">
              Tanlia Studio
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[76px] leading-[0.95] tracking-[-0.02em]">
            Fashion,
            <br />
            <span className="italic font-normal text-white/90">
              beautifully curated.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-md text-sm sm:text-base leading-7 text-white/80 font-light">
            Discover distinctive pieces from independent boutiques,
            thoughtfully brought together in one place.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4">

            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:bg-[#B85028] hover:text-white"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/sellers"
              className="inline-flex items-center justify-center px-7 py-4 border border-white/60 text-white text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-gray-900"
            >
              Meet Our Sellers
            </Link>

          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/60">
        <span className="text-[9px] uppercase tracking-[0.25em]">
          Discover
        </span>
        <span className="w-px h-8 bg-white/50" />
      </div>

    </section>
  );
};

export default Hero;
