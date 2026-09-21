import React, { useEffect, useState } from "react";
import { Heart, ShoppingBag, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeller, setSelectedSeller] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [wishlist, setWishlist] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);

useEffect(() => {
  fetch("https://tanlia-backend.onrender.com/api/products")
    .then((res) => res.json())
    .then((data) => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Failed to load products:", error);
      setLoading(false);
    });
}, []);
  useEffect(() => {
    const savedWishlist = JSON.parse(
      localStorage.getItem("tanliaWishlist") || "[]"
    );
    setWishlist(savedWishlist);
  }, []);

  const getProductTitle = (product) => {
    return (
      product.title ||
      product.name ||
      product.productName ||
      product.product?.title ||
      "Product"
    );
  };

  const getSellerName = (product) => {
    return (
      product.sellerName ||
      product.seller ||
      product.product?.sellerName ||
      product.product?.seller ||
      ""
    );
  };

  const getProductImages = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    if (Array.isArray(product.image) && product.image.length > 0) {
      return product.image;
    }

    if (product.image) {
      return [product.image];
    }

    if (product.media?.cover) {
      return [product.media.cover];
    }

    if (
      Array.isArray(product.media?.images) &&
      product.media.images.length > 0
    ) {
      return product.media.images;
    }

    if (Array.isArray(product.colors) && product.colors.length > 0) {
      const colorImages = product.colors
        .map((color) => color?.image)
        .filter(Boolean);

      if (colorImages.length > 0) {
        return colorImages;
      }
    }

    return [];
  };

  const getPrice = (product) => {
    if (product.pricing?.fullSet) {
      return product.pricing.fullSet;
    }

    if (product.pricing?.price) {
      return product.pricing.price;
    }

    if (product.pricing?.kameez) {
      return product.pricing.kameez;
    }

    if (product.pricing?.pant) {
      return product.pricing.pant;
    }

    return product.price || "0";
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

  const getCategories = (product) => {
    const category =
      product.category ||
      product.product?.category ||
      product.type ||
      "";

    return String(category)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const getColors = (product) => {
    if (Array.isArray(product.colors)) {
      return product.colors;
    }

    if (Array.isArray(product.variants?.colors)) {
      return product.variants.colors;
    }

    return [];
  };

  const getSizes = (product) => {
    if (Array.isArray(product.sizes)) {
      return product.sizes;
    }

    if (Array.isArray(product.variants?.sizes)) {
      return product.variants.sizes;
    }

    return [];
  };

  const categories = [
    "All",
    ...new Set(products.flatMap((product) => getCategories(product))),
  ];

  const sellers = [
    "All",
    ...new Set(
      products.map((product) => getSellerName(product)).filter(Boolean)
    ),
  ];

  const filteredProducts = products
    .filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
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
        return getProductTitle(a).localeCompare(getProductTitle(b));
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

      const cartItem = {
        id: String(product.id),
        title: getProductTitle(product),
        price: String(getPrice(product) || "0"),
        image: image || images[0] || "",
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

    setSelectedImage(images[0] || "");

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
    const productId = String(product.id);

    let updatedWishlist;

    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter(
        (id) => id !== productId
      );
    } else {
      updatedWishlist = [...wishlist, productId];
    }

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "tanliaWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  /* =========================
     ESCAPE QUICK VIEW
  ========================= */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeQuickView();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p className="text-sm">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">

      {/* =========================
          CART NOTIFICATION
      ========================= */}
      {showCartNotification && (
        <div className="fixed top-24 right-6 z-[100] bg-black text-white px-5 py-3 text-sm shadow-lg">
          Product added to cart
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}
      <section className="px-5 md:px-10 lg:px-16 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase mb-3">
              Tanlia Studio
            </p>

            <h1 className="text-3xl md:text-5xl font-light">
              All Products
            </h1>

            <p className="text-sm text-gray-600 mt-3">
              Discover our curated collection from independent sellers.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            {filteredProducts.length} Products
          </p>
        </div>
      </section>

      {/* =========================
          FILTERS
      ========================= */}
      <section className="px-5 md:px-10 lg:px-16 pb-8">
        <div className="border-y border-gray-200 py-5 flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs border transition ${
                  selectedCategory === category
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2 text-xs outline-none"
            >
              {sellers.map((seller) => (
                <option key={seller} value={seller}>
                  {seller === "All" ? "All Sellers" : seller}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 bg-white px-4 py-2 text-xs outline-none"
            >
              <option value="default">Sort By</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </section>

      {/* =========================
          PRODUCTS
      ========================= */}
      <section className="px-5 md:px-10 lg:px-16 pb-16">

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-sm">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">

            {filteredProducts.map((product) => {
              const images = getProductImages(product);
              const image = images[0] || "";
              const productId = String(product.id);
              const isWishlisted = wishlist.includes(productId);

              return (
                <div key={product.id} className="group">

                  {/* PRODUCT IMAGE */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">

                    {image ? (
                      <img
                        src={image}
                        alt={getProductTitle(product)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}

                    {/* WISHLIST */}
                    <button
                      onClick={() => handleWishlist(product)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.5}
                        fill={
                          isWishlisted
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    {/* =========================
                        HOVER ACTIONS
                    ========================= */}
                    <div className="absolute left-3 right-3 bottom-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                      {/* ADD TO CART - LONG BOX */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 min-w-0 bg-white text-black py-3 px-3 text-xs flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
                      >
                        <ShoppingBag size={15} />
                        <span>Add to Cart</span>
                      </button>

                      {/* QUICK VIEW - ICON ONLY */}
                      <button
                        onClick={() => openQuickView(product)}
                        aria-label="Quick View"
                        title="Quick View"
                        className="w-12 shrink-0 bg-white text-black py-3 flex items-center justify-center hover:bg-black hover:text-white transition"
                      >
                        <Eye size={16} />
                      </button>

                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="pt-4">

                    <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">
                      {getSellerName(product)}
                    </p>

                    <h3 className="text-sm md:text-base font-normal line-clamp-2">
                      {getProductTitle(product)}
                    </h3>

                    <p className="text-sm mt-2">
                      {getPrice(product)}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </section>

      {/* =========================
          QUICK VIEW MODAL
      ========================= */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4"
          onClick={closeQuickView}
        >
          <div
            className="relative bg-[#FDFBF7] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">

              {/* IMAGES */}
              <div className="p-5 md:p-8">

                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={getProductTitle(quickViewProduct)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>

                {getProductImages(quickViewProduct).length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">

                    {getProductImages(quickViewProduct).map(
                      (img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={`w-16 h-20 shrink-0 overflow-hidden border ${
                            selectedImage === img
                              ? "border-black"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )
                    )}

                  </div>
                )}
              </div>

              {/* DETAILS */}
              <div className="p-5 md:p-8 flex flex-col justify-center">

                <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">
                  {getSellerName(quickViewProduct)}
                </p>

                <h2 className="text-2xl md:text-3xl font-light">
                  {getProductTitle(quickViewProduct)}
                </h2>

                <p className="text-base mt-4">
                  {getPrice(quickViewProduct)}
                </p>

                {quickViewProduct.description && (
                  <p className="text-sm text-gray-600 leading-6 mt-5">
                    {quickViewProduct.description}
                  </p>
                )}

                {/* COLORS */}
                {getColors(quickViewProduct).length > 0 && (
                  <div className="mt-6">

                    <p className="text-xs uppercase tracking-wider mb-3">
                      Color
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {getColors(quickViewProduct).map(
                        (color, index) => {
                          const colorName =
                            typeof color === "string"
                              ? color
                              : color?.name || "";

                          const colorImage =
                            typeof color === "object"
                              ? color?.image || ""
                              : "";

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                setSelectedColor(colorName);

                                if (colorImage) {
                                  setSelectedImage(colorImage);
                                }
                              }}
                              className={`px-4 py-2 border text-xs ${
                                selectedColor === colorName
                                  ? "bg-black text-white border-black"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {colorName || "Color"}
                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>
                )}

                {/* SIZES */}
                {getSizes(quickViewProduct).length > 0 && (
                  <div className="mt-6">

                    <p className="text-xs uppercase tracking-wider mb-3">
                      Size
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {getSizes(quickViewProduct).map(
                        (size, index) => {
                          const sizeName =
                            typeof size === "string"
                              ? size
                              : size?.name || "";

                          return (
                            <button
                              key={index}
                              onClick={() =>
                                setSelectedSize(sizeName)
                              }
                              className={`px-4 py-2 border text-xs ${
                                selectedSize === sizeName
                                  ? "bg-black text-white border-black"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {sizeName || "Size"}
                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <button
                    onClick={() =>
                      handleAddToCart(
                        quickViewProduct,
                        selectedColor,
                        selectedSize,
                        selectedImage
                      )
                    }
                    className="flex-1 bg-black text-white py-3 text-sm flex items-center justify-center gap-2 hover:bg-black"
                  >
                    <ShoppingBag size={17} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      closeQuickView();
                      navigate(
                        `/products/${quickViewProduct.id}`
                      );
                    }}
                    className="flex-1 border border-black py-3 text-sm hover:bg-black hover:text-white transition"
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