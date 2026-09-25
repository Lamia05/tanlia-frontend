
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedThisWeek = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/data/featured.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load featured products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data.slice(0, 3));
      })
      .catch((error) => {
        console.error("Failed to load featured products:", error);
      });
  }, []);

  return (
    <section className="bg-[#FDFBF7] py-20 sm:py-24 lg:py-28 px-5 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 lg:mb-14">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#B85028]" />
              <p className="text-[10px] tracking-[0.28em] uppercase text-[#B85028] font-medium">
                Curated selection
              </p>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#171717] tracking-tight">
              Featured this week
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-neutral-500 font-light sm:text-right">
            A thoughtful selection of pieces from our boutique sellers,
            available for a limited time.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {products.map((product) => {
            const image = Array.isArray(product.image)
              ? product.image[0]
              : product.image;

            return (
              <div key={product.id} className="group">

                {/* Product Image */}
                <Link to={`/products/${product.id}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EEE9E2]">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-500" />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="pt-5">

                  <p className="text-[10px] tracking-[0.18em] uppercase text-neutral-400 mb-2">
                    {product.sellerName}
                  </p>

                  <h3 className="text-base sm:text-lg text-[#222] font-medium leading-snug">
                    {product.title}
                  </h3>

                  <div className="mt-4 flex items-center justify-between gap-4">

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base text-[#222] font-medium">
                        ৳{product.price}
                      </span>

                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Shop Now */}
                    <Link
                      to={`/products/${product.id}`}
                      className="group/link inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-[#B85028] border-b border-[#B85028]/40 pb-1 hover:border-[#B85028] transition-all duration-300"
                    >
                      Shop now
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedThisWeek;
