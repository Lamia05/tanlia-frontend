
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
      <div className="py-20 text-center text-gray-500 font-serif">
        Loading Boutique Sellers...
      </div>
    );
  }

  return (
    <section className="py-16 bg-White text-Orange-500 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header */}
        <div className="text-center mb-12">
          <span className="uppercase text-xs tracking-[0.25em] font-semibold text-orange-500 block mb-2">
          THE MAKERS
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-gray-900 mb-2 font-normal">
            MEET OUR BOUTIQUE SELLERS
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 font-light max-w-md mx-auto">
           Independent boutiques from around the world, each with their own unique story and aesthetic


          </p>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 flex flex-col justify-between group"
            >

              {/* Top Banner & Image */}
              <div>
                <div className="relative h-56 overflow-hidden bg-gray-200">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <h3 className="text-lg font-serif font-medium text-gray-900 mb-1">
                    {seller.name}
                  </h3>

                  <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-800 block mb-2">
                    {seller.tagline}
                  </span>

                  <p className="text-xs text-gray-600 font-light line-clamp-2 leading-relaxed mb-6">
                    {seller.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-3 border-t border-gray-200/60 font-light">
                  <div className="flex items-center gap-1.5">
                    
                    <span>{seller.productsCount} products</span>
                  </div>

                  <span>{seller.location}</span>
                </div>

                {/* View Collection */}
                <Link
                  to={`/sellers/${seller.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="w-full flex items-center justify-between text-xs font-medium text-gray-900 hover:text-amber-800 transition-colors pt-1"
                >
                  <span>View Collection</span>

                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
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

