import React from "react";
import { Link } from "react-router-dom";

const FeaturedCollection = () => {
  const products = [
    {
      id: 1,
      title: "The latest pieces fresh from our boutique sellers",
      tag: "New Arrival",
      slug: "new-arrival",
      image:
        "https://i.ibb.co.com/VYmdS3K1/IMG-20260906-WA0006-1.jpg",
    },
    {
      id: 2,
      title: "What everyone is loving this season",
      tag: "Trending Now",
      slug: "trending-now",
      image:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Elegant modest wear with contemporary design",
      tag: "Modest Fashion",
      slug: "modest-fashion",
      image:
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Timeless styles made for every occasion",
      tag: "Classic Elegance",
      slug: "classic-elegance",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-14 bg-[#F4F1EA] text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-10 border-b border-gray-300 pb-6 text-center">

          <div>
            <span className="uppercase text-xs tracking-[0.25em] font-semibold text-orange-500 block mb-2">
              EXPLORE
            </span>

            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-gray-900">
              Featured Collection
            </h2>

            
          </div>

        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((item) => (
            <Link
              key={item.id}
              to={`/collections/${item.slug}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end text-center p-6">

                  <span className="text-white text-[11px] uppercase tracking-[0.3em] font-semibold drop-shadow-md">
                    {item.tag}
                  </span>

                  <h3 className="mt-3 text-white text-lg md:text-2xl font-serif font-light leading-snug drop-shadow-lg">
                    {item.title}
                  </h3>

                  <span className="mt-4 text-white text-xs uppercase tracking-[0.2em] font-medium border-b border-white pb-1">
                    Discover Collection
                  </span>

                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;