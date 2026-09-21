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
    fetch("/data/products.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Close Quick View with Escape key
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

  // Prevent background scrolling while modal is open
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

  // Get all product images
  const getProductImages = (product) => {
    if (!product) return [];

    if (Array.isArray(product.image)) {
      return product.image.filter(Boolean);
    }

    return product.image ? [product.image] : [];
  };

  // Get Colors from JSON
  const getProductColors = (product) => {
    if (!product) return [];

    if (Array.isArray(product.colors)) {
      return product.colors
        .map((color) => {
          // New standard JSON format
          if (color && typeof color === "object") {
            return {
              name: String(color.name || "").trim(),
              image: color.image || "",
            };
          }

          // Old string format
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

    // Nested products
    if (
      product.variants &&
      Array.isArray(product.variants.colors)
    ) {
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
                color.name ||
                  color.color ||
                  ""
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

  // Get Sizes from JSON
  const getProductSizes = (product) => {
    if (!product) return [];

    if (Array.isArray(product.sizes)) {
      return product.sizes
        .map((size) => {
          if (typeof size === "string") {
            return size.trim();
          }

          if (size && typeof size === "object") {
            return (
              size.name ||
              size.size ||
              ""
            );
          }

          return "";
        })
        .filter(Boolean);
    }

    // Nested products
    if (
      product.variants &&
      Array.isArray(product.variants.sizes)
    ) {
      return product.variants.sizes
        .map((size) => {
          if (typeof size === "string") {
            return size.trim();
          }

          if (size && typeof size === "object") {
            return (
              size.name ||
              size.size ||
              ""
            );
          }

          return "";
        })
        .filter(Boolean);
    }

    return [];
  };

  // Add product to cart
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

    // Update Navbar cart count instantly
    window.dispatchEvent(new Event("cartUpdated"));

    // Show cart notification
    setShowCartNotification(true);

    setTimeout(() => {
      setShowCartNotification(false);
    }, 2000);
  };

  // Open Quick View
  const handleQuickView = (product) => {
    setQuickViewProduct(product);

    const images = getProductImages(product);
    const colors = getProductColors(product);
    const sizes = getProductSizes(product);

    // First product image
    setSelectedImage(images[0] || "");

    // First color
    setSelectedColor(
      colors.length > 0
        ? colors[0].name
        : ""
    );

    // First size
    setSelectedSize(
      sizes.length > 0
        ? sizes[0]
        : ""
    );

    // If first color has its own image,
    // show that image
    if (colors.length > 0 && colors[0].image) {
      setSelectedImage(colors[0].image);
    }
  };

  // Change Color + Image
  const handleColorChange = (color) => {
    setSelectedColor(color.name);

    if (color.image) {
      setSelectedImage(color.image);
    }
  };

  // Close Quick View
  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedImage("");
    setSelectedColor("");
    setSelectedSize("");
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 font-serif">
        Loading Featured Products...
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#F5F1EA] text-gray-900">

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-24 right-6 z-[100] bg-black text-white px-5 py-3 text-sm shadow-lg">
          Product added to cart
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="uppercase text-xs tracking-[0.25em] font-semibold text-orange-500 block mb-2">
            HANDPICKED
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-gray-900 mb-2 font-normal uppercase">
            FEATURED PRODUCTS
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 font-light">
            A selection of our most loved pieces from across all boutique sellers
          </p>
        </div>

        {/* 8 Featured Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.slice(0, 8).map((product) => {

            const productImage = Array.isArray(product.image)
              ? product.image.find((img) => img)
              : product.image;

            return (
              <div
                key={product.id}
                className="group flex flex-col"
              >

                {/* Image Container */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] shadow-sm">

                  {/* Product Image */}
                  <img
                    src={productImage}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.badges &&
                      product.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className={`${badge.bg} text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider uppercase text-center shadow-sm`}
                        >
                          {badge.text}
                        </span>
                      ))}
                  </div>

                  {/* Wishlist */}
                  <button
                    type="button"
                    aria-label="Add to Wishlist"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-800 hover:text-black hover:bg-white transition-colors shadow-sm z-10"
                  >
                    <Heart className="w-4 h-4 stroke-[1.8]" />
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <div className="w-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">

                      {/* Add to Cart */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-white text-gray-900 py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-black hover:text-white transition-colors shadow-md"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      {/* Quick View */}
                      <button
                        type="button"
                        aria-label="Quick View"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickView(product);
                        }}
                        className="bg-white/90 text-gray-900 p-2.5 rounded-lg hover:bg-black hover:text-white transition-colors shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                    </div>
                  </div>

                </div>

                {/* Product Details */}
                <div className="mt-4 flex flex-col">

                  <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                    {product.sellerName}
                  </span>

                  <h3 className="text-sm font-serif font-medium text-gray-900 mt-0.5 group-hover:text-amber-900 transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
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

        {/* Explore All Products */}
        <div className="mt-14 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-transparent border border-gray-900 text-gray-900 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* ================= QUICK VIEW MODAL ================= */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeQuickView}
        >

          {/* Modal */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              type="button"
              onClick={closeQuickView}
              aria-label="Close Quick View"
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-800 hover:bg-black hover:text-white transition-colors shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">

              {/* LEFT SIDE - IMAGE + THUMBNAILS */}
              <div className="bg-gray-100">

                {/* Main Image */}
                <div className="w-full h-[430px] sm:h-[500px] md:h-[560px]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={quickViewProduct.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {getProductImages(quickViewProduct).length > 0 && (
                  <div className="bg-[#FDFBF7] px-4 py-4">
                    <div className="flex gap-3 overflow-x-auto justify-center">

                      {getProductImages(quickViewProduct).map(
                        (image, index) => (
                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() =>
                              setSelectedImage(image)
                            }
                            className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === image
                                ? "border-gray-900"
                                : "border-transparent hover:border-gray-400"
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

              {/* RIGHT SIDE - PRODUCT INFORMATION */}
              <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-start pt-10 sm:pt-12 md:pt-16">

                {/* Seller */}
                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                  {quickViewProduct.sellerName}
                </span>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mt-2 pr-8">
                  {quickViewProduct.title}
                </h2>

                {/* Price */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">
                    {quickViewProduct.price}
                  </span>

                  {quickViewProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {quickViewProduct.originalPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mt-5">

                  <p className="text-sm leading-6 text-gray-600">
                    {typeof quickViewProduct.description === "object"
                      ? quickViewProduct.description.intro
                      : quickViewProduct.description ||
                        "A thoughtfully selected piece from one of our independent boutique sellers."}
                  </p>

                  {/* Structured Description Details */}
                  {typeof quickViewProduct.description === "object" &&
                    Array.isArray(
                      quickViewProduct.description.details
                    ) && (
                      <div className="mt-4 space-y-2">
                        {quickViewProduct.description.details
                          .slice(0, 3)
                          .map((detail, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-xs text-gray-600"
                            >
                              <span className="mt-1 w-1 h-1 rounded-full bg-gray-500 flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                      </div>
                    )}

                </div>

                {/* ================= COLOR & SIZE ================= */}
                <div className="mt-6 space-y-5">

                  {/* COLOR */}
                  {getProductColors(quickViewProduct).length > 0 && (
                    <div>

                      <div className="flex items-center justify-between mb-2.5">

                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Color
                        </span>

                        <span className="text-xs text-gray-500">
                          {selectedColor}
                        </span>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        {getProductColors(quickViewProduct).map(
                          (color, index) => (
                            <button
                              key={`${color.name}-${index}`}
                              type="button"
                              onClick={() =>
                                handleColorChange(color)
                              }
                              className={`px-3.5 py-2 rounded-md border text-xs transition-all ${
                                selectedColor === color.name
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 bg-white text-gray-800 hover:border-gray-900"
                              }`}
                            >
                              {color.name}
                            </button>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* SIZE */}
                  {getProductSizes(quickViewProduct).length > 0 && (
                    <div>

                      <div className="flex items-center justify-between mb-2.5">

                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Size
                        </span>

                        <span className="text-xs text-gray-500">
                          {selectedSize}
                        </span>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        {getProductSizes(quickViewProduct).map(
                          (size, index) => (
                            <button
                              key={`${size}-${index}`}
                              type="button"
                              onClick={() =>
                                setSelectedSize(size)
                              }
                              className={`min-w-[44px] px-3 py-2 rounded-md border text-xs transition-all ${
                                selectedSize === size
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-gray-300 bg-white text-gray-800 hover:border-gray-900"
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
                <div className="mt-7 flex flex-col gap-3">

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(
                        quickViewProduct,
                        selectedColor,
                        selectedSize
                      )
                    }
                    className="w-full bg-black text-white py-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>

                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => {
                      const productId = quickViewProduct.id;

                      closeQuickView();
                      navigate(`/products/${productId}`);
                    }}
                    className=" text-gray-900 py-3 rounded-lg text-xs font-semibold tracking-wider uppercase hover:bg-gray-100 transition-colors"
                  >
                    View Details
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