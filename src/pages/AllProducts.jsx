
import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag, Eye, X, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Wishlist initial state = 0
  const [wishlist, setWishlist] = useState(0);

  const [showCartNotification, setShowCartNotification] = useState(false);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch(
          "https://tanlia-backend.onrender.com/api/products",
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load products:", error);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  /* =========================
     LOAD WISHLIST
  ========================= */

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = JSON.parse(
          localStorage.getItem("tanliaWishlist") || "[]"
        );

        if (!Array.isArray(savedWishlist)) {
          setWishlist([]);
          return;
        }

        const savedIds = savedWishlist
          .map((item) => {
            if (
              typeof item === "string" ||
              typeof item === "number"
            ) {
              return String(item);
            }

            if (item && typeof item === "object") {
              return String(item._id || item.id || "");
            }

            return "";
          })
          .filter(Boolean);

        setWishlist(savedIds);
      } catch (error) {
        console.error("Wishlist loading error:", error);
        setWishlist([]);
      }
    };

    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
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
  }, []);

  const getProductTitle = (product) => {
    return (
      product?.title ||
      product?.name ||
      product?.productName ||
      product?.product?.title ||
      "Product"
    );
  };

  const getSellerName = (product) => {
    return (
      product?.sellerName ||
      product?.seller ||
      product?.product?.sellerName ||
      product?.product?.seller ||
      ""
    );
  };

  /* =========================
     IMAGE HELPERS
  ========================= */

  const cleanImages = (images) => {
    if (!Array.isArray(images)) return [];

    return [
      ...new Set(
        images
          .filter(
            (image) =>
              typeof image === "string" &&
              image.trim() !== ""
          )
          .map((image) => image.trim())
      ),
    ];
  };

  const getProductImages = (product) => {
    if (!product) return [];

    if (Array.isArray(product.image)) {
      const images = cleanImages(product.image);

      if (images.length > 0) return images;
    }

    if (
      typeof product.image === "string" &&
      product.image.trim() !== ""
    ) {
      return [product.image.trim()];
    }

    if (Array.isArray(product.images)) {
      const images = cleanImages(product.images);

      if (images.length > 0) return images;
    }

    if (product.media) {
      const mediaImages = [];

      if (
        typeof product.media.cover === "string" &&
        product.media.cover.trim() !== ""
      ) {
        mediaImages.push(product.media.cover.trim());
      }

      if (Array.isArray(product.media.images)) {
        mediaImages.push(...product.media.images);
      }

      const cleanedMediaImages = cleanImages(mediaImages);

      if (cleanedMediaImages.length > 0) {
        return cleanedMediaImages;
      }
    }

    if (Array.isArray(product.colors)) {
      const colorImages = product.colors
        .map((color) => {
          if (
            color &&
            typeof color === "object" &&
            typeof color.image === "string"
          ) {
            return color.image.trim();
          }

          return "";
        })
        .filter(Boolean);

      const cleanedColorImages = cleanImages(colorImages);

      if (cleanedColorImages.length > 0) {
        return cleanedColorImages;
      }
    }

    return [];
  };

  /* =========================
     SAFE TEXT
  ========================= */

  const getSafeText = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => getSafeText(item))
        .filter(Boolean)
        .join(" ");
    }

    if (typeof value === "object") {
      if (
        typeof value.intro === "string" &&
        Array.isArray(value.details)
      ) {
        return [
          value.intro,
          ...value.details.map((detail) =>
            getSafeText(detail)
          ),
        ]
          .filter(Boolean)
          .join(" ");
      }

      if (typeof value.intro === "string") {
        return value.intro;
      }

      if (typeof value.details === "string") {
        return value.details;
      }

      return "";
    }

    return "";
  };

  const renderDescription = (description) => {
    if (!description) return null;

    if (typeof description === "string") {
      return <p>{description}</p>;
    }

    if (Array.isArray(description)) {
      const safeItems = description
        .map((item) => getSafeText(item))
        .filter(Boolean);

      if (safeItems.length === 0) return null;

      return (
        <ul className="space-y-1.5">
          {safeItems.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      );
    }

    if (typeof description === "object") {
      const intro = getSafeText(description.intro);

      const details = Array.isArray(description.details)
        ? description.details
            .map((detail) => getSafeText(detail))
            .filter(Boolean)
        : [];

      return (
        <>
          {intro && <p>{intro}</p>}

          {details.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {details.map((detail, index) => (
                <li key={index}>• {detail}</li>
              ))}
            </ul>
          )}
        </>
      );
    }

    return null;
  };

  /* =========================
     PRICE
  ========================= */

  const getPrice = (product) => {
    if (product?.pricing?.fullSet) {
      return product.pricing.fullSet;
    }

    if (product?.pricing?.price) {
      return product.pricing.price;
    }

    if (product?.pricing?.kameez) {
      return product.pricing.kameez;
    }

    if (product?.pricing?.pant) {
      return product.pricing.pant;
    }

    return product?.price || "0";
  };

  const getNumericPrice = (price) => {
    if (typeof price === "number") {
      return price;
    }

    const numeric = String(price || "")
      .replace(/[^\d.]/g, "")
      .trim();

    return Number(numeric) || 0;
  };

  /* =========================
     CATEGORY
  ========================= */

  const getCategories = (product) => {
    const category =
      product?.category ||
      product?.product?.category ||
      product?.type ||
      "";

    return String(category)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  /* =========================
     COLORS
  ========================= */

  const getColors = (product) => {
    if (Array.isArray(product?.colors)) {
      return product.colors.filter(Boolean);
    }

    if (Array.isArray(product?.variants?.colors)) {
      return product.variants.colors.filter(Boolean);
    }

    return [];
  };

  /* =========================
     SIZES
  ========================= */

  const getSizes = (product) => {
    if (Array.isArray(product?.sizes)) {
      return product.sizes.filter(Boolean);
    }

    if (Array.isArray(product?.variants?.sizes)) {
      return product.variants.sizes.filter(Boolean);
    }

    return [];
  };

  /* =========================
     FILTER OPTIONS
  ========================= */

  const categories = [
    "Women's Fashion",
    "Men's Fashion",
    "Unisex",
    "Accessories",
    "Home & Lifestyle",
  ];

  const sellers = [
    "All",
    ...new Set(
      products
        .map((product) => getSellerName(product))
        .filter(Boolean)
    ),
  ];

  const filteredProducts = products
    .filter((product) => {
      const categoryMatch =
        selectedCategory === "" ||
        getCategories(product).includes(selectedCategory);

      const sellerMatch =
        selectedSeller === "All" ||
        getSellerName(product) === selectedSeller;

      return categoryMatch && sellerMatch;
    })
    .sort((a, b) => {
      const priceA = getNumericPrice(getPrice(a));
      const priceB = getNumericPrice(getPrice(b));

      if (sortBy === "low") {
        return priceA - priceB;
      }

      if (sortBy === "high") {
        return priceB - priceA;
      }

      if (sortBy === "name") {
        return getProductTitle(a).localeCompare(
          getProductTitle(b)
        );
      }

      return 0;
    });

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = (
    product,
    color = "",
    size = "",
    image = ""
  ) => {
    try {
      const existingCart = JSON.parse(
        localStorage.getItem("tanliaCart") || "[]"
      );

      const images = getProductImages(product);

      const selectedCartImage =
        typeof image === "string" && image.trim()
          ? image.trim()
          : images.length > 0
          ? images[0]
          : "";

      const cartItem = {
        id: String(product._id || product.id),
        title: getProductTitle(product),
        price: String(getPrice(product) || "0"),
        image: selectedCartImage,
        seller: getSellerName(product),
        color: color || "",
        size: size || "",
        quantity: 1,
      };

      existingCart.push(cartItem);

      localStorage.setItem(
        "tanliaCart",
        JSON.stringify(existingCart)
      );

      window.dispatchEvent(new Event("cartUpdated"));

      setShowCartNotification(true);

      setTimeout(() => {
        setShowCartNotification(false);
      }, 2000);
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  /* =========================
     QUICK VIEW
  ========================= */

  const openQuickView = (product) => {
    setQuickViewProduct(product);

    const images = getProductImages(product);

    setSelectedImage(
      images.length > 0 ? images[0] : ""
    );

    const colors = getColors(product);
    const sizes = getSizes(product);

    setSelectedColor(
      colors.length > 0
        ? typeof colors[0] === "string"
          ? colors[0]
          : colors[0]?.name || ""
        : ""
    );

    setSelectedSize(
      sizes.length > 0
        ? typeof sizes[0] === "string"
          ? sizes[0]
          : sizes[0]?.name || ""
        : ""
    );
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedImage("");
    setSelectedColor("");
    setSelectedSize("");
  };

  /* =========================
     WISHLIST
  ========================= */

  const handleWishlist = (product) => {
    try {
      const productId = String(
        product._id || product.id || ""
      );

      if (!productId) {
        console.error("Product ID missing:", product);
        return;
      }

      const savedWishlist = JSON.parse(
        localStorage.getItem("tanliaWishlist") || "[]"
      );

      const wishlistItems = Array.isArray(savedWishlist)
        ? savedWishlist
        : [];

      const currentIds = wishlistItems
        .map((item) => {
          if (
            typeof item === "string" ||
            typeof item === "number"
          ) {
            return String(item);
          }

          if (item && typeof item === "object") {
            return String(item._id || item.id || "");
          }

          return "";
        })
        .filter(Boolean);

      const alreadyExists = currentIds.includes(productId);

      let updatedIds;

      if (alreadyExists) {
        updatedIds = currentIds.filter(
          (id) => id !== productId
        );
      } else {
        updatedIds = [...currentIds, productId];
      }

      // Save ONLY product IDs
      localStorage.setItem(
        "tanliaWishlist",
        JSON.stringify(updatedIds)
      );

      setWishlist(updatedIds);

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  /* =========================
     ESCAPE + BODY LOCK
  ========================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeQuickView();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [quickViewProduct]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
            Tanlia Studio
          </p>

          <p className="mt-3 text-sm text-gray-600">
            Loading collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* CART NOTIFICATION */}

      {showCartNotification && (
        <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[100] bg-[#1A1816] text-white px-5 py-3 text-xs sm:text-sm shadow-xl">
          Product added to cart
        </div>
      )}

      {/* PAGE HEADER */}

      <section className="px-5 sm:px-8 md:px-10 lg:px-16 pt-14 sm:pt-16 lg:pt-20 pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>

              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#B85028] mb-3">
                The Collection
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
                All Products
              </h1>

              <p className="text-sm text-gray-500 mt-4 max-w-xl leading-6">
                Discover thoughtfully selected pieces from
                independent boutiques, brought together in one
                curated collection.
              </p>

            </div>

            <div className="text-left md:text-right">

              <p className="text-2xl font-light">
                {filteredProducts.length}
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-1">
                Products
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* FILTER BAR */}

      <section className="px-5 sm:px-8 md:px-10 lg:px-16 pb-10">

        <div className="max-w-7xl mx-auto border-y border-[#DED8D0]">

          {/* MOBILE FILTER TOGGLE */}

          <div className="flex items-center justify-between py-4 lg:hidden">

            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]"
            >
              <SlidersHorizontal
                size={15}
                strokeWidth={1.5}
              />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="bg-transparent text-xs outline-none"
            >
              <option value="default">
                Sort By
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="name">
                Name
              </option>
            </select>

          </div>

          <div
            className={`${
              showFilters ? "flex" : "hidden"
            } lg:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 py-5`}
          >

            {/* CATEGORIES */}

            <div className="flex flex-wrap gap-x-5 gap-y-3">

              <button
                type="button"
                onClick={() =>
                  setSelectedCategory("")
                }
                className={`text-xs transition-colors ${
                  selectedCategory === ""
                    ? "text-[#B85028]"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`text-xs transition-colors ${
                    selectedCategory === category
                      ? "text-[#B85028]"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

            {/* DESKTOP FILTERS */}

            <div className="hidden lg:flex items-center gap-3">

              <select
                value={selectedSeller}
                onChange={(e) =>
                  setSelectedSeller(e.target.value)
                }
                className="bg-transparent border-b border-gray-300 py-2 px-1 text-xs outline-none min-w-[130px]"
              >
                {sellers.map((seller) => (
                  <option
                    key={seller}
                    value={seller}
                  >
                    {seller === "All"
                      ? "All Sellers"
                      : seller}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="bg-transparent border-b border-gray-300 py-2 px-1 text-xs outline-none min-w-[130px]"
              >
                <option value="default">
                  Sort By
                </option>

                <option value="low">
                  Price: Low to High
                </option>

                <option value="high">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>
              </select>

            </div>

            {/* MOBILE SELLER */}

            <div className="lg:hidden">

              <select
                value={selectedSeller}
                onChange={(e) =>
                  setSelectedSeller(e.target.value)
                }
                className="w-full bg-transparent border-b border-gray-300 py-2 text-xs outline-none"
              >
                {sellers.map((seller) => (
                  <option
                    key={seller}
                    value={seller}
                  >
                    {seller === "All"
                      ? "All Sellers"
                      : seller}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}

      <section className="px-5 sm:px-8 md:px-10 lg:px-16 pb-20">

        <div className="max-w-7xl mx-auto">

          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center border-t border-[#DED8D0]">

              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                Collection
              </p>

              <p className="text-gray-500 text-sm mt-3">
                No products found.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSeller("All");
                  setSortBy("default");
                }}
                className="mt-6 text-xs uppercase tracking-[0.15em] border-b border-black pb-1"
              >
                Clear filters
              </button>

            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 lg:gap-x-7 gap-y-12 sm:gap-y-14">

              {filteredProducts.map((product) => {

                const images =
                  getProductImages(product);

                const image =
                  images.length > 0
                    ? images[0]
                    : "";

                const productId = String(
                  product._id || product.id
                );

                const isWishlisted =
                  Array.isArray(wishlist) &&
                  wishlist.includes(productId);

                return (
                  <article
                    key={productId}
                    className="group min-w-0"
                  >

                    {/* IMAGE */}

                    <div className="relative overflow-hidden bg-[#F1EEE9] aspect-[3/4]">

                      {image ? (
                        <img
                          src={image}
                          alt={getProductTitle(product)}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}

                      {/* WISHLIST */}

                      <button
                        type="button"
                        onClick={() =>
                          handleWishlist(product)
                        }
                        aria-label={
                          isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                        className="absolute top-3 right-3 w-9 h-9 bg-[#FDFBF7]/95 flex items-center justify-center z-20 transition-all duration-300 hover:bg-black hover:text-white"
                      >
                        <Heart
                          size={16}
                          strokeWidth={1.4}
                          fill={
                            isWishlisted
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      {/* ACTIONS */}

                      <div className="absolute left-3 right-3 bottom-3 flex gap-2 opacity-100 translate-y-0 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">

                        <button
                          type="button"
                          onClick={() =>
                            handleAddToCart(product)
                          }
                          className="flex-1 min-w-0 bg-[#FDFBF7] text-black py-3 px-2 sm:px-3 text-[10px] sm:text-xs uppercase tracking-[0.08em] flex items-center justify-center gap-1.5 hover:bg-black hover:text-white transition-colors"
                        >
                          <ShoppingBag
                            size={14}
                            strokeWidth={1.5}
                          />

                          <span>
                            Add to Cart
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openQuickView(product)
                          }
                          aria-label="Quick View"
                          title="Quick View"
                          className="w-11 sm:w-12 shrink-0 bg-[#FDFBF7] text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        >
                          <Eye
                            size={15}
                            strokeWidth={1.5}
                          />
                        </button>

                      </div>

                    </div>

                    {/* INFO */}

                    <div className="pt-4">

                      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1.5 truncate">
                        {getSellerName(product)}
                      </p>

                      <h3 className="text-xs sm:text-sm md:text-base font-normal leading-5 line-clamp-2">
                        {getProductTitle(product)}
                      </h3>

                      <p className="text-xs sm:text-sm mt-2">
                        {getPrice(product)}
                      </p>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </section>

      {/* QUICK VIEW MODAL */}

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-5"
          onClick={closeQuickView}
        >

          <div
            className="relative bg-[#FDFBF7] w-full max-w-5xl max-h-[94vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close quick view"
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-9 h-9 bg-[#FDFBF7] border border-[#DED8D0] flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"
            >
              <X
                size={17}
                strokeWidth={1.5}
              />
            </button>

            <div className="grid md:grid-cols-2">

              {/* IMAGES */}

              <div className="p-4 sm:p-6 lg:p-8">

                <div className="aspect-[3/4] bg-[#F1EEE9] overflow-hidden">

                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={getProductTitle(
                        quickViewProduct
                      )}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}

                </div>

                {getProductImages(
                  quickViewProduct
                ).length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1">

                    {getProductImages(
                      quickViewProduct
                    ).map((img, index) => (
                      <button
                        type="button"
                        key={`${img}-${index}`}
                        onClick={() =>
                          setSelectedImage(img)
                        }
                        className={`w-14 sm:w-16 h-18 sm:h-20 shrink-0 overflow-hidden border ${
                          selectedImage === img
                            ? "border-black"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </button>
                    ))}

                  </div>
                )}

              </div>

              {/* DETAILS */}

              <div className="p-5 sm:p-7 lg:p-10 flex flex-col justify-center">

                <p className="text-[10px] uppercase tracking-[0.22em] text-[#B85028] mb-3">
                  {getSellerName(
                    quickViewProduct
                  )}
                </p>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-tight pr-8">
                  {getProductTitle(
                    quickViewProduct
                  )}
                </h2>

                <p className="text-base mt-4">
                  {getPrice(
                    quickViewProduct
                  )}
                </p>

                {quickViewProduct.description && (
                  <div className="text-sm text-gray-500 leading-6 mt-5 max-w-lg">
                    {renderDescription(
                      quickViewProduct.description
                    )}
                  </div>
                )}

                {getColors(
                  quickViewProduct
                ).length > 0 && (
                  <div className="mt-6">

                    <p className="text-[10px] uppercase tracking-[0.2em] mb-3">
                      Color
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {getColors(
                        quickViewProduct
                      ).map((color, index) => {

                        const colorName =
                          typeof color === "string"
                            ? color.trim()
                            : color?.name || "";

                        const colorImage =
                          typeof color === "object" &&
                          typeof color?.image === "string"
                            ? color.image.trim()
                            : "";

                        if (!colorName) return null;

                        return (
                          <button
                            type="button"
                            key={`${colorName}-${index}`}
                            onClick={() => {
                              setSelectedColor(
                                colorName
                              );

                              if (colorImage) {
                                setSelectedImage(
                                  colorImage
                                );
                              }
                            }}
                            className={`px-4 py-2 border text-xs transition-colors ${
                              selectedColor === colorName
                                ? "bg-black text-white border-black"
                                : "bg-transparent border-gray-300 hover:border-black"
                            }`}
                          >
                            {colorName}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

                {getSizes(
                  quickViewProduct
                ).length > 0 && (
                  <div className="mt-6">

                    <p className="text-[10px] uppercase tracking-[0.2em] mb-3">
                      Size
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {getSizes(
                        quickViewProduct
                      ).map((size, index) => {

                        const sizeName =
                          typeof size === "string"
                            ? size.trim()
                            : size?.name ||
                              size?.size ||
                              size?.title ||
                              "";

                        if (!sizeName) return null;

                        return (
                          <button
                            type="button"
                            key={`${sizeName}-${index}`}
                            onClick={() =>
                              setSelectedSize(
                                sizeName
                              )
                            }
                            className={`px-4 py-2 border text-xs transition-colors ${
                              selectedSize === sizeName
                                ? "bg-black text-white border-black"
                                : "bg-transparent border-gray-300 hover:border-black"
                            }`}
                          >
                            {sizeName}
                          </button>
                        );
                      })}

                    </div>

                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(
                        quickViewProduct,
                        selectedColor,
                        selectedSize,
                        selectedImage
                      )
                    }
                    className="flex-1 bg-black text-white py-3.5 text-xs uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:bg-[#B85028] transition-colors"
                  >
                    <ShoppingBag
                      size={16}
                      strokeWidth={1.5}
                    />
                    Add to Cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeQuickView();

                      navigate(
                        `/products/${
                          quickViewProduct._id ||
                          quickViewProduct.id
                        }`
                      );
                    }}
                    className="flex-1 border border-black py-3.5 text-xs uppercase tracking-[0.12em] hover:bg-black hover:text-white transition-colors"
                  >
                    View Details
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AllProducts;