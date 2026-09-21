
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
    <section className="bg-[#FDFBF7] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="space-y-1 mb-5">
            

            <p className="text-xs tracking-[0.3em]  uppercase text-orange-500">
              LIMITED TIME
            </p>

            <p className="text-3xl tracking-[0.3em]  uppercase text-[#111111]">
              FEATURED THIS WEEK
            </p>
          </div>

          <h2 className="text-sm text-gray-600">
            Promotional highlights from our boutique sellers — special offers available for a limited time
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const image = Array.isArray(product.image)
              ? product.image[0]
              : product.image;

            return (
              <div key={product.id} className="group">
                {/* Product Image */}
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="pt-4 text-[#666666]">
                  {/* Seller Name */}
                  <p className="text-sm text-neutral-400 mb-1">
                    {product.sellerName}
                  </p>

                  {/* Product Title */}
                  <h3 className="text-base sm:text-lg font-medium mb-4 hover:text-orange-400">
                    {product.title}
                  </h3>

                  {/* Price + Shop Now */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium">
                        {product.price}
                      </span>

                      {product.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="shrink-0 inline-flex items-center gap-2 bg-[#B85028] text-white px-4 py-2 text-sm transition-all duration-300 hover:bg-[#D97852] rounded-full"
                    >
                      Shop Now
                      <ArrowRight size={15} />
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
