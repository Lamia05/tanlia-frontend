import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  const tanliaInstagram = "https://www.instagram.com/tanliastudio/";

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("https://tanlia-backend.onrender.com/api/products");
        const products = await response.json();

        // One/two nice product images from each seller
        const selected = [
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "ayzan" &&
              product.id === 1
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "halal mood" &&
              product.id === 2
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "artistic humu" &&
              product.id === 3
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "su zan 1622" &&
              product.id === 4
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "trendy touh" &&
              product.id === 9
          ),
          products.find(
            (product) =>
              product.sellerName?.toLowerCase() === "halal mood" &&
              product.id === 6
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
    <section className="py-20 bg-[#F4F1EA] text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-300 pb-7">
          <div>
            <span className="uppercase text-[10px] sm:text-xs tracking-[0.3em] font-semibold text-[#B85028] block mb-3">
              From Our Instagram
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight">
              A Little Inspiration
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-sm md:text-right leading-relaxed">
            Everyday looks, new arrivals and beautiful moments from the
            Tanlia Studio community.
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, index) => {
            const sellerName = post.sellerName;

            return (
              <div
                key={post.id}
                className={`group relative overflow-hidden bg-gray-200 ${
                  index === 1 || index === 4
                    ? "lg:translate-y-8"
                    : ""
                }`}
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={
                      Array.isArray(post.images)
                        ? post.images[0]
                        : post.image
                    }
                    alt={`${sellerName} - ${post.title}`}
                    className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href={tanliaInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 border border-gray-900 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all duration-300"
          >
            {/* Instagram Icon */}
            <svg
              className="w-4 h-4 fill-none stroke-current stroke-[1.8]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
              />

              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 1 1 16 11.37z" />

              <line
                x1="17.5"
                y1="6.5"
                x2="17.51"
                y2="6.5"
              />
            </svg>

            <span>Tanlia Studio</span>

            <ArrowUpRight
              className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;