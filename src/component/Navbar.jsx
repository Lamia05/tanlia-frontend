import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  X,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Mobile Menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);

  const isCollectionsActive =
    location.pathname.startsWith("/collections");

  /* =========================
     FETCH PRODUCTS FOR SEARCH
  ========================= */

  useEffect(() => {
    fetch("https://tanlia-backend.onrender.com/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Search product loading error:", error);
        setProducts([]);
      });
  }, []);

  /* =========================
     CART COUNT
  ========================= */

  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = JSON.parse(
        localStorage.getItem("tanliaCart") || "[]"
      );

      if (!Array.isArray(savedCart)) {
        setCartCount(0);
        return;
      }

      const totalItems = savedCart.reduce((total, item) => {
        return total + Number(item.quantity || 1);
      }, 0);

      setCartCount(totalItems);
    };

    updateCartCount();

    const interval = setInterval(updateCartCount, 300);

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [location.pathname]);

  /* =========================
     WISHLIST COUNT
  ========================= */

  useEffect(() => {
    const updateWishlistCount = () => {
      const savedWishlist = JSON.parse(
        localStorage.getItem("tanliaWishlist") || "[]"
      );

      setWishlistCount(
        Array.isArray(savedWishlist)
          ? savedWishlist.length
          : 0
      );
    };

    updateWishlistCount();

    const handleWishlistUpdate = () => {
      updateWishlistCount();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );
    };
  }, [location.pathname]);

  /* =========================
     SEARCH HELPERS
  ========================= */

  const getProductTitle = (product) => {
    return (
      product?.product?.title ||
      product?.title ||
      "Product"
    );
  };

  const getSellerName = (product) => {
    return (
      product?.sellerName ||
      product?.seller?.name ||
      product?.seller ||
      "Tanlia Studio"
    );
  };

  const getProductImage = (product) => {
    if (product?.media?.cover) {
      return product.media.cover;
    }

    if (
      Array.isArray(product?.media?.images) &&
      product.media.images.length > 0
    ) {
      return product.media.images[0];
    }

    if (Array.isArray(product?.image)) {
      return product.image[0] || "";
    }

    return product?.image || "";
  };

  const getPrice = (product) => {
    if (!product) return "";

    if (product.pricing) {
      if (product.pricing.fullSet) {
        return product.pricing.fullSet;
      }

      if (product.pricing.price) {
        return `${product.pricing.currency || "BDT"} ${
          product.pricing.price
        }`;
      }

      if (
        product.pricing.kameez &&
        product.pricing.pant
      ) {
        return `${product.pricing.kameez} / ${product.pricing.pant}`;
      }
    }

    return product.price || "";
  };

  /* =========================
     SEARCH RESULTS
  ========================= */

  const filteredProducts =
    searchQuery.trim().length === 0
      ? []
      : products.filter((product) => {
          const query = searchQuery
            .toLowerCase()
            .trim();

          const title = getProductTitle(product)
            .toLowerCase();

          const seller = getSellerName(product)
            .toLowerCase();

          const description =
            typeof product?.description === "string"
              ? product.description.toLowerCase()
              : typeof product?.description?.intro ===
                  "string"
                ? product.description.intro.toLowerCase()
                : "";

          return (
            title.includes(query) ||
            seller.includes(query) ||
            description.includes(query)
          );
        });

  /* =========================
     OPEN SEARCH
  ========================= */

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setMobileMenuOpen(false);
  };

  /* =========================
     CLOSE SEARCH
  ========================= */

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  /* =========================
     SEARCH PRODUCT
  ========================= */

  const handleSearchProduct = (product) => {
    if (!product?.id) return;

    handleCloseSearch();
    navigate(`/products/${product.id}`);
  };

  /* =========================
     MOBILE MENU
  ========================= */

  const handleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =========================
     ESCAPE KEY
  ========================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleCloseSearch();
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-20 flex items-center justify-between">

          {/* =========================
              MOBILE LEFT - MENU
          ========================= */}

          <div className="md:hidden w-1/3 flex items-center justify-start">
            <button
              type="button"
              onClick={handleMobileMenu}
              className="p-1 text-gray-800 hover:text-black transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>

          {/* =========================
              BRAND - DESKTOP
          ========================= */}

          <div className="hidden md:flex flex-1">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-serif tracking-wider text-gray-900"
            >
              Tanlia Studio
            </Link>
          </div>

          {/* =========================
              MOBILE CENTER BRAND
          ========================= */}

          <div className="md:hidden w-1/3 flex items-center justify-center">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block text-xl font-serif tracking-wider text-gray-900 whitespace-nowrap"
            >
              Tanlia Studio
            </Link>
          </div>

          {/* =========================
              CENTER - DESKTOP NAV
          ========================= */}

          <nav className="hidden md:flex items-center justify-center gap-7 text-xs uppercase tracking-widest font-medium text-gray-600">

            <Link
              to="/"
              className="hover:text-orange-400 transition-colors"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-orange-400 transition-colors"
            >
              Products
            </Link>

            <Link
              to="/collections"
              className={`hover:text-orange-400 transition-colors ${
                isCollectionsActive
                  ? "text-black border-b border-black pb-1"
                  : ""
              }`}
            >
              Collections
            </Link>

            <Link
              to="/sellers"
              className="hover:text-orange-400 transition-colors"
            >
              Sellers
            </Link>

            <Link
              to="/about"
              className="hover:text-orange-400 transition-colors"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="hover:text-orange-400 transition-colors"
            >
              Contact
            </Link>

            <Link
              to="/track-order"
              className="hover:text-orange-400 transition-colors"
            >
              Track Order
            </Link>

          </nav>

          {/* =========================
              RIGHT - ICONS
          ========================= */}

          <div className="flex-1 flex items-center justify-end gap-4 text-gray-800">

            {/* SEARCH */}

            <button
              type="button"
              onClick={handleOpenSearch}
              className="p-1 text-gray-800 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* WISHLIST */}

            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              className="p-1 relative text-gray-800 hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />

              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#B85028] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART */}

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="p-1 relative text-gray-800 hover:text-black transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />

              <span className="absolute -top-1.5 -right-1.5 bg-[#B85028] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

          </div>
        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-5 py-5 flex flex-col">

              <Link
                to="/"
                onClick={closeMobileMenu}
                className="py-3 text-sm uppercase tracking-widest text-gray-700 hover:text-orange-400 transition-colors border-b border-gray-100"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="py-3 text-sm uppercase tracking-widest text-gray-700 hover:text-orange-400 transition-colors border-b border-gray-100"
              >
                Products
              </Link>

              <Link
                to="/collections"
                onClick={closeMobileMenu}
                className={`py-3 text-sm uppercase tracking-widest hover:text-orange-400 transition-colors border-b border-gray-100 ${
                  isCollectionsActive
                    ? "text-black font-medium"
                    : "text-gray-700"
                }`}
              >
                Collections
              </Link>

              <Link
                to="/sellers"
                onClick={closeMobileMenu}
                className="py-3 text-sm uppercase tracking-widest text-gray-700 hover:text-orange-400 transition-colors border-b border-gray-100"
              >
                Sellers
              </Link>

              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="py-3 text-sm uppercase tracking-widest text-gray-700 hover:text-orange-400 transition-colors border-b border-gray-100"
              >
                About
              </Link>

              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="py-3 text-sm uppercase tracking-widest text-gray-700 hover:text-orange-400 transition-colors border-b border-gray-100"
              >
                Contact
              </Link>

              <Link
                to="/track-order"
                onClick={closeMobileMenu}
                className="py-3 text-sm uppercase tracking-widest text-gray-700 hover:text-orange-400 transition-colors"
              >
                Track Order
              </Link>

            </nav>
          </div>
        )}
      </header>

      {/* =========================
          SEARCH OVERLAY
      ========================= */}

      {searchOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40">
          <div className="bg-white w-full shadow-lg">

            {/* SEARCH HEADER */}

            <div className="max-w-5xl mx-auto px-5 sm:px-6 py-6">

              <div className="flex items-center gap-4 border-b border-gray-200 pb-4">

                <Search
                  className="w-5 h-5 text-gray-500 flex-shrink-0"
                  strokeWidth={1.5}
                />

                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search products..."
                  className="flex-1 outline-none text-base text-gray-900 placeholder:text-gray-400 bg-transparent"
                />

                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="p-1 text-gray-500 hover:text-black transition"
                  aria-label="Close Search"
                >
                  <X
                    className="w-5 h-5"
                    strokeWidth={1.5}
                  />
                </button>

              </div>

              {/* SEARCH RESULTS */}

              {searchQuery.trim() !== "" && (
                <div className="mt-5 max-h-[65vh] overflow-y-auto">

                  {filteredProducts.length > 0 ? (
                    <div className="divide-y divide-gray-100">

                      {filteredProducts
                        .slice(0, 8)
                        .map((product) => {
                          const image =
                            getProductImage(product);

                          return (
                            <button
                              type="button"
                              key={product.id}
                              onClick={() =>
                                handleSearchProduct(product)
                              }
                              className="w-full flex items-center gap-4 py-3 text-left hover:bg-gray-50 transition px-2"
                            >

                              {/* IMAGE */}

                              <div className="w-16 h-20 flex-shrink-0 bg-gray-100 overflow-hidden">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={getProductTitle(product)}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                                    No Image
                                  </div>
                                )}
                              </div>

                              {/* INFO */}

                              <div className="flex-1 min-w-0">

                                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                                  {getSellerName(product)}
                                </p>

                                <p className="mt-1 text-sm text-gray-900 truncate">
                                  {getProductTitle(product)}
                                </p>

                                <p className="mt-1 text-xs text-gray-600">
                                  {getPrice(product)}
                                </p>

                              </div>

                            </button>
                          );
                        })}

                    </div>
                  ) : (
                    <div className="py-10 text-center">

                      <Search
                        className="w-8 h-8 mx-auto text-gray-300"
                        strokeWidth={1.2}
                      />

                      <p className="mt-3 text-sm text-gray-500">
                        No products found for "{searchQuery}"
                      </p>

                    </div>
                  )}

                </div>
              )}

              {/* INITIAL SEARCH STATE */}

              {searchQuery.trim() === "" && (
                <div className="py-8 text-center">

                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    Search Tanlia Studio
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Find your favorite products and collections
                  </p>

                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;