
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Box, ArrowLeft, ShoppingBag } from "lucide-react";
import FeaturedSellers from "../component/FeaturedSellers";

const Sellers = () => {
  const { sellerName } = useParams();

  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/sellers.json").then((res) => res.json()),
      fetch("https://tanlia-backend.onrender.com/api/products").then((res) => res.json()),
      fetch("/data/featured.json").then((res) => res.json()),
    ])
      .then(([sellerData, productData, featuredData]) => {
        setSellers(sellerData);
        setProducts(productData);
        setFeaturedProducts(featuredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading seller data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-gray-500 font-serif">
        Loading Sellers...
      </div>
    );
  }

  // =====================================================
  // ALL SELLERS PAGE
  // =====================================================

  if (!sellerName) {
    return (
      <div className="py-12 bg-[#FDFBF7] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 pb-6 mb-8 text-center sm:text-left">
            <span className="uppercase text-xs tracking-[0.25em] font-semibold text-[#B85028] block mb-2">
              Our Boutique Partners
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 tracking-tight">
              Independent Sellers
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 font-light mt-2 max-w-xl">
              Meet the passionate artisans and independent brands behind our
              curated fashion collections.
            </p>
          </div>

          <FeaturedSellers />
        </div>
      </div>
    );
  }

  // =====================================================
  // FIND SELECTED SELLER
  // =====================================================

  const selectedSeller = sellers.find((seller) => {
    const slug = seller.name.toLowerCase().replace(/\s+/g, "-");
    return slug === sellerName;
  });

  // =====================================================
  // SELLER NOT FOUND
  // =====================================================

  if (!selectedSeller) {
    return (
      <section className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-3">
            Tanlia Studio
          </p>

          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            Seller Not Found
          </h1>

          <p className="text-sm text-gray-500 mb-7">
            Sorry, the seller you are looking for does not exist.
          </p>

          <Link
            to="/sellers"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md text-sm hover:bg-gray-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sellers
          </Link>
        </div>
      </section>
    );
  }

  // =====================================================
  // GET SELECTED SELLER PRODUCTS
  // =====================================================

  const sellerNameLower = selectedSeller.name.toLowerCase().trim();

  let sellerProductList = [];

  if (sellerNameLower === "trendy touch") {
    sellerProductList = featuredProducts.filter((product) => {
      return product.sellerName?.toLowerCase().trim() === sellerNameLower;
    });
  } else {
    sellerProductList = products.filter((product) => {
      return product.sellerName?.toLowerCase().trim() === sellerNameLower;
    });
  }

  // =====================================================
  // GET FIRST PRODUCT IMAGE
  // =====================================================

  const getFirstProductImage = (product) => {
    if (Array.isArray(product.image)) {
      return (
        product.image.find(
          (image) => image && image.trim() !== ""
        ) || ""
      );
    }

    if (product.image) {
      return product.image;
    }

    if (Array.isArray(product.colors)) {
      return (
        product.colors.find(
          (color) => color?.image && color.image.trim() !== ""
        )?.image || ""
      );
    }

    return "";
  };

  // =====================================================
  // HERO IMAGE
  // Seller image now comes directly from sellers.json
  // =====================================================

  const heroImage = selectedSeller.image || "";

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  return (
    <section className="bg-[#FDFBF7] min-h-screen">

      {/* =================================================
          FULL WIDTH HERO
      ================================================= */}

      <div className="relative w-full h-[55vh] min-h-[420px] overflow-hidden bg-gray-200">
        {heroImage ? (
          <img
            src={heroImage}
            alt={selectedSeller.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FAF7F2]">
            <span className="text-gray-400 font-serif text-2xl">
              {selectedSeller.name}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white">
            <span className="uppercase text-xs tracking-[0.3em] font-medium block mb-4">
              Boutique Collection
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif">
              {selectedSeller.name}
            </h1>

            {selectedSeller.tagline && (
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold mt-4">
                {selectedSeller.tagline}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          PAGE CONTENT
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Back Button */}

        <Link
          to="/sellers"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sellers
        </Link>

        {/* =================================================
            SELLER INFORMATION
        ================================================= */}

        <div className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm mb-14">
          <div className="p-7 sm:p-10 md:p-12">

            <span className="uppercase text-xs tracking-[0.25em] text-gray-400 mb-3 block">
              Boutique Seller
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
              {selectedSeller.name}
            </h2>

            {selectedSeller.tagline && (
              <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#B85028] mt-3">
                {selectedSeller.tagline}
              </p>
            )}

            <p className="text-sm text-gray-600 font-light leading-relaxed mt-6 max-w-2xl">
              {selectedSeller.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6 mt-8 text-sm text-gray-600">

              {selectedSeller.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{selectedSeller.rating} Rating</span>
                </div>
              )}

              {selectedSeller.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{selectedSeller.location}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-gray-400" />
                <span>{sellerProductList.length} Products</span>
              </div>

            </div>
          </div>
        </div>

        {/* =================================================
            PRODUCTS SECTION
        ================================================= */}

        <div className="mb-8">
          <span className="uppercase text-xs tracking-[0.25em] font-semibold text-[#B85028] block mb-2">
            Shop From This Seller
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
            {selectedSeller.name}'s Collection
          </h2>

          <p className="text-sm text-gray-500 font-light mt-2">
            Explore products from this independent boutique seller.
          </p>
        </div>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {sellerProductList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {sellerProductList.map((product) => {
              const currentImage = getFirstProductImage(product);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="relative h-80 overflow-hidden bg-gray-100">

                    <Link
                      to={`/products/${product.id}`}
                      className="block w-full h-full"
                    >
                      {currentImage ? (
                        <img
                          src={currentImage}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </Link>

                    {/* SALE BADGE */}

                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 bg-[#B85028] text-white text-[10px] font-semibold px-2 py-1 rounded">
                        SALE
                      </span>
                    )}

                    {/* ADD TO CART HOVER BUTTON */}

                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="w-full h-12 bg-black text-white rounded-md text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>

                  </div>

                  {/* PRODUCT INFO */}

                  <div className="p-5">

                    <p className="text-xs text-gray-400 mb-1">
                      {product.sellerName}
                    </p>

                    <h3 className="text-sm font-medium text-gray-900 leading-relaxed">
                      {product.title}
                    </h3>

                    <div className="flex items-center gap-2 mt-3">

                      <span className="font-semibold text-sm text-gray-900">
                        {product.price}
                      </span>

                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        ) : (
          <div className="bg-white rounded-xl py-16 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">
              No products available for this seller yet.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Sellers;
