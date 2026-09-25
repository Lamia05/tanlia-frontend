
import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  const tanliaInstagram = "https://www.instagram.com/tanliastudio/";

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch(
          "https://tanlia-backend.onrender.com/api/products"
        );

        const products = await response.json();

        // Selected product images for the Instagram-inspired grid
        const selected = [
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "ayzan" &&
              (product.id === 1 || product._id)
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "halal mood" &&
              (product.id === 2 || product._id)
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "artistic humu" &&
              (product.id === 3 || product._id)
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "su zan 1622" &&
              (product.id === 4 || product._id)
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "trendy touh" &&
              (product.id === 9 || product._id)
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "halal mood" &&
              (product.id === 6 || product._id)
          ),
        ].filter(Boolean);

        setPosts(selected);
      } catch (error) {
        console.error("Failed to load Instagram feed:", error);
      }
    };

    loadPosts();
  }, []);

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#FDFBF7] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div>
            <span className="block text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#B85028] mb-3">
              Follow Along
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight">
              From Tanlia Studio
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 font-light max-w-sm md:text-right leading-relaxed">
            Discover new pieces, boutique stories and everyday fashion
            inspiration from our growing community.
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {posts.map((post, index) => {
            const sellerName = post.sellerName || "Tanlia Studio";

            const image =
              Array.isArray(post.images) && post.images.length > 0
                ? post.images[0]
                : post.image;

            return (
              <a
                key={post.id || post._id || index}
                href={tanliaInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden bg-[#EDE8E0] block ${
                  index === 1 || index === 4
                    ? "lg:translate-y-8"
                    : ""
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={image}
                    alt={`${sellerName} - ${post.title || "Tanlia Studio"}`}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-[#1A1A1A]" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 sm:mt-20 flex justify-center">
          <a
            href={tanliaInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 border-b border-[#1A1A1A] pb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#B85028] hover:border-[#B85028] transition-colors duration-300"
          >
            {/* Instagram Icon */}
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-[1.7]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>

            <span>Follow Tanlia Studio</span>

            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;
