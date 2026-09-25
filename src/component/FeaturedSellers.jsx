
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/sellers.json")
      .then((res) => res.json())
      .then((data) => {
        setSellers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sellers:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-[#FDFBF7] text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
          Loading boutiques
        </p>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-24 lg:py-28 bg-[#F5F0E9]">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 lg:mb-14">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#B85028]" />

              <span className="text-[10px] uppercase tracking-[0.28em] text-[#B85028] font-medium">
                The makers
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#171717] tracking-tight">
              Meet our boutiques
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-neutral-500 font-light sm:text-right">
            Discover independent sellers, each bringing their own
            perspective, craft and style to Tanlia.
          </p>

        </div>

        {/* Sellers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">

          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="group"
            >

              {/* Seller Image */}
              <Link
                to={`/sellers/${seller.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#E9E2D9]">

                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />

                  {/* Soft overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.08] transition-colors duration-500" />

                  {/* View Collection */}
                  <div className="absolute inset-x-4 bottom-4 hidden sm:flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="w-full bg-white text-[#171717] py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-center">
                      View collection
                    </span>
                  </div>

                </div>
              </Link>

              {/* Seller Info */}
              <div className="pt-5">

                <p className="text-[9px] uppercase tracking-[0.18em] text-[#B85028] font-medium mb-2">
                  {seller.tagline}
                </p>

                <h3 className="font-serif text-xl text-[#171717] leading-tight">
                  {seller.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-neutral-500 font-light line-clamp-2">
                  {seller.description}
                </p>

                {/* Bottom Info */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">

                  <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    {seller.productsCount} products
                  </span>

                  <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                    {seller.location}
                  </span>

                </div>

                {/* Link */}
                <Link
                  to={`/sellers/${seller.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group/link mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.17em] font-semibold text-[#171717] hover:text-[#B85028] transition-colors"
                >
                  Explore boutique

                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1"
                  />
                </Link>

              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
};

export default FeaturedSellers;
