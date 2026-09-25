
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const getProductId = (product) => {
    return product?.id || product?._id;
  };

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

    if (Array.isArray(product?.images)) {
      return product.images[0] || "";
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
              : typeof product?.description?.intro === "string"
              ? product.description.intro.toLowerCase()
              : "";

          return (
            title.includes(query) ||
            seller.includes(query) ||
            description.includes(query)
          );
        });

  /* =========================
     SEARCH ACTIONS
  ========================= */

  const handleOpenSearch = () => {
    setSearchOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearchProduct = (product) => {
    const productId = getProductId(product);

    if (!productId) return;

    handleCloseSearch();
    navigate(`/products/${productId}`);
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

  /* =========================
     NAV LINKS
  ========================= */

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Collections", path: "/collections" },
    { name: "Sellers", path: "/sellers" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Track Order", path: "/track-order" },
  ];

  return (
    <>
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E7E0D8]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[72px] sm:h-20 flex items-center">

            {/* MOBILE MENU */}
            <div className="md:hidden flex-1">
              <button
                type="button"
                onClick={handleMobileMenu}
                className="p-2 -ml-2 text-[#1A1A1A] hover:text-[#B85028] transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 stroke-[1.5]" />
                ) : (
                  <Menu className="w-5 h-5 stroke-[1.5]" />
                )}
              </button>
            </div>

            {/* BRAND */}
            <div className="flex-1 md:flex-none">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="inline-block text-[20px] sm:text-[23px] font-serif tracking-[0.08em] text-[#1A1A1A] whitespace-nowrap hover:text-[#B85028] transition-colors"
              >
                Tanlia Studio
              </Link>
            </div>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-5 lg:gap-7 xl:gap-8 ml-8">

              {navLinks.map((link) => {
                const active =
                  link.name === "Collections"
                    ? isCollectionsActive
                    : location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative py-2 text-[10px] lg:text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "text-[#1A1A1A]"
                        : "text-gray-600 hover:text-[#B85028]"
                    }`}
                  >
                    {link.name}

                    {active && (
                      <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#B85028]" />
                    )}
                  </Link>
                );
              })}

            </nav>

            {/* RIGHT ICONS */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 md:gap-4">

              {/* SEARCH */}
              <button
                type="button"
                onClick={handleOpenSearch}
                className="p-2 text-[#1A1A1A] hover:text-[#B85028] transition-colors"
                aria-label="Search"
              >
                <Search className="w-[19px] h-[19px] stroke-[1.5]" />
              </button>

              {/* WISHLIST */}
              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
                className="relative p-2 text-[#1A1A1A] hover:text-[#B85028] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-[19px] h-[19px] stroke-[1.5]" />

                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[15px] h-[15px] px-1 bg-[#B85028] text-white text-[8px] rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="relative p-2 text-[#1A1A1A] hover:text-[#B85028] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[19px] h-[19px] stroke-[1.5]" />

                <span className="absolute top-0 right-0 min-w-[15px] h-[15px] px-1 bg-[#B85028] text-white text-[8px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>

            </div>
          </div>
        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FDFBF7] border-t border-[#E7E0D8]">
            <nav className="px-5 sm:px-6 py-3">

              {navLinks.map((link, index) => {
                const active =
                  link.name === "Collections"
                    ? isCollectionsActive
                    : location.pathname === link.path;

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between py-4 text-[11px] uppercase tracking-[0.18em] border-b border-[#EAE4DD] transition-colors ${
                      active
                        ? "text-[#B85028]"
                        : "text-[#444] hover:text-[#B85028]"
                    } ${
                      index === navLinks.length - 1
                        ? "border-b-0"
                        : ""
                    }`}
                  >
                    <span>{link.name}</span>

                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B85028]" />
                    )}
                  </Link>
                );
              })}

            </nav>
          </div>
        )}
      </header>

      {/* =========================
          SEARCH OVERLAY
      ========================= */}

      {searchOpen && (
        <div className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[2px]">

          <div className="w-full bg-[#FDFBF7] shadow-xl">

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

              {/* SEARCH INPUT */}
              <div className="flex items-center gap-3 sm:gap-4 border-b border-[#DCD4CB] pb-4">

                <Search
                  className="w-5 h-5 text-[#B85028] flex-shrink-0"
                  strokeWidth={1.5}
                />

                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search products, boutiques..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-base text-[#1A1A1A] placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="p-1 text-gray-500 hover:text-[#B85028] transition-colors"
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
                    <div className="divide-y divide-[#EAE4DD]">

                      {filteredProducts
                        .slice(0, 8)
                        .map((product, index) => {
                          const image =
                            getProductImage(product);

                          return (
                            <button
                              type="button"
                              key={
                                getProductId(product) ||
                                index
                              }
                              onClick={() =>
                                handleSearchProduct(product)
                              }
                              className="w-full flex items-center gap-4 py-3 px-1 sm:px-2 text-left hover:bg-[#F5F0E9] transition-colors"
                            >

                              {/* IMAGE */}
                              <div className="w-14 h-[72px] sm:w-16 sm:h-20 flex-shrink-0 bg-[#EEE9E2] overflow-hidden">

                                {image ? (
                                  <img
                                    src={image}
                                    alt={getProductTitle(product)}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                                    No Image
                                  </div>
                                )}

                              </div>

                              {/* INFO */}
                              <div className="flex-1 min-w-0">

                                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[#B85028]">
                                  {getSellerName(product)}
                                </p>

                                <p className="mt-1 text-sm text-[#1A1A1A] truncate">
                                  {getProductTitle(product)}
                                </p>

                                <p className="mt-1 text-xs text-gray-600">
                                  {getPrice(product)}
                                </p>

                              </div>

                              <div className="hidden sm:block text-gray-400">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>

                            </button>
                          );
                        })}

                    </div>
                  ) : (
                    <div className="py-12 text-center">

                      <Search
                        className="w-8 h-8 mx-auto text-[#D8CEC3]"
                        strokeWidth={1.2}
                      />

                      <p className="mt-4 text-sm text-gray-500">
                        No products found for "{searchQuery}"
                      </p>

                    </div>
                  )}

                </div>
              )}

              {/* INITIAL SEARCH STATE */}
              {searchQuery.trim() === "" && (
                <div className="py-9 sm:py-12 text-center">

                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#B85028]">
                    Search Tanlia Studio
                  </p>

                  <p className="mt-2 text-xs sm:text-sm text-gray-500">
                    Find products, boutiques and collections
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
