
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Sparkles, Store } from "lucide-react";

const OurStory = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* ================= HERO ================= */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            <span className="uppercase text-[10px] sm:text-xs tracking-[0.3em] font-semibold text-[#B85028]">
              Our Story
            </span>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight">
              Bringing Independent
              <span className="block">Fashion Together.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm sm:text-base text-gray-600 font-light leading-7">
              Tanlia Studio is a curated marketplace created to bring
              independent boutiques, designers, and fashion lovers together
              in one beautiful space.
            </p>

          </div>
        </div>
      </section>


      {/* ================= OUR BEGINNING ================= */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <div className="h-[400px] sm:h-[500px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
                alt="Tanlia Studio boutique"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div>

              <span className="uppercase text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#B85028]">
                Where It Began
              </span>

              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-gray-900 leading-tight">
                A Space for Stories Behind Every Piece
              </h2>

              <p className="mt-6 text-sm sm:text-base text-gray-600 font-light leading-7">
                We believe fashion is more than simply what we wear.
                Behind every collection is a creative vision, a boutique
                owner, a designer, or an artisan who puts something personal
                into their work.
              </p>

              <p className="mt-4 text-sm sm:text-base text-gray-600 font-light leading-7">
                Tanlia Studio brings these independent voices together and
                creates a place where customers can discover thoughtfully
                selected pieces from different boutiques and brands.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= WHAT WE BELIEVE ================= */}
      <section className="py-16 sm:py-20 bg-[#EFE9DF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="max-w-2xl mx-auto text-center mb-12">

            <span className="uppercase text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#B85028]">
              What We Believe
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-gray-900">
              More Than a Marketplace
            </h2>

            <p className="mt-4 text-sm text-gray-600 font-light leading-6">
              Tanlia Studio is built around discovery, creativity, and
              supporting independent fashion businesses.
            </p>

          </div>


          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 01 */}
            <div className="bg-[#FDFBF7] p-7 sm:p-8 text-center">

              <div className="w-12 h-12 mx-auto flex items-center justify-center border border-gray-200 rounded-full">
                <Heart className="w-5 h-5 text-[#B85028]" />
              </div>

              <h3 className="mt-5 text-xl font-serif text-gray-900">
                Curated With Care
              </h3>

              <p className="mt-3 text-sm text-gray-500 font-light leading-6">
                We bring together collections that feel distinctive,
                thoughtful, and worth discovering.
              </p>

            </div>


            {/* Card 02 */}
            <div className="bg-[#FDFBF7] p-7 sm:p-8 text-center">

              <div className="w-12 h-12 mx-auto flex items-center justify-center border border-gray-200 rounded-full">
                <Store className="w-5 h-5 text-[#B85028]" />
              </div>

              <h3 className="mt-5 text-xl font-serif text-gray-900">
                Supporting Boutiques
              </h3>

              <p className="mt-3 text-sm text-gray-500 font-light leading-6">
                We give independent boutiques and designers a place to
                showcase their collections and connect with customers.
              </p>

            </div>


            {/* Card 03 */}
            <div className="bg-[#FDFBF7] p-7 sm:p-8 text-center">

              <div className="w-12 h-12 mx-auto flex items-center justify-center border border-gray-200 rounded-full">
                <Sparkles className="w-5 h-5 text-[#B85028]" />
              </div>

              <h3 className="mt-5 text-xl font-serif text-gray-900">
                Discover Something New
              </h3>

              <p className="mt-3 text-sm text-gray-500 font-light leading-6">
                From everyday essentials to statement pieces, we make
                discovering new fashion simple and inspiring.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= OUR VISION ================= */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">

          <span className="uppercase text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#B85028]">
            Our Vision
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
            Making Independent Fashion
            <span className="block">Easier to Discover.</span>
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-sm sm:text-base text-gray-600 font-light leading-7">
            Our vision is to create a trusted destination where customers
            can discover independent fashion brands while sellers get the
            opportunity to grow, connect, and tell their stories.
          </p>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="bg-black text-white rounded-2xl px-6 py-12 sm:px-10 sm:py-14 text-center">

            <span className="uppercase text-[10px] sm:text-xs tracking-[0.25em] font-semibold text-[#D98B63]">
              Discover Tanlia Studio
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl font-serif">
              Find Your Next Favourite Piece
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-sm text-gray-300 font-light leading-6">
              Explore collections from independent boutiques and discover
              fashion selected with you in mind.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 mt-7 px-7 py-3 bg-white text-black text-xs sm:text-sm font-medium rounded-md hover:bg-[#B85028] hover:text-white transition-all duration-300"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
};

export default OurStory;

