import React, { useEffect, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Eye,
  ArrowRight,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showCartNotification, setShowCartNotification] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://tanlia-backend.onrender.com/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        return res.json();
      })
      .then((data) => {
        const normalizedProducts = Array.isArray(data)
          ? data.map((product) => ({
              ...product,
              id: product.id || product._id,
            }))
          : [];

        setProducts(normalizedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setQuickViewProduct(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
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

  const getProductImages = (product) => {
    if (!product) return [];

    const images = [];

    if (Array.isArray(product.image)) {
      product.image.forEach((img) => {
        if (typeof img === "string" && img.trim()) {
          images.push(img.trim());
        }
      });
    } else if (
      typeof product.image === "string" &&
      product.image.trim()
    ) {
      images.push(product.image.trim());
    }

    if (Array.isArray(product.colors)) {
      product.colors.forEach((color) => {
        if (
          color &&
          typeof color === "object" &&
          typeof color.image === "string" &&
          color.image.trim()
        ) {
          images.push(color.image.trim());
        }
      });
    }

    return [...new Set(images)];
  };

  const getProductColors = (product) => {
    if (!product) return [];

    if (Array.isArray(product.colors)) {
      return product.colors
        .map((color) => {
          if (color && typeof color === "object") {
            return {
              name: String(color.name || "").trim(),
              image: color.image || "",
            };
          }

          if (typeof color === "string") {
            return {
              name: color.trim(),
              image: "",
            };
          }

          return {
            name: "",
            image: "",
          };
        })
        .filter((color) => color.name);
    }

    if (product.variants && Array.isArray(product.variants.colors)) {
      return product.variants.colors
        .map((color) => {
          if (typeof color === "string") {
            return {
              name: color.trim(),
              image: "",
            };
          }

          if (color && typeof color === "object") {
            return {
              name: String(
                color.name || color.color || ""
              ).trim(),
              image: color.image || "",
            };
          }

          return {
            name: "",
            image: "",
          };
        })
        .filter((color) => color.name);
    }

    return [];
  };

  const getProductSizes = (product) => {
    if (!product) return [];

    if (Array.isArray(product.sizes)) {
      return product.sizes
        .map((size) => {
          if (typeof size === "string") {
            return size.trim();
          }

          if (size && typeof size === "object") {
            return size.name || size.size || "";
          }

          return "";
        })
        .filter(Boolean);
    }

    if (product.variants && Array.isArray(product.variants.sizes)) {
      return product.variants.sizes
        .map((size) => {
          if (typeof size === "string") {
            return size.trim();
          }

          if (size && typeof size === "object") {
            return size.name || size.size || "";
          }

          return "";
        })
        .filter(Boolean);
    }

    return [];
  };

  const handleWishlist = (product) => {
    const wishlist = JSON.parse(
      localStorage.getItem("tanliaWishlist") || "[]"
    );

    const productId = product.id || product._id;

    const alreadyExists = wishlist.some(
      (item) => (item.id || item._id) === productId
    );

    let updatedWishlist;

    if (alreadyExists) {
      updatedWishlist = wishlist.filter(
        (item) => (item.id || item._id) !== productId
      );
    } else {
      updatedWishlist = [...wishlist, product];
    }

    localStorage.setItem(
      "tanliaWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const handleAddToCart = (
    product,
    selectedColorValue = "",
    selectedSizeValue = ""
  ) => {
    const cart = JSON.parse(
      localStorage.getItem("tanliaCart") || "[]"
    );

    const productImages = getProductImages(product);

    const cartItem = {
      ...product,
      selectedColor: selectedColorValue,
      selectedSize: selectedSizeValue,
      selectedImage: productImages[0] || "",
      quantity: 1,
    };

    cart.push(cartItem);

    localStorage.setItem(
      "tanliaCart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(new Event("cartUpdated"));

    setShowCartNotification(true);

    setTimeout(() => {
      setShowCartNotification(false);
    }, 2000);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);

    const images = getProductImages(product);
    const colors = getProductColors(product);
    const sizes = getProductSizes(product);

    setSelectedImage(images[0] || "");
    setSelectedColor(colors.length > 0 ? colors[0].name : "");
    setSelectedSize(sizes.length > 0 ? sizes[0] : "");

    if (colors.length > 0 && colors[0].image) {
      setSelectedImage(colors[0].image);
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.name);

    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedImage("");
    setSelectedColor("");
    setSelectedSize("");
  };

  // Only these products will appear in the 30% OFF section
  const discountProductIds = [27, 28, 31, 32, 33, 34];

  const discountProducts = products.filter((product) =>
    discountProductIds.includes(Number(product.id))
  );

  if (loading) {
    return (
      <section className="bg-[#FDFBF7] py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          Loading collection
        </p>
      </section>
    );
  }

  return (
    <section className="bg-[#FDFBF7] py-20 sm:py-24 lg:py-28 text-[#171717]">

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-24 right-5 sm:right-8 z-[100] bg-[#171717] text-white px-5 py-3 text-xs tracking-wide shadow-xl">
          Product added to cart
        </div>
      )}

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* ================= FEATURED PRODUCTS ================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 lg:mb-14">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#B85028]" />

              <span className="text-[10px] tracking-[0.28em] uppercase text-[#B85028] font-medium">
                Handpicked
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#171717] tracking-tight">
              Featured products
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-neutral-500 font-light sm:text-right">
            Explore pieces selected from our growing community of
            independent boutique sellers.
          </p>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">

          {products.slice(0, 8).map((product) => {

            const productImages = getProductImages(product);
            const productImage = productImages[0] || "";

            return (
              <div
                key={product.id}
                className="group min-w-0"
              >

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#EEE9E2]">

                  <Link to={`/products/${product.id}`}>
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={product.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                        No Image Available
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.05] transition-colors duration-500" />
                  </Link>

                  {/* Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {product.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className={`${badge.bg} text-[8px] sm:text-[9px] font-semibold px-2 py-1 tracking-[0.12em] uppercase`}
                        >
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    type="button"
                    aria-label="Add to Wishlist"
                    onClick={() => handleWishlist(product)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#333] hover:bg-white hover:text-[#B85028] transition-all duration-300 z-20"
                  >
                    <Heart className="w-4 h-4 stroke-[1.5]" />
                  </button>

                  {/* Hover Actions */}
                  <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-white text-[#171717] py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:bg-[#B85028] hover:text-white transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to cart
                    </button>

                    <button
                      type="button"
                      aria-label="Quick View"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleQuickView(product);
                      }}
                      className="w-11 h-11 bg-white text-[#171717] flex items-center justify-center hover:bg-[#171717] hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* Product Info */}
                <div className="pt-4">

                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    {product.sellerName}
                  </p>

                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-xs sm:text-sm font-medium text-[#222] leading-snug line-clamp-2 hover:text-[#B85028] transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium text-[#222]">
                      ৳{product.price}
                    </span>

                    {product.originalPrice && (
                      <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                        ৳{product.originalPrice}
                      </span>
                    )}
                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {/* Explore All */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#171717] border-b border-[#171717]/40 pb-2 hover:border-[#B85028] hover:text-[#B85028] transition-all duration-300"
          >
            Explore all products
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ================= 30% OFF SECTION ================= */}

        <div className="mt-24 sm:mt-28 lg:mt-32">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 lg:mb-14">

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-[#B85028]" />

                <span className="text-[10px] tracking-[0.28em] uppercase text-[#B85028] font-medium">
                  Special Offer
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl text-[#171717] tracking-tight">
                30% Off
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-neutral-500 font-light sm:text-right">
              Discover selected pieces available at a special price.
            </p>

          </div>

          {/* Discount Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">

            {discountProducts.map((product) => {

              const productImages = getProductImages(product);
              const productImage = productImages[0] || "";

              return (
                <div
                  key={`discount-${product.id}`}
                  className="group min-w-0"
                >

                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#EEE9E2]">

                    <Link to={`/products/${product.id}`}>
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.title}
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                "[data-image-fallback]"
                              );

                            if (fallback) {
                              fallback.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        data-image-fallback
                        className={`w-full h-full items-center justify-center text-neutral-400 text-xs ${
                          productImage ? "hidden" : "flex"
                        }`}
                      >
                        No Image Available
                      </div>

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.05] transition-colors duration-500" />
                    </Link>

                    {/* 30% OFF Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#B85028] text-white text-[8px] sm:text-[9px] font-semibold px-2.5 py-1.5 tracking-[0.12em] uppercase">
                        30% OFF
                      </span>
                    </div>

                    {/* Wishlist */}
                    <button
                      type="button"
                      aria-label="Add to Wishlist"
                      onClick={() => handleWishlist(product)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#333] hover:bg-white hover:text-[#B85028] transition-all duration-300 z-20"
                    >
                      <Heart className="w-4 h-4 stroke-[1.5]" />
                    </button>

                    {/* Hover Actions */}
                    <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-white text-[#171717] py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] flex items-center justify-center gap-2 hover:bg-[#B85028] hover:text-white transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to cart
                      </button>

                      <button
                        type="button"
                        aria-label="Quick View"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickView(product);
                        }}
                        className="w-11 h-11 bg-white text-[#171717] flex items-center justify-center hover:bg-[#171717] hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                  {/* Product Info */}
                  <div className="pt-4">

                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                      {product.sellerName}
                    </p>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-xs sm:text-sm font-medium text-[#222] leading-snug line-clamp-2 hover:text-[#B85028] transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {/* IMPORTANT:
                        Show exact backend price.
                        No price calculation here.
                    */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">

                      <span className="text-xs sm:text-sm font-medium text-[#B85028]">
                        ৳{product.price}
                      </span>

                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                          ৳{product.originalPrice}
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* ================= QUICK VIEW MODAL ================= */}

      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeQuickView}
        >

          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#FDFBF7] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close */}
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close Quick View"
              className="absolute top-4 right-4 z-30 w-9 h-9 bg-white flex items-center justify-center text-[#222] hover:bg-[#171717] hover:text-white transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">

              {/* Image */}
              <div className="bg-[#EEE9E2]">

                <div className="w-full h-[430px] sm:h-[500px] md:h-[560px]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={quickViewProduct.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>

                {getProductImages(quickViewProduct).length > 0 && (
                  <div className="bg-[#FDFBF7] px-4 py-4">
                    <div className="flex gap-3 overflow-x-auto justify-center">

                      {getProductImages(quickViewProduct).map(
                        (image, index) => (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() => setSelectedImage(image)}
                            className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border transition-all ${
                              selectedImage === image
                                ? "border-[#171717]"
                                : "border-transparent hover:border-neutral-400"
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${quickViewProduct.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        )
                      )}

                    </div>
                  </div>
                )}

              </div>

              {/* Information */}
              <div className="p-6 sm:p-8 md:p-10 pt-12 md:pt-16">

                <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  {quickViewProduct.sellerName}
                </span>

                <h2 className="text-2xl sm:text-3xl font-serif text-[#171717] mt-3 pr-8 leading-tight">
                  {quickViewProduct.title}
                </h2>

                {/* Exact Product Price */}
                <div className="mt-4 flex items-center gap-3">

                  <span className="text-lg font-medium text-[#171717]">
                    ৳{quickViewProduct.price}
                  </span>

                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      ৳{quickViewProduct.originalPrice}
                    </span>
                  )}

                </div>

                {/* Description */}
                <div className="mt-6">

                  <p className="text-sm leading-6 text-neutral-600">
                    {typeof quickViewProduct.description === "object"
                      ? quickViewProduct.description.intro
                      : quickViewProduct.description ||
                        "A thoughtfully selected piece from one of our independent boutique sellers."}
                  </p>

                  {typeof quickViewProduct.description === "object" &&
                    Array.isArray(quickViewProduct.description.details) && (
                      <div className="mt-4 space-y-2">
                        {quickViewProduct.description.details
                          .slice(0, 3)
                          .map((detail, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-xs text-neutral-600"
                            >
                              <span className="mt-1 w-1 h-1 bg-neutral-500 rounded-full flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                      </div>
                    )}

                </div>

                {/* Options */}
                <div className="mt-7 space-y-6">

                  {/* Color */}
                  {getProductColors(quickViewProduct).length > 0 && (
                    <div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171717]">
                          Color
                        </span>

                        <span className="text-xs text-neutral-500">
                          {selectedColor}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getProductColors(quickViewProduct).map(
                          (color, index) => (
                            <button
                              key={`${color.name}-${index}`}
                              type="button"
                              onClick={() => handleColorChange(color)}
                              className={`px-3.5 py-2 border text-xs transition-all ${
                                selectedColor === color.name
                                  ? "border-[#171717] bg-[#171717] text-white"
                                  : "border-neutral-300 bg-white text-neutral-800 hover:border-[#171717]"
                              }`}
                            >
                              {color.name}
                            </button>
                          )
                        )}
                      </div>

                    </div>
                  )}

                  {/* Size */}
                  {getProductSizes(quickViewProduct).length > 0 && (
                    <div>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#171717]">
                          Size
                        </span>

                        <span className="text-xs text-neutral-500">
                          {selectedSize}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {getProductSizes(quickViewProduct).map(
                          (size, index) => (
                            <button
                              key={`${size}-${index}`}
                              type="button"
                              onClick={() => setSelectedSize(size)}
                              className={`min-w-[44px] px-3 py-2 border text-xs transition-all ${
                                selectedSize === size
                                  ? "border-[#171717] bg-[#171717] text-white"
                                  : "border-neutral-300 bg-white text-neutral-800 hover:border-[#171717]"
                              }`}
                            >
                              {size}
                            </button>
                          )
                        )}
                      </div>

                    </div>
                  )}

                </div>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(
                        quickViewProduct,
                        selectedColor,
                        selectedSize
                      )
                    }
                    className="w-full bg-[#171717] text-white py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 hover:bg-[#B85028] transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to cart
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const productId = quickViewProduct.id;

                      closeQuickView();
                      navigate(`/products/${productId}`);
                    }}
                    className="w-full text-[#171717] py-3.5 text-[10px] font-semibold tracking-[0.18em] uppercase border border-neutral-300 hover:border-[#171717] transition-colors"
                  >
                    View details
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default FeaturedProducts;